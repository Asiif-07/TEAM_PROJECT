export const templateConfigs = {
    "classic-red": {
        sections: ["personalInfo", "about", "experience", "education", "skills", "projects", "languages", "certifications"],
        customFields: {
            personalInfo: [
                { name: "name", label: "Full Name", placeholder: "e.g. John Doe", required: true },
                { name: "title", label: "Job Title", placeholder: "e.g. Software Engineer", required: true },
                { name: "email", label: "Email", placeholder: "e.g. john@example.com", required: true },
                { name: "phone", label: "Phone", placeholder: "e.g. +1 234 567 890" },
                { name: "address", label: "Address", placeholder: "e.g. New York, USA" },
                { name: "linkedin", label: "LinkedIn" },
                { name: "github", label: "GitHub" }
            ]
        }
    },
    "europass-standard": {
        sections: ["personalInfo", "experience", "education", "skills", "languages", "projects"],
        customFields: {
            personalInfo: [
                { name: "name", label: "Full Name", required: true },
                { name: "title", label: "Applying Position", required: true },
                { name: "email", label: "Email", required: true },
                { name: "phone", label: "Phone" },
                { name: "address", label: "Address" }
            ]
        }
    },
    "korean-standard": {
        sections: ["personalInfo", "about", "education", "experience", "skills"],
        customFields: {
            personalInfo: [
                { name: "name", label: "성명 (Name)", required: true },
                { name: "dob", label: "생년월일 (Date of Birth)", type: "date", required: true },
                { name: "title", label: "지원분야 (Position)", required: true },
                { name: "email", label: "이메일 (Email)", required: true },
                { name: "phone", label: "연락처 (Phone)", required: true },
                { name: "address", label: "주소 (Address)" }
            ]
        }
    },
    "modern-blue": {
        sections: ["personalInfo", "about", "experience", "education", "skills", "languages", "certifications", "projects"],
        customFields: {
            personalInfo: [
                { name: "name", label: "Name", required: true },
                { name: "title", label: "Professional Title", required: true },
                { name: "email", label: "Email", required: true },
                { name: "phone", label: "Phone" },
                { name: "address", label: "Address" },
                { name: "github", label: "GitHub" },
                { name: "linkedin", label: "LinkedIn" }
            ]
        }
    },
    "minimalist-clean": {
        sections: ["personalInfo", "about", "experience", "education", "skills"],
        customFields: {
            personalInfo: [
                { name: "name", label: "Name", required: true },
                { name: "title", label: "Professional Background", required: true },
                { name: "email", label: "Email", required: true },
                { name: "phone", label: "Contact No" },
                { name: "address", label: "Location" }
            ]
        }
    },
    "creative-indigo": {
        sections: ["personalInfo", "about", "experience", "education", "skills", "languages", "projects"],
        customFields: {
            personalInfo: [
                { name: "name", label: "Name", required: true },
                { name: "title", label: "Creative Focus", required: true },
                { name: "email", label: "Email", required: true },
                { name: "phone", label: "Phone" },
                { name: "address", label: "Location" }
            ]
        }
    },
    "executive-slate": {
        sections: ["personalInfo", "about", "experience", "education", "skills", "languages", "projects"],
        customFields: {
            personalInfo: [
                { name: "name", label: "Executive Name", required: true },
                { name: "title", label: "Senior Position", required: true },
                { name: "email", label: "Professional Email", required: true },
                { name: "phone", label: "Direct Phone" },
                { name: "address", label: "Business Address" },
                { name: "linkedin", label: "LinkedIn Executive Profile" },
                { name: "github", label: "GitHub/Portfolio" }
            ]
        }
    },
    "gradient-wave": {
        sections: ["personalInfo", "about", "experience", "education", "skills", "languages", "projects"],
        customFields: {
            personalInfo: [
                { name: "name", label: "Creative Name", required: true },
                { name: "title", label: "Design/Creative Focus", required: true },
                { name: "email", label: "Inquiry Email", required: true },
                { name: "phone", label: "Phone" },
                { name: "address", label: "Location" }
            ]
        }
    },
    "tech-dark": {
        sections: ["personalInfo", "about", "experience", "education", "skills", "languages", "projects"],
        customFields: {
            personalInfo: [
                { name: "name", label: "Developer Identity", required: true },
                { name: "title", label: "Stack Focus (e.g. Full Stack)", required: true },
                { name: "email", label: "Communication Endpoint", required: true },
                { name: "phone", label: "Phone" },
                { name: "address", label: "Address" }
            ]
        }
    }
};

export const getTemplateConfig = (templateId) => {
    return templateConfigs[templateId] || templateConfigs["classic-red"];
};
