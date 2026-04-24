export const templateConfigs = {
    "classic-red": {
        usePhoto: false,
        sections: ["personalInfo", "about", "experience", "education", "skills", "projects", "languages", "certifications"],
        customFields: {
            personalInfo: [
                { name: "name", label: "Full Name", placeholder: "e.g. John Doe", required: true },
                { name: "title", label: "Job Title", placeholder: "e.g. Software Engineer", required: true },
                { name: "email", label: "Email", placeholder: "e.g. john@example.com", required: true },
                { name: "phone", label: "Phone", placeholder: "e.g. +1 234 567 890" },
                { name: "address", label: "Address", placeholder: "e.g. New York, USA" },
                { name: "linkedin", label: "LinkedIn", placeholder: "e.g. linkedin.com/in/johndoe" },
                { name: "github", label: "GitHub", placeholder: "e.g. github.com/johndoe" }
            ]
        }
    },
    "europass-standard": {
        usePhoto: true,
        sections: ["personalInfo", "experience", "education", "skills", "languages", "projects"],
        customFields: {
            personalInfo: [
                { name: "name", label: "Full Name", placeholder: "e.g. Marie Dupont", required: true },
                { name: "title", label: "Applying Position", placeholder: "e.g. Marketing Manager", required: true },
                { name: "email", label: "Email", placeholder: "e.g. marie@example.com", required: true },
                { name: "phone", label: "Phone", placeholder: "e.g. +33 6 12 34 56 78" },
                { name: "address", label: "Address", placeholder: "e.g. Paris, France" }
            ]
        }
    },
    "korean-standard": {
        usePhoto: true,
        sections: ["personalInfo", "about", "education", "experience", "skills"],
        customFields: {
            personalInfo: [
                { name: "name", label: "성명 (Name)", placeholder: "e.g. 김민수", required: true },
                { name: "dob", label: "생년월일 (Date of Birth)", type: "date", required: true },
                { name: "title", label: "지원분야 (Position)", placeholder: "e.g. 소프트웨어 엔지니어", required: true },
                { name: "email", label: "이메일 (Email)", placeholder: "e.g. minsu@example.com", required: true },
                { name: "phone", label: "연락처 (Phone)", placeholder: "e.g. 010-1234-5678", required: true },
                { name: "address", label: "주소 (Address)", placeholder: "e.g. 서울시 강남구" }
            ]
        }
    },
    "modern-blue": {
        usePhoto: true,
        sections: ["personalInfo", "about", "experience", "education", "skills", "languages", "certifications", "projects"],
        customFields: {
            personalInfo: [
                { name: "name", label: "Name", placeholder: "e.g. Sarah Johnson", required: true },
                { name: "title", label: "Professional Title", placeholder: "e.g. Product Manager", required: true },
                { name: "email", label: "Email", placeholder: "e.g. sarah@company.com", required: true },
                { name: "phone", label: "Phone", placeholder: "e.g. +1 555 123 4567" },
                { name: "address", label: "Address", placeholder: "e.g. San Francisco, CA" },
                { name: "github", label: "GitHub", placeholder: "e.g. github.com/sarahj" },
                { name: "linkedin", label: "LinkedIn", placeholder: "e.g. linkedin.com/in/sarahj" }
            ]
        }
    },
    "minimalist-clean": {
        usePhoto: true,
        sections: ["personalInfo", "about", "experience", "education", "skills"],
        customFields: {
            personalInfo: [
                { name: "name", label: "Name", placeholder: "e.g. David Chen", required: true },
                { name: "title", label: "Professional Background", placeholder: "e.g. UX Designer", required: true },
                { name: "email", label: "Email", placeholder: "e.g. david@example.com", required: true },
                { name: "phone", label: "Contact No", placeholder: "e.g. +1 234 567 890" },
                { name: "address", label: "Location", placeholder: "e.g. London, UK" }
            ]
        }
    },
    "creative-indigo": {
        usePhoto: true,
        sections: ["personalInfo", "about", "experience", "education", "skills", "languages", "projects"],
        customFields: {
            personalInfo: [
                { name: "name", label: "Name", placeholder: "e.g. Luna Rivera", required: true },
                { name: "title", label: "Creative Focus", placeholder: "e.g. Graphic Designer", required: true },
                { name: "email", label: "Email", placeholder: "e.g. luna@studio.com", required: true },
                { name: "phone", label: "Phone", placeholder: "e.g. +1 555 987 6543" },
                { name: "address", label: "Location", placeholder: "e.g. Austin, TX" }
            ]
        }
    },
    "executive-slate": {
        usePhoto: true,
        sections: ["personalInfo", "about", "experience", "education", "skills", "languages", "projects"],
        customFields: {
            personalInfo: [
                { name: "name", label: "Executive Name", placeholder: "e.g. Robert Williams", required: true },
                { name: "title", label: "Senior Position", placeholder: "e.g. VP of Engineering", required: true },
                { name: "email", label: "Professional Email", placeholder: "e.g. robert@corp.com", required: true },
                { name: "phone", label: "Direct Phone", placeholder: "e.g. +1 212 555 0100" },
                { name: "address", label: "Business Address", placeholder: "e.g. New York, NY" },
                { name: "linkedin", label: "LinkedIn Executive Profile", placeholder: "e.g. linkedin.com/in/robertw" },
                { name: "github", label: "GitHub/Portfolio", placeholder: "e.g. github.com/robertw" }
            ]
        }
    },
    "gradient-wave": {
        usePhoto: true,
        sections: ["personalInfo", "about", "experience", "education", "skills", "languages", "projects"],
        customFields: {
            personalInfo: [
                { name: "name", label: "Creative Name", placeholder: "e.g. Aria Patel", required: true },
                { name: "title", label: "Design/Creative Focus", placeholder: "e.g. Art Director", required: true },
                { name: "email", label: "Inquiry Email", placeholder: "e.g. aria@design.co", required: true },
                { name: "phone", label: "Phone", placeholder: "e.g. +1 323 555 0123" },
                { name: "address", label: "Location", placeholder: "e.g. Los Angeles, CA" }
            ]
        }
    },
    "tech-dark": {
        usePhoto: true,
        sections: ["personalInfo", "about", "experience", "education", "skills", "languages", "projects"],
        customFields: {
            personalInfo: [
                { name: "name", label: "Developer Identity", placeholder: "e.g. Alex Kim", required: true },
                { name: "title", label: "Stack Focus (e.g. Full Stack)", placeholder: "e.g. Full Stack Developer", required: true },
                { name: "email", label: "Communication Endpoint", placeholder: "e.g. alex@dev.io", required: true },
                { name: "phone", label: "Phone", placeholder: "e.g. +1 415 555 0199" },
                { name: "address", label: "Address", placeholder: "e.g. Seattle, WA" }
            ]
        }
    },
    "black-pro": {
        usePhoto: true,
        sections: ["personalInfo", "about", "experience", "education", "skills"],
        customFields: {
            personalInfo: [
                { name: "name", label: "Professional Name", placeholder: "e.g. James Carter", required: true },
                { name: "title", label: "Corporate Role", placeholder: "e.g. Chief Financial Officer", required: true },
                { name: "email", label: "Corporate Email", placeholder: "e.g. james@enterprise.com", required: true },
                { name: "phone", label: "Mobile", placeholder: "e.g. +1 646 555 0178" },
                { name: "linkedin", label: "LinkedIn", placeholder: "e.g. linkedin.com/in/jamescarter" }
            ]
        }
    },
    "black-white": {
        usePhoto: true,
        sections: ["personalInfo", "experience", "education", "skills"],
        customFields: {
            personalInfo: [
                { name: "name", label: "Name", placeholder: "e.g. Emily Park", required: true },
                { name: "title", label: "Focus Area", placeholder: "e.g. Data Analyst", required: true },
                { name: "email", label: "Email", placeholder: "e.g. emily@example.com", required: true },
                { name: "phone", label: "Phone", placeholder: "e.g. +1 312 555 0145" }
            ]
        }
    },
    "monochrome-simple": {
        usePhoto: true,
        sections: ["personalInfo","about", "experience", "education", "skills"],
        customFields: {
            personalInfo: [
                { name: "name", label: "Name", placeholder: "e.g. Marcus Lee", required: true },
                { name: "title", label: "Main Profession", placeholder: "e.g. Architect", required: true },
                { name: "email", label: "Email", placeholder: "e.g. marcus@firm.com", required: true },
                { name: "phone", label: "Contact No", placeholder: "e.g. +1 305 555 0167" }
            ]
        }
    },
    "orange-white": {
        usePhoto: false,
        sections: ["personalInfo", "about", "experience", "education", "skills", "projects"],
        customFields: {
            personalInfo: [
                { name: "name", label: "Creative Name", placeholder: "e.g. Zoe Martinez", required: true },
                { name: "title", label: "Energetic Title", placeholder: "e.g. Brand Strategist", required: true },
                { name: "email", label: "Email", placeholder: "e.g. zoe@creative.io", required: true },
                { name: "phone", label: "Phone", placeholder: "e.g. +1 786 555 0134" },
                { name: "github", label: "GitHub/Portfolio", placeholder: "e.g. github.com/zoemartinez" }
            ]
        }
    },
    "royal-blue": {
        usePhoto: true,
        sections: ["personalInfo", "about", "experience", "education", "skills", "projects"],
        customFields: {
            personalInfo: [
                { name: "name", label: "Full Name", placeholder: "e.g. Michael Brooks", required: true },
                { name: "title", label: "Professional Title", placeholder: "e.g. Senior Consultant", required: true },
                { name: "email", label: "Official Email", placeholder: "e.g. michael@firm.com", required: true },
                { name: "phone", label: "Business Phone", placeholder: "e.g. +1 202 555 0156" },
                { name: "linkedin", label: "LinkedIn Profile", placeholder: "e.g. linkedin.com/in/michaelbrooks" }
            ]
        }
    },
    "royal-brown": {
        usePhoto: true,
        sections: ["personalInfo", "about", "experience", "education", "skills", "languages"],
        customFields: {
            personalInfo: [
                { name: "name", label: "Full Name", placeholder: "e.g. Sophia Bennett", required: true },
                { name: "title", label: "Distinctive Title", placeholder: "e.g. Creative Director", required: true },
                { name: "email", label: "Email", placeholder: "e.g. sophia@agency.com", required: true },
                { name: "phone", label: "Phone", placeholder: "e.g. +1 404 555 0189" },
                { name: "address", label: "Address", placeholder: "e.g. Atlanta, GA" }
            ]
        }
    }
};

export const getTemplateConfig = (templateId) => {
    return templateConfigs[templateId] || templateConfigs["classic-red"];
};
