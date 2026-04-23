import pdfParse from "pdf-extraction"; 
import mammoth from "mammoth";
import { groq } from "../config/groq.js";
import CustomError from "../handler/CustomError.js";
import AsyncHandler from "../handler/AsyncHandler.js";

export const parseUploadedCV = AsyncHandler(async (req, res, next) => {
    try {
        // STEP 1: Gatekeeper checking
        if (!req.file) {
            return next(new CustomError(400, "Please upload a pdf or docx file"));
        }

        let rawText = "";

        // STEP 2: X-Ray Machine (Text Extraction)
        if (req.file.mimetype === "application/pdf") {
            const pdfData = await pdfParse(req.file.buffer);
            rawText = pdfData.text;
        } else if (req.file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
            const docxData = await mammoth.extractRawText({ buffer: req.file.buffer });
            rawText = docxData.value;
        }

        // Agar file se text nikla hi nahi
        if (!rawText || rawText.trim() === "") {
            return next(new CustomError(400, "Unable to read text from the file"));
        }

        // STEP 3: Smart Robot Setup (Groq AI)
        const systemContent = `You are an expert CV parser. Extract the information from the raw resume text strictly into the provided JSON structure.
        If a field is not found in the text, leave it as an empty string "".
        Output MUST be a JSON object with this exact structure:
        {
            "name": "",
            "email": "",
            "phone": "",
            "github": "",
            "linkedin": "",
            "summary": "Write a 2-line professional summary based on the text if not provided",
            "education": [
                { "degree": "", "institute": "", "year": "" }
            ],
            "skills": ["skill1", "skill2"],
            "projects": [
                { "title": "", "description": "", "githubLink": "", "liveLink": "" }
            ],
            "experience": [
                { "role": "", "company": "", "duration": "", "description": "" }
            ]
        }
        The response must contain ONLY the JSON object and nothing else.`;

        const userContent = `Raw Resume Text:\n${rawText}`;

        // Robot ko text de kar jawab ka wait karo using Groq
        const response = await groq.chat.completions.create({
            model: "llama-3.1-8b-instant", // You can also use llama3-70b-8192 if you need even smarter parsing
            response_format: { type: "json_object" }, // Strictly enforce JSON
            temperature: 0.1, // Very low temperature so it extracts exactly what is there
            messages: [
                { role: "system", content: systemContent },
                { role: "user", content: userContent }
            ]
        });

        // STEP 4: Validation / Safai
        const textResult = response.choices[0].message.content;
        const parsedCVData = JSON.parse(textResult);

        // STEP 5: Wapis Frontend ko bhej do!
        return res.status(200).json({
            success: true,
            message: "CV Extract ho gaya successfully!",
            data: parsedCVData,
        });

    } catch (error) {
        console.error("CV Parsing Error:", error);
        
        // Handle specific JSON parsing errors from the AI output
        if (error instanceof SyntaxError) {
            return res.status(500).json({ 
                success: false, 
                message: "AI ko data samajhne mein masla hua. Please manually form fill karein." 
            });
        }

        // Handle general server errors
        return res.status(500).json({ 
            success: false, 
            message: "Server error. CV extract nahi ho saka." 
        });
    }    
});