import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';

// 🎨 CUSTOM DESIGN COMPONENTS for the "Line and Dot" style
const SectionHeader = ({ title }) => (
    <Box sx={{ position: 'relative', mb: 2, mt: 4 }}>
        {/* The Black Dot */}
        <Box sx={{
            position: 'absolute',
            left: '-28px', // Adjusts to sit exactly on the border line
            top: '50%',
            transform: 'translateY(-50%)',
            width: '14px',
            height: '14px',
            borderRadius: '50%',
            bgcolor: '#000'
        }} />
        <Typography variant="h6" fontWeight="900" sx={{ textTransform: 'uppercase', letterSpacing: '1px', color: '#000' }}>
            {title}
        </Typography>
    </Box>
);

const ContactRow = ({ icon, text }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5 }}>
        <Box sx={{ 
            width: 32, height: 32, borderRadius: '50%', border: '1px solid #000', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' 
        }}>
            {icon}
        </Box>
        <Typography variant="body2" sx={{ color: '#333', fontWeight: 500, wordBreak: 'break-all' }}>
            {text}
        </Typography>
    </Box>
);

export default function BlackPro({ data }) {

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
    const displayWebsite = personalInfo.website || personalInfo.portfolio || personalInfo.linkedin;
    
    const profileImageUrl = React.useMemo(() => {
        const img = personalInfo.profileImage;
        if (!img) return null;
        if (typeof img === 'string') return img;
        if (img.secure_url) return img.secure_url;
        if (img instanceof File || img instanceof Blob) return URL.createObjectURL(img);
        return null;
    }, [personalInfo.profileImage]);

    // 🎨 CUSTOM DESIGN COMPONENTS for the "Line and Dot" style
    // Moved outside the component

    return (
        <Box sx={{ minHeight: '297mm', width: '210mm', mx: 'auto', fontFamily: '"Arial", sans-serif', boxShadow: 3, bgcolor: 'white', display: 'flex', flexDirection: 'column' }}>
            
            {/* ---------------- HEADER ---------------- */}
            <Box sx={{ pt: 6, pb: 4, px: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
                
                {/* Horizontal Divider Line */}
                <Box sx={{ position: 'absolute', bottom: 0, left: 40, right: 40, height: '1px', bgcolor: '#ccc' }} />

                <Box sx={{ flex: 1 }}>
                    <Typography variant="h3" fontWeight="900" sx={{ textTransform: 'uppercase', color: '#000', mb: 1, letterSpacing: '1px' }}>
                        {personalInfo.name}
                    </Typography>
                    <Typography variant="h6" sx={{ textTransform: 'uppercase', color: '#555', letterSpacing: '3px' }}>
                        {personalInfo.title}
                    </Typography>
                </Box>

                <Box sx={{ zIndex: 1, bgcolor: 'white', borderRadius: '50%', p: 1 }}>
                    {profileImageUrl ? (
                        <Avatar src={profileImageUrl} sx={{ width: 150, height: 150 }} />
                    ) : (
                        <Box sx={{ width: 150, height: 150, borderRadius: '50%', bgcolor: '#f0f0f0', border: '1px solid #ccc' }} />
                    )}
                </Box>
            </Box>

            {/* ---------------- BODY (Two Columns) ---------------- */}
            <Box sx={{ display: 'flex', flex: 1, px: 4, pb: 6 }}>
                
                {/* LEFT COLUMN */}
                <Box sx={{ flex: 1, borderLeft: '1px solid #ccc', pl: 3, ml: 2, pr: 3 }}>
                    
                    {/* About Me */}
                    {(personalInfo.about || personalInfo.summary) && (
                        <Box>
                            <SectionHeader title="About Me" />
                            <Typography variant="body2" sx={{ color: '#444', lineHeight: 1.8, textAlign: 'justify' }}>
                                {personalInfo.about || personalInfo.summary}
                            </Typography>
                        </Box>
                    )}

                    {/* Work Experiences */}
                    {safeExperience.length > 0 && (
                        <Box>
                            <SectionHeader title="Work Experiences" />
                            {safeExperience.map((exp, idx) => (
                                <Box key={idx} sx={{ mb: 4 }}>
                                    <Typography variant="subtitle2" fontWeight="900" sx={{ color: '#000' }}>
                                        {getDisplayText(exp.duration || exp.date)}
                                    </Typography>
                                    <Typography variant="body2" fontStyle="italic" sx={{ color: '#555', mb: 0.5 }}>
                                        {getDisplayText(exp.company || exp.organization)}
                                    </Typography>
                                    <Typography variant="subtitle2" fontWeight="bold" sx={{ color: '#000', mb: 1 }}>
                                        {getDisplayText(exp.role || exp.position)}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#444', lineHeight: 1.7, textAlign: 'justify' }}>
                                        {getDisplayText(exp.description || exp.summary)}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    )}
                </Box>

                {/* RIGHT COLUMN */}
                <Box sx={{ flex: 1, borderLeft: '1px solid #ccc', pl: 3, ml: 2 }}>
                    
                    {/* Education History */}
                    {safeEducation.length > 0 && (
                        <Box>
                            <SectionHeader title="Education History" />
                            {safeEducation.map((edu, idx) => (
                                <Box key={idx} sx={{ mb: 3 }}>
                                    <Typography variant="subtitle2" fontWeight="900" sx={{ color: '#000', textTransform: 'uppercase' }}>
                                        {getDisplayText(edu.institute || edu.school)} {getDisplayText(edu.year || edu.date)}
                                    </Typography>
                                    <Typography variant="body2" fontStyle="italic" sx={{ color: '#555', mb: 0.5 }}>
                                        {getDisplayText(edu.degree || edu.course)}
                                    </Typography>
                                    {edu.location && (
                                        <Typography variant="body2" fontStyle="italic" sx={{ color: '#777' }}>
                                            {getDisplayText(edu.location)}
                                        </Typography>
                                    )}
                                </Box>
                            ))}
                        </Box>
                    )}

                    {/* Contact */}
                    <Box>
                        <SectionHeader title="Contact" />
                        <Box sx={{ mt: 2 }}>
                            {displayPhone && <ContactRow icon="📞" text={displayPhone} />}
                            {displayEmail && <ContactRow icon="✉️" text={displayEmail} />}
                            {displayWebsite && <ContactRow icon="🌐" text={displayWebsite} />}
                            {displayAddress && <ContactRow icon="🏠" text={displayAddress} />}
                        </Box>
                    </Box>

                    {/* Skills */}
                    {safeSkills.length > 0 && (
                        <Box>
                            <SectionHeader title="Skills" />
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mt: 2 }}>
                                {safeSkills.map((skill, idx) => (
                                    <Typography key={idx} variant="body2" sx={{ color: '#333', fontWeight: 500 }}>
                                        • {getDisplayText(skill)}
                                    </Typography>
                                ))}
                            </Box>
                        </Box>
                    )}

                </Box>
            </Box>
        </Box>
    );
}