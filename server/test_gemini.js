import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config();

async function listModels() {
    try {
        const genAI = new GoogleGenerativeAI(process.env.API_Key_GEMINI);
        // The SDK doesn't have a listModels method directly on genAI, 
        // but we can try to hit the endpoint manually or check the error.
        // Actually, we can use the discovery URL.
        console.log("Testing connectivity with 'gemini-pro'...");
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent("Respond with 'OK'");
        console.log("gemini-pro test result:", result.response.text());
    } catch (err) {
        console.error("Test failed:", err.message);
    }
}

listModels();
