import React from "react";
import { Box, Typography, Divider, Grid, Link } from "@mui/material";
import { Mail, Phone, MapPin, Linkedin, Github } from "lucide-react";
import { CVSection, ExperienceItem, EducationItem, SkillList, SimpleList, DecorativeSeparator } from "./TemplateComponents";

const ContactLink = ({ icon: LucideIcon, text, link, accentColor, primaryColor }) => {
    if (!text) return null;
    return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {React.createElement(LucideIcon, { size: 14, color: accentColor })}
            {link ? (
                <Link href={link} target="_blank" sx={{ color: "inherit", textDecoration: "none", fontSize: "0.85rem", fontWeight: 500 }}>{text}</Link>
            ) : (
                <Typography sx={{ fontSize: "0.85rem", fontWeight: 500, color: primaryColor }}>{text}</Typography>
            )}
        </Box>
    );
};

export default function ExecutiveTemplate({ data }) {
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

    const primaryColor = "#111827"; // Gray-900
    const accentColor = "#94a3b8"; // Slate-400

    return (
        <Box sx={{ p: 7, bgcolor: "#fff", minHeight: "297mm", fontFamily: "'Inter', sans-serif", color: primaryColor }}>
            {/* EXECUTIVE HEADER */}
            <Box sx={{ mb: 6, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <Box sx={{ flex: 1 }}>
                    <Typography variant="h2" sx={{ fontWeight: 800, letterSpacing: "-1.5px", mb: 1 }}>
                        {personalInfo.name}
                    </Typography>
                    <Typography variant="h5" sx={{ color: accentColor, fontWeight: 500, letterSpacing: 2, mb: 4, textTransform: "uppercase" }}>
                        {personalInfo.title}
                    </Typography>
                </Box>
                {profileImageUrl && (
                    <Box
                        component="img"
                        src={profileImageUrl}
                        sx={{
                            width: 120,
                            height: 140,
                            borderRadius: "4px",
                            objectFit: "cover",
                            border: "1px solid #e5e7eb",
                            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)"
                        }}
                    />
                )}
            </Box>

                <Grid container spacing={3}>
                    <Grid item xs={4}><ContactLink icon={Mail} text={personalInfo.email} link={`mailto:${personalInfo.email}`} accentColor={accentColor} primaryColor={primaryColor} /></Grid>
                    <Grid item xs={4}><ContactLink icon={Phone} text={personalInfo.phone} accentColor={accentColor} primaryColor={primaryColor} /></Grid>
                    <Grid item xs={4}><ContactLink icon={MapPin} text={personalInfo.address} accentColor={accentColor} primaryColor={primaryColor} /></Grid>
                    <Grid item xs={4}><ContactLink icon={Linkedin} text={personalInfo.linkedin} link={personalInfo.linkedin} accentColor={accentColor} primaryColor={primaryColor} /></Grid>
                    <Grid item xs={4}><ContactLink icon={Github} text={personalInfo.github} link={personalInfo.github} accentColor={accentColor} primaryColor={primaryColor} /></Grid>
                </Grid>

            <DecorativeSeparator color={accentColor} />

            {/* SUMMARY */}
            <Box sx={{ my: 4 }}>
                <Typography variant="body1" sx={{ fontSize: "1.1rem", lineHeight: 1.8, color: "#374151", fontWeight: 400, fontStyle: "italic" }}>
                    {personalInfo.about}
                </Typography>
            </Box>

            <Grid container spacing={6}>
                <Grid item xs={8}>
                    <CVSection title="Core Experience" color={primaryColor}>
                        {experience?.map((exp, idx) => (
                            <ExperienceItem
                                key={idx}
                                role={exp.role}
                                company={exp.company}
                                duration={exp.duration}
                                description={exp.description}
                            />
                        ))}
                    </CVSection>
                </Grid>

                <Grid item xs={4}>
                    <CVSection title="Education" color={primaryColor}>
                        {education?.map((edu, idx) => (
                            <EducationItem
                                key={idx}
                                degree={edu.degree}
                                institute={edu.institute}
                                year={edu.year}
                            />
                        ))}
                    </CVSection>

                    <CVSection title="Expertise" color={primaryColor}>
                        <SkillList skills={skills} color={primaryColor} />
                    </CVSection>

                    <CVSection title="Languages" color={primaryColor}>
                        <SimpleList data={languages} />
                    </CVSection>
                </Grid>
            </Grid>

            {projects && (
                <>
                    <DecorativeSeparator color={accentColor} />
                    <CVSection title="Strategic Projects" color={primaryColor}>
                        <SimpleList data={projects} />
                    </CVSection>
                </>
            )}
        </Box>
    );
}
