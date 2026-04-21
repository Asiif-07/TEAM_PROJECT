import React from "react";
import { Box, Typography, Grid, Link, Divider } from "@mui/material";
import { Mail, Phone, MapPin, Linkedin, Github } from "lucide-react";

const accentRed = "#DC2626";

const ExperienceItem = ({ role, company, duration, description, color = "#475569" }) => {
    if (!role && !company) return null;
    return (
        <Box sx={{ mb: 3.5, position: "relative", pl: 3, borderLeft: `2px solid ${color}22` }}>
            <Box sx={{ position: "absolute", left: -5, top: 6, width: 8, height: 8, borderRadius: "50%", bgcolor: color, boxShadow: `0 0 0 3px ${color}22` }} />
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 0.3 }}>
                <Typography variant="body1" sx={{ fontWeight: 800, color: "#0f172a", fontSize: "1rem", lineHeight: 1.3, wordBreak: "break-word", overflowWrap: "break-word", maxWidth: "70%" }}>{role}</Typography>
                {duration && <Typography variant="caption" sx={{ fontWeight: 700, color: color, bgcolor: `${color}15`, px: 1.2, py: 0.4, borderRadius: "6px", ml: 1, flexShrink: 0, fontSize: "0.72rem" }}>{duration}</Typography>}
            </Box>
            <Typography variant="body2" sx={{ fontWeight: 700, color: color, mb: description ? 1 : 0, fontSize: "0.85rem", wordBreak: "break-word", overflowWrap: "break-word" }}>{company}</Typography>
            {description && <Typography variant="body2" sx={{ color: "#475569", lineHeight: 1.75, whiteSpace: "pre-line", fontSize: "0.88rem", wordBreak: "break-word", overflowWrap: "break-word" }}>{description}</Typography>}
        </Box>
    );
};

const EducationItem = ({ degree, institute, year, color = "#64748b" }) => {
    if (!degree && !institute) return null;
    return (
        <Box sx={{ mb: 3, display: "flex", gap: 2, alignItems: "flex-start" }}>
            <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: color, mt: "6px", flexShrink: 0 }} />
            <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <Typography variant="body1" sx={{ fontWeight: 800, color: "#0f172a", lineHeight: 1.3, wordBreak: "break-word", overflowWrap: "break-word", maxWidth: "70%" }}>{degree}</Typography>
                    {year && <Typography variant="caption" sx={{ fontWeight: 700, color: "#94a3b8", ml: 1, flexShrink: 0 }}>{year}</Typography>}
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 600, color: color, mt: 0.2, wordBreak: "break-word", overflowWrap: "break-word" }}>{institute}</Typography>
            </Box>
        </Box>
    );
};

const SkillList = ({ skills, color = "#6366f1" }) => {
    if (!skills || skills.length === 0) return null;
    return (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {skills.map((skill, index) => (
                <Box key={index} sx={{ px: 1.8, py: 0.6, borderRadius: "8px", bgcolor: `${color}12`, border: `1px solid ${color}30`, color: color, fontSize: "0.78rem", fontWeight: 700, letterSpacing: "0.3px" }}>
                    {skill}
                </Box>
            ))}
        </Box>
    );
};

const SimpleList = ({ data, bullet = true, color = "#475569" }) => {
    if (!data) return null;
    const items = typeof data === "string" ? data.split("\n").filter(i => i.trim()) : data;
    if (!items.length) return null;
    return (
        <Box component="ul" sx={{ p: 0, m: 0, listStyle: "none" }}>
            {items.map((item, index) => (
                <Box component="li" key={index} sx={{ mb: 1.2, display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                    {bullet && <Box sx={{ width: 5, height: 5, bgcolor: color, borderRadius: "50%", mt: "7px", flexShrink: 0, opacity: 0.6 }} />}
                    <Typography variant="body2" sx={{ color: color, fontSize: "0.88rem", lineHeight: 1.65, wordBreak: "break-word", overflowWrap: "break-word", flex: 1 }}>{item}</Typography>
                </Box>
            ))}
        </Box>
    );
};

const ContactChunk = ({ icon: LucideIcon, text, link }) => {
  if (!text) return null;
  const content = (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      {React.createElement(LucideIcon, { size: 12, color: accentRed, strokeWidth: 2.5 })}
      <Typography sx={{ fontSize: "0.78rem", color: "#374151", fontWeight: 500, wordBreak: "break-word", overflowWrap: "break-word" }}>{text}</Typography>
    </Box>
  );
  return link ? <Link href={link} target="_blank" color="inherit" sx={{ textDecoration: "none" }}>{content}</Link> : content;
};

// Classic section header with a bold red left-border rule
const ClassicSection = ({ title, children }) => {
  if (!children || (Array.isArray(children) && children.length === 0)) return null;
  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1.5 }}>
        <Box sx={{ width: 4, height: 20, bgcolor: accentRed, borderRadius: 1 }} />
        <Typography sx={{ fontWeight: 900, textTransform: "uppercase", letterSpacing: "2px", fontSize: "0.82rem", color: "#111827" }}>
          {title}
        </Typography>
        <Box sx={{ flex: 1, height: "1px", bgcolor: "#E5E7EB" }} />
      </Box>
      {children}
    </Box>
  );
};

export default function ClassicTemplate({ data }) {
  const personalInfo = data?.personalInfo || {};
  const experience = data?.experience || [];
  const education = data?.education || [];
  const skills = data?.skills || [];
  const languages = data?.languages || "";
  const projects = data?.projects || "";
  const certifications = data?.certifications || "";

  if (!data) return null;

  return (
    <Box sx={{ p: 6, bgcolor: "#fff", minHeight: "297mm", fontFamily: "'Times New Roman', serif", color: "#111827" }}>
      {/* HEADER */}
      <Box sx={{ textAlign: "center", mb: 1 }}>
        <Typography variant="h3" sx={{ fontWeight: 700, letterSpacing: "1px", mb: 0.5, wordBreak: "break-word", overflowWrap: "break-word" }}>
          {personalInfo.name?.toUpperCase()}
        </Typography>
        {/* Red accent bar under name */}
        <Box sx={{ width: 60, height: 3, bgcolor: accentRed, mx: "auto", borderRadius: 2, mb: 1 }} />
        <Typography variant="h6" sx={{ color: "#374151", fontWeight: 500, letterSpacing: "2px", textTransform: "uppercase", fontSize: "0.85rem", wordBreak: "break-word", overflowWrap: "break-word" }}>
          {personalInfo.title}
        </Typography>
      </Box>

      {/* Contact Row */}
      <Box sx={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 2.5, my: 2 }}>
        <ContactChunk icon={Mail} text={personalInfo.email} link={`mailto:${personalInfo.email}`} />
        <ContactChunk icon={Phone} text={personalInfo.phone} />
        <ContactChunk icon={MapPin} text={personalInfo.address} />
        {personalInfo.linkedin && <ContactChunk icon={Linkedin} text={personalInfo.linkedin} link={personalInfo.linkedin} />}
        {personalInfo.github && <ContactChunk icon={Github} text={personalInfo.github} link={personalInfo.github} />}
      </Box>

      <Divider sx={{ borderColor: accentRed, opacity: 0.6, mb: 4 }} />

      {/* SUMMARY */}
      {personalInfo.about && (
        <ClassicSection title="Professional Profile">
          <Typography variant="body2" sx={{ color: "#374151", lineHeight: 1.7, textAlign: "justify", fontFamily: "inherit", wordBreak: "break-word", overflowWrap: "break-word" }}>
            {personalInfo.about}
          </Typography>
        </ClassicSection>
      )}

      {/* EXPERIENCE */}
      <ClassicSection title="Work Experience">
        {experience?.map((exp, index) => (
          <ExperienceItem key={index} role={exp.role} company={exp.company} duration={exp.duration} description={exp.description} color={accentRed} />
        ))}
      </ClassicSection>

      {/* EDUCATION */}
      <ClassicSection title="Education">
        {education?.map((edu, index) => (
          <EducationItem key={index} degree={edu.degree} institute={edu.institute} year={edu.year} color={accentRed} />
        ))}
      </ClassicSection>

      <Grid container spacing={4}>
        <Grid item xs={6}>
          <ClassicSection title="Skills">
            <SkillList skills={skills} color={accentRed} />
          </ClassicSection>
        </Grid>
        <Grid item xs={6}>
          <ClassicSection title="Projects">
            <SimpleList data={projects} color="#374151" />
          </ClassicSection>
        </Grid>
      </Grid>

      <Box sx={{ display: "flex", gap: 6 }}>
        <Box sx={{ flex: 1 }}>
          <ClassicSection title="Languages">
            <SimpleList data={languages} color="#374151" />
          </ClassicSection>
        </Box>
        <Box sx={{ flex: 1 }}>
          <ClassicSection title="Certifications">
            <SimpleList data={certifications} color="#374151" />
          </ClassicSection>
        </Box>
      </Box>
    </Box>
  );
}