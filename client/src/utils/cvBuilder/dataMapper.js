/**
 * MAPPING FUNCTION (Backend -> Frontend)
 * Converts raw flat JSON from backend into nested structure for templates
 */
export const mapParsedDataToTemplate = (data) => {
    if (!data) return null;

    return {
        personalInfo: {
            name: data.name || "",
            email: data.email || "",
            phone: data.phone || "",
            title: data.title || "",
            linkedin: data.linkedin || "",
            github: data.github || "",
            about: data.summary || "" // Maps summary to about
        },

        experience: (data.experience || []).map((exp) => ({
            role: exp.role || "",
            company: exp.company || "",
            duration: exp.duration || "",
            description: exp.description || ""
        })),

        education: (data.education || []).map((edu) => ({
            degree: edu.degree || "",
            institute: edu.institute || "",
            year: edu.year || ""
        })),

        skills: Array.isArray(data.skills) ? data.skills : [],
        languages: data.languages || "",
        customFields: data.customFields || {},
        projects: Array.isArray(data.projects)
            ? data.projects.map(p => `${p.title} | ${p.description}`).join("\n")
            : data.projects || ""
    };
};
