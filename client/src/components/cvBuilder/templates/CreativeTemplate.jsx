import React from 'react';
import { Box, Typography, Divider, Avatar } from '@mui/material';

export default function CreativeTemplate({ data }) {
    const { personalInfo = {}, experience = [], education = [], skills = [] } = data || {};

    const mainColor = "#6366F1"; // Indigo

    const profileImageUrl = React.useMemo(() => {
        const img = personalInfo.profileImage;
        if (!img) return null;
        if (typeof img === 'string') return img;
        if (img.secure_url) return img.secure_url;
        if (img instanceof File || img instanceof Blob) return URL.createObjectURL(img);
        return null;
    }, [personalInfo.profileImage]);

    return (
        <Box sx={{ minHeight: '297mm', width: '210mm', bgcolor: '#F8FAFC', mx: 'auto', display: 'flex' }}>
            {/* Sidebar */}
            <Box sx={{ width: '70mm', bgcolor: mainColor, color: 'white', p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Avatar
                    src={profileImageUrl}
                    sx={{ width: 120, height: 120, mb: 4, border: '4px solid rgba(255,255,255,0.2)' }}
                />

                <Box sx={{ width: '100%', mb: 6 }}>
                    <Typography variant="h6" fontWeight="900" sx={{ mb: 2, scale: '0.9', transformOrigin: 'left' }}>CONTACT</Typography>
                    <Typography variant="body2" sx={{ mb: 1, opacity: 0.9 }}>📍 {personalInfo.phone || "Location"}</Typography>
                    <Typography variant="body2" sx={{ mb: 1, opacity: 0.9 }}>📧 {personalInfo.email}</Typography>
                    <Typography variant="body2" sx={{ mb: 1, opacity: 0.9 }}>🔗 {personalInfo.linkedin || "linkedin.com/..."}</Typography>
                </Box>

                <Box sx={{ width: '100%', mb: 6 }}>
                    <Typography variant="h6" fontWeight="900" sx={{ mb: 2, scale: '0.9', transformOrigin: 'left' }}>EXPERTISE</Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                        {skills.map((skill, idx) => (
                            <Box key={idx}>
                                <Typography variant="caption" sx={{ display: 'block', mb: 0.5, fontWeight: 700 }}>{skill}</Typography>
                                <Box sx={{ width: '100%', height: 4, bgcolor: 'rgba(255,255,255,0.2)', borderRadius: 2 }}>
                                    <Box sx={{ width: '80%', height: '100%', bgcolor: 'white', borderRadius: 2 }} />
                                </Box>
                            </Box>
                        ))}
                    </Box>
                </Box>

                <Box sx={{ width: '100%' }}>
                    <Typography variant="h6" fontWeight="900" sx={{ mb: 2, scale: '0.9', transformOrigin: 'left' }}>EDUCATION</Typography>
                    {education.map((edu, idx) => (
                        <Box key={idx} sx={{ mb: 3 }}>
                            <Typography variant="body2" fontWeight="700">{edu.degree}</Typography>
                            <Typography variant="caption" sx={{ display: 'block', opacity: 0.8 }}>{edu.institute}</Typography>
                            <Typography variant="caption" sx={{ opacity: 0.6 }}>{edu.year}</Typography>
                        </Box>
                    ))}
                </Box>
            </Box>

            {/* Main Content */}
            <Box sx={{ flex: 1, p: 6, bgcolor: 'white' }}>
                <Box sx={{ mb: 6 }}>
                    <Typography variant="h2" fontWeight="900" sx={{ color: mainColor, lineHeight: 1 }}>
                        {personalInfo.name?.split(' ')[0] || "SAM"}<br />
                        <span style={{ color: '#1E293B' }}>{personalInfo.name?.split(' ').slice(1).join(' ') || "WINCHESTER"}</span>
                    </Typography>
                    <Typography variant="h5" fontWeight="700" sx={{ mt: 2, color: '#64748B', letterSpacing: 2 }}>
                        {personalInfo.title || "CREATIVE DIRECTOR"}
                    </Typography>
                </Box>

                <Box sx={{ mb: 6 }}>
                    <Typography variant="h6" fontWeight="900" sx={{ color: mainColor, mb: 2, borderBottom: '2px solid', borderColor: mainColor, display: 'inline-block' }}>PROFILE</Typography>
                    <Typography variant="body2" sx={{ color: '#475569', lineHeight: 1.8, textAlign: 'justify' }}>
                        {personalInfo.about || "Creative and results-driven professional with a passion for designing impactful user experiences and brand identities."}
                    </Typography>
                </Box>

                <Box>
                    <Typography variant="h6" fontWeight="900" sx={{ color: mainColor, mb: 3, borderBottom: '2px solid', borderColor: mainColor, display: 'inline-block' }}>WORK EXPERIENCE</Typography>
                    {experience.map((exp, idx) => (
                        <Box key={idx} sx={{ mb: 4, position: 'relative' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                <Typography variant="subtitle1" fontWeight="800" sx={{ color: '#1E293B' }}>{exp.role}</Typography>
                                <Typography variant="caption" fontWeight="700" sx={{ color: mainColor }}>{exp.duration}</Typography>
                            </Box>
                            <Typography variant="subtitle2" fontWeight="700" sx={{ color: '#64748B', mb: 2 }}>{exp.company}</Typography>
                            <Typography variant="body2" sx={{ color: '#475569', lineHeight: 1.7 }}>
                                {exp.description}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            </Box>
        </Box>
    );
}
