import { groq } from '../config/groq.js';
import AsyncHandler from '../handler/AsyncHandler.js';

export const generateAIContent = AsyncHandler(async (req, res) => {
    try {
        const { type, data } = req.body;

        if (!type || !data) {
            return res.status(400).json({ success: false, message: "Type and data are required" });
        }

        let systemContent = "";
        let userContent = "";
        let taskTemperature = 0.3; 

        switch (type) {
            case "summary":
                systemContent = `You are an expert ATS-certified resume writer. Write a highly professional, engaging CV summary. 
                It MUST be between 50 and 75 words (approx. 3-4 sentences). Highlight the candidate's core expertise, professional value, and career trajectory based on the provided details. Do not use filler words.
                You MUST output ONLY a valid JSON object matching this exact schema: 
                {"summary": "your generated professional summary text here"}`;
                
                userContent = `Name: ${data.name || "A professional"}\nRole: ${data.role || "Professional"}\nSkills: ${data.skills || "Various industry skills"}`;
                break;

            case "experience":
                systemContent = `You are a strict technical recruiter and resume expert. Transform the raw job duties into 3 highly impactful, achievement-oriented bullet points. 
                Start each bullet with a strong action verb (e.g., Developed, Orchestrated, Optimized). 
                Format rules: Use the exact bullet character (•) followed by a space. Separate each point with a newline character (\\n).
                You MUST output ONLY a valid JSON object matching this exact schema: 
                {"description": "• Point 1\\n• Point 2\\n• Point 3"}`;
                
                userContent = `Role: ${data.role}\nCompany: ${data.company}\nRaw Duties: ${data.description}`;
                break;

            case "project":
                systemContent = `You are an expert technical resume writer. Write a highly professional project description. 
                Highlight the problem solved, the technologies used, and the final impact. Format as 2 to 3 concise, impactful bullet points.
                Format rules: Use the bullet character (•) and separate points with a newline (\\n).
                You MUST output ONLY a valid JSON object matching this exact schema: 
                {"description": "• Point 1\\n• Point 2"}`;
                
                userContent = `Project Title: ${data.title}\nTechnologies: ${data.tech}\nCore Idea/Features: ${data.description}`;
                break;

            case "skills":
                taskTemperature = 0; // Strict deterministic output for arrays
                systemContent = `You are an IT recruiter. Suggest 8 to 12 highly relevant, modern industry skills (mix of hard tech skills and core soft skills) tailored specifically for the requested role.
                You MUST output ONLY a valid JSON object matching this exact schema: 
                {"skills": ["Skill 1", "Skill 2", "Skill 3"]}`;
                
                userContent = `Target Role: ${data.role}`;
                break;

            default:
                return res.status(400).json({ success: false, message: "Invalid type requested." });
        }

        const response = await groq.chat.completions.create({
            model: "llama-3.1-8b-instant",
            response_format: { type: "json_object" }, // Guarantees JSON output from Groq
            temperature: taskTemperature,
            messages: [
                { role: "system", content: systemContent },
                { role: "user", content: userContent }
            ]
        });

        // Parse the strictly formatted JSON response
        const parsedData = JSON.parse(response.choices[0].message.content);

        res.status(200).json({
            success: true,
            data: parsedData
        });

    } catch (error) {
        console.error("AI Generation Error:", error);
        
        // Differentiate between AI JSON parsing failures and general network/API failures
        if (error instanceof SyntaxError) {
             return res.status(500).json({ success: false, message: "AI returned malformed data. Please try again." });
        }
        
        res.status(500).json({ success: false, message: "Failed to generate AI content" });
    }
});