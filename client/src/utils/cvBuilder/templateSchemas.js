/**
 * CENTRALIZED TEMPLATE SCHEMAS
 * This registry defines the dynamic form fields for each template.
 * Supported types: text, email, phone, date, textarea, image, array.
 */

export const templateSchemas = {
    // SHARED FIELDS - Used if no specific override exists
    common: {
        personalInfo: [
            { name: "name", label: "Full Name", type: "text", required: true, grid: 6 },
            { name: "title", label: "Professional Title", type: "text", required: true, grid: 6 },
            { name: "email", label: "Email Address", type: "email", required: true, grid: 6 },
            { name: "phone", label: "Phone Number", type: "phone", grid: 6 },
            { name: "address", label: "Location / Address", type: "text", grid: 12 },
            { name: "about", label: "Professional Summary", type: "textarea", grid: 12 },
            { name: "linkedin", label: "LinkedIn URL", type: "text", grid: 6 },
            { name: "github", label: "GitHub URL", type: "text", grid: 6 },
        ],
        experience: {
            repeatable: true,
            fields: [
                { name: "role", label: "Role / Position", type: "text", grid: 6 },
                { name: "company", label: "Company Name", type: "text", grid: 6 },
                { name: "startDate", label: "Start Date", type: "date", grid: 6 },
                { name: "endDate", label: "End Date", type: "date", grid: 3 },
                { name: "current", label: "Present?", type: "checkbox", grid: 3 },
                { name: "description", label: "Responsibilities & Achievements", type: "textarea", grid: 12 },
            ]
        },
        education: {
            repeatable: true,
            fields: [
                { name: "degree", label: "Degree / Certificate", type: "text", grid: 6 },
                { name: "institute", label: "Institution Name", type: "text", grid: 6 },
                { name: "startDate", label: "Start Date", type: "date", grid: 6 },
                { name: "endDate", label: "End Date", type: "date", grid: 6 },
                { name: "description", label: "Field of Study / GPA", type: "textarea", grid: 12 },
            ]
        },
        skills: { type: "skill-tags", label: "Technical & Soft Skills" },
        projects: { type: "textarea", label: "Projects (Title | Description | Link)" },
        languages: { type: "textarea", label: "Languages (e.g. English - Native)" },
        certifications: { type: "textarea", label: "Certifications" }
    },

    // KOREAN SPECIFIC - Adds Date of Birth and Chinese characters name placeholder
    "korean-standard": {
        personalInfo: [
            { name: "name", label: "성명 (Name)", type: "text", required: true, grid: 4 },
            { name: "nameHanja", label: "성명 (Hanja/Chinese)", type: "text", grid: 4 },
            { name: "dob", label: "생년월일 (Date of Birth)", type: "date", required: true, grid: 4 },
            { name: "email", label: "이메일 (Email)", type: "email", required: true, grid: 6 },
            { name: "phone", label: "연락처 (Phone)", type: "phone", required: true, grid: 6 },
            { name: "address", label: "주소 (Address)", type: "text", grid: 12 },
            { name: "about", label: "자기소개 (Summary)", type: "textarea", grid: 12 },
        ]
    },

    // TECH DARK - Tailored for developers
    "tech-dark": {
        personalInfo: [
            { name: "name", label: "Developer Name", type: "text", required: true, grid: 6 },
            { name: "title", label: "Primary Stack", type: "text", required: true, grid: 6 },
            { name: "email", label: "Endpoint (Email)", type: "email", required: true, grid: 6 },
            { name: "github", label: "Origin (GitHub)", type: "text", grid: 6 },
            { name: "about", label: "System Overview (Bio)", type: "textarea", grid: 12 },
        ]
    },

    // EXECUTIVE - Professional/Strategic Focus
    "executive-slate": {
        personalInfo: [
            { name: "name", label: "Executive Name", type: "text", required: true, grid: 6 },
            { name: "title", label: "Leadership Title", type: "text", required: true, grid: 6 },
            { name: "email", label: "Confidential Email", type: "email", required: true, grid: 6 },
            { name: "linkedin", label: "Executive LinkedIn", type: "text", grid: 6 },
            { name: "about", label: "Executive Summary & Strategy", type: "textarea", grid: 12 },
        ]
    }
};

/**
 * UTILITY: Get current schema based on template ID and section
 */
export const getSectionSchema = (templateId, sectionName) => {
    const specific = templateSchemas[templateId]?.[sectionName];
    const common = templateSchemas.common[sectionName];
    return specific || common;
};
