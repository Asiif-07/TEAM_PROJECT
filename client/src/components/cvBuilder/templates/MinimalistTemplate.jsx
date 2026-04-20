import React from 'react';
import { Box, Typography } from '@mui/material';

// Helper component for the small thick underline beneath headers on the right side
const SectionLine = ({ color }) => (
    <Box sx={{ width: '35px', height: '3px', bgcolor: color, mt: 0.5, mb: 2 }} />
);

export default function MinimalistTemplate({ data }) {

    
    const { 
        personalInfo = {}, 
        experience = [], 
        education = [], 
        skills = [],
        languages = [],
        hobbies = [],
        interests = [], 
        activities = [], 
        certifications = [], 
        certificates = [],
        awards = []
    } = data || {};

    const parseArray = (item) => {
        if (Array.isArray(item)) return item;
        if (typeof item === 'string' && item.trim() !== '') return item.split(',').map(s => s.trim());
        return [];
    };

    // ULTIMATE TEXT EXTRACTOR: Finds the text no matter what your form names the object keys
    const getDisplayText = (item) => {
        if (!item) return "";
        if (typeof item === 'string') return item;
        
        if (typeof item === 'object') {
            const possibleKeys = ['name', 'title', 'label', 'value', 'certification', 'certName', 'hobby', 'interest', 'award', 'description', 'text'];
            for (let key of possibleKeys) {
                if (item[key]) return item[key];
            }
            const fallbackString = Object.values(item).find(v => typeof v === 'string');
            if (fallbackString) return fallbackString;

            return "• Invalid Format"; 
        }
        return String(item);
    };

    const safeExperience = Array.isArray(experience) ? experience : [];
    const safeEducation = Array.isArray(education) ? education : [];
    const safeSkills = parseArray(skills);
    const safeLanguages = parseArray(languages);
    const safeHobbies = parseArray(hobbies.length > 0 ? hobbies : (interests.length > 0 ? interests : activities));
    const safeCertifications = parseArray(certifications.length > 0 ? certifications : (certificates.length > 0 ? certificates : awards));

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

    return (
        <Box sx={{ display: 'flex', minHeight: '297mm', width: '210mm', mx: 'auto', fontFamily: '"Helvetica", "Arial", sans-serif', boxShadow: 3, bgcolor: 'white' }}>
            
            {/* ---------------- LEFT SIDEBAR (Dark Theme) ---------------- */}
            <Box sx={{ width: '35%', bgcolor: '#2A313C', color: 'white', p: 5 }}>
                
                {/* Profile Picture */}
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 6 }}>
                    {profileImageUrl ? (
                        <Box 
                            component="img" 
                            src={profileImageUrl} 
                            alt="Profile"
                            sx={{ width: 140, height: 140, borderRadius: '50%', objectFit: 'cover', border: '3px solid #4a5568' }} 
                        />
                    ) : (
                        <Box sx={{ width: 140, height: 140, borderRadius: '50%', bgcolor: '#4a5568', border: '3px solid #718096' }} />
                    )}
                </Box>

                {/* Contact Section */}
                <Box sx={{ mb: 5 }}>
                    <Typography variant="h6" fontWeight="bold">Contact</Typography>
                    <SectionLine color="white" />
                    
                    {displayAddress && (
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle2" fontWeight="bold">Address</Typography>
                            <Typography variant="body2" sx={{ color: '#ccc' }}>{displayAddress}</Typography>
                        </Box>
                    )}

                    {displayPhone && (
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle2" fontWeight="bold">Phone</Typography>
                            <Typography variant="body2" sx={{ color: '#ccc' }}>{displayPhone}</Typography>
                        </Box>
                    )}

                    {displayEmail && (
                        <Box>
                            <Typography variant="subtitle2" fontWeight="bold">Email</Typography>
                            <Typography variant="body2" sx={{ color: '#ccc', wordBreak: 'break-all' }}>{displayEmail}</Typography>
                        </Box>
                    )}
                </Box>

                {/* Skills Section */}
                {safeSkills.length > 0 && (
                    <Box sx={{ mb: 5 }}>
                        <Typography variant="h6" fontWeight="bold">Skills</Typography>
                        <SectionLine color="white" />
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                            {safeSkills.map((skill, idx) => (
                                <Typography key={idx} variant="body2" sx={{ color: '#ccc' }}>• {getDisplayText(skill)}</Typography>
                            ))}
                        </Box>
                    </Box>
                )}

                {/* Languages Section */}
                {safeLanguages.length > 0 && (
                    <Box sx={{ mb: 5 }}>
                        <Typography variant="h6" fontWeight="bold">Languages</Typography>
                        <SectionLine color="white" />
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                            {safeLanguages.map((lang, idx) => (
                                <Typography key={idx} variant="body2" sx={{ color: '#ccc' }}>• {getDisplayText(lang)}</Typography>
                            ))}
                        </Box>
                    </Box>
                )}

                {/* Hobbies Section */}
                {safeHobbies.length > 0 && (
                    <Box sx={{ mb: 5 }}>
                        <Typography variant="h6" fontWeight="bold">Hobbies</Typography>
                        <SectionLine color="white" />
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                            {safeHobbies.map((hobby, idx) => (
                                <Typography key={idx} variant="body2" sx={{ color: '#ccc' }}>• {getDisplayText(hobby)}</Typography>
                            ))}
                        </Box>
                    </Box>
                )}

                {/* Certifications Section */}
                {safeCertifications.length > 0 && (
                    <Box>
                        <Typography variant="h6" fontWeight="bold">Certifications</Typography>
                        <SectionLine color="white" />
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                            {safeCertifications.map((cert, idx) => (
                                <Typography key={idx} variant="body2" sx={{ color: '#ccc' }}>• {getDisplayText(cert)}</Typography>
                            ))}
                        </Box>
                    </Box>
                )}
            </Box>

            {/* ---------------- RIGHT MAIN CONTENT (White Theme) ---------------- */}
            <Box sx={{ width: '65%', color: '#000', p: 6, pt: 8 }}>
                
                {/* Header: Name & Title */}
                <Box sx={{ mb: 6 }}>
                    <Typography variant="h3" fontWeight="bold" sx={{ letterSpacing: '1px', textTransform: 'uppercase', color: '#1a1a1a', mb: 1, minHeight: '48px' }}>
                        {personalInfo.name}
                    </Typography>
                    <Typography variant="h5" sx={{ color: '#333', minHeight: '32px' }}>
                        {personalInfo.title}
                    </Typography>
                </Box>

                {/* Profile Summary */}
                {(personalInfo.about || personalInfo.summary) && (
                    <Box sx={{ mb: 6 }}>
                        <Typography variant="h5" fontWeight="bold">Profile</Typography>
                        <SectionLine color="#000" />
                        <Typography variant="body2" sx={{ lineHeight: 1.6, color: '#333', textAlign: 'justify', whiteSpace: 'pre-wrap' }}>
                            {personalInfo.about || personalInfo.summary}
                        </Typography>
                    </Box>
                )}

                {/* Work Experience */}
                {safeExperience.length > 0 && (
                    <Box sx={{ mb: 6 }}>
                        <Typography variant="h5" fontWeight="bold">Work Experience</Typography>
                        <SectionLine color="#000" />
                        
                        {safeExperience.map((exp, idx) => (
                            <Box key={idx} sx={{ mb: 4 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5 }}>
                                    <Typography variant="subtitle1" fontWeight="bold">{getDisplayText(exp.role || exp.position)}</Typography>
                                    <Typography variant="caption" fontWeight="bold" sx={{ color: '#555', mt: 0.5 }}>{getDisplayText(exp.duration || exp.date)}</Typography>
                                </Box>
                                <Typography variant="subtitle2" sx={{ color: '#555', mb: 1.5, fontWeight: 'bold' }}>{getDisplayText(exp.company || exp.organization)}</Typography>
                                <Typography variant="body2" sx={{ color: '#333', lineHeight: 1.6, whiteSpace: 'pre-wrap', pl: 2 }}>
                                    {getDisplayText(exp.description || exp.summary)}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                )}

                {/* Education */}
                {safeEducation.length > 0 && (
                    <Box>
                        <Typography variant="h5" fontWeight="bold">Education</Typography>
                        <SectionLine color="#000" />
                        
                        {safeEducation.map((edu, idx) => (
                            <Box key={idx} sx={{ mb: 3 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <Typography variant="subtitle1" fontWeight="bold">{getDisplayText(edu.degree || edu.course)}</Typography>
                                    <Typography variant="caption" fontWeight="bold" sx={{ color: '#555', mt: 0.5 }}>{getDisplayText(edu.year || edu.date)}</Typography>
                                </Box>
                                <Typography variant="subtitle2" sx={{ color: '#555', mt: 0.5 }}>{getDisplayText(edu.institute || edu.school)}</Typography>
                            </Box>
                        ))}
                    </Box>
                )}

            </Box>
        </Box>
    );
}