import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';

// The full-width grey section banner
const SectionBanner = ({ title }) => (
    <Box sx={{ width: '100%', bgcolor: '#F3F4F6', py: 1.2, mb: 3, textAlign: 'center' }}>
        <Typography variant="subtitle1" fontWeight="900" sx={{ letterSpacing: '4px', color: '#111', textTransform: 'uppercase' }}>
            {title}
        </Typography>
    </Box>
);

// The two-column row for Education and Work Experience
const DateRowItem = ({ dates, title, subtitle, description }) => (
    <Box sx={{ display: 'flex', mb: 4, px: 6 }}>
        {/* Left Column: Dates (approx 25% width) */}
        <Box sx={{ width: '25%', flexShrink: 0, pr: 3 }}>
            <Typography variant="body2" sx={{ color: '#555', mt: 0.2 }}>
                {dates}
            </Typography>
        </Box>
        
        {/* Right Column: Content */}
        <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle2" fontWeight="900" sx={{ color: '#111', mb: 1, textTransform: 'uppercase' }}>
                {title} {subtitle && <span style={{ color: '#111', margin: '0 4px' }}>|</span>} {subtitle}
            </Typography>
            {description && (
                <Typography variant="body2" sx={{ color: '#555', lineHeight: 1.7, textAlign: 'justify' }}>
                    {description}
                </Typography>
            )}
        </Box>
    </Box>
);

export default function BlackWhite({ data }) {
    
    // Aggressively check for multiple possible names your form might be using
    const { 
        personalInfo = {}, 
        experience = [], 
        education = [], 
        skills = []
    } = data || {};

    const parseArray = (item) => {
        if (Array.isArray(item)) return item;
        if (typeof item === 'string' && item.trim() !== '') return item.split(',').map(s => s.trim());
        return [];
    };

    // ULTIMATE TEXT EXTRACTOR
    const getDisplayText = (item) => {
        if (!item) return "";
        if (typeof item === 'string') return item;
        
        if (typeof item === 'object') {
            const possibleKeys = ['name', 'title', 'label', 'value', 'description', 'text', 'degree', 'institute', 'role', 'company'];
            for (let key of possibleKeys) {
                if (item[key]) return item[key];
            }
            const fallbackString = Object.values(item).find(v => typeof v === 'string');
            if (fallbackString) return fallbackString;
            return ""; 
        }
        return String(item);
    };

    const safeExperience = Array.isArray(experience) ? experience : [];
    const safeEducation = Array.isArray(education) ? education : [];
    const safeSkills = parseArray(skills);

    const displayPhone = personalInfo.phone || personalInfo.contactNo || personalInfo.contact;
    const displayAddress = personalInfo.address || personalInfo.location;
    const displayEmail = personalInfo.email;
    
    const profileImageUrl = React.useMemo(() => {
        const img = personalInfo.profileImage;
        if (!img) return null;
        if (typeof img === 'string') return img;
        if (img.secure_url) return img.secure_url;
        if (img instanceof File || img instanceof Blob) return URL.createObjectURL(img);
        return null;
    }, [personalInfo.profileImage]);

    // 🎨 CUSTOM DESIGN COMPONENTS FOR EXACT MATCH
    // Moved outside the component

    return (
        <Box sx={{ minHeight: '297mm', width: '210mm', mx: 'auto', fontFamily: '"Arial", sans-serif', boxShadow: 3, bgcolor: 'white', color: '#333' }}>
            
            {/* ---------------- HEADER ---------------- */}
            <Box sx={{ p: 6, pb: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                
                {/* Profile Picture */}
                <Box>
                    {profileImageUrl ? (
                        <Avatar src={profileImageUrl} sx={{ width: 110, height: 110 }} />
                    ) : (
                        <Box sx={{ width: 110, height: 110, borderRadius: '50%', bgcolor: '#f0f0f0', border: '1px solid #ccc' }} />
                    )}
                </Box>

                {/* Name, Title & Contact Info */}
                <Box sx={{ flex: 1 }}>
                    <Typography variant="h3" fontWeight="900" sx={{ color: '#111', mb: 0.5 }}>
                        {personalInfo.name}
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#555', mb: 1 }}>
                        {personalInfo.title}
                    </Typography>
                    
                    {/* Short line under title */}
                    <Box sx={{ width: '60px', height: '2px', bgcolor: '#888', mb: 1.5 }} />

                    {/* Contact Row (Inline) */}
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, alignItems: 'center' }}>
                        {displayPhone && (
                            <Typography variant="caption" sx={{ color: '#333', display: 'flex', alignItems: 'center', gap: 0.5, fontWeight: 600 }}>
                                📞 {displayPhone}
                            </Typography>
                        )}
                        {displayEmail && (
                            <Typography variant="caption" sx={{ color: '#333', display: 'flex', alignItems: 'center', gap: 0.5, fontWeight: 600 }}>
                                ✉️ {displayEmail}
                            </Typography>
                        )}
                        {displayAddress && (
                            <Typography variant="caption" sx={{ color: '#333', display: 'flex', alignItems: 'center', gap: 0.5, fontWeight: 600 }}>
                                📍 {displayAddress}
                            </Typography>
                        )}
                    </Box>
                </Box>
            </Box>

            {/* ---------------- ABOUT ME ---------------- */}
            {(personalInfo.about || personalInfo.summary) && (
                <Box>
                    <SectionBanner title="ABOUT ME" />
                    <Box sx={{ px: 6, mb: 4 }}>
                        <Typography variant="body2" sx={{ color: '#555', lineHeight: 1.7, textAlign: 'justify' }}>
                            {personalInfo.about || personalInfo.summary}
                        </Typography>
                    </Box>
                </Box>
            )}

            {/* ---------------- EDUCATION ---------------- */}
            {safeEducation.length > 0 && (
                <Box>
                    <SectionBanner title="EDUCATION" />
                    <Box sx={{ mb: 1 }}>
                        {safeEducation.map((edu, idx) => (
                            <DateRowItem 
                                key={idx}
                                dates={getDisplayText(edu.year || edu.date)}
                                title={getDisplayText(edu.institute || edu.school)}
                                subtitle={getDisplayText(edu.degree || edu.course)}
                                description={getDisplayText(edu.description || edu.summary)}
                            />
                        ))}
                    </Box>
                </Box>
            )}

            {/* ---------------- WORK EXPERIENCE ---------------- */}
            {safeExperience.length > 0 && (
                <Box>
                    <SectionBanner title="WORK EXPERIENCE" />
                    <Box sx={{ mb: 1 }}>
                        {safeExperience.map((exp, idx) => (
                            <DateRowItem 
                                key={idx}
                                dates={getDisplayText(exp.duration || exp.date)}
                                title={getDisplayText(exp.company || exp.organization)}
                                subtitle={getDisplayText(exp.role || exp.position)}
                                description={getDisplayText(exp.description || exp.summary)}
                            />
                        ))}
                    </Box>
                </Box>
            )}

            {/* ---------------- SKILLS ---------------- */}
            {safeSkills.length > 0 && (
                <Box>
                    <SectionBanner title="SKILLS" />
                    <Box sx={{ px: 6, pb: 6 }}>
                        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1.5 }}>
                            {safeSkills.map((skill, idx) => (
                                <Typography key={idx} variant="body2" sx={{ color: '#333', fontWeight: 500 }}>
                                    • {getDisplayText(skill)}
                                </Typography>
                            ))}
                        </Box>
                    </Box>
                </Box>
            )}

        </Box>
    );
}