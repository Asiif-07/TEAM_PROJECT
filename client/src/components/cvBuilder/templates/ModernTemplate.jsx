import React from 'react';
import { Box, Typography } from '@mui/material';

export default function ModernTemplate({ data }) {
  const { personalInfo = {}, experience = [], education = [], skills = [] } = data || {};

  return (
    <Box sx={{ display: 'flex', minHeight: '297mm', width: '210mm', bgcolor: 'white', mx: 'auto', fontFamily: '"Arial", sans-serif' }}>
      
      <Box sx={{ width: '35%', bgcolor: '#E5E7EB', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ height: '220px', display: 'flex', justifyContent: 'center', alignItems: 'center', pt: 4 }}>
          <Box sx={{ width: 150, height: 150, borderRadius: '50%', bgcolor: '#ccc', border: '6px solid #d1d5db' }} />
        </Box>

        <Box sx={{ bgcolor: '#1F2937', color: 'white', py: 1.5, px: 4, mb: 2, mt: 2 }}><Typography variant="h6" fontWeight="bold" letterSpacing={1}>Contact</Typography></Box>
        <Box sx={{ px: 4, mb: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box><Typography variant="caption" fontWeight="bold" display="block">Phone</Typography><Typography variant="body2">{personalInfo.phone || "123-456-7890"}</Typography></Box>
          <Box><Typography variant="caption" fontWeight="bold" display="block">Email</Typography><Typography variant="body2" sx={{ wordBreak: 'break-all' }}>{personalInfo.email || "email@site.com"}</Typography></Box>
          <Box><Typography variant="caption" fontWeight="bold" display="block">Link</Typography><Typography variant="body2" sx={{ wordBreak: 'break-all' }}>{personalInfo.linkedin || personalInfo.github || "linkedin.com/in/name"}</Typography></Box>
        </Box>

        <Box sx={{ bgcolor: '#1F2937', color: 'white', py: 1.5, px: 4, mb: 2 }}><Typography variant="h6" fontWeight="bold" letterSpacing={1}>Education</Typography></Box>
        <Box sx={{ px: 4, mb: 4, display: 'flex', flexDirection: 'column', gap: 2 }}>
          {education.map((edu, idx) => (
            <Box key={idx}>
              <Typography variant="body2" fontWeight="bold">{edu.degree}</Typography>
              <Typography variant="caption" display="block">{edu.institute}</Typography>
              <Typography variant="caption" color="#555">{edu.year}</Typography>
            </Box>
          ))}
        </Box>

        <Box sx={{ bgcolor: '#1F2937', color: 'white', py: 1.5, px: 4, mb: 2 }}><Typography variant="h6" fontWeight="bold" letterSpacing={1}>Skills</Typography></Box>
        <Box sx={{ px: 4, mb: 4 }}>
          <ul style={{ margin: 0, paddingLeft: '20px' }}>
            {skills.map((skill, idx) => (<li key={idx}><Typography variant="body2" sx={{ mb: 0.5 }}>{skill}</Typography></li>))}
          </ul>
        </Box>
      </Box>

      <Box sx={{ width: '65%', p: 5, pt: 8 }}>
        <Box sx={{ mb: 6 }}>
          <Typography variant="h2" fontWeight="900" sx={{ lineHeight: 1, mb: 1, color: '#1f2937', textTransform: 'uppercase' }}>
            {(personalInfo.name || "YOUR NAME").split(' ').map((n, i) => <div key={i}>{n}</div>)}
          </Typography>
          <Typography variant="h6" sx={{ color: '#4b5563', letterSpacing: 2 }}>{personalInfo.title || "Your Job Title"}</Typography>
        </Box>

        {personalInfo.about && (
           <Box sx={{ mb: 4 }}><Typography variant="body2" sx={{ color: '#4b5563', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{personalInfo.about}</Typography></Box>
        )}

        <Typography variant="h6" fontWeight="900" sx={{ mb: 3, color: '#1f2937' }}>Professional Experience</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {experience.map((exp, idx) => (
            <Box key={idx} sx={{ display: 'flex', gap: 3 }}>
              <Box sx={{ width: '80px', flexShrink: 0, textAlign: 'center' }}>
                <Typography variant="subtitle2" fontWeight="bold" sx={{ color: '#1f2937' }}>{exp.duration ? exp.duration.split('-')[0] : ""}</Typography>
                <Typography variant="caption" sx={{ display: 'block' }}>-</Typography>
                <Typography variant="subtitle2" fontWeight="bold" sx={{ color: '#1f2937' }}>{exp.duration ? exp.duration.split('-')[1] : ""}</Typography>
              </Box>
              <Box sx={{ borderLeft: '2px solid #e5e7eb', pl: 3 }}>
                <Typography variant="subtitle1" fontWeight="900" sx={{ color: '#1f2937' }}>{exp.role}</Typography>
                <Typography variant="body2" sx={{ color: '#4b5563', mb: 1 }}>{exp.company}</Typography>
                <Typography variant="body2" sx={{ lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>{exp.description}</Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}