import React from "react";
import { Box, Typography, Grid, Link } from "@mui/material";
import { Mail, Phone, Linkedin, Github, MapPin } from "lucide-react";
import { CVSection, ExperienceItem, EducationItem, SkillList, SimpleList } from "./TemplateComponents";

const ContactInfo = ({ icon: LucideIcon, text, link, accentColor }) => {
  if (!text) return null;
  const content = (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.2 }}>
      {React.createElement(LucideIcon, { size: 14, color: accentColor })}
      <Typography variant="caption" sx={{ color: "#475569", fontWeight: 500, fontSize: "0.75rem" }}>
        {text}
      </Typography>
    </Box>
  );
  return link ? <Link href={link} target="_blank" sx={{ textDecoration: "none" }}>{content}</Link> : content;
};

export default function ModernTemplate({ data }) {
  const personalInfo = data?.personalInfo || {};
  const experience = data?.experience || [];
  const education = data?.education || [];
  const skills = data?.skills || [];
  const languages = data?.languages || "";
  const projects = data?.projects || "";
  const certifications = data?.certifications || "";

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

  const accentColor = "#4f46e5"; // Indigo-600

  return (
    <Box
      sx={{
        p: 0,
        bgcolor: "#fff",
        minHeight: "297mm", // A4 height
        fontFamily: "'Inter', sans-serif",
        color: "#1e293b"
      }}
    >
      <Grid container sx={{ minHeight: "297mm" }}>
        {/* SIDEBAR (Left) */}
        <Grid item xs={4} sx={{ bgcolor: "#F8FAFC", p: 4, borderRight: "1px solid #E2E8F0" }}>
          {/* Portrait Placeholder / Initial */}
          <Box sx={{ mb: 4, textAlign: "center" }}>
            <Box
              sx={{
                width: 80,
                height: 80,
                bgcolor: accentColor,
                borderRadius: "20px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto",
                mb: 2,
                boxShadow: "0 10px 15px -3px rgba(79, 70, 229, 0.2)",
                overflow: "hidden"
              }}
            >
              {profileImageUrl ? (
                <Box component="img" src={profileImageUrl} sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <Typography variant="h4" sx={{ color: "#fff", fontWeight: 900 }}>
                  {personalInfo.name?.charAt(0) || "U"}
                </Typography>
              )}
            </Box>
          </Box>

          <CVSection title="Contact" color={accentColor}>
            <ContactInfo icon={Mail} text={personalInfo.email} link={`mailto:${personalInfo.email}`} accentColor={accentColor} />
            <ContactInfo icon={Phone} text={personalInfo.phone} accentColor={accentColor} />
            <ContactInfo icon={MapPin} text={personalInfo.address} accentColor={accentColor} />
            <ContactInfo icon={Linkedin} text={personalInfo.linkedin} link={personalInfo.linkedin} accentColor={accentColor} />
            <ContactInfo icon={Github} text={personalInfo.github} link={personalInfo.github} accentColor={accentColor} />
          </CVSection>

          <CVSection title="Skills" color={accentColor}>
            <SkillList skills={skills} color={accentColor} />
          </CVSection>

          <CVSection title="Languages" color={accentColor}>
            <SimpleList data={languages} bullet={false} />
          </CVSection>

          <CVSection title="Certifications" color={accentColor}>
            <SimpleList data={certifications} />
          </CVSection>
        </Grid>

        {/* MAIN CONTENT (Right) */}
        <Grid item xs={8} sx={{ p: 5 }}>
          <Box sx={{ mb: 5 }}>
            <Typography variant="h3" sx={{ fontWeight: 900, color: "#0f172a", letterSpacing: "-1px", mb: 0.5 }}>
              {personalInfo.name}
            </Typography>
            <Typography variant="h6" sx={{ color: accentColor, fontWeight: 700, textTransform: "uppercase", letterSpacing: "2px", mb: 3 }}>
              {personalInfo.title}
            </Typography>

            {personalInfo.about && (
              <Typography variant="body2" sx={{ color: "#475569", lineHeight: 1.8, fontSize: "0.95rem" }}>
                {personalInfo.about}
              </Typography>
            )}
          </Box>

          <CVSection title="Professional Experience" color={accentColor}>
            {experience?.map((exp, index) => (
              <ExperienceItem
                key={index}
                role={exp.role}
                company={exp.company}
                duration={exp.duration}
                description={exp.description}
                color={accentColor}
              />
            ))}
          </CVSection>

          <CVSection title="Education" color={accentColor}>
            {education?.map((edu, index) => (
              <EducationItem
                key={index}
                degree={edu.degree}
                institute={edu.institute}
                year={edu.year}
              />
            ))}
          </CVSection>

          <CVSection title="Projects" color={accentColor}>
            <SimpleList data={projects} />
          </CVSection>
        </Grid>
      </Grid>
    </Box>
  );
}