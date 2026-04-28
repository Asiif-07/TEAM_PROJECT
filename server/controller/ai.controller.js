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
            // --- ORIGINAL FIELDS ---
            case "summary":
                systemContent = `You are an expert ATS-certified resume writer. Write a highly professional, engaging CV summary. 
                It MUST be between 50 and 75 words (approx. 3-4 sentences). Highlight the candidate's core expertise, professional value, and career trajectory. Do not use filler words.
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

            // --- NEW JSON RESUME FIELDS ---
            case "label":
                systemContent = `You are a career coach. Based on the user's provided skills and current job title, generate a punchy, professional headline/label (e.g., "Full Stack MERN Developer" or "Senior UI/UX Designer"). Keep it under 5 words.
                You MUST output ONLY a valid JSON object matching this exact schema: 
                {"label": "Professional Title Here"}`;
                
                userContent = `Current Role: ${data.role}\nSkills/Tech: ${data.skills}`;
                break;

            case "volunteer":
                systemContent = `You are a professional resume writer. Enhance the raw volunteer details into a polished summary and 2 impactful bullet points (highlights).
                You MUST output ONLY a valid JSON object matching this exact schema: 
                {"summary": "A 1-2 sentence professional summary of the volunteer work.", "highlights": ["Point 1", "Point 2"]}`;
                
                userContent = `Organization: ${data.organization}\nRole: ${data.position}\nRaw Details: ${data.description}`;
                break;

            case "awards":
                systemContent = `You are a resume expert. Write a 1-2 sentence professional summary explaining the significance of this award and why it was achieved.
                You MUST output ONLY a valid JSON object matching this exact schema: 
                {"summary": "Polished award description here."}`;
                
                userContent = `Award Title: ${data.title}\nIssuer: ${data.awarder}\nRaw Details: ${data.description}`;
                break;

            case "publications":
                systemContent = `You are an academic/professional editor. Write a 1-2 sentence compelling summary or abstract of this publication.
                You MUST output ONLY a valid JSON object matching this exact schema: 
                {"summary": "Polished publication summary here."}`;
                
                userContent = `Title: ${data.name}\nPublisher: ${data.publisher}\nRaw Details: ${data.description}`;
                break;

            default:
                return res.status(400).json({ success: false, message: "Invalid type requested." });
        }

        // Switched to the 70B model for smarter, more professional text generation
        const response = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile", 
            response_format: { type: "json_object" }, 
            temperature: taskTemperature,
            messages: [
                { role: "system", content: systemContent },
                { role: "user", content: userContent }
            ]
        });

        const parsedData = JSON.parse(response.choices[0].message.content);

        res.status(200).json({
            success: true,
            data: parsedData
        });

    } catch (error) {
        console.error("AI Generation Error:", error);
        
        if (error instanceof SyntaxError) {
             return res.status(500).json({ success: false, message: "AI returned malformed data. Please try again." });
        }
        
        res.status(500).json({ success: false, message: "Failed to generate AI content" });
    }
});