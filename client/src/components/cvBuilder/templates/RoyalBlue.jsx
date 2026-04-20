import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';

export default function RoyalBlue({ data }) {
    
    // Aggressively check for multiple possible names your form might be using
    const { 
        personalInfo = {}, 
        experience = [], 
        education = [], 
        skills = [],
        languages = [],
        references = [] 
    } = data || {};

    const royalBlue = "#1D4486"; // The deep blue from the image
    const textDark = "#333333";
    const textGrey = "#666666";

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
    const safeLanguages = parseArray(languages);
    const safeReferences = Array.isArray(references) ? references : [];

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

    // Split date string like "2028 - 2032" into top and bottom for the timeline stack
    const splitDates = (dateStr) => {
        const str = getDisplayText(dateStr);
        if (!str) return { top: '', bottom: '' };
        const parts = str.split(/-|–|—/).map(s => s.trim());
        if (parts.length >= 2) return { top: parts[0], bottom: parts[1] };
        return { top: parts[0], bottom: 'NOW' };
    };

    // Bullet Point Renderer for descriptions
    const renderBullets = (text) => {
        if (!text) return null;
        const bullets = text.split(/\n|•/).filter(b => b.trim() !== '');
        return (
            <Box sx={{ pl: 2, mt: 1 }}>
                {bullets.map((bullet, idx) => (
                    <Typography key={idx} variant="body2" sx={{ color: textGrey, mb: 0.5, display: 'list-item', textAlign: 'justify' }}>
                        {bullet.trim()}
                    </Typography>
                ))}
            </Box>
        );
    };

    // 🎨 CUSTOM TIMELINE COMPONENT
    const TimelineItem = ({ dates, title, subtitle, description, isLast }) => {
        const { top, bottom } = splitDates(dates);
        
        return (
            <Box sx={{ display: 'flex', position: 'relative' }}>
                
                {/* Left: Stacked Dates */}
                <Box sx={{ width: '60px', flexShrink: 0, textAlign: 'right', pr: 2, pt: 0.5 }}>
                    <Typography variant="caption" fontWeight="900" sx={{ color: royalBlue, display: 'block', lineHeight: 1.2 }}>{top}</Typography>
                    <Typography variant="caption" fontWeight="900" sx={{ color: royalBlue, display: 'block', lineHeight: 1.2 }}>{bottom}</Typography>
                </Box>

                {/* Middle: Vertical Line & Horizontal Notch */}
                <Box sx={{ width: '20px', position: 'relative', flexShrink: 0 }}>
                    {/* Vertical continuous line */}
                    {!isLast && (
                        <Box sx={{ position: 'absolute', top: 0, bottom: '-24px', left: '0px', borderLeft: `2px solid ${royalBlue}` }} />
                    )}
                    {isLast && (
                        <Box sx={{ position: 'absolute', top: 0, bottom: '0px', left: '0px', borderLeft: `2px solid ${royalBlue}` }} />
                    )}
                    {/* Horizontal notch branching to the content */}
                    <Box sx={{ position: 'absolute', top: '10px', left: '0px', width: '12px', borderTop: `2px solid ${royalBlue}` }} />
                </Box>

                {/* Right: Content */}
                <Box sx={{ flex: 1, pb: 4, pl: 1 }}>
                    <Typography variant="subtitle2" fontWeight="900" sx={{ color: textDark, textTransform: 'uppercase' }}>
                        {title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: royalBlue, mb: 1 }}>
                        {subtitle}
                    </Typography>
                    {renderBullets(description)}
                </Box>
            </Box>
        );
    };

    const TimelineHeader = ({ icon, title }) => (
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Box sx={{ 
                width: '32px', height: '32px', borderRadius: '50%', bgcolor: royalBlue, 
                display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white',
                fontSize: '18px', ml: '44px', zIndex: 2
            }}>
                {icon}
            </Box>
            <Typography variant="h6" fontWeight="900" sx={{ color: royalBlue, ml: 2, letterSpacing: '2px', textTransform: 'uppercase' }}>
                {title}
            </Typography>
        </Box>
    );

    const SidebarHeader = ({ title }) => (
        <Box sx={{ mb: 2, mt: 4 }}>
            <Typography variant="subtitle1" fontWeight="900" sx={{ letterSpacing: '2px', color: 'white', textTransform: 'uppercase' }}>
                {title}
            </Typography>
            <Box sx={{ width: '40px', height: '2px', bgcolor: 'white', mt: 0.5, mb: 1.5 }} />
        </Box>
    );

    return (
        <Box sx={{ minHeight: '297mm', width: '210mm', mx: 'auto', fontFamily: '"Arial", sans-serif', boxShadow: 3, display: 'flex', bgcolor: 'white' }}>
            
            {/* ================= LEFT SIDEBAR (Royal Blue) ================= */}
            <Box sx={{ width: '35%', bgcolor: royalBlue, color: 'white', p: 4 }}>
                
                {/* Profile Picture */}
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                    {profileImageUrl ? (
                        <Avatar src={profileImageUrl} sx={{ width: 150, height: 150, border: '4px solid white' }} />
                    ) : (
                        <Box sx={{ width: 150, height: 150, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.2)', border: '4px solid white' }} />
                    )}
                </Box>

                {/* Profile Info */}
                {(personalInfo.about || personalInfo.summary) && (
                    <Box>
                        <SidebarHeader title="Profile Info" />
                        <Typography variant="body2" sx={{ lineHeight: 1.6, textAlign: 'justify', color: 'rgba(255,255,255,0.9)' }}>
                            {personalInfo.about || personalInfo.summary}
                        </Typography>
                    </Box>
                )}

                {/* Skills */}
                {safeSkills.length > 0 && (
                    <Box>
                        <SidebarHeader title="Skills" />
                        <Box sx={{ pl: 2 }}>
                            {safeSkills.map((skill, idx) => (
                                <Typography key={idx} variant="body2" sx={{ mb: 1, display: 'list-item', color: 'rgba(255,255,255,0.9)' }}>
                                    {getDisplayText(skill)}
                                </Typography>
                            ))}
                        </Box>
                    </Box>
                )}

                {/* References */}
                {safeReferences.length > 0 && (
                    <Box>
                        <SidebarHeader title="Reference" />
                        {safeReferences.map((ref, idx) => (
                            <Box key={idx} sx={{ mb: 2 }}>
                                <Typography variant="subtitle2" fontWeight="bold" sx={{ color: 'white' }}>
                                    {getDisplayText(ref.name)}
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mb: 0.5 }}>
                                    {getDisplayText(ref.company)} {getDisplayText(ref.role) && `/ ${getDisplayText(ref.role)}`}
                                </Typography>
                                {ref.phone && (
                                    <Typography variant="caption" sx={{ display: 'block', color: 'rgba(255,255,255,0.9)' }}>
                                        <span style={{ fontWeight: 'bold' }}>Phone:</span> {getDisplayText(ref.phone)}
                                    </Typography>
                                )}
                                {ref.email && (
                                    <Typography variant="caption" sx={{ display: 'block', color: 'rgba(255,255,255,0.9)' }}>
                                        <span style={{ fontWeight: 'bold' }}>Email:</span> {getDisplayText(ref.email)}
                                    </Typography>
                                )}
                            </Box>
                        ))}
                    </Box>
                )}

                {/* Languages */}
                {safeLanguages.length > 0 && (
                    <Box>
                        <SidebarHeader title="Languages" />
                        <Box sx={{ pl: 2 }}>
                            {safeLanguages.map((lang, idx) => (
                                <Typography key={idx} variant="body2" sx={{ mb: 1, display: 'list-item', color: 'rgba(255,255,255,0.9)' }}>
                                    {getDisplayText(lang)}
                                </Typography>
                            ))}
                        </Box>
                    </Box>
                )}

            </Box>

            {/* ================= RIGHT MAIN CONTENT (White Theme) ================= */}
            <Box sx={{ width: '65%', p: 5, pt: 6, display: 'flex', flexDirection: 'column' }}>
                
                {/* Header: Name & Title */}
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h3" fontWeight="900" sx={{ color: royalBlue, textTransform: 'uppercase', mb: 0.5, letterSpacing: '1px' }}>
                        {personalInfo.name}
                    </Typography>
                    <Typography variant="h6" sx={{ color: textGrey, letterSpacing: '2px' }}>
                        {personalInfo.title}
                    </Typography>
                    
                    {/* Full width underline */}
                    <Box sx={{ width: '100%', height: '2px', bgcolor: royalBlue, mt: 3, mb: 2 }} />

                    {/* Inline Contact Row */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        {displayEmail && <Typography variant="caption" sx={{ color: textGrey }}>{displayEmail}</Typography>}
                        {displayEmail && displayPhone && <Typography variant="caption" sx={{ color: royalBlue }}>|</Typography>}
                        {displayPhone && <Typography variant="caption" sx={{ color: textGrey }}>{displayPhone}</Typography>}
                        {displayPhone && displayAddress && <Typography variant="caption" sx={{ color: royalBlue }}>|</Typography>}
                        {displayAddress && <Typography variant="caption" sx={{ color: textGrey }}>{displayAddress}</Typography>}
                    </Box>
                    <Box sx={{ width: '100%', height: '2px', bgcolor: royalBlue, mt: 2 }} />
                </Box>

                {/* Education Timeline */}
                {safeEducation.length > 0 && (
                    <Box sx={{ mb: 2 }}>
                        <TimelineHeader icon="🎓" title="Education" />
                        <Box>
                            {safeEducation.map((edu, idx) => (
                                <TimelineItem 
                                    key={idx}
                                    dates={getDisplayText(edu.year || edu.date)}
                                    title={getDisplayText(edu.degree || edu.course)}
                                    subtitle={getDisplayText(edu.institute || edu.school)}
                                    description={getDisplayText(edu.description || edu.summary)}
                                    isLast={idx === safeEducation.length - 1}
                                />
                            ))}
                        </Box>
                    </Box>
                )}

                {/* Experience Timeline */}
                {safeExperience.length > 0 && (
                    <Box>
                        <TimelineHeader icon="⚙️" title="Experience" />
                        <Box>
                            {safeExperience.map((exp, idx) => (
                                <TimelineItem 
                                    key={idx}
                                    dates={getDisplayText(exp.duration || exp.date)}
                                    title={getDisplayText(exp.role || exp.position)}
                                    subtitle={getDisplayText(exp.company || exp.organization)}
                                    description={getDisplayText(exp.description || exp.summary)}
                                    isLast={idx === safeExperience.length - 1}
                                />
                            ))}
                        </Box>
                    </Box>
                )}

            </Box>
        </Box>
    );
}