import React from 'react';
import { Box, Typography } from '@mui/material';

export default function ClassicTemplate({ data }) {
  const { personalInfo = {}, experience = [], education = [], skills = [] } = data || {};
  const accentBlue = "#0078D4";

  return (
    <Box sx={{ minHeight: '297mm', width: '210mm', bgcolor: 'white', mx: 'auto', p: 6, fontFamily: '"Arial", sans-serif', color: '#000' }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h3" fontWeight="900" sx={{ color: '#000', mb: 0.5, letterSpacing: '-0.5px' }}>
          {personalInfo.name || "Sebastian Hurst"}
        </Typography>
        <Typography variant="h6" fontWeight="bold" sx={{ color: accentBlue, mb: 1 }}>
          {personalInfo.title || "Business Data Analyst"}
        </Typography>
        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', color: '#333' }}>
          {personalInfo.phone && <Typography variant="body2" fontWeight="bold">📞 {personalInfo.phone}</Typography>}
          {personalInfo.email && <Typography variant="body2" fontWeight="bold">📧 {personalInfo.email}</Typography>}
          {personalInfo.linkedin && <Typography variant="body2" fontWeight="bold">🔗 {personalInfo.linkedin}</Typography>}
        </Box>
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
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          {skills.map((skill, idx) => (
            <Typography key={idx} variant="body2" fontWeight="bold" sx={{ borderBottom: '1px solid #ccc', pb: 0.5 }}>{skill}</Typography>
          ))}
        </Box>
      </Box>
    </Box>
  );
}