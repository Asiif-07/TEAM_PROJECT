import React from "react";
import { Box, Typography, Divider } from "@mui/material";
import { CVSection, ExperienceItem, EducationItem, SkillList } from "./TemplateComponents";

export default function MinimalistTemplate({ data }) {
    const personalInfo = data?.personalInfo || {};
    const experience = data?.experience || [];
    const education = data?.education || [];
    const skills = data?.skills || [];

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

    return (
        <Box sx={{ p: 8, bgcolor: "#fff", minHeight: "297mm", fontFamily: "'Inter', sans-serif", color: "#000" }}>
            <Box sx={{ mb: 8, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <Box>
                    <Typography variant="h3" sx={{ fontWeight: 300, letterSpacing: -1, mb: 1 }}>{personalInfo.name}</Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600, letterSpacing: 1, color: "#666", mb: 3 }}>{personalInfo.title?.toUpperCase()}</Typography>

                    <Box sx={{ display: "flex", gap: 3, color: "#888" }}>
                        <Typography variant="caption">{personalInfo.email}</Typography>
                        <Typography variant="caption">{personalInfo.phone}</Typography>
                        <Typography variant="caption">{personalInfo.address}</Typography>
                    </Box>
                </Box>
                {profileImageUrl && (
                    <Box
                        component="img"
                        src={profileImageUrl}
                        sx={{
                            width: 80,
                            height: 80,
                            borderRadius: "50%",
                            objectFit: "cover",
                            filter: "grayscale(100%)",
                            border: "1px solid #000"
                        }}
                    />
                )}
            </Box>

            <Box sx={{ mb: 6 }}>
                <Typography variant="body2" sx={{ lineHeight: 1.8, color: "#444" }}>{personalInfo.about}</Typography>
            </Box>

            <CVSection title="Experience" sx={{ border: "none", ".MuiDivider-root": { display: "none" } }}>
                {experience?.map((exp, idx) => (
                    <ExperienceItem key={idx} role={exp.role} company={exp.company} duration={exp.duration} description={exp.description} />
                ))}
            </CVSection>

            <CVSection title="Education" sx={{ border: "none", ".MuiDivider-root": { display: "none" } }}>
                {education?.map((edu, idx) => (
                    <EducationItem key={idx} degree={edu.degree} institute={edu.institute} year={edu.year} />
                ))}
            </CVSection>

            <CVSection title="Skills" sx={{ border: "none", ".MuiDivider-root": { display: "none" } }}>
                <SkillList skills={skills} color="#000" />
            </CVSection>
        </Box>
    );
}
