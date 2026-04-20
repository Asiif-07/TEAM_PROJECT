import React from "react";
import { Box, Typography, Grid, Link, Divider } from "@mui/material";
import { Code, Terminal, Cpu, Database, Globe, Mail, Phone, MapPin, Github } from "lucide-react";
import { CVSection, ExperienceItem, EducationItem, SkillList, SimpleList } from "./TemplateComponents";

export default function TechPremiumTemplate({ data }) {
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

    const accentColor = "#06b6d4"; // Cyan-500
    const darkBg = "#0f172a"; // Slate-900

    return (
        <Box sx={{ minHeight: "297mm", bgcolor: "#fff", fontFamily: "'JetBrains Mono', monospace" }}>
            {/* TECH HEADER (DARK) */}
            <Box sx={{ p: 6, bgcolor: darkBg, color: "#fff" }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
                        {profileImageUrl && (
                            <Box
                                component="img"
                                src={profileImageUrl}
                                sx={{
                                    width: 80,
                                    height: 80,
                                    borderRadius: "12px",
                                    objectFit: "cover",
                                    border: `2px solid ${accentColor}`,
                                    boxShadow: `0 0 20px ${accentColor}44`
                                }}
                            />
                        )}
                        <Box>
                            <Typography variant="h4" sx={{ fontWeight: 800, color: accentColor, mb: 1 }}>
                                &lt;{personalInfo.name?.replace(/\s/g, '')} /&gt;
                            </Typography>
                            <Typography variant="h6" sx={{ color: "#94a3b8", fontWeight: 500 }}>
                                $ {personalInfo.title}
                            </Typography>
                        </Box>
                    </Box>
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 0.5 }}>
                        <Typography variant="caption" sx={{ color: "#94a3b8" }}>{personalInfo.email}</Typography>
                        <Typography variant="caption" sx={{ color: "#94a3b8" }}>{personalInfo.phone}</Typography>
                        <Typography variant="caption" sx={{ color: "#94a3b8" }}>{personalInfo.address}</Typography>
                    </Box>
                </Box>
            </Box>

            <Box sx={{ p: 6 }}>
                <Grid container spacing={5}>
                    <Grid item xs={8}>
                        <CVSection title="System.out.println('Bio')" icon={Terminal} color={accentColor}>
                            <Typography variant="body2" sx={{ color: "#475569", lineHeight: 1.8, p: 2, bgcolor: "#f8fafc", borderLeft: `4px solid ${accentColor}`, borderRadius: "0 4px 4px 0" }}>
                                {personalInfo.about}
                            </Typography>
                        </CVSection>

                        <CVSection title="Execution_History" icon={Code} color={accentColor}>
                            {experience?.map((exp, i) => (
                                <ExperienceItem
                                    key={i}
                                    role={exp.role}
                                    company={exp.company}
                                    duration={exp.duration}
                                    description={exp.description}
                                    color={accentColor}
                                />
                            ))}
                        </CVSection>
                    </Grid>

                    <Grid item xs={4}>
                        <CVSection title="TechStack" icon={Cpu} color={accentColor}>
                            <SkillList skills={skills} color={accentColor} />
                        </CVSection>

                        <CVSection title="Knowledge_Base" icon={Database} color={accentColor}>
                            {education?.map((edu, i) => (
                                <EducationItem
                                    key={i}
                                    degree={edu.degree}
                                    institute={edu.institute}
                                    year={edu.year}
                                    color={accentColor}
                                />
                            ))}
                        </CVSection>

                        <CVSection title="Localizations" icon={Globe} color={accentColor}>
                            <SimpleList data={languages} color="#475569" />
                        </CVSection>
                    </Grid>
                </Grid>

                {projects && (
                    <CVSection title="Open_Source_Contributions" icon={Github} color={accentColor}>
                        <SimpleList data={projects} />
                    </CVSection>
                )}
            </Box>
        </Box>
    );
}
