/**
 * MAPPING FUNCTION (Backend -> Frontend)
 * Converts raw flat JSON from backend into nested structure for templates
 */
const CERT_KEYWORDS = [
    "certificate", "certification", "course", "coursera", "udemy", "edx",
    "training", "license", "credential", "accreditation", "pluralsight", "skill",
    "bootcamp", "nanodegree", "professional", "diploma", "workshop", "seminar"
];

const isCertification = (item) => {
    const degree = (item.degree || "").toLowerCase();
    const institute = (item.institute || "").toLowerCase();

    // Explicit exclusions for formal education
    const formalHighValue = ["bs", "ms", "phd", "bachelor", "master", "doctorate", "degree", "ssc", "hssc", "school", "college", "university"];
    if (formalHighValue.some(kw => degree.includes(kw))) return false;

    // Check for certification keywords
    const text = `${degree} ${institute}`.toLowerCase();

    // "Development" combined with "Full Stack" or "Advance" often means a course
    if (text.includes("development") && (text.includes("stack") || text.includes("advance"))) return true;

    return CERT_KEYWORDS.some(kw => text.includes(kw));
};

export const mapParsedDataToTemplate = (data) => {
    if (!data) return null;

    const rawEducation = data.education || [];
    const education = [];
    const certsFromEdu = [];

    // Validation: Separate formal education from certifications/courses
    rawEducation.forEach(item => {
        let year = item.year || item.duration || item.date || "";
        let startDate = item.startDate || "";
        let endDate = item.endDate || "";

        // Fallback: If year is missing but we have start/end dates
        if (!year && (startDate || endDate)) {
            year = `${startDate}${endDate ? ` - ${endDate}` : ""}`;
        }

        if (isCertification(item)) {
            certsFromEdu.push(`${item.degree}${item.institute ? ` | ${item.institute}` : ""}${year ? ` (${year})` : ""}`);
        } else {
            // Split year/duration if possible for the form fields (if we got a combined string)
            if (year && year.includes("-") && !startDate && !endDate) {
                const parts = year.split("-");
                startDate = parts[0]?.trim() || "";
                endDate = parts[1]?.trim() || "";
            }

            education.push({
                degree: item.degree || "",
                institute: item.institute || "",
                year: year,
                startDate: startDate,
                endDate: endDate,
                current: !!item.current
            });
        }
    });

    const incomingCerts = Array.isArray(data.certifications) ? data.certifications : (typeof data.certifications === 'string' ? [data.certifications] : []);
    const certifications = [...certsFromEdu, ...incomingCerts].filter(Boolean);

    return {
        personalInfo: {
            name: data.name || "",
            email: data.email || "",
            phone: data.phone || "",
            title: data.title || "",
            linkedin: data.linkedin || "",
            github: data.github || "",
            address: data.address || "",
            about: data.summary || data.about || ""
        },

        experience: (data.experience || []).map((exp) => {
            let duration = exp.duration || exp.date || "";
            let startDate = exp.startDate || "";
            let endDate = exp.endDate || "";

            // Fallback: Construct duration if missing
            if (!duration && (startDate || endDate)) {
                duration = `${startDate}${endDate ? ` - ${endDate}` : ""}`;
            }

            // Split duration if missing start/end
            if (duration && duration.includes("-") && !startDate && !endDate) {
                const parts = duration.split("-");
                startDate = parts[0]?.trim() || "";
                endDate = parts[1]?.trim() || "";
            }

            return {
                role: exp.role || "",
                company: exp.company || "",
                duration: duration,
                startDate,
                endDate,
                current: !!exp.current,
                description: exp.description || ""
            };
        }),

        education,
        skills: Array.isArray(data.skills) ? data.skills : [],
        languages: data.languages || "",
        certifications: certifications.join("\n"),
        projects: Array.isArray(data.projects)
            ? data.projects.map(p => `${p.title} | ${p.description}`).join("\n")
            : data.projects || "",

        // Items that might need to be moved to additionalSections if unsupported by template
        highValueExtras: {
            Awards: data.awards,
            Achievements: data.achievements,
            Interests: data.interests,
            Hobbies: data.hobbies,
            Publications: data.publications,
            Volunteering: data.volunteering,
            References: data.references
        }
    };
};
