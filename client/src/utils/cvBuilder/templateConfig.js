export const templateConfigs = {
    "classic-red": {
        sections: ["personalInfo", "experience", "education", "skills"],
        customFields: {
            personalInfo: [
                { name: "name", label: "Full Name", placeholder: "e.g. John Doe", required: true },
                { name: "title", label: "Job Title", placeholder: "e.g. Software Engineer", required: true },
                { name: "email", label: "Email", placeholder: "e.g. john@example.com", required: true },
                { name: "phone", label: "Phone", placeholder: "e.g. +1 234 567 890" },
                { name: "address", label: "Address", placeholder: "e.g. New York, USA" }
            ]
        }
    },
    "europass-standard": {
        sections: ["personalInfo", "experience", "education", "skills", "languages", "certifications"],
        customFields: {
            personalInfo: [
                { name: "name", label: "Full Name", required: true },
                { name: "email", label: "Email", required: true },
                { name: "phone", label: "Phone" },
                { name: "title", label: "Applying Position", required: true },
                { name: "dob", label: "Date of Birth", type: "date" },
                { name: "address", label: "Current Address" },
                { name: "linkedin", label: "LinkedIn Profile" }
            ]
        }
    },
    "korean-standard": {
        sections: ["personalInfo", "education", "experience", "skills"],
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
        sections: ["personalInfo", "experience", "skills", "education", "projects"],
        customFields: {
            personalInfo: [
                { name: "name", label: "Name", required: true },
                { name: "title", label: "Professional Title", required: true },
                { name: "email", label: "Email", required: true },
                { name: "phone", label: "Phone" },
                { name: "github", label: "GitHub" },
                { name: "linkedin", label: "LinkedIn" }
            ]
        }
    },
    "minimalist-clean": {
        sections: ["personalInfo", "experience", "education", "skills"],
        customFields: {
            personalInfo: [
                { name: "name", label: "Name", required: true },
                { name: "title", label: "Professional Background", required: true },
                { name: "email", label: "Email", required: true },
                { name: "phone", label: "Contact No" }
            ]
        }
    },
    "creative-indigo": {
        sections: ["personalInfo", "skills", "experience", "education"],
        customFields: {
            personalInfo: [
                { name: "name", label: "Name", required: true },
                { name: "title", label: "Creative Focus", required: true },
                { name: "email", label: "Email", required: true },
                { name: "github", label: "Portfolio/GitHub" },
                { name: "linkedin", label: "LinkedIn" }
            ]
        }
    }
};

export const getTemplateConfig = (templateId) => {
    return templateConfigs[templateId] || templateConfigs["classic-red"];
};
