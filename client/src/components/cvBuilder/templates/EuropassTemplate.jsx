import React from 'react';
import { Box, Typography } from '@mui/material';

export default function EuropassTemplate({ data }) {
  const { personalInfo = {}, experience = [], education = [], skills = [] } = data || {};
  const euroBlue = "#0e4194";

  return (
    <Box sx={{ minHeight: '297mm', width: '210mm', bgcolor: 'white', mx: 'auto', p: 6, fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}>
      
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 4 }}>
         <Box sx={{ bgcolor: euroBlue, color: 'white', px: 1.5, py: 0.5, borderRadius: 0.5, fontWeight: 'bold', letterSpacing: 1 }}>
           europass
         </Box>
      </Box>

      <Typography variant="h3" sx={{ color: euroBlue, mb: 1, fontWeight: 'normal' }}>
        {personalInfo.name || "Your Name"}
      </Typography>
      <Box sx={{ width: '100%', height: '2px', bgcolor: euroBlue, mb: 4 }} />

      <Box sx={{ display: 'grid', gridTemplateColumns: '180px 1fr', gap: '0 24px' }}>
        
        <Typography sx={{ textAlign: 'right', color: euroBlue, fontWeight: 'bold', fontSize: '0.85rem', pt: 0.5 }}>PERSONAL INFORMATION</Typography>
        <Box sx={{ borderLeft: `1px solid ${euroBlue}`, pl: 3, pb: 4 }}>
          {personalInfo.email && <Typography variant="body2" sx={{ mb: 0.5 }}><strong>Email address:</strong> {personalInfo.email}</Typography>}
          {personalInfo.phone && <Typography variant="body2" sx={{ mb: 0.5 }}><strong>Phone number:</strong> {personalInfo.phone}</Typography>}
          {personalInfo.linkedin && <Typography variant="body2" sx={{ mb: 0.5 }}><strong>LinkedIn:</strong> {personalInfo.linkedin}</Typography>}
          
          <Box sx={{ mt: 3, p: 2, bgcolor: '#f9fafb', borderLeft: `3px solid ${euroBlue}` }}>
             <Typography variant="body2" sx={{ fontStyle: 'italic', color: '#4b5563', whiteSpace: 'pre-wrap' }}>{personalInfo.about}</Typography>
          </Box>
        </Box>

        <Typography sx={{ textAlign: 'right', color: euroBlue, fontWeight: 'bold', fontSize: '0.85rem', pt: 0.5 }}>JOB APPLIED FOR</Typography>
        <Box sx={{ borderLeft: `1px solid ${euroBlue}`, pl: 3, pb: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#111827' }}>{personalInfo.title}</Typography>
        </Box>

        <Typography sx={{ textAlign: 'right', color: euroBlue, fontWeight: 'bold', fontSize: '0.85rem', pt: 0.5 }}>WORK EXPERIENCE</Typography>
        <Box sx={{ borderLeft: `1px solid ${euroBlue}`, pl: 3, pb: 4 }}>
          {experience.map((exp, idx) => (
            <Box key={idx} sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ color: '#6b7280', mb: 0.5 }}>{exp.duration}</Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#111827', textTransform: 'uppercase' }}>{exp.role}</Typography>
              <Typography variant="body2" sx={{ fontStyle: 'italic', color: '#4b5563', mb: 1 }}>{exp.company}</Typography>
              <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{exp.description}</Typography>
            </Box>
          ))}
        </Box>

        <Typography sx={{ textAlign: 'right', color: euroBlue, fontWeight: 'bold', fontSize: '0.85rem', pt: 0.5 }}>EDUCATION</Typography>
        <Box sx={{ borderLeft: `1px solid ${euroBlue}`, pl: 3, pb: 4 }}>
          {education.map((edu, idx) => (
            <Box key={idx} sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ color: '#6b7280', mb: 0.5 }}>{edu.year}</Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#111827', textTransform: 'uppercase' }}>{edu.degree}</Typography>
              <Typography variant="body2" sx={{ fontStyle: 'italic', color: '#4b5563' }}>{edu.institute}</Typography>
            </Box>
          ))}
        </Box>

        <Typography sx={{ textAlign: 'right', color: euroBlue, fontWeight: 'bold', fontSize: '0.85rem', pt: 0.5 }}>DIGITAL SKILLS</Typography>
        <Box sx={{ borderLeft: `1px solid ${euroBlue}`, pl: 3, pb: 4 }}>
          <Typography variant="body2" sx={{ lineHeight: 1.8 }}>{skills.join(" | ")}</Typography>
        </Box>

      </Box>
    </Box>
  );
}