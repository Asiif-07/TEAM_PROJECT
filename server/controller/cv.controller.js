import AsyncHandler from '../handler/AsyncHandler.js'
import Cv from '../model/cvModle.js'
import CustomError from '../handler/CustomError.js'
import User from '../model/user.model.js';
import mammoth from "mammoth";

function cleanLines(text) {
    return String(text || "")
        .replace(/\r/g, "")
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean);
}

function pickFirstNameCandidate(lines) {
    for (const line of lines.slice(0, 8)) {
        if (/@/.test(line)) continue;
        if (/(curriculum vitae|resume|cv)/i.test(line)) continue;
        const letters = line.replace(/[^a-zA-Z\s]/g, "").trim();
        const words = letters.split(/\s+/).filter(Boolean);
        if (words.length >= 2 && words.length <= 5 && letters.length >= 5 && letters.length <= 40) {
            return line.replace(/\s+/g, " ").trim();
        }
    }
    return "";
}

function extractEmail(text) {
    const m = String(text || "").match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
    return m ? m[0] : "";
}

function extractPhone(text) {
    const t = String(text || "");
    const m =
        t.match(/(\+?\d[\d\s().-]{7,}\d)/) ||
        t.match(/(\d{3,4}[\s-]?\d{3,4}[\s-]?\d{3,4})/);
    return m ? m[1].replace(/\s+/g, " ").trim() : "";
}

function extractUrl(text, kind) {
    const t = String(text || "");
    const urlRegex = /https?:\/\/[^\s)]+/gi;
    const urls = t.match(urlRegex) || [];
    if (kind === "github") return urls.find((u) => /github\.com/i.test(u)) || "";
    if (kind === "linkedin") return urls.find((u) => /linkedin\.com/i.test(u)) || "";
    return "";
}

function isSectionHeader(line) {
    const l = String(line || "").trim().toLowerCase();
    return /^(summary|profile|about|objective|skills|technical skills|key skills|core skills|education|academic( background)?|experience|work experience|professional experience|employment|projects?|certifications?|licenses?|languages?)\b[:]?$/i.test(l);
}

function sectionLines(lines, headerRegex) {
    const idx = lines.findIndex((l) => headerRegex.test(l));
    if (idx < 0) return [];

    const out = [];
    for (let i = idx + 1; i < Math.min(lines.length, idx + 40); i++) {
        const l = lines[i];
        if (isSectionHeader(l)) break;
        out.push(l);
    }
    return out;
}

function parseSkills(lines, fullText) {
    const fromSection = sectionLines(lines, /^(skills|technical skills|key skills|core skills)\b[:]?$/i);
    const base = fromSection.length ? fromSection.join(" ") : "";
    const raw = base || "";
    const items = raw
        .split(/•|·|\||,|;/g)
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, 30);

    // fallback: pick common "Skills:" inline
    if (items.length) return items;
    const m = String(fullText || "").match(/skills\s*:\s*(.+)/i);
    if (!m) return [];
    return m[1]
        .split(/,|;|\|/g)
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, 30);
}

function parseEducation(lines) {
    const edu = sectionLines(lines, /^(education|academic( background)?)\b[:]?$/i);
    if (!edu.length) return [];

    // Try to split into (degree, institute, year) using common patterns.
    return edu
        .slice(0, 10)
        .map((l) => {
            const line = String(l || "").replace(/\s+/g, " ").trim();
            const yearMatch = line.match(/\b(19|20)\d{2}\b/);
            const year = yearMatch ? yearMatch[0] : "";

            // Common separators: | or - or •
            const parts = line.split(/\s*\|\s*|\s+[-–•]\s+/).map((p) => p.trim()).filter(Boolean);
            const degree = parts[0] || line;
            const institute = parts.length >= 2 ? parts[1] : "";
            return {
                degree: degree || "",
                institute: institute || "",
                year: year || "",
            };
        })
        .filter((e) => e.degree || e.institute || e.year);
}

function parseExperience(lines) {
    const exp = sectionLines(lines, /^(experience|work experience|professional experience|employment)\b[:]?$/i);
    if (!exp.length) return [];

    return exp
        .slice(0, 15)
        .map((l) => {
            const line = String(l || "").replace(/\s+/g, " ").trim();

            // Duration guess: "2022 - 2024" or "Jan 2022 - Present"
            const durationMatch =
                line.match(/\b(19|20)\d{2}\b\s*[-–]\s*(\b(19|20)\d{2}\b|present)\b/i) ||
                line.match(/\b(jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\s+\d{4}\b\s*[-–]\s*(\b(jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\s+\d{4}\b|present)\b/i);
            const duration = durationMatch ? durationMatch[0] : "";

            const parts = line.split(/\s*\|\s*|\s+[-–•]\s+/).map((p) => p.trim()).filter(Boolean);
            const role = parts[0] || "";
            const company = parts.length >= 2 ? parts[1] : "";

            return {
                role,
                company,
                duration,
                description: "",
            };
        })
        .filter((e) => e.role || e.company || e.duration || e.description);
}

function parseProjects(lines) {
    const proj = sectionLines(lines, /^projects?\b[:]?$/i);
    if (!proj.length) return [];
    return proj
        .slice(0, 10)
        .map((l) => {
            const line = String(l || "").trim();
            // "Title - description"
            const parts = line.split(/\s+[-–•:]\s+/).map((p) => p.trim()).filter(Boolean);
            const title = parts[0] || "";
            const description = parts.slice(1).join(" ") || "";
            return { title, description, githubLink: "", liveLink: "" };
        })
        .filter((p) => p.title || p.description);
}

function parseSimpleList(lines, headerRegex, max = 20) {
    const section = sectionLines(lines, headerRegex);
    if (!section.length) return [];
    return section
        .join(" ")
        .split(/•|·|\||,|;/g)
        .map((s) => s.trim())
        .filter(Boolean)
        .slice(0, max);
}

async function extractTextFromUpload(file) {
    if (!file?.buffer) return "";
    const mime = String(file.mimetype || "").toLowerCase();

    if (mime.includes("pdf")) {
        // `pdf-parse` in this project exposes a class `PDFParse` (not a function).
        const mod = await import("pdf-parse");
        const PDFParse = mod?.PDFParse || mod?.default?.PDFParse;
        if (typeof PDFParse !== "function") {
            throw new CustomError(500, "PDF import failed: PDF parser is not available.");
        }

        const parser = new PDFParse({ data: file.buffer });
        await parser.load();
        const result = await parser.getText();
        await parser.destroy();
        if (typeof result === "string") return result;
        if (result && typeof result === "object") {
            if (typeof result.text === "string") return result.text;
            if (typeof result.value === "string") return result.value;
        }
        return "";
    }

    if (
        mime.includes("officedocument.wordprocessingml.document") ||
        mime.includes("msword") ||
        (file.originalname || "").toLowerCase().endsWith(".docx")
    ) {
        const result = await mammoth.extractRawText({ buffer: file.buffer });
        return result?.value || "";
    }

    // txt fallback
    return file.buffer.toString("utf8");
}


const CreateCv = AsyncHandler(async (req, res, next) => {

    const userId = req.userId;

    const { 
      name, email, phone, github, linkedin, 
      summary, education, skills, projects, experience,templateId
    } = req.body;

    const findId = await User.findById(userId)

    if(!findId){
        throw new CustomError(404, 'User not found')
    }

    const newCv = await Cv.create({
      name,
      email,
      phone,
      github,
      linkedin,
      summary,
      education,
      skills,
      projects,
      experience,
      userId,
      templateId
    })

    if(!newCv){
        throw new CustomError(500, 'Failed to create CV')
    }

    res.status(201).json({
        success: true,
        message: 'CV created successfully',
        data: newCv
    })

    

    
})


const updateCv = AsyncHandler(async(req,res,next)=>{

    const {id} = req.params;
    const userId = req.userId;

    //db check
    const findCv = await Cv.findById(id)

    if(!findCv){
        throw new CustomError(404, 'CV not found')
    }   

    //check if the user is the owner of the cv
    if(findCv.userId.toString() !== userId.toString()) {
        throw new CustomError(403, 'Not authorized to update this CV')
    }

    const { 
      name, email, phone, github, linkedin, 
      summary, education, skills, projects, experience, templateId
    } = req.body;


    const updatedFields ={};

    if (name) updatedFields.name = name;
    if (email) updatedFields.email = email;
    if (phone) updatedFields.phone = phone;
    if (github) updatedFields.github = github;
    if (linkedin) updatedFields.linkedin = linkedin;
    if (summary) updatedFields.summary = summary;
    if (education) updatedFields.education = education;
    if (skills) updatedFields.skills = skills;
    if (projects) updatedFields.projects = projects;
    if (experience) updatedFields.experience = experience;
    if (templateId) updatedFields.templateId = templateId;

    const updateCvFields = await Cv.findByIdAndUpdate(id, {$set: updatedFields}, {new: true})

    if(!updateCvFields){
        throw new CustomError(500, 'Failed to update CV')
    }

    console.log(updateCvFields)

    res.status(200).json({
        success: true,
        message: 'CV updated successfully',
        data: updateCvFields
    })




    
})

const getAllCvs = AsyncHandler(async(req,res,next)=>{

    const userId = req.userId;

    const cvs = await Cv.find({userId})

    console.log(cvs);
    

    if(cvs.length === 0){
        throw new CustomError(404, 'CVs not found')
    }

    res.status(200).json({
        success: true,
        message: 'CVs fetched successfully',
        data: cvs
    })
    
})

const SingleCv = AsyncHandler(async(req,res,next)=>{
    const {id} = req.params;

    const findCv = await Cv.findById(id)

    if(!findCv){
        throw new CustomError(404, "cv not found")
    }

    if(findCv.userId.toString() !== req.userId.toString()){
        throw new CustomError(403, "Not authorized to view this CV")
    }

    res.status(200).json({
        success: true,
        message: 'CV fetched successfully',
        data: findCv
    })
})

const deleteCv = AsyncHandler(async(req,res,next)=>{
    const {id} = req.params;

    console.log(id)

    const findId = await Cv.findById(id)

    console.log(findId)

    if(!findId){
        throw new CustomError(404, "Cv not found")
    }

    if(findId.userId.toString() !== req.userId.toString()){
        throw new CustomError(403, "Not authorized to delete this CV")
    }

    await Cv.findByIdAndDelete(id)

    res.status(200).json({
        success: true,
        message: 'CV deleted successfully'
    })

    
})

export { CreateCv, updateCv, getAllCvs, SingleCv, deleteCv }