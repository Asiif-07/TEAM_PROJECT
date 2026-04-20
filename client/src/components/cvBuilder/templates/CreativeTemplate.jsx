import React from "react";
import { Box, Typography, Grid, Avatar, Divider } from "@mui/material";
import { Mail, Phone, MapPin, Linkedin, Github, Globe } from "lucide-react";
import { CVSection, ExperienceItem, EducationItem, SkillProgress, SimpleList } from "./TemplateComponents";

export default function CreativeTemplate({ data }) {
    if (!data) return null;
    const { personalInfo, experience, education, skills, languages, projects } = data;

    const mainColor = "#ec4899"; // Pink-500
    const secondaryColor = "#8b5cf6"; // Violet-500
    const gradient = `linear-gradient(135deg, ${mainColor} 0%, ${secondaryColor} 100%)`;

    const profileImageUrl = React.useMemo(() => {
        const img = personalInfo.profileImage;
        if (personalInfo.profileImagePreview) return personalInfo.profileImagePreview;
        if (!img) return null;
        if (typeof img === 'string') return img;
        if (img.secure_url) return img.secure_url;
        if (img instanceof File || img instanceof Blob) return URL.createObjectURL(img);
        return null;
    }, [personalInfo.profileImage, personalInfo.profileImagePreview]);

    return (
        <Box sx={{ minHeight: '297mm', bgcolor: '#fff', display: 'flex', fontFamily: "'Poppins', sans-serif" }}>
            {/* Sidebar */}
            <Box sx={{ width: '80mm', background: gradient, color: 'white', p: 4 }}>
                <Box sx={{ textAlign: "center", mb: 4 }}>
                    <Avatar
                        src={profileImageUrl}
                        sx={{ width: 140, height: 140, mx: "auto", mb: 3, border: "6px solid rgba(255,255,255,0.2)", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.2)" }}
                    >
                        {personalInfo.name?.charAt(0)}
                    </Avatar>
                    <Typography variant="h5" sx={{ fontWeight: 900, letterSpacing: 1 }}>{personalInfo.name}</Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9, fontWeight: 500 }}>{personalInfo.title}</Typography>
                </Box>

                <Divider sx={{ bgcolor: "rgba(255,255,255,0.2)", mb: 4 }} />

                <Box sx={{ mb: 4 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 900, mb: 2, textTransform: "uppercase", letterSpacing: 1.5 }}>Contact</Typography>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                            <Mail size={16} />
                            <Typography variant="caption" sx={{ fontWeight: 500 }}>{personalInfo.email}</Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                            <Phone size={16} />
                            <Typography variant="caption" sx={{ fontWeight: 500 }}>{personalInfo.phone}</Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                            <MapPin size={16} />
                            <Typography variant="caption" sx={{ fontWeight: 500 }}>{personalInfo.address}</Typography>
                        </Box>
                    </Box>
                </Box>

                <Box sx={{ mb: 4 }}>
                    <Typography variant="subtitle2" sx={{ fontWeight: 900, mb: 2, textTransform: "uppercase", letterSpacing: 1.5 }}>Skills</Typography>
                    {skills?.map((skill, index) => (
                        <SkillProgress key={index} name={skill} level={85} color="#fff" />
                    ))}
                </Box>

                <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 900, mb: 2, textTransform: "uppercase", letterSpacing: 1.5 }}>Languages</Typography>
                    <SimpleList data={languages} bullet={false} />
                </Box>
            </Box>

            {/* Main Content */}
            <Box sx={{ flex: 1, p: 5 }}>
                <CVSection title="About Me" color={mainColor}>
                    <Typography variant="body2" sx={{ color: "#4b5563", lineHeight: 1.8, fontSize: "1rem" }}>
                        {personalInfo.about}
                    </Typography>
                </CVSection>

                <CVSection title="Work Experience" color={mainColor}>
                    {experience?.map((exp, index) => (
                        <ExperienceItem
                            key={index}
                            role={exp.role}
                            company={exp.company}
                            duration={exp.duration}
                            description={exp.description}
                            color={mainColor}
                        />
                    ))}
                </CVSection>

                <CVSection title="Education" color={mainColor}>
                    {education?.map((edu, index) => (
                        <EducationItem
                            key={index}
                            degree={edu.degree}
                            institute={edu.institute}
                            year={edu.year}
                        />
                    ))}
                </CVSection>

                {projects && (
                    <CVSection title="Projects" color={mainColor}>
                        <SimpleList data={projects} />
                    </CVSection>
                )}
            </Box>
        </Box>
    );
}
