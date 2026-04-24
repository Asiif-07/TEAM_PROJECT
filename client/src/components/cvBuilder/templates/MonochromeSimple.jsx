import React from 'react';
import { Box, Typography } from '@mui/material';
import AdditionalSectionsBlock from "./AdditionalSectionsBlock";

// 🎨 CUSTOM DESIGN COMPONENTS FOR MONOCHROME LAYOUT

// Wide letter-spaced title (e.g., "P R O F I L E")
const SectionTitle = ({ title }) => (
    <Typography
        variant="h6"
        fontWeight="900"
        sx={{
            letterSpacing: '5px',
            color: '#111',
            textTransform: 'uppercase',
            mb: 2.5,
            fontFamily: '"Times New Roman", Times, serif',
            fontSize: '0.95rem'
        }}
    >
        {title.split('').join(' ')}
    </Typography>
);

// Contact icon row
const ContactRow = ({ icon, text }) => (
    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5, mb: 1.8 }}>
        <Typography sx={{ fontSize: '14px', lineHeight: 1 }}>{icon}</Typography>
        <Typography variant="body2" sx={{ color: '#111', fontWeight: 500, wordBreak: 'break-all', mt: '1px', fontSize: '0.85rem' }}>
            {text}
        </Typography>
    </Box>
);

export default function MonochromeSimple({ data }) {
    

    const { 
        personalInfo = {}, 
        experience = [], 
        education = [], 
        skills = [],
        languages = [],
        references = [] 
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
    const safeLanguages = parseArray(languages);
    const safeReferences = Array.isArray(references) ? references : [];

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
    }, []);

    // 🎨 CUSTOM DESIGN COMPONENTS FOR MONOCHROME LAYOUT
    // Moved outside the component

    // Bullet Point Renderer for Work Experience descriptions
    const renderBullets = (text) => {
        if (!text) return null;
        // Split by newlines or existing bullet characters
        const bullets = text.split(/\n|•/).filter(b => b.trim() !== '');
        return (
            <Box sx={{ pl: 2, mt: 1 }}>
                {bullets.map((bullet, idx) => (
                    <Typography key={idx} variant="body2" sx={{ color: '#333', mb: 0.5, display: 'list-item', textAlign: 'justify', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                        {bullet.trim()}
                    </Typography>
                ))}
            </Box>
        );
    };

    return (
        <Box className="cv-document" sx={{ minHeight: '297mm', width: '210mm', mx: 'auto', bgcolor: 'white', color: '#111', p: 4, pt: 5, '@media print': { boxShadow: 0 } }}>
            
            {/* ================= TOP SECTION ================= */}
            <Box sx={{ display: 'flex', gap: 3, mb: 3 }}>
                
                {/* --- TOP LEFT (Image & Contact) --- */}
                <Box sx={{ width: '32%', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
                    
                    {/* Profile Image (Square) */}
                    <Box sx={{ width: '100%', aspectRatio: '1/1', bgcolor: '#e8e8e8', border: '2px solid #111' }}>
                        {profileImageUrl ? (
                            <Box 
                                component="img" 
                                src={profileImageUrl} 
                                sx={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                            />
                        ) : (
                            <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Typography variant="h1" sx={{ color: '#ccc', fontWeight: 900 }}>{personalInfo.name?.charAt(0) || "U"}</Typography>
                            </Box>
                        )}
                    </Box>

                    {/* Contact Box (Thick Border) */}
                    <Box sx={{ border: '3px solid #111', p: 2.5, flexGrow: 1 }}>
                        {displayPhone && <ContactRow icon="📞" text={displayPhone} />}
                        {displayEmail && <ContactRow icon="✉️" text={displayEmail} />}
                        {displayAddress && <ContactRow icon="📍" text={displayAddress} />}
                        {displayWebsite && <ContactRow icon="🌐" text={displayWebsite} />}
                    </Box>
                </Box>

                {/* --- TOP RIGHT (Header, Profile, Education) --- */}
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    
                    {/* Name Header Box (Thick Border) */}
                    <Box sx={{ border: '3px solid #111', p: 3.5, textAlign: 'center', mb: 3 }}>
                        <Typography 
                            variant="h3" 
                            fontWeight="900" 
                            sx={{ 
                                color: '#111', 
                                letterSpacing: '5px', 
                                textTransform: 'uppercase', 
                                fontFamily: '"Times New Roman", Times, serif',
                                mb: 1,
                                minHeight: '48px',
                                lineHeight: 1.1,
                                wordBreak: 'break-word',
                                overflowWrap: 'break-word'
                            }}
                        >
                            {personalInfo.name}
                        </Typography>
                        <Typography 
                            variant="subtitle1" 
                            fontWeight="800"
                            sx={{ 
                                color: '#444', 
                                letterSpacing: '6px', 
                                textTransform: 'uppercase',
                                minHeight: '28px',
                                fontSize: '0.82rem',
                                wordBreak: 'break-word',
                                overflowWrap: 'break-word'
                            }}
                        >
                            {personalInfo.title}
                        </Typography>
                    </Box>

                    {/* Profile */}
                    {(personalInfo.about || personalInfo.summary) && (
                        <Box sx={{ mb: 4 }}>
                            <SectionTitle title="PROFILE" />
                            <Typography variant="body2" sx={{ color: '#333', lineHeight: 1.75, textAlign: 'justify', fontSize: '0.9rem', whiteSpace: 'pre-wrap', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                                {personalInfo.about || personalInfo.summary}
                            </Typography>
                        </Box>
                    )}

                    {/* Education (2 Column Grid) */}
                    {safeEducation.length > 0 && (
                        <Box>
                            <SectionTitle title="EDUCATION" />
                            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
                                {safeEducation.map((edu, idx) => (
                                    <Box key={idx}>
                                        <Typography variant="subtitle2" fontWeight="900" sx={{ color: '#111', mb: 0.5, wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                                            {getDisplayText(edu.year || edu.date)}
                                        </Typography>
                                        <Typography variant="subtitle2" fontWeight="900" sx={{ color: '#111', textTransform: 'uppercase', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                                            {getDisplayText(edu.institute || edu.school)}
                                        </Typography>
                                        <Box sx={{ pl: 2, mt: 0.5 }}>
                                            <Typography variant="body2" sx={{ color: '#333', display: 'list-item', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                                                {getDisplayText(edu.degree || edu.course)}
                                            </Typography>
                                            {edu.description && (
                                                <Typography variant="body2" sx={{ color: '#333', display: 'list-item', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                                                    {getDisplayText(edu.description)}
                                                </Typography>
                                            )}
                                        </Box>
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    )}
                </Box>
            </Box>

            {/* ================= BOTTOM SECTION (Giant Bordered Box) ================= */}
            <Box sx={{ border: '3px solid #111', p: 4, display: 'flex', gap: 5 }}>
                
                {/* --- BOTTOM LEFT (Work Experience) --- */}
                <Box sx={{ flex: '1.5' }}>
                    {safeExperience.length > 0 && (
                        <>
                            <SectionTitle title="WORK EXPERIENCE" />
                            {safeExperience.map((exp, idx) => (
                                <Box key={idx} sx={{ mb: 3 }}>
                                    <Typography variant="subtitle2" fontWeight="900" sx={{ color: '#111', textTransform: 'uppercase', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                                        {getDisplayText(exp.duration || exp.date)}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#333', mb: 0.5, wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                                        {getDisplayText(exp.company || exp.organization)}
                                    </Typography>
                                    <Typography variant="subtitle1" fontWeight="900" sx={{ color: '#111', fontFamily: '"Times New Roman", Times, serif', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                                        {getDisplayText(exp.role || exp.position)}
                                    </Typography>
                                    
                                    {/* Render description as clean bullet points */}
                                    {renderBullets(getDisplayText(exp.description || exp.summary))}
                                </Box>
                            ))}
                        </>
                    )}
                </Box>

                {/* --- BOTTOM RIGHT (Skills, References, Languages) --- */}
                <Box sx={{ flex: '1', display: 'flex', flexDirection: 'column', gap: 4 }}>
                    
                    {/* Skills */}
                    {safeSkills.length > 0 && (
                        <Box>
                            <SectionTitle title="SKILLS" />
                            <Box sx={{ pl: 2 }}>
                                {safeSkills.map((skill, idx) => (
                                    <Typography key={idx} variant="body2" sx={{ color: '#333', mb: 0.5, display: 'list-item', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                                        {getDisplayText(skill)}
                                    </Typography>
                                ))}
                            </Box>
                        </Box>
                    )}

                    {/* References (If available in data) */}
                    {safeReferences.length > 0 && (
                        <Box>
                            <SectionTitle title="REFERENCE" />
                            {safeReferences.map((ref, idx) => (
                                <Box key={idx} sx={{ mb: 2 }}>
                                    <Typography variant="subtitle2" fontWeight="900" sx={{ color: '#111', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                                        {getDisplayText(ref.name)}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#333', mb: 0.5, wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                                        {getDisplayText(ref.company)} / {getDisplayText(ref.role)}
                                    </Typography>
                                    {ref.phone && (
                                        <Typography variant="body2" sx={{ color: '#111', fontWeight: 600, wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                                            Phone <span style={{ fontWeight: 'normal', color: '#333', marginLeft: 8 }}>{getDisplayText(ref.phone)}</span>
                                        </Typography>
                                    )}
                                    {ref.email && (
                                        <Typography variant="body2" sx={{ color: '#111', fontWeight: 600, wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                                            Email <span style={{ fontWeight: 'normal', color: '#333', marginLeft: 8 }}>{getDisplayText(ref.email)}</span>
                                        </Typography>
                                    )}
                                </Box>
                            ))}
                        </Box>
                    )}

                    {/* Languages */}
                    {safeLanguages.length > 0 && (
                        <Box>
                            <SectionTitle title="LANGUAGES" />
                            <Box sx={{ pl: 2 }}>
                                {safeLanguages.map((lang, idx) => (
                                    <Typography key={idx} variant="body2" sx={{ color: '#333', mb: 0.5, display: 'list-item', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                                        {getDisplayText(lang)}
                                    </Typography>
                                ))}
                            </Box>
                        </Box>
                    )}
                    <AdditionalSectionsBlock sections={data?.additionalSections} accentColor="#111827" />

                </Box>
            </Box>
        </Box>
    );
}