import pdfParse from "pdf-extraction"; // ✅ Naya modern package
import mammoth from "mammoth";
import { genAI } from "../config/gemini.js";
import CustomError from "../handler/CustomError.js";
import AsyncHandler from "../handler/AsyncHandler.js";

export const parseUploadedCV = AsyncHandler(async (req, res, next) => {
  try {

    if (!req.file) {
      return next(new CustomError(400, "upload pdf or docx file"));
    }

    let rawText = "";


    if (req.file.mimetype === "application/pdf") {

      const pdfData = await pdfParse(req.file.buffer);
      rawText = pdfData.text;
    } else if (req.file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      const docxData = await mammoth.extractRawText({ buffer: req.file.buffer });
      rawText = docxData.value;
    }


    if (!rawText || rawText.trim() === "") {
      return next(new CustomError(400, "unable to read text from the file"));
    }


    const modelsToTry = ["gemini-2.5-flash", "gemini-1.5-flash", "gemini-1.5-pro"];
    let model;
    let result;

    // Retry config: 3 attempts per model with exponential backoff
    const MAX_RETRIES = 3;
    const BASE_DELAY = 1000; // 1 second

    for (const modelName of modelsToTry) {
      for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
          console.log(`[DEBUG] Attempt ${attempt}/${MAX_RETRIES} with model: ${modelName}`);
          const currentModel = genAI.getGenerativeModel({ model: modelName });

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

          result = await currentModel.generateContent(prompt);
          model = currentModel;
          console.log(`[DEBUG] Successfully used model: ${modelName}`);
          break;
        } catch (err) {
          console.warn(`[WARN] Model ${modelName} attempt ${attempt} failed: ${err.message}`);

          // If it's a 503 error, wait and retry
          if (err.message?.includes("503") || err.message?.toLowerCase().includes("unavailable")) {
            if (attempt < MAX_RETRIES) {
              const delay = BASE_DELAY * Math.pow(2, attempt - 1); // Exponential backoff: 1s, 2s, 4s
              console.log(`[DEBUG] Waiting ${delay}ms before retry...`);
              await new Promise(resolve => setTimeout(resolve, delay));
              continue;
            }
          } else {
            // Non-503 error, don't retry this model
            break;
          }
        }
      }
      if (result) break; // Success, move to next model
    }

    if (!result) {
      throw new CustomError(503, "AI extraction is currently under heavy load. Please try again soon or enter details manually.");
    }


    let textResult = result.response.text();


    textResult = textResult.replace(/```json/g, "").replace(/```/g, "").trim();

    const parsedCVData = JSON.parse(textResult);


    return res.status(200).json({
      success: true,
      message: "CV Extract successfully!",
      data: parsedCVData,
    });

  } catch (error) {
    console.error("CV Parsing Error:", error);
    
    const message = error.status === 503 
      ? error.message 
      : "The AI had trouble reading this specific file format. Please try another file or enter details manually.";

    return res.status(error.status || 500).json({
      success: false,
      message
    });
  }
});