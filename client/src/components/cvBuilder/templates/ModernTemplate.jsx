import React from "react";
import { Box, Typography, Grid, Link } from "@mui/material";
import { Mail, Phone, Linkedin, Github, MapPin } from "lucide-react";
import AdditionalSectionsBlock from "./AdditionalSectionsBlock";

// Inlined from TemplateComponents
const CVSection = ({ title, icon: Icon, children, color = "#1e293b", sx = {} }) => {
    if (!children || (Array.isArray(children) && children.length === 0)) return null;
    return (
        <Box sx={{ mb: 4, ...sx }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 0.5 }}>
                {Icon && <Icon size={18} color={color} strokeWidth={2.5} />}
                <Typography variant="subtitle1" sx={{ fontWeight: 900, textTransform: "uppercase", color: color, letterSpacing: "2px", fontSize: "0.82rem" }}>
                    {title}
                </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0, mb: 2 }}>
                <Box sx={{ width: "32px", height: "3px", bgcolor: color, borderRadius: "2px" }} />
                <Box sx={{ flex: 1, height: "1px", bgcolor: color, opacity: 0.12 }} />
            </Box>
            {children}
        </Box>
    );
};

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

const ContactInfo = ({ icon: LucideIcon, text, link, accentColor }) => {
  if (!text) return null;
  const content = (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.4 }}>
      <Box sx={{
        width: 28, height: 28, borderRadius: "8px",
        bgcolor: `${accentColor}18`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
      }}>
        {React.createElement(LucideIcon, { size: 13, color: accentColor, strokeWidth: 2.5 })}
      </Box>
      <Typography variant="caption" sx={{ color: "#475569", fontWeight: 600, fontSize: "0.75rem", lineHeight: 1.3, wordBreak: "break-word", overflowWrap: "break-word" }}>
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

  const accentColor = "#4f46e5";

  return (
    <Box sx={{ p: 0, bgcolor: "#fff", minHeight: "297mm", fontFamily: "'Inter', sans-serif", color: "#1e293b" }}>
      <Grid container sx={{ minHeight: "297mm" }}>
        {/* SIDEBAR */}
        <Grid item xs={4} sx={{
          background: "linear-gradient(180deg, #F0F0FF 0%, #F8FAFC 100%)",
          p: 4, borderRight: "1px solid #E2E8F0", display: "flex", flexDirection: "column"
        }}>
          {/* Profile Photo */}
          <Box sx={{ mb: 4, textAlign: "center" }}>
            <Box sx={{
              width: 96, height: 96,
              background: `linear-gradient(135deg, ${accentColor}, #818cf8)`,
              borderRadius: "24px",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto", mb: 2,
              boxShadow: `0 12px 24px -4px ${accentColor}40`,
              overflow: "hidden"
            }}>
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

        {/* MAIN CONTENT */}
        <Grid item xs={8} sx={{ p: 5 }}>
          {/* Header */}
          <Box sx={{ mb: 5 }}>
            <Typography variant="h3" sx={{ fontWeight: 900, color: "#0f172a", letterSpacing: "-1.5px", mb: 0.3, lineHeight: 1.1, wordBreak: "break-word", overflowWrap: "break-word" }}>
              {personalInfo.name}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
              <Typography variant="h6" sx={{ color: accentColor, fontWeight: 800, textTransform: "uppercase", letterSpacing: "2px", fontSize: "0.8rem", wordBreak: "break-word", overflowWrap: "break-word" }}>
                {personalInfo.title}
              </Typography>
            </Box>
            {/* Gradient accent line */}
            <Box sx={{ height: 3, width: "100%", background: `linear-gradient(90deg, ${accentColor}, #818cf8, transparent)`, borderRadius: 2, mb: 3 }} />

            {personalInfo.about && (
              <Typography variant="body2" sx={{ color: "#475569", lineHeight: 1.8, fontSize: "0.92rem", wordBreak: "break-word", overflowWrap: "break-word" }}>
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
                color={accentColor}
              />
            ))}
          </CVSection>

          <CVSection title="Projects" color={accentColor}>
            <SimpleList data={projects} color="#475569" />
          </CVSection>
          <AdditionalSectionsBlock sections={data?.additionalSections} accentColor={accentColor} />
        </Grid>
      </Grid>
    </Box>
  );
}