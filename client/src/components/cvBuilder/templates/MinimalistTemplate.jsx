import React from 'react';
import { Box, Typography, Divider } from '@mui/material';

export default function MinimalistTemplate({ data }) {
    const { personalInfo = {}, experience = [], education = [], skills = [] } = data || {};

    return (
        <Box sx={{ minHeight: '297mm', width: '210mm', bgcolor: 'white', mx: 'auto', p: 8, fontFamily: '"Helvetica", "Arial", sans-serif', color: '#333' }}>
            {/* Header */}
            <Box sx={{ mb: 6, textAlign: 'center' }}>
                <Typography variant="h3" fontWeight="300" sx={{ color: '#000', mb: 1, letterSpacing: '2px', textTransform: 'uppercase' }}>
                    {personalInfo.name || "Alex Rivera"}
                </Typography>
                <Typography variant="subtitle1" sx={{ color: '#666', mb: 2, letterSpacing: '1px' }}>
                    {personalInfo.title || "Software Architect"}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 3, opacity: 0.8, fontSize: '0.9rem' }}>
                    {personalInfo.email && <Typography variant="body2">{personalInfo.email}</Typography>}
                    {personalInfo.phone && <Typography variant="body2">{personalInfo.phone}</Typography>}
                    {personalInfo.linkedin && <Typography variant="body2">LinkedIn</Typography>}
                </Box>
            </Box>

            {/* Summary */}
            <Box sx={{ mb: 5 }}>
                <Typography variant="body2" sx={{ lineHeight: 1.8, color: '#555', fontStyle: 'italic', textAlign: 'center', maxWidth: '80%', mx: 'auto' }}>
                    {personalInfo.about || "Focusing on clean code and scalable architecture with 10+ years of experience."}
                </Typography>
            </Box>

            <Divider sx={{ mb: 5, borderColor: '#eee' }} />

            {/* Experience */}
            <Box sx={{ mb: 5 }}>
                <Typography variant="caption" fontWeight="900" sx={{ display: 'block', mb: 3, letterSpacing: '2px', color: '#000', textTransform: 'uppercase' }}>
                    Experience
                </Typography>
                {experience.map((exp, idx) => (
                    <Box key={idx} sx={{ mb: 4 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                            <Typography variant="subtitle1" fontWeight="700">{exp.role}</Typography>
                            <Typography variant="caption" sx={{ color: '#999' }}>{exp.duration}</Typography>
                        </Box>
                        <Typography variant="subtitle2" sx={{ color: '#666', mb: 1.5 }}>{exp.company}</Typography>
                        <Typography variant="body2" sx={{ color: '#555', lineHeight: 1.7, pl: 2, borderLeft: '1px solid #eee' }}>
                            {exp.description}
                        </Typography>
                    </Box>
                ))}
            </Box>

            {/* Education & Skills Grid */}
            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                <Box>
                    <Typography variant="caption" fontWeight="900" sx={{ display: 'block', mb: 3, letterSpacing: '2px', color: '#000', textTransform: 'uppercase' }}>
                        Education
                    </Typography>
                    {education.map((edu, idx) => (
                        <Box key={idx} sx={{ mb: 2 }}>
                            <Typography variant="subtitle2" fontWeight="700">{edu.degree}</Typography>
                            <Typography variant="caption" sx={{ display: 'block', color: '#777' }}>{edu.institute}</Typography>
                            <Typography variant="caption" sx={{ color: '#999' }}>{edu.year}</Typography>
                        </Box>
                    ))}
                </Box>
                <Box>
                    <Typography variant="caption" fontWeight="900" sx={{ display: 'block', mb: 3, letterSpacing: '2px', color: '#000', textTransform: 'uppercase' }}>
                        Expertise
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {skills.map((skill, idx) => (
                            <Box key={idx} sx={{ px: 1.5, py: 0.5, border: '1px solid #eee', borderRadius: '4px' }}>
                                <Typography variant="caption" sx={{ fontSize: '0.7rem', fontWeight: 600 }}>{skill}</Typography>
                            </Box>
                        ))}
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}
