/**
 * MAPPING FUNCTION (Backend -> Frontend)
 * Converts raw flat JSON from backend into nested structure for templates
 */
const CERT_KEYWORDS = [
    "certificate", "certification", "course", "coursera", "udemy", "edx",
    "training", "license", "credential", "accreditation", "pluralsight", "skill",
    "bootcamp", "nanodegree", "professional", "diploma", "workshop", "seminar"
];

const MONTH_MAP = {
    january: "01", jan: "01", "01": "01",
    february: "02", feb: "02", "02": "02",
    march: "03", mar: "03", "03": "03",
    april: "04", apr: "04", "04": "04",
    may: "05", "05": "05",
    june: "06", jun: "06", "06": "06",
    july: "07", jul: "07", "07": "07",
    august: "08", aug: "08", "08": "08",
    september: "09", sep: "09", "09": "09",
    october: "10", oct: "10", "10": "10",
    november: "11", nov: "11", "11": "11",
    december: "12", dec: "12", "12": "12"
};

const cleanDate = (dateStr) => {
    if (!dateStr || typeof dateStr !== 'string') return "";
    const clean = dateStr.toLowerCase().trim();
    if (clean === "present" || clean === "current") return "";

    // If already YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(clean)) return clean;

    // Handle "Month YYYY" or "YYYY-MM"
    const parts = clean.split(/[\s,/-]+/);
    let year = parts.find(p => /^\d{4}$/.test(p));
    let monthPart = parts.find(p => MONTH_MAP[p]);

    if (year) {
        const monthNum = monthPart ? MONTH_MAP[monthPart] : "01";
        return `${year}-${monthNum}-01`;
    }

    return "";
};

const isCertification = (item) => {
    const degree = (item.degree || item.name || "").toLowerCase();
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
        // AI may return separate fields or unified year
        let startDate = item.startDate || (item.startMonth ? `${item.startMonth} ${item.startYear || ""}`.trim() : "");
        let endDate = item.endDate || (item.endMonth ? `${item.endMonth} ${item.endYear || ""}`.trim() : "");
        let year = item.year || item.duration || item.date || "";

        // Fallback: If year is missing but we have start/end dates
        if (!year && (startDate || endDate)) {
            year = `${startDate}${endDate ? ` - ${endDate}` : ""}`;
        }

        if (isCertification(item)) {
            certsFromEdu.push(`${item.degree || item.name}${item.institute ? ` | ${item.institute}` : ""}${year ? ` (${year})` : ""}`);
        } else {
            education.push({
                degree: item.degree || "",
                institute: item.institute || item.school || "",
                year: year,
                startDate: cleanDate(startDate),
                endDate: cleanDate(endDate),
                current: endDate?.toLowerCase().includes("present") || !!item.current || !!item.isCurrent
            });
        }
    });

    const incomingCerts = Array.isArray(data.certificates)
        ? data.certificates.map(c => `${c.name}${c.issuer ? ` | ${c.issuer}` : ""}${c.date ? ` (${c.date})` : ""}`)
        : (Array.isArray(data.certifications) ? data.certifications : (typeof data.certifications === 'string' ? [data.certifications] : []));

    // 80% Similarity Deduplication Check
    const allCertsRaw = [...certsFromEdu, ...incomingCerts].filter(Boolean);
    const certifications = [];

    const getSimilarity = (s1, s2) => {
        const clean = (s) => (s || "").toLowerCase().replace(/[^a-z0-9]/g, '');
        const c1 = clean(s1);
        const c2 = clean(s2);
        if (c1 === c2) return 1.0;
        if (!c1 || !c2) return 0.0;

        const words1 = new Set(c1.split(' '));
        const words2 = new Set(c2.split(' '));
        const intersection = new Set([...words1].filter(x => words2.has(x)));
        const union = new Set([...words1, ...words2]);
        return intersection.size / union.size;
    };

    allCertsRaw.forEach(newCert => {
        const isDuplicate = certifications.some(existing => getSimilarity(existing, newCert) > 0.8);
        if (!isDuplicate) {
            certifications.push(newCert);
        }
    });

    // Map languages
    let languagesStr = "";
    if (Array.isArray(data.languages)) {
        languagesStr = data.languages.map(l => l.language || l).join(", ");
    } else {
        languagesStr = data.languages || "";
    }

    const locationStr = data.location
        ? [data.location.address, data.location.city, data.location.region, data.location.countryCode].filter(Boolean).join(", ")
        : (data.address || "");

    return {
        personalInfo: {
            name: data.name || "",
            email: data.email || "",
            phone: data.phone || "",
            title: data.title || data.label || "",
            linkedin: data.linkedin || "",
            github: data.github || "",
            address: locationStr,
            about: data.summary || data.about || ""
        },

        experience: (data.experience || []).map((exp) => {
            let duration = exp.duration || exp.date || "";
            let startDate = exp.startDate || "";
            let endDate = exp.endDate || "";

            if (!duration && (startDate || endDate)) {
                duration = `${startDate}${endDate ? ` - ${endDate}` : ""}`;
            }

            if (duration && duration.includes("-") && !startDate && !endDate) {
                const parts = duration.split("-");
                startDate = parts[0]?.trim() || "";
                endDate = parts[1]?.trim() || "";
            }

            return {
                role: exp.role || "",
                company: exp.company || "",
                duration: duration,
                startDate: cleanDate(startDate),
                endDate: cleanDate(endDate),
                current: !!exp.current || !!exp.isCurrent || endDate?.toLowerCase().includes("present"),
                description: exp.description || ""
            };
        }),

        education,
        skills: Array.isArray(data.skills) ? data.skills : [],
        languages: languagesStr,
        certifications: certifications.join("\n"),
        projects: Array.isArray(data.projects)
            ? data.projects.map(p => `${p.title} | ${p.description} | ${p.githubLink || ""} | ${p.liveLink || ""}`).join("\n")
            : data.projects || "",

        volunteer: data.volunteer || [],
        awards: data.awards || [],
        publications: data.publications || [],
        interests: data.interests || [],
        references: data.references || [],

        highValueExtras: {
            "Awards": data.awards,
            "Achievements": data.achievements,
            "Interests": data.interests,
            "Hobbies": data.hobbies,
            "Publications": data.publications,
            "Volunteering": data.volunteer || data.volunteering,
            "References": data.references,
            "Languages": languagesStr,
            "Certifications": certifications.length ? certifications.join("\n") : null
        },
        additionalSections: Array.isArray(data.additionalSections) ? data.additionalSections : []
    };
};
