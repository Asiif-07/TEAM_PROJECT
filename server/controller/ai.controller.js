import { GoogleGenerativeAI } from "@google/generative-ai";
import AsyncHandler from "../handler/AsyncHandler.js";
import CustomError from "../handler/CustomError.js";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateSummary = AsyncHandler(async (req, res) => {
    const { title } = req.body;
    if (!title) {
        throw new CustomError("Title is required", 400);
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Write a professional CV summary for a "${title}". 
    Make it concise (3-4 sentences), engaging, and highlighting key strengths typical for this role. 
    Do not include any placeholders like [Name] or [Years]. Just the summary text.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // Clean up if AI adds markdown or backticks
    text = text.replace(/```json|```/g, "").trim();

    res.status(200).json({ success: true, data: text });
});

export const enhanceExperience = AsyncHandler(async (req, res) => {
    const { role, company, description } = req.body;
    if (!role || !description) {
        throw new CustomError("Role and description are required", 400);
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Enhance this work experience description for a CV:
    Role: ${role}
    Company: ${company || "N/A"}
    Current Description: ${description}

    Requirements:
    - Use strong action verbs.
    - Focus on achievements and impact.
    - Keep it professional and concise.
    - Provide it as a single block of text or a clean list (no markdown if possible, just the text).
    - Do not include placeholders.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    text = text.replace(/```json|```/g, "").trim();

    res.status(200).json({ success: true, data: text });
});
