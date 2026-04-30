import React from "react";
import { Box, Typography } from "@mui/material";
import AdditionalSectionsBlock from "./AdditionalSectionsBlock";


const RibbonHeader = ({ title }) => (
    <Box sx={{ position: "relative", mb: 3, mt: 5, width: "112%", zIndex: 2 }}>
        <Box sx={{ 
            bgcolor: "#222", 
            color: "#fff", 
            py: 1.2, 
            pl: 5, 
            pr: 2, 
            fontSize: "1.4rem", 
            fontWeight: 800, 
            letterSpacing: "1px" 
        }}>
            {title}
        </Box>
        {/* The little dark fold triangle underneath */}
        <Box sx={{ 
            position: "absolute", 
            right: 0, 
            bottom: -10, 
            width: 0, 
            height: 0, 
            borderTop: "10px solid #0a0a0a", 
            borderRight: "10px solid transparent" 
        }} />
    </Box>
);

// Sidebar contact item (Label bold, value normal)
const SidebarItem = ({ label, value }) => {
    if (!value) return null;
    return (
        <Box sx={{ mb: 2.5, px: 5 }}>
            <Typography sx={{ fontWeight: 800, fontSize: "0.95rem", color: "#222" }}>{label}</Typography>
            <Typography sx={{ fontSize: "0.85rem", color: "#444", wordBreak: "break-word" }}>{value}</Typography>
        </Box>
    );
};

// Sidebar Education Item
const SidebarEduItem = ({ degree, institute, year }) => {
    if (!degree && !institute) return null;
    return (
        <Box sx={{ mb: 3, px: 5 }}>
            <Typography sx={{ fontWeight: 800, fontSize: "0.95rem", color: "#222", lineHeight: 1.2, mb: 0.5 }}>{degree}</Typography>
            <Typography sx={{ fontSize: "0.85rem", color: "#444" }}>{institute}</Typography>
            <Typography sx={{ fontSize: "0.85rem", color: "#666" }}>{year}</Typography>
        </Box>
    );
};

// Main Content Header
const MainHeader = ({ title }) => (
    <Typography variant="h5" sx={{ fontWeight: 900, color: "#222", mb: 3, letterSpacing: "0.5px" }}>
        {title}
    </Typography>
);

export default function ModernTemplate({ data }) {
    
    // Fallbacks and exact data extraction
    const { 
        personalInfo = {}, 
        experience = [], 
        education = [], 
        skills = [],
        languages = [],
        references = [] 
    } = data || {};

    const parseArray = (item) => {
        if (Array.isArray(item)) return item;
        if (typeof item === "string" && item.trim() !== "") return item.split(",").map(s => s.trim());
        return [];
    };

    const getDisplayText = (item) => {
        if (!item) return "";
        if (typeof item === "string") return item;
        if (typeof item === "object") {
            const possibleKeys = ["name", "title", "label", "value", "description", "text", "degree", "institute", "role", "company", "url", "link"];
            for (let key of possibleKeys) {
                if (item[key]) return item[key];
            }
            const fallbackString = Object.values(item).find(v => typeof v === "string");
            if (fallbackString) return fallbackString;
            return ""; 
        }
        return String(item);
    };

    const safeExperience = Array.isArray(experience) ? experience : [];
    const safeEducation = Array.isArray(education) ? education : [];
    const safeSkills = parseArray(skills);
    const safeLanguages = parseArray(languages);
    const safeReferences = Array.isArray(references) ? references : [];

    // Strictly extracting only Phone, Email, and Address
    const displayPhone = getDisplayText(personalInfo.phone || personalInfo.contactNo || personalInfo.contact);
    const displayAddress = getDisplayText(personalInfo.address || personalInfo.location || personalInfo.city);
    const displayEmail = getDisplayText(personalInfo.email);

    const profileImageUrl = React.useMemo(() => {
        const img = personalInfo.profileImagePreview || personalInfo.profileImage;
        if (!img) return null;
        if (typeof img === "string") return img;
        if (img.secure_url) return img.secure_url;
        if (img instanceof File || img instanceof Blob) return URL.createObjectURL(img);
        return null;
    }, [personalInfo.profileImage, personalInfo.profileImagePreview]);

    // Format Date for Timeline (splits "2020 - 2023" into stacked text)
    const renderTimelineDate = (dateStr) => {
        const date = getDisplayText(dateStr);
        if (!date) return null;
        
        // Attempt to split by dash to stack them like the design
        const parts = date.split(/[-–—]/).map(s => s.trim());
        if (parts.length >= 2) {
            return (
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <Typography sx={{ fontWeight: 900, fontSize: "0.9rem", color: "#222" }}>{parts[0]}</Typography>
                    <Typography sx={{ fontWeight: 900, fontSize: "0.9rem", color: "#222", lineHeight: 0.8 }}>-</Typography>
                    <Typography sx={{ fontWeight: 900, fontSize: "0.9rem", color: "#222" }}>{parts[1]}</Typography>
                </Box>
            );
        }
        return <Typography sx={{ fontWeight: 900, fontSize: "0.9rem", color: "#222", textAlign: "center" }}>{date}</Typography>;
    };

    // Clean bullets
    const renderBullets = (text) => {
        if (!text) return null;
        const bullets = text.split(/\n|•/).filter(b => b.trim() !== "");
        return (
            <Box component="ul" sx={{ m: 0, pl: 2.5, mt: 1 }}>
                {bullets.map((bullet, idx) => (
                    <Typography component="li" key={idx} variant="body2" sx={{ color: "#333", mb: 0.8, textAlign: "justify", fontSize: "0.85rem", lineHeight: 1.6 }}>
                        {bullet.trim()}
                    </Typography>
                ))}
            </Box>
        );
    };

    return (
        <Box className="cv-document" sx={{ 
            display: "flex", 
            minHeight: "297mm", 
            width: "210mm", 
            mx: "auto", 
            bgcolor: "#fff", 
            fontFamily: "'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif",
            "@media print": { boxShadow: 0 } 
        }}>
            
            {/* ================= LEFT SIDEBAR ================= */}
            <Box sx={{ width: "35%", bgcolor: "#EAEAEA", pb: 5, position: "relative", zIndex: 1 }}>
                
                {/* Top Gray Background Block */}
                <Box sx={{ width: "100%", height: "200px", bgcolor: "#D9D9D9", position: "absolute", top: 0, left: 0, zIndex: -1 }} />
                
                {/* Profile Photo (Overlapping) */}
                <Box sx={{ display: "flex", justifyContent: "center", pt: "60px", mb: 3 }}>
                    <Box sx={{ 
                        width: "180px", 
                        height: "180px", 
                        borderRadius: "50%", 
                        border: "6px solid #D9D9D9", // Matches the background to look seamless
                        bgcolor: "#ccc",
                        overflow: "hidden",
                        boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
                    }}>
                        {profileImageUrl ? (
                            <Box component="img" src={profileImageUrl} sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                            <Box sx={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", bgcolor: "#222" }}>
                                <Typography variant="h2" sx={{ color: "#fff", fontWeight: 900 }}>{getDisplayText(personalInfo.name)?.charAt(0) || "U"}</Typography>
                            </Box>
                        )}
                    </Box>
                </Box>

                {/* Contact Section - EXCLUSIVELY Phone, Email, Address */}
                <RibbonHeader title="Contact" />
                <SidebarItem label="Phone" value={displayPhone} />
                <SidebarItem label="Email" value={displayEmail} />
                <SidebarItem label="Address" value={displayAddress} />

                {/* Education Section (Moved to Sidebar per design) */}
                {safeEducation.length > 0 && (
                    <>
                        <RibbonHeader title="Education" />
                        {safeEducation.map((edu, idx) => (
                            <SidebarEduItem 
                                key={idx}
                                degree={getDisplayText(edu.degree || edu.course)}
                                institute={getDisplayText(edu.institute || edu.school)}
                                year={getDisplayText(edu.year || edu.date)}
                            />
                        ))}
                    </>
                )}

                {/* Skills Section */}
                {safeSkills.length > 0 && (
                    <>
                        <RibbonHeader title="Skills" />
                        <Box component="ul" sx={{ m: 0, pl: 7, pr: 2 }}>
                            {safeSkills.map((skill, idx) => (
                                <Typography component="li" key={idx} sx={{ fontSize: "0.85rem", color: "#222", mb: 1, fontWeight: 500 }}>
                                    {getDisplayText(skill)}
                                </Typography>
                            ))}
                        </Box>
                    </>
                )}

                {/* Language Section */}
                {safeLanguages.length > 0 && (
                    <>
                        <RibbonHeader title="Language" />
                        <Box component="ul" sx={{ m: 0, pl: 7, pr: 2 }}>
                            {safeLanguages.map((lang, idx) => (
                                <Typography component="li" key={idx} sx={{ fontSize: "0.85rem", color: "#222", mb: 1, fontWeight: 500 }}>
                                    {getDisplayText(lang)}
                                </Typography>
                            ))}
                        </Box>
                    </>
                )}
            </Box>

            {/* ================= RIGHT MAIN CONTENT ================= */}
            <Box sx={{ width: "65%", p: "50px 40px", position: "relative" }}>
                
                {/* Top Right Decorative Gray Box */}
                <Box sx={{ position: "absolute", top: 0, right: 0, width: "120px", height: "120px", bgcolor: "#EAEAEA", zIndex: 0 }} />

                {/* Header (Name & Title) */}
                <Box sx={{ mb: 6, mt: 2, position: "relative", zIndex: 2 }}>
                    <Typography sx={{ 
                        fontWeight: 900, 
                        fontSize: "3.2rem", 
                        color: "#222", 
                        lineHeight: 1.1, 
                        textTransform: "uppercase",
                        mb: 1,
                        wordBreak: "break-word"
                    }}>
                        {getDisplayText(personalInfo.name)}
                    </Typography>
                    <Typography sx={{ 
                        fontWeight: 600, 
                        fontSize: "1.3rem", 
                        color: "#444", 
                        letterSpacing: "1px" 
                    }}>
                        {getDisplayText(personalInfo.title)}
                    </Typography>
                </Box>

                {/* Professional Experience Timeline */}
                {safeExperience.length > 0 && (
                    <Box sx={{ mb: 4 }}>
                        <MainHeader title="Professional Experience" />
                        
                        {safeExperience.map((exp, idx) => (
                            <Box key={idx} sx={{ display: "flex", mb: 3.5 }}>
                                {/* Timeline Left (Dates) */}
                                <Box sx={{ width: "70px", flexShrink: 0, pt: 0.5 }}>
                                    {renderTimelineDate(exp.duration || exp.date)}
                                </Box>
                                
                                {/* Timeline Right (Content) */}
                                <Box sx={{ flex: 1, pl: 3, borderLeft: "2px solid #ccc" }}>
                                    <Typography sx={{ fontWeight: 800, fontSize: "1.1rem", color: "#222", mb: 0.5 }}>
                                        {getDisplayText(exp.role || exp.position)}
                                    </Typography>
                                    <Typography sx={{ fontSize: "0.9rem", color: "#444", mb: 1 }}>
                                        {getDisplayText(exp.company || exp.organization)}
                                    </Typography>
                                    {renderBullets(getDisplayText(exp.description || exp.summary))}
                                </Box>
                            </Box>
                        ))}
                    </Box>
                )}

                {/* References Section (Side by Side Grid) */}
                {safeReferences.length > 0 && (
                    <Box sx={{ mt: 5 }}>
                        <MainHeader title="References" />
                        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3 }}>
                            {safeReferences.map((ref, idx) => (
                                <Box key={idx}>
                                    <Typography sx={{ fontWeight: 800, fontSize: "1rem", color: "#222" }}>
                                        {getDisplayText(ref.name)}
                                    </Typography>
                                    <Typography sx={{ fontSize: "0.85rem", color: "#444", mb: 1 }}>
                                        {getDisplayText(ref.company)} / {getDisplayText(ref.role)}
                                    </Typography>
                                    {ref.phone && (
                                        <Typography sx={{ fontSize: "0.8rem", color: "#222", fontWeight: 800 }}>
                                            Phone: <span style={{ fontWeight: 400, color: "#444" }}>{getDisplayText(ref.phone)}</span>
                                        </Typography>
                                    )}
                                    {ref.email && (
                                        <Typography sx={{ fontSize: "0.8rem", color: "#222", fontWeight: 800 }}>
                                            Email: <span style={{ fontWeight: 400, color: "#444" }}>{getDisplayText(ref.email)}</span>
                                        </Typography>
                                    )}
                                </Box>
                            ))}
                        </Box>
                    </Box>
                )}

                {/* Additional dynamic sections if any */}
                <Box sx={{ mt: 4 }}>
                    <AdditionalSectionsBlock sections={data?.additionalSections} accentColor="#222" />
                </Box>
                
            </Box>
        </Box>
    );
}