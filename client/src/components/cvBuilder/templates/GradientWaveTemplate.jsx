import React from "react";
import { Box, Typography, Grid, Avatar, Link } from "@mui/material";
import { Mail, Phone, MapPin, Linkedin, Github } from "lucide-react";
import { CVSection, ExperienceItem, EducationItem, SkillProgress, SimpleList } from "./TemplateComponents";

export default function GradientWaveTemplate({ data }) {
    const personalInfo = data?.personalInfo || {};
    const experience = data?.experience || [];
    const education = data?.education || [];
    const skills = data?.skills || [];
    const languages = data?.languages || "";
    const projects = data?.projects || "";

    const profileImageUrl = React.useMemo(() => {
        const img = personalInfo.profileImage;
        if (personalInfo.profileImagePreview) return personalInfo.profileImagePreview;
        if (!img) return null;
        if (typeof img === 'string') return img;
        if (img.secure_url) return img.secure_url;
        if (img instanceof File || img instanceof Blob) return URL.createObjectURL(img);
        return null;
    }, [personalInfo.profileImage, personalInfo.profileImagePreview]);

    if (!data) return null;

    const primaryColor = "#7c3aed"; // Violet-600
    const secondaryColor = "#2563eb"; // Blue-600
    const gradient = `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`;

    return (
        <Box sx={{ minHeight: "297mm", bgcolor: "#fff", display: "flex", flexDirection: "column", overflow: "hidden" }}>
            {/* FLOWING GRADIENT HEADER */}
            <Box sx={{
                height: "180px",
                background: gradient,
                position: "relative",
                display: "flex",
                alignItems: "center",
                px: 6,
                color: "#fff"
            }}>
                <Box sx={{ zIndex: 2, display: "flex", alignItems: "center", gap: 3 }}>
                    {profileImageUrl && (
                        <Avatar
                            src={profileImageUrl}
                            sx={{
                                width: 90,
                                height: 90,
                                border: "3px solid rgba(255,255,255,0.3)",
                                boxShadow: "0 8px 32px rgba(0,0,0,0.2)"
                            }}
                        />
                    )}
                    <Box>
                        <Typography variant="h3" sx={{ fontWeight: 900, letterSpacing: "-1px", mb: 0.5 }}>{personalInfo.name}</Typography>
                        <Typography variant="h6" sx={{ fontWeight: 600, opacity: 0.9, letterSpacing: 1 }}>{personalInfo.title?.toUpperCase()}</Typography>
                    </Box>
                </Box>

                {/* SVG WAVE MASK */}
                <Box sx={{ position: "absolute", bottom: -1, left: 0, width: "100%", lineHeight: 0, zIndex: 1 }}>
                    <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 70C840 80 960 100 1080 110C1200 120 1320 120 1380 120H1440V0H1380C1320 0 1200 0 1080 0C960 0 840 0 720 0C600 0 480 0 360 0C240 0 120 0 60 0H0V120Z" fill="white" />
                    </svg>
                </Box>
            </Box>

            <Box sx={{ px: 6, mt: 4, display: "flex", gap: 6 }}>
                {/* SIDEBAR (30%) */}
                <Box sx={{ width: "30%" }}>
                    <Box sx={{ mb: 5 }}>
                        <Typography variant="overline" sx={{ fontWeight: 900, color: primaryColor, letterSpacing: 2 }}>Contact</Typography>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
                            {[
                                { icon: Mail, text: personalInfo.email },
                                { icon: Phone, text: personalInfo.phone },
                                { icon: MapPin, text: personalInfo.address }
                            ].map((item, i) => item.text && (
                                <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                                    <item.icon size={16} color={primaryColor} />
                                    <Typography variant="caption" sx={{ color: "#475569", fontWeight: 600 }}>{item.text}</Typography>
                                </Box>
                            ))}
                        </Box>
                    </Box>

                    <Box sx={{ mb: 5 }}>
                        <Typography variant="overline" sx={{ fontWeight: 900, color: primaryColor, letterSpacing: 2 }}>Expertise</Typography>
                        <Box sx={{ mt: 2 }}>
                            {skills?.map((s, i) => (
                                <SkillProgress key={i} name={s} level={85} color={primaryColor} />
                            ))}
                        </Box>
                    </Box>

                    <Box>
                        <Typography variant="overline" sx={{ fontWeight: 900, color: primaryColor, letterSpacing: 2 }}>Languages</Typography>
                        <Box sx={{ mt: 2 }}>
                            <SimpleList data={languages} bullet={false} color="#475569" />
                        </Box>
                    </Box>
                </Box>

                {/* MAIN (70%) */}
                <Box sx={{ flex: 1 }}>
                    <CVSection title="Professional Summary" color={primaryColor}>
                        <Typography variant="body2" sx={{ color: "#334155", lineHeight: 1.8, fontSize: "0.95rem" }}>
                            {personalInfo.about}
                        </Typography>
                    </CVSection>

                    <CVSection title="Work History" color={primaryColor}>
                        {experience?.map((exp, i) => (
                            <ExperienceItem
                                key={i}
                                role={exp.role}
                                company={exp.company}
                                duration={exp.duration}
                                description={exp.description}
                                color={primaryColor}
                            />
                        ))}
                    </CVSection>

                    <CVSection title="Education" color={primaryColor}>
                        {education?.map((edu, i) => (
                            <EducationItem
                                key={i}
                                degree={edu.degree}
                                institute={edu.institute}
                                year={edu.year}
                                color={primaryColor}
                            />
                        ))}
                    </CVSection>

                    {projects && (
                        <CVSection title="Personal Projects" color={primaryColor}>
                            <SimpleList data={projects} />
                        </CVSection>
                    )}
                </Box>
            </Box>
        </Box>
    );
}
