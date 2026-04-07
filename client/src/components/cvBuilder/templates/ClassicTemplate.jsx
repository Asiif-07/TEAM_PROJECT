import React from 'react';
import { Box, Typography } from '@mui/material';

export default function ClassicTemplate({ data }) {
  const { personalInfo = {}, experience = [], education = [], skills = [] } = data || {};
  const accentBlue = "#0078D4";

  const profileImageUrl = React.useMemo(() => {
    const img = personalInfo.profileImage;
    if (!img) return null;
    if (typeof img === 'string') return img;
    if (img.secure_url) return img.secure_url;
    if (img instanceof File || img instanceof Blob) return URL.createObjectURL(img);
    return null;
  }, [personalInfo.profileImage]);

  return (
    <Box sx={{ minHeight: '297mm', width: '210mm', bgcolor: 'white', mx: 'auto', p: 6, fontFamily: '"Arial", sans-serif', color: '#000' }}>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="h3" fontWeight="900" sx={{ color: '#000', mb: 0.5, letterSpacing: '-0.5px' }}>
            {personalInfo.name || "Sebastian Hurst"}
          </Typography>
          <Typography variant="h6" fontWeight="bold" sx={{ color: accentBlue, mb: 1 }}>
            {personalInfo.title || "Business Data Analyst"}
          </Typography>
        </Box>
        {profileImageUrl && (
          <Box component="img" src={profileImageUrl} sx={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: `3px solid ${accentBlue}` }} />
        )}
      </Box>

      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', color: '#333', mb: 3 }}>
        {personalInfo.phone && <Typography variant="body2" fontWeight="bold">📞 {personalInfo.phone}</Typography>}
        {personalInfo.email && <Typography variant="body2" fontWeight="bold">📧 {personalInfo.email}</Typography>}
        {personalInfo.linkedin && <Typography variant="body2" fontWeight="bold">🔗 {personalInfo.linkedin}</Typography>}
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" fontWeight="900" sx={{ textTransform: 'uppercase', borderBottom: '3px solid #000', pb: 0.5, mb: 1.5 }}>Summary</Typography>
        <Typography variant="body2" sx={{ lineHeight: 1.6, textAlign: 'justify', whiteSpace: 'pre-wrap' }}>
          {personalInfo.about || "A motivated professional with experience in optimizing processes and data analysis."}
        </Typography>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" fontWeight="900" sx={{ textTransform: 'uppercase', borderBottom: '3px solid #000', pb: 0.5, mb: 1.5 }}>Experience</Typography>
        {experience.map((exp, idx) => (
          <Box key={idx} sx={{ mb: 2.5 }}>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#000' }}>{exp.role}</Typography>
            <Typography variant="subtitle2" fontWeight="bold" sx={{ color: accentBlue }}>{exp.company}</Typography>
            <Typography variant="caption" sx={{ color: '#555', display: 'block', mb: 1 }}>🗓 {exp.duration}</Typography>
            <Typography variant="body2" sx={{ lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{exp.description}</Typography>
          </Box>
        ))}
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" fontWeight="900" sx={{ textTransform: 'uppercase', borderBottom: '3px solid #000', pb: 0.5, mb: 1.5 }}>Education</Typography>
        {education.map((edu, idx) => (
          <Box key={idx} sx={{ mb: 2 }}>
            <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#000' }}>{edu.degree}</Typography>
            <Typography variant="subtitle2" fontWeight="bold" sx={{ color: accentBlue }}>{edu.institute}</Typography>
            <Typography variant="caption" sx={{ color: '#555' }}>🗓 {edu.year}</Typography>
          </Box>
        ))}
      </Box>

      <Box>
        <Typography variant="h6" fontWeight="900" sx={{ textTransform: 'uppercase', borderBottom: '3px solid #000', pb: 0.5, mb: 1.5 }}>Skills</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {skills.map((skill, idx) => (
            <Typography key={idx} variant="body2" fontWeight="bold">• {skill}</Typography>
          ))}
        </Box>
      </Box>
    </Box >
  );
}