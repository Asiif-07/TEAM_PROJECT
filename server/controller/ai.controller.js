import AsyncHandler from '../handler/AsyncHandler.js'
import { genAI } from '../config/gemini.js' // Apne path ke hisaab se check kar lena
import CustomError from '../handler/CustomError.js'

const generateAIContent = AsyncHandler(async (req, res) => {
    // 🔥 FIX: Yahan 'section' ki jagah ab 'type' use ho raha hai
    const { type, data } = req.body;

    // 🔥 FIX: Error check mein bhi 'type'
    if (!type || !data) {
        throw new CustomError(400, "Type and data are required to generate content");
    }

    const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash",
        generationConfig: { responseMimeType: "application/json" }
    });

    let prompt = "";

    // 🔥 FIX: Switch statement mein bhi 'type'
    switch (type) {
        case "summary":
            prompt = `
                You are an expert CV writer. Write a professional, highly engaging, and ATS-friendly CV summary.
                User's Name: ${data.name || "A professional"}
                Role/Target Job: ${data.role || "Software Developer"}
                Key Skills: ${data.skills ? data.skills.join(", ") : "Not provided"}
                Experience Level: ${data.experienceLevel || "Not provided"}

                Keep it concise (3-4 lines).
                Return ONLY a JSON object.
                Schema: {"summary": "your generated professional summary here"}
            `;
            break;

        case "experience":
            prompt = `
                You are an expert CV writer. Enhance the following work experience description to sound highly professional, using action verbs and focusing on achievements.
                Role: ${data.role}
                Company: ${data.company}
                Raw User Input/Duties: ${data.rawDescription}

                Format the text beautifully using bullet points (•) so it looks good in a text area. Do not use markdown backticks.
                Return ONLY a JSON object.
                Schema: {"description": "• Point 1\\n• Point 2\\n• Point 3"}
            `;
            break;

        case "project":
            prompt = `
                You are an expert CV writer. Write an impactful project description.
                Project Title: ${data.title}
                Core Technologies Used: ${data.tech || "Not provided"}
                Raw Idea/Features: ${data.rawDescription || "A technical project"}

                Focus on what the project does, the technical implementation, and the value it provides. Keep it between 2 to 3 concise sentences or bullet points (•).
                Return ONLY a JSON object.
                Schema: {"description": "your generated project description here"}
            `;
            break;

        case "skills":
            prompt = `
                You are a technical recruiter. The user is applying for the role of "${data.role}".
                Suggest a comprehensive list of 8 to 12 highly relevant, modern industry skills (both hard and soft skills, but primarily technical if it's an IT role).
                Return ONLY a JSON object containing an array of strings.
                Schema: {"skills": ["Skill 1", "Skill 2", "Skill 3"]}
            `;
            break;

        default:
            throw new CustomError(400, "Invalid type requested. Allowed: summary, experience, project, skills");
    }

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    let parsedData;
    try {
        parsedData = JSON.parse(text);
    } catch (err) {
        const cleanedText = text.replace(/```json/g, "").replace(/```/g, "").trim();
        try {
            parsedData = JSON.parse(cleanedText);
        } catch (fallbackErr) {
            console.error("AI Output Parsing Failed:", text);
            throw new CustomError(500, "Failed to parse AI response into structured data.");
        }
    }

    res.status(200).json({
        success: true,
        message: `${type} generated successfully`,
        data: parsedData
    });
});

export { generateAIContent };