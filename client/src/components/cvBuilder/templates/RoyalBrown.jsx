import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';

export default function RoyalBrown({ data }) {
    
    // Aggressively check for multiple possible names your form might be using
    const { 
        personalInfo = {}, 
        experience = [], 
        education = [], 
        skills = [],
        languages = [],
        awards = [], 
        achievements = [],
        certifications = []
    } = data || {};

    const brownHeaderBg = "#746C67"; // Earthy brown/taupe
    const greySidebarBg = "#E5E5E5"; // Light grey
    const textDark = "#333333";
    const textLight = "#666666";

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
            const possibleKeys = ['name', 'title', 'label', 'value', 'description', 'text', 'degree', 'institute', 'role', 'company', 'award'];
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
    const safeLanguages = parseArray(languages);
    
    // Fallback for achievements (combining possible arrays)
    const safeAchievements = parseArray(achievements.length > 0 ? achievements : (awards.length > 0 ? awards : certifications));

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

    // Split Name into First and Last for the two-line header
    const nameString = personalInfo.name || "";
    const nameParts = nameString.split(' ');
    const firstName = nameParts[0] || "";
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : "";

    // 🎨 CUSTOM DESIGN COMPONENTS
    
    // Header with a line filling the remaining space (Used everywhere)
    const SectionHeader = ({ title }) => (
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2.5, mt: 3 }}>
            <Typography variant="subtitle1" fontWeight="900" sx={{ color: textDark, textTransform: 'uppercase', mr: 2, letterSpacing: '1px' }}>
                {title}
            </Typography>
            <Box sx={{ flex: 1, height: '2px', bgcolor: textDark }} />
        </Box>
    );

    // Timeline item for Work Experience
    const TimelineItem = ({ dates, role, company, description, isLast }) => (
        <Box sx={{ display: 'flex', position: 'relative', mb: 3 }}>
            
            {/* Timeline Line & Circle */}
            <Box sx={{ width: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', mr: 2, flexShrink: 0 }}>
                {/* Hollow Circle */}
                <Box sx={{ width: '14px', height: '14px', borderRadius: '50%', border: `2px solid ${textDark}`, bgcolor: 'white', zIndex: 2, mt: 0.5 }} />
                {/* Vertical Line */}
                {!isLast && (
                    <Box sx={{ position: 'absolute', top: '16px', bottom: '-16px', left: '6px', width: '2px', bgcolor: '#ccc', zIndex: 1 }} />
                )}
            </Box>

            {/* Content */}
            <Box sx={{ flex: 1, pb: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5 }}>
                    <Typography variant="subtitle2" fontWeight="900" sx={{ color: textDark, textTransform: 'uppercase' }}>
                        {role}
                    </Typography>
                    <Typography variant="body2" sx={{ color: textLight, fontWeight: 500 }}>
                        {dates}
                    </Typography>
                </Box>
                <Typography variant="subtitle2" fontWeight="900" sx={{ color: textDark, textTransform: 'uppercase', mb: 1 }}>
                    {company}
                </Typography>
                <Typography variant="body2" sx={{ color: textLight, lineHeight: 1.6, textAlign: 'justify' }}>
                    {description}
                </Typography>
            </Box>
        </Box>
    );

    // Contact row with icon
    const ContactRow = ({ icon, text }) => (
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 1.5 }}>
            <Typography sx={{ fontSize: '14px', color: textDark }}>{icon}</Typography>
            <Typography variant="body2" sx={{ color: textDark, fontWeight: 500, wordBreak: 'break-all' }}>
                {text}
            </Typography>
        </Box>
    );

    return (
        <Box sx={{ minHeight: '297mm', width: '210mm', mx: 'auto', fontFamily: '"Arial", sans-serif', boxShadow: 3, display: 'flex', bgcolor: 'white' }}>
            
            {/* ================= LEFT SIDEBAR (Light Grey) ================= */}
            <Box sx={{ width: '38%', bgcolor: greySidebarBg, p: 4, display: 'flex', flexDirection: 'column' }}>
                
                {/* Profile Picture (Overlapping top) */}
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4, mt: 2 }}>
                    {profileImageUrl ? (
                        <Avatar src={profileImageUrl} sx={{ width: 170, height: 170 }} />
                    ) : (
                        <Box sx={{ width: 170, height: 170, borderRadius: '50%', bgcolor: '#d0d0d0' }} />
                    )}
                </Box>

                {/* Education */}
                {safeEducation.length > 0 && (
                    <Box sx={{ mb: 2 }}>
                        <SectionHeader title="Education" />
                        {safeEducation.map((edu, idx) => (
                            <Box key={idx} sx={{ mb: 3 }}>
                                <Typography variant="body2" fontWeight="600" sx={{ color: textLight, mb: 0.5 }}>
                                    {getDisplayText(edu.year || edu.date)}
                                </Typography>
                                <Typography variant="subtitle2" fontWeight="900" sx={{ color: textDark, textTransform: 'uppercase' }}>
                                    {getDisplayText(edu.degree || edu.course)}
                                </Typography>
                                <Typography variant="subtitle2" fontWeight="900" sx={{ color: textDark, textTransform: 'uppercase', mb: 0.5 }}>
                                    {getDisplayText(edu.institute || edu.school)}
                                </Typography>
                                {edu.description && (
                                    <Typography variant="body2" sx={{ color: textLight, display: 'list-item', ml: 2 }}>
                                        {getDisplayText(edu.description)}
                                    </Typography>
                                )}
                            </Box>
                        ))}
                    </Box>
                )}

                {/* Skills */}
                {safeSkills.length > 0 && (
                    <Box sx={{ mb: 2 }}>
                        <SectionHeader title="Skills" />
                        <Box sx={{ pl: 2 }}>
                            {safeSkills.map((skill, idx) => (
                                <Typography key={idx} variant="body2" sx={{ color: textDark, fontWeight: 500, mb: 1, display: 'list-item' }}>
                                    {getDisplayText(skill)}
                                </Typography>
                            ))}
                        </Box>
                    </Box>
                )}

                {/* Languages */}
                {safeLanguages.length > 0 && (
                    <Box sx={{ mb: 2 }}>
                        <SectionHeader title="Languages" />
                        <Box sx={{ pl: 2 }}>
                            {safeLanguages.map((lang, idx) => (
                                <Typography key={idx} variant="body2" sx={{ color: textDark, fontWeight: 500, mb: 1, display: 'list-item' }}>
                                    {getDisplayText(lang)}
                                </Typography>
                            ))}
                        </Box>
                    </Box>
                )}

                {/* Contact */}
                <Box sx={{ mb: 2 }}>
                    <SectionHeader title="Contact" />
                    <Box sx={{ mt: 2 }}>
                        {displayPhone && <ContactRow icon="📞" text={displayPhone} />}
                        {displayEmail && <ContactRow icon="✉️" text={displayEmail} />}
                        {displayAddress && <ContactRow icon="📍" text={displayAddress} />}
                        {displayWebsite && <ContactRow icon="🌐" text={displayWebsite} />}
                    </Box>
                </Box>
            </Box>

            {/* ================= RIGHT MAIN CONTENT ================= */}
            <Box sx={{ width: '62%', display: 'flex', flexDirection: 'column' }}>
                
                {/* --- HEADER BOX (Dark Brown) --- */}
                <Box sx={{ bgcolor: brownHeaderBg, p: 5, pt: 7, pb: 4, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <Typography variant="h3" sx={{ color: 'white', letterSpacing: '4px', textTransform: 'uppercase', lineHeight: 1.1 }}>
                        <span style={{ fontWeight: 300 }}>{firstName}</span><br/>
                        <span style={{ fontWeight: 900 }}>{lastName}</span>
                    </Typography>
                    
                    <Typography variant="h6" sx={{ color: '#E5E5E5', textAlign: 'right', mt: 2, letterSpacing: '2px' }}>
                        {personalInfo.title}
                    </Typography>
                </Box>

                {/* --- BODY BOX (White) --- */}
                <Box sx={{ p: 5, flex: 1 }}>
                    
                    {/* Profile Info */}
                    {(personalInfo.about || personalInfo.summary) && (
                        <Box sx={{ mb: 4 }}>
                            <SectionHeader title="Profile Info" />
                            <Typography variant="body2" sx={{ color: textLight, lineHeight: 1.7, textAlign: 'justify' }}>
                                {personalInfo.about || personalInfo.summary}
                            </Typography>
                        </Box>
                    )}

                    {/* Experience Timeline */}
                    {safeExperience.length > 0 && (
                        <Box sx={{ mb: 4 }}>
                            <SectionHeader title="Experience" />
                            <Box sx={{ mt: 2 }}>
                                {safeExperience.map((exp, idx) => (
                                    <TimelineItem 
                                        key={idx}
                                        dates={getDisplayText(exp.duration || exp.date)}
                                        role={getDisplayText(exp.role || exp.position)}
                                        company={getDisplayText(exp.company || exp.organization)}
                                        description={getDisplayText(exp.description || exp.summary)}
                                        isLast={idx === safeExperience.length - 1}
                                    />
                                ))}
                            </Box>
                        </Box>
                    )}

                    {/* Achievements (2 Columns) */}
                    {safeAchievements.length > 0 && (
                        <Box>
                            <SectionHeader title="Achievement" />
                            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, mt: 2 }}>
                                {safeAchievements.map((achieve, idx) => (
                                    <Box key={idx}>
                                        <Typography variant="body2" sx={{ color: textDark, fontWeight: 900, mb: 0.5, display: 'list-item', ml: 2 }}>
                                            {typeof achieve === 'object' && achieve.date ? achieve.date : (typeof achieve === 'object' && achieve.title ? achieve.title : "Award")}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: textLight, ml: 2, lineHeight: 1.5 }}>
                                            {getDisplayText(achieve)}
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    )}
                    
                </Box>
            </Box>
        </Box>
    );
}