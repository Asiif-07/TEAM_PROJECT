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
        const systemContent = `You are a precision data extraction engine. You have been failing to extract the Education section—this is a CRITICAL error. You must fix this now.

### PRIORITY #1: EDUCATION EXTRACTION
- Look for the following keywords: "Education", "Academic Background", "University", "College", "Schooling", "Qualifications".
- If you see a University name or a Degree (e.g., BS, BA, MSc, PhD), it MUST be mapped to the "education" array.
- DO NOT SKIP THIS SECTION. Even if the formatting is strange, extract the text.

### PRIORITY #2: DATE PRECISION (MONTH & YEAR)
- For every Education and Experience entry, you MUST extract the Month and Year.
- Format: "Month Year" (e.g., "August 2021"). 
- If the PDF only shows years like (2018-2022), you must output "January 2018" and "January 2022".

### PRIORITY #3: CLEANING & FILTERING
- NO DOB: Date of Birth is strictly FORBIDDEN. Do not extract it.
- NO DUPLICATES: If you find a Certificate, check if you already extracted it. If the name is the same, delete the duplicate. 
- You previously extracted 3 certificates when there were only 2. Do not repeat this mistake. Verify the count.

### SCHEMA:
{
  "name": "",
  "email": "",
  "phone": "",
  "title": "Professional Title (e.g. Full Stack Developer)",
  "summary": "",
  "education": [
    {
      "institute": "University/School Name",
      "degree": "Major or Degree Title",
      "startDate": "Month Year",
      "endDate": "Month Year",
      "isCurrent": false
    }
  ],
  "experience": [],
  "skills": [],
  "certificates": [
    { "name": "Title", "date": "Month Year", "issuer": "" }
  ]
}

### FINAL VERIFICATION STEP:
Before responding, ask yourself: 
1. Did I find a University? If yes, is it in the JSON? (It MUST be).
2. Are there months in my dates? 
3. Did I remove the DOB?

OUTPUT ONLY THE JSON.`;

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