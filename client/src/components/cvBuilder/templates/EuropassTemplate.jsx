import React from "react";
import { Box, Typography, Divider, Grid } from "@mui/material";
import {
  Mail,
  Smartphone,
  Home,
  Globe,
  Briefcase,
  GraduationCap,
  Award,
  Linkedin,
  Github,
  Calendar,
  User
} from "lucide-react";
import europassLogo from "../../../assets/images/eurologo.png";
import AdditionalSectionsBlock from "./AdditionalSectionsBlock";

// Official Europass Section Component
const EuropassSection = (props) => {
  const { title, icon: SectionIcon, children } = props;
  if (!children || (Array.isArray(children) && children.length === 0)) return null;
  return (
    <Grid container sx={{ mb: 4 }}>
      <Grid item xs={3.5} sx={{ textAlign: "right", pr: 4 }}>
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 1 }}>
          {SectionIcon && <SectionIcon size={22} color="#0055a4" strokeWidth={1.5} />}
          <Typography variant="body2" sx={{ fontWeight: 800, color: "#0055a4", textTransform: "uppercase", fontSize: "0.75rem", letterSpacing: 0.5, lineHeight: 1.2, wordBreak: "break-word", overflowWrap: "break-word" }}>
            {title}
          </Typography>
        </Box>
      </Grid>
      <Grid item xs={8.5} sx={{ borderLeft: "2px solid #0055a4", pl: 4, pb: 2, position: "relative" }}>
        {/* Section Bullet Node */}
        <Box sx={{
          position: "absolute",
          left: -6,
          top: 4,
          width: 10,
          height: 10,
          borderRadius: "50%",
          bgcolor: "#0055a4",
          border: "2px solid #fff"
        }} />
        {children}
      </Grid>
    </Grid>
  );
};

const ContactItem = (props) => {
  const { icon: ContactIcon, text, link } = props;
  if (!text) return null;
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 1.5 }}>
      <Box sx={{ color: "#0055a4", display: "flex", alignItems: "center", minWidth: 20 }}>
        <ContactIcon size={18} strokeWidth={2} />
      </Box>
      <Typography
        component={link ? "a" : "p"}
        href={link}
        sx={{
          fontSize: "0.9rem",
          color: "#000",
          textDecoration: "none",
          fontWeight: 500,
          m: 0,
          p: 0,
          display: "block",
          wordBreak: "break-word",
          overflowWrap: "break-word"
        }}
      >
        {text}
      </Typography>
    </Box>
  );
};

export default function EuropassTemplate({ data }) {
  const personalInfo = data?.personalInfo || {};
  const experience = data?.experience || [];
  const education = data?.education || [];
  const skills = data?.skills || [];
  const languages = data?.languages || "";
  const projects = data?.projects || "";
  const certifications = data?.certifications || "";

  const accentColor = "#0055a4";

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
    <Box sx={{ bgcolor: "#fff", minHeight: "297mm", width: "100%", fontFamily: "'Inter', 'Arial', sans-serif", color: "#000" }}>
      {/* HEADER SECTION (Official Europass Style) */}
      <Box sx={{ bgcolor: "#F8FAFC", p: 7, borderBottom: "4px solid #0055a4", position: "relative" }}>
        <Grid container spacing={5} alignItems="flex-start">
          <Grid item xs={3.5}>
            <Box sx={{
              width: 150,
              height: 180,
              bgcolor: "#fff",
              border: `1.5px solid #CBD5E1`,
              borderRadius: "4px",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)"
            }}>
              {profileImageUrl ? (
                <Box component="img" src={profileImageUrl} sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <User size={60} color="#CBD5E1" />
              )}
            </Box>
          </Grid>
          <Grid item xs={8.5}>
            {/* Logo positioned absolutely in the header corner */}
            <Box sx={{
              position: "absolute",
              top: 25,
              right: 25,
              display: "flex",
              alignItems: "center"
            }}>
              <Box component="img" src={europassLogo} alt="Europass Logo" sx={{ height: 65, objectFit: "contain" }} />
            </Box>
            <Box sx={{ mb: 4, mt: 2 }}>
              <Typography variant="h3" sx={{ fontWeight: 900, color: "#111827", mb: 1, letterSpacing: -1.5, lineHeight: 1, wordBreak: "break-word", overflowWrap: "break-word" }}>
                {personalInfo.name || "YOUR NAME"}
              </Typography>
              <Typography variant="h6" sx={{ color: accentColor, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", wordBreak: "break-word", overflowWrap: "break-word" }}>
                {personalInfo.title || "PROFESSIONAL TITLE"}
              </Typography>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <ContactItem icon={Mail} text={personalInfo.email} link={`mailto:${personalInfo.email}`} />
                <ContactItem icon={Smartphone} text={personalInfo.phone} />
              </Grid>
              <Grid item xs={12} sm={6}>
                <ContactItem icon={Home} text={personalInfo.address} />
                {(personalInfo.linkedin || personalInfo.github) && (
                  <Box sx={{ display: "flex", gap: 3, pt: 1, borderTop: "1px solid #E2E8F0" }}>
                    {personalInfo.linkedin && (
                      <Box component="a" href={personalInfo.linkedin} sx={{ color: accentColor, display: "flex", alignItems: "center", gap: 1, textDecoration: "none" }}>
                        <Linkedin size={18} />
                        <Typography variant="caption" sx={{ fontWeight: 700 }}>LinkedIn</Typography>
                      </Box>
                    )}
                    {personalInfo.github && (
                      <Box component="a" href={personalInfo.github} sx={{ color: accentColor, display: "flex", alignItems: "center", gap: 1, textDecoration: "none" }}>
                        <Github size={18} />
                        <Typography variant="caption" sx={{ fontWeight: 700 }}>GitHub</Typography>
                      </Box>
                    )}
                  </Box>
                )}
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>

      {/* CONTENT AREA */}
      <Box sx={{ p: 6, pt: 8 }}>

        <EuropassSection title="Work Experience" icon={Briefcase}>
          {experience?.map((exp, idx) => (
            <Box key={idx} sx={{ mb: 4, position: "relative" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                <Calendar size={14} color={accentColor} />
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: accentColor }}>{exp.duration}</Typography>
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 900, color: "#111827", mb: 0.5, wordBreak: "break-word", overflowWrap: "break-word" }}>{exp.role}</Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#4B5563", mb: 1.5, fontStyle: "italic", wordBreak: "break-word", overflowWrap: "break-word" }}>{exp.company}</Typography>
              <Typography variant="body2" sx={{ whiteSpace: "pre-line", color: "#374151", lineHeight: 1.6, wordBreak: "break-word", overflowWrap: "break-word" }}>{exp.description}</Typography>
              {idx !== experience.length - 1 && <Divider sx={{ mt: 3, opacity: 0.3 }} />}
            </Box>
          ))}
          {experience.length === 0 && <Typography variant="body2" color="text.secondary">No experience listed.</Typography>}
        </EuropassSection>

        <EuropassSection title="Education and training" icon={GraduationCap}>
          {education?.map((edu, idx) => (
            <Box key={idx} sx={{ mb: 3 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: accentColor, mb: 0.5 }}>{edu.year}</Typography>
              <Typography variant="h6" sx={{ fontWeight: 800, color: "#111827", mb: 0.5, wordBreak: "break-word", overflowWrap: "break-word" }}>{edu.degree}</Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#4B5563", wordBreak: "break-word", overflowWrap: "break-word" }}>{edu.institute}</Typography>
              {idx !== education.length - 1 && <Divider sx={{ mt: 2, borderStyle: "dashed", opacity: 0.3 }} />}
            </Box>
          ))}
        </EuropassSection>

        <EuropassSection title="Digital Skills" icon={Globe}>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5 }}>
            {skills?.map((s, i) => (
              <Box key={i} sx={{
                px: 2,
                py: 1,
                bgcolor: "#F1F5F9",
                color: "#1E293B",
                borderRadius: "4px",
                fontSize: "0.85rem",
                fontWeight: 700,
                border: "1px solid #CBD5E1"
              }}>
                {s}
              </Box>
            ))}
          </Box>
        </EuropassSection>

        {languages && (
          <EuropassSection title="Language Skills" icon={User}>
            <Typography variant="body1" sx={{ fontWeight: 700, color: "#1F2937", borderLeft: "4px solid #E2E8F0", pl: 2, wordBreak: "break-word", overflowWrap: "break-word" }}>{languages}</Typography>
          </EuropassSection>
        )}

        {projects && (
          <EuropassSection title="Honours and awards" icon={Award}>
            <Typography variant="body2" sx={{ whiteSpace: "pre-line", color: "#374151", lineHeight: 1.8, wordBreak: "break-word", overflowWrap: "break-word" }}>
              {projects}
            </Typography>
          </EuropassSection>
        )}
        {certifications && (
          <EuropassSection title="Certifications" icon={Award}>
            <Typography variant="body2" sx={{ whiteSpace: "pre-line", color: "#374151", lineHeight: 1.8, wordBreak: "break-word", overflowWrap: "break-word" }}>
              {certifications}
            </Typography>
          </EuropassSection>
        )}
        <AdditionalSectionsBlock sections={data?.additionalSections} accentColor={accentColor} />

      </Box>

      {/* FOOTER */}
      <Box sx={{ p: 6, textAlign: "center", bgcolor: "#F8FAFC", borderTop: "1px solid #E2E8F0", mt: "auto" }}>
        <Typography variant="caption" sx={{ color: "#64748B", fontWeight: 600 }}>
          Europass CV created with AI CV Builder © 2026 | www.europass.eu
        </Typography>
      </Box>
    </Box>
  );
}