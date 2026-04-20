import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';

// Custom Header Component for the Right Side
const RightHeader = ({ icon, title, mainColor }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, mt: 4 }}>
        <Typography variant="h5" sx={{ color: mainColor }}>{icon}</Typography>
        <Typography variant="h6" fontWeight="bold" sx={{ color: mainColor }}>{title}</Typography>
    </Box>
);

export default function CreativeTemplate({ data }) {
    

    const { 
        personalInfo = {}, 
        experience = [], 
        education = [], 
        skills = [], 
        languages = [],
        hobbies = [],
        interests = [], 
        certifications = [], 
        certificates = [],
        awards = [], // Maps to "Most proud of"
        achievements = []
    } = data || {};

    const mainColor = "#1B629A"; // 
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
            const possibleKeys = ['name', 'title', 'label', 'value', 'certification', 'certName', 'hobby', 'interest', 'award', 'description', 'text', 'proficiency', 'authority'];
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
    const safeHobbies = parseArray(hobbies.length > 0 ? hobbies : interests);
    const safeCertifications = parseArray(certifications.length > 0 ? certifications : certificates);
    const safeAwards = parseArray(awards.length > 0 ? awards : achievements);

    const displayPhone = personalInfo.phone || personalInfo.contactNo || personalInfo.contact;
    const displayAddress = personalInfo.address || personalInfo.location;
    const displayEmail = personalInfo.email;
    const displayLinkedin = personalInfo.linkedin;
    
    const profileImageUrl = React.useMemo(() => {
        const img = personalInfo.profileImage;
        if (personalInfo.profileImagePreview) return personalInfo.profileImagePreview;
        if (!img) return null;
        if (typeof img === 'string') return img;
        if (img.secure_url) return img.secure_url;
        if (img instanceof File || img instanceof Blob) return URL.createObjectURL(img);
        return null;
    }, []);

    // Custom Header Component for the Right Side
    // Moved outside the component

    return (
        <Box sx={{ display: 'flex', minHeight: '297mm', width: '210mm', mx: 'auto', fontFamily: '"Arial", sans-serif', boxShadow: 3, bgcolor: 'white' }}>
            
            {/* ---------------- LEFT SIDEBAR (Blue Theme) ---------------- */}
            <Box sx={{ width: '35%', bgcolor: mainColor, color: 'white', p: 4, display: 'flex', flexDirection: 'column' }}>
                
                {/* Profile Picture & Header */}
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', mb: 4 }}>
                    {profileImageUrl ? (
                        <Avatar
                            src={profileImageUrl}
                            sx={{ width: 140, height: 140, mb: 2, border: '4px solid rgba(255,255,255,0.3)' }}
                        />
                    ) : (
                        <Box sx={{ width: 140, height: 140, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.2)', border: '4px solid rgba(255,255,255,0.3)', mb: 2 }} />
                    )}
                    
                    <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
                        {personalInfo.name}
                    </Typography>
                    <Typography variant="body1" sx={{ px: 2, lineHeight: 1.4 }}>
                        {personalInfo.title}
                    </Typography>
                    
                    {/* Small Divider */}
                    <Box sx={{ width: '40px', height: '1px', bgcolor: 'white', opacity: 0.5, mt: 3, mb: 1 }} />
                </Box>

                {/* Details Section */}
                <Box sx={{ mb: 4 }}>
                    <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>Details</Typography>
                    {displayAddress && <Typography variant="body2" sx={{ mb: 0.5 }}>{displayAddress}</Typography>}
                    
                    <Box sx={{ mt: 2 }}>
                        {displayPhone && <Typography variant="body2" sx={{ mb: 0.5 }}>{displayPhone}</Typography>}
                        {displayEmail && <Typography variant="body2" sx={{ mb: 0.5, wordBreak: 'break-all' }}>{displayEmail}</Typography>}
                        {displayLinkedin && <Typography variant="body2" sx={{ wordBreak: 'break-all' }}>in/ {displayLinkedin}</Typography>}
                    </Box>
                </Box>

                {/* Tools of the trade (Skills) */}
                {safeSkills.length > 0 && (
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>Tools of the trade</Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                            {safeSkills.map((skill, idx) => (
                                <Typography key={idx} variant="body2" fontWeight="bold">{getDisplayText(skill)}</Typography>
                            ))}
                        </Box>
                    </Box>
                )}

                {/* Languages */}
                {safeLanguages.length > 0 && (
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>Languages</Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                            {safeLanguages.map((lang, idx) => (
                                <Box key={idx}>
                                    <Typography variant="body2" fontWeight="bold">{getDisplayText(lang)}</Typography>
                                    {typeof lang === 'object' && lang.proficiency && (
                                        <Typography variant="caption" sx={{ opacity: 0.8 }}>{lang.proficiency}</Typography>
                                    )}
                                </Box>
                            ))}
                        </Box>
                    </Box>
                )}

                {/* Hobbies */}
                {safeHobbies.length > 0 && (
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>Hobbies</Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                            {safeHobbies.map((hobby, idx) => (
                                <Typography key={idx} variant="body2" sx={{ lineHeight: 1.4 }}>
                                    {getDisplayText(hobby)}
                                </Typography>
                            ))}
                        </Box>
                    </Box>
                )}
            </Box>

            {/* ---------------- RIGHT MAIN CONTENT (White Theme) ---------------- */}
            <Box sx={{ width: '65%', color: '#333', p: 5, pt: 3 }}>
                
                {/* Profile Summary */}
                {(personalInfo.about || personalInfo.summary) && (
                    <Box>
                        <RightHeader icon="👤" title="Profile" mainColor={mainColor} />
                        <Typography variant="body2" sx={{ lineHeight: 1.6, textAlign: 'justify', whiteSpace: 'pre-wrap' }}>
                            {personalInfo.about || personalInfo.summary}
                        </Typography>
                    </Box>
                )}

                {/* Work Experience */}
                {safeExperience.length > 0 && (
                    <Box>
                        <RightHeader icon="💻" title="Experience" mainColor={mainColor} />
                        {safeExperience.map((exp, idx) => (
                            <Box key={idx} sx={{ mb: 3 }}>
                                <Typography variant="subtitle1" fontWeight="bold">
                                    {getDisplayText(exp.role || exp.position)} {getDisplayText(exp.company || exp.organization) && `- ${getDisplayText(exp.company || exp.organization)}`}
                                </Typography>
                                <Typography variant="caption" sx={{ color: '#777', mb: 1, display: 'block' }}>
                                    {getDisplayText(exp.duration || exp.date)}
                                </Typography>
                                <Typography variant="body2" sx={{ lineHeight: 1.6, whiteSpace: 'pre-wrap', ml: 1 }}>
                                    {getDisplayText(exp.description || exp.summary)}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                )}

                {/* Education */}
                {safeEducation.length > 0 && (
                    <Box>
                        <RightHeader icon="🎓" title="Education" mainColor={mainColor} />
                        {safeEducation.map((edu, idx) => (
                            <Box key={idx} sx={{ mb: 3 }}>
                                <Typography variant="subtitle1" fontWeight="bold">
                                    {getDisplayText(edu.degree || edu.course)} - {getDisplayText(edu.institute || edu.school)}
                                </Typography>
                                <Typography variant="caption" sx={{ color: '#777', mb: 0.5, display: 'block' }}>
                                    {getDisplayText(edu.year || edu.date)}
                                </Typography>
                                {edu.description && (
                                    <Typography variant="body2" sx={{ lineHeight: 1.6, whiteSpace: 'pre-wrap', ml: 1 }}>
                                        • {getDisplayText(edu.description)}
                                    </Typography>
                                )}
                            </Box>
                        ))}
                    </Box>
                )}

                {/* Certificates */}
                {safeCertifications.length > 0 && (
                    <Box>
                        <RightHeader icon="➕" title="Certificates" mainColor={mainColor} />
                        {safeCertifications.map((cert, idx) => (
                            <Box key={idx} sx={{ mb: 2 }}>
                                <Typography variant="subtitle2" fontWeight="bold">
                                    {getDisplayText(cert)}
                                </Typography>
                                {typeof cert === 'object' && cert.authority && (
                                    <Typography variant="body2" fontStyle="italic" sx={{ color: '#555' }}>
                                        {cert.authority}
                                    </Typography>
                                )}
                            </Box>
                        ))}
                    </Box>
                )}

                {/* Most proud of (Awards) */}
                {safeAwards.length > 0 && (
                    <Box>
                        <RightHeader icon="➕" title="Most proud of" mainColor={mainColor} />
                        {safeAwards.map((award, idx) => (
                            <Box key={idx} sx={{ mb: 2 }}>
                                <Typography variant="subtitle2" fontWeight="bold">
                                    {typeof award === 'object' && award.title ? award.title : "Awarded"}
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#333' }}>
                                    - {getDisplayText(award)}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                )}

            </Box>
        </Box>
    );
}