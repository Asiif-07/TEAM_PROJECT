import React from "react";
import { Box, Typography, Divider, Grid, Link } from "@mui/material";
import { Mail, Phone, MapPin, Linkedin, Github } from "lucide-react";
import { CVSection, ExperienceItem, EducationItem, SkillList, SimpleList } from "./TemplateComponents";

const ContactChunk = ({ icon: LucideIcon, text, link, subTextColor }) => {
  if (!text) return null;
  const content = (
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
      {React.createElement(LucideIcon, { size: 12, color: subTextColor })}
      <Typography sx={{ fontSize: "0.8rem", color: subTextColor }}>{text}</Typography>
    </Box>
  );
  return link ? <Link href={link} target="_blank" color="inherit" sx={{ textDecoration: "none" }}>{content}</Link> : content;
};

export default function ClassicTemplate({ data }) {
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

  const textColor = "#111827";
  const subTextColor = "#374151";

  return (
    <Box
      sx={{
        p: 6,
        bgcolor: "#fff",
        minHeight: "297mm",
        fontFamily: "'Times New Roman', serif",
        color: textColor
      }}
    >
      {/* CLEAN CORPORATE HEADER */}
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 3, mb: 4 }}>
        {profileImageUrl && (
          <Box
            component="img"
            src={profileImageUrl}
            sx={{
              width: 100,
              height: 100,
              borderRadius: "50%",
              objectFit: "cover",
              border: "2px solid #e5e7eb"
            }}
          />
        )}
        <Box sx={{ textAlign: profileImageUrl ? "left" : "center" }}>
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 0.5, letterSpacing: "1px" }}>
            {personalInfo.name?.toUpperCase()}
          </Typography>
          <Typography variant="h6" sx={{ color: subTextColor, fontWeight: 500, letterSpacing: "2px", mb: 2, textTransform: "uppercase" }}>
            {personalInfo.title}
          </Typography>
        </Box>
      </Box>

        <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 3, mb: 1 }}>
          <ContactChunk icon={Mail} text={personalInfo.email} link={`mailto:${personalInfo.email}`} subTextColor={subTextColor} />
          <ContactChunk icon={Phone} text={personalInfo.phone} subTextColor={subTextColor} />
          <ContactChunk icon={MapPin} text={personalInfo.address} subTextColor={subTextColor} />
        </Box>

        {(personalInfo.linkedin || personalInfo.github) && (
          <Box sx={{ display: "flex", justifyContent: "center", gap: 3 }}>
            {personalInfo.linkedin && <ContactChunk icon={Linkedin} text={personalInfo.linkedin} link={personalInfo.linkedin} subTextColor={subTextColor} />}
            {personalInfo.github && <ContactChunk icon={Github} text={personalInfo.github} link={personalInfo.github} subTextColor={subTextColor} />}
          </Box>
        )}

      {/* SUMMARY */}
      <CVSection title="Professional Profile">
        <Typography variant="body2" sx={{ color: subTextColor, lineHeight: 1.6, textAlign: "justify" }}>
          {personalInfo.about}
        </Typography>
      </CVSection>

      {/* EXPERIENCE */}
      <CVSection title="Work Experience">
        {experience?.map((exp, index) => (
          <ExperienceItem
            key={index}
            role={exp.role}
            company={exp.company}
            duration={exp.duration}
            description={exp.description}
            color={textColor}
          />
        ))}
      </CVSection>

      {/* EDUCATION */}
      <CVSection title="Education">
        {education?.map((edu, index) => (
          <EducationItem
            key={index}
            degree={edu.degree}
            institute={edu.institute}
            year={edu.year}
          />
        ))}
      </CVSection>

      <Grid container spacing={4}>
        <Grid item xs={6}>
          <CVSection title="Skills">
            <SkillList skills={skills} color={textColor} />
          </CVSection>
        </Grid>
        <Grid item xs={6}>
          <CVSection title="Projects">
            <SimpleList data={projects} />
          </CVSection>
        </Grid>
      </Grid>

      <Box sx={{ display: "flex", gap: 6 }}>
        <CVSection title="Languages" sx={{ flex: 1 }}>
          <SimpleList data={languages} />
        </CVSection>
        <CVSection title="Certifications" sx={{ flex: 1 }}>
          <SimpleList data={certifications} />
        </CVSection>
      </Box>
    </Box>
  );
}