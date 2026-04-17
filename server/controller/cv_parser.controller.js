import pdfParse from "pdf-extraction"; // ✅ Naya modern package
import mammoth from "mammoth";
import { genAI } from "../config/gemini.js";
import CustomError from "../handler/CustomError.js";
import AsyncHandler from "../handler/AsyncHandler.js";

export const parseUploadedCV = AsyncHandler(async (req, res, next) => {
    try {
        // STEP 1: Gatekeeper checking
        if (!req.file) {
            return next(new CustomError(400, "upload pdf or docx file"));
        }

        let rawText = "";

        // STEP 2: X-Ray Machine (Text Extraction)
        if (req.file.mimetype === "application/pdf") {
            // 🔥 Ab yeh seedha function ki tarah chalega bina phate
            const pdfData = await pdfParse(req.file.buffer);
            rawText = pdfData.text;
        } else if (req.file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
            const docxData = await mammoth.extractRawText({ buffer: req.file.buffer });
            rawText = docxData.value;
        }

        // Agar file se text nikla hi nahi
        if (!rawText || rawText.trim() === "") {
            return next(new CustomError(400, "unable to read text from the file"));
        }

        // STEP 3: Smart Robot Setup (Gemini AI)
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `
        You are an expert CV parser. Read the following raw text from a resume.
        Extract the information strictly into the provided JSON structure.
        Do NOT add markdown, conversational text, or backticks (\`\`\`). Return ONLY valid JSON.
        If a field is not found in the text, leave it as an empty string "".
        
        Required JSON Structure:
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

        Raw Text:
        ${rawText}
        `;

        // Robot ko text de kar jawab ka wait karo
        const result = await model.generateContent(prompt);
        let textResult = result.response.text();

        // STEP 4: Validation / Safai
        textResult = textResult.replace(/```json/g, "").replace(/```/g, "").trim();
        
        const parsedCVData = JSON.parse(textResult);

        // STEP 5: Wapis Frontend ko bhej do!
        return res.status(200).json({
            success: true,
            message: "CV Extract ho gaya successfully!",
            data: parsedCVData,
        });

    } catch (error) {
        console.error("CV Parsing Error:", error);
        
        if (error instanceof SyntaxError) {
            return res.status(500).json({ 
                success: false, 
                message: "AI ko data samajhne mein masla hua. Please manually form fill karein." 
            });
        }

        return res.status(500).json({ 
            success: false, 
            message: "Server error. CV extract nahi ho saka." 
        });
    }    
});