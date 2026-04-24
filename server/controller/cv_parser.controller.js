import pdfParse from "pdf-extraction"; 
import mammoth from "mammoth";
import { groq } from "../config/groq.js";
import CustomError from "../handler/CustomError.js";
import AsyncHandler from "../handler/AsyncHandler.js";

export const parseUploadedCV = AsyncHandler(async (req, res, next) => {
    try {
        if (!req.file) {
            return next(new CustomError(400, "Please upload a pdf or docx file"));
        }

        let rawText = "";

        // 1. Read the file
        if (req.file.mimetype === "application/pdf") {
            const pdfData = await pdfParse(req.file.buffer);
            rawText = pdfData.text;
        } else if (req.file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
            const docxData = await mammoth.extractRawText({ buffer: req.file.buffer });
            rawText = docxData.value;
        }

        if (!rawText || rawText.trim() === "") {
            return next(new CustomError(400, "Unable to read text from the file"));
        }

        // 2. Prompt built specifically for a Reasoning AI
        const systemContent = `You are an expert data extraction AI. Think step-by-step about the provided resume text and map it perfectly to the requested JSON schema.

        CRITICAL RULES:
        1. DATES: Look for dates in parentheses (e.g., "(2019-2021)") that appear directly before or after an institution name. Link them properly to the correct school or certificate.
        2. ARRAYS: If a category like experience, projects, or volunteer work is missing from the resume, output an completely empty array []. Do not create empty template objects inside them.
        3. FORMAT: Output ONLY valid JSON inside your final response.

        JSON SCHEMA TO FOLLOW:
        {
            "name": "",
            "label": "",
            "email": "",
            "phone": "",
            "url": "",
            "github": "",
            "linkedin": "",
            "location": { "address": "", "postalCode": "", "city": "", "countryCode": "", "region": "" },
            "summary": "",
            "education": [ { "degree": "", "institute": "", "startDate": "", "endDate": "", "isCurrent": false } ],
            "skills": [],
            "projects": [],
            "experience": [],
            "volunteer": [],
            "awards": [],
            "certificates": [ { "name": "", "date": "", "issuer": "", "url": "" } ],
            "publications": [],
            "languages": [ { "language": "", "fluency": "" } ],
            "interests": [],
            "references": []
        }`;

        const userContent = `RAW RESUME TEXT:\n\n${rawText}`;

        // 3. Call Groq using the DeepSeek R1 Reasoning Model
        const response = await groq.chat.completions.create({
            model: "openai/gpt-oss-120b", // <--- THE REASONING MODEL
            temperature: 0.6, // Reasoning models need a slightly higher temp to "think"
            messages: [
                { role: "system", content: systemContent },
                { role: "user", content: userContent }
            ]
        });

        const textResult = response.choices[0].message.content;
        
        // 4. Strip out the <think> blocks the reasoning model generates
        const cleanText = textResult.replace(/<think>[\s\S]*?<\/think>/g, '').trim();
        
        // Extract just the JSON block
        const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
        
        if (!jsonMatch) {
            throw new SyntaxError("AI did not return valid JSON");
        }
        
        const parsedCVData = JSON.parse(jsonMatch[0]);

        return res.status(200).json({
            success: true,
            message: "CV extracted smartly and successfully!",
            data: parsedCVData,
        });

    } catch (error) {
        console.error("CV Parsing Error:", error);
        
        if (error instanceof SyntaxError) {
            return res.status(500).json({ 
                success: false, 
                message: "AI failed to format the data correctly. Please try again or fill manually." 
            });
        }

        return res.status(500).json({ 
            success: false, 
            message: "Server error during CV extraction." 
        });
    }    
});