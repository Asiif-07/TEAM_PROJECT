import React from 'react';
import { Box, Typography } from '@mui/material';
import AdditionalSectionsBlock from "./AdditionalSectionsBlock";

const PhoneIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
);
const EmailIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
);
const LocationIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
);
const WebIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
);


const SectionTitle = ({ title }) => (
    <Typography
        variant="h6"
        fontWeight="900"
        sx={{
            letterSpacing: '5px',
            color: '#111',
            textTransform: 'uppercase',
            mb: 2,
            mt: 2,
            fontFamily: '"Times New Roman", Times, serif',
            fontSize: '1rem'
        }}
    >
        {title.split('').join(' ')}
    </Typography>
);

const ContactRow = ({ icon, text }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.8, overflow: 'hidden' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{icon}</Box>
        <Typography variant="body2" sx={{ 
            color: '#111', 
            fontWeight: 500, 
            fontSize: '0.85rem',
            whiteSpace: 'nowrap', 
            overflow: 'hidden', 
            textOverflow: 'ellipsis',
            width: '100%'
        }}>
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

    // ULTIMATE TEXT EXTRACTOR - ensures no missing data if wrapped in objects
    const getDisplayText = (item) => {
        if (!item) return "";
        if (typeof item === 'string') return item;
        
        if (typeof item === 'object') {
            const possibleKeys = ['name', 'title', 'label', 'value', 'description', 'text', 'degree', 'institute', 'role', 'company', 'url', 'link'];
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
    const displayAddress = personalInfo.address || personalInfo.location || personalInfo.city;
    const displayEmail = personalInfo.email;
    
    let displayWebsite = personalInfo.website || personalInfo.portfolio || personalInfo.linkedin;
    if (!displayWebsite && Array.isArray(personalInfo.links) && personalInfo.links.length > 0) {
        displayWebsite = personalInfo.links[0];
    }
    
    const profileImageUrl = React.useMemo(() => {
        const img = personalInfo.profileImage;
        if (!img) return null;
        if (typeof img === 'string') return img;
        if (img.secure_url) return img.secure_url;
        if (img instanceof File || img instanceof Blob) return URL.createObjectURL(img);
        return null;
    }, [personalInfo.profileImage]);

    // Clean bullet points using native lists for perfect alignment
    const renderBullets = (text) => {
        if (!text) return null;
        const bullets = text.split(/\n|•/).filter(b => b.trim() !== '');
        return (
            <Box component="ul" sx={{ m: 0, pl: 2.5, mt: 1 }}>
                {bullets.map((bullet, idx) => (
                    <Typography component="li" key={idx} variant="body2" sx={{ color: '#333', mb: 0.5, textAlign: 'justify', fontSize: '0.85rem' }}>
                        {bullet.trim()}
                    </Typography>
                ))}
            </Box>
        );
    };

    return (
        <Box className="cv-document" sx={{ minHeight: '297mm', width: '210mm', mx: 'auto', bgcolor: 'white', color: '#111', p: '12mm', boxSizing: 'border-box', '@media print': { boxShadow: 0 } }}>
            
            {/* ================= TOP SECTION ================= */}
            <Box sx={{ display: 'flex', gap: '24px', mb: '24px' }}>
                
                {/* --- TOP LEFT (Image & Contact) --- */}
                <Box sx={{ width: '32%', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    
                    {/* Profile Image (Square) */}
                    <Box sx={{ width: '100%', aspectRatio: '1/1', bgcolor: '#e8e8e8' }}>
                        {profileImageUrl ? (
                            <Box component="img" src={profileImageUrl} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Typography variant="h1" sx={{ color: '#ccc', fontWeight: 900 }}>{getDisplayText(personalInfo.name)?.charAt(0) || "U"}</Typography>
                            </Box>
                        )}
                    </Box>

                    {/* Contact Box (Bordered) */}
                    <Box sx={{ border: '2px solid #111', p: 2, flexGrow: 1, overflow: 'hidden' }}>
                        {displayPhone && <ContactRow icon={<PhoneIcon />} text={displayPhone} />}
                        {displayEmail && <ContactRow icon={<EmailIcon />} text={displayEmail} />}
                        {displayAddress && <ContactRow icon={<LocationIcon />} text={displayAddress} />}
                        {displayWebsite && <ContactRow icon={<WebIcon />} text={displayWebsite} />}
                    </Box>
                </Box>

                {/* --- TOP RIGHT (Header, Profile, Education) --- */}
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    
                    {/* Name Header Box (Bordered) */}
                    <Box sx={{ border: '2px solid #111', p: 3, textAlign: 'center', mb: 2 }}>
                        <Typography 
                            variant="h3" 
                            fontWeight="900" 
                            sx={{ 
                                color: '#111', 
                                letterSpacing: '4px', 
                                textTransform: 'uppercase', 
                                fontFamily: '"Times New Roman", Times, serif',
                                mb: 1,
                                lineHeight: 1.1,
                                wordBreak: 'break-word'
                            }}
                        >
                            {getDisplayText(personalInfo.name)}
                        </Typography>
                        <Typography 
                            variant="subtitle1" 
                            fontWeight="800"
                            sx={{ 
                                color: '#444', 
                                letterSpacing: '4px', 
                                textTransform: 'uppercase',
                                fontSize: '0.85rem',
                                wordBreak: 'break-word'
                            }}
                        >
                            {getDisplayText(personalInfo.title)}
                        </Typography>
                    </Box>

                    {/* Profile */}
                    {(personalInfo.about || personalInfo.summary) && (
                        <Box sx={{ mb: 2 }}>
                            <SectionTitle title="PROFILE" />
                            <Typography variant="body2" sx={{ color: '#333', lineHeight: 1.7, textAlign: 'justify', fontSize: '0.85rem', whiteSpace: 'pre-wrap' }}>
                                {getDisplayText(personalInfo.about || personalInfo.summary)}
                            </Typography>
                            
                            {/* HORIZONTAL LINE SEPARATOR (Matches Image) */}
                            <Box sx={{ height: '2px', bgcolor: '#111', width: '100%', mt: 3, mb: 1 }} />
                        </Box>
                    )}

                    {/* Education (2 Column Grid) - NO BORDER BOX HERE */}
                    {safeEducation.length > 0 && (
                        <Box>
                            <SectionTitle title="EDUCATION" />
                            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3 }}>
                                {safeEducation.map((edu, idx) => (
                                    <Box key={idx} sx={{ overflow: 'hidden' }}>
                                        <Typography sx={{ fontWeight: '900', fontSize: '0.85rem', color: '#111', mb: 0.5, whiteSpace: 'nowrap' }}>
                                            {getDisplayText(edu.year || edu.date)}
                                        </Typography>
                                        {/* SINGLE LINE INSTITUTE NAME */}
                                        <Typography sx={{ 
                                            fontWeight: '900', 
                                            fontSize: '0.85rem', 
                                            color: '#111', 
                                            textTransform: 'uppercase', 
                                            mb: 0.5,
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            width: '100%'
                                        }}>
                                            {getDisplayText(edu.institute || edu.school)}
                                        </Typography>
                                        <Box component="ul" sx={{ m: 0, pl: 2.5 }}>
                                            <Typography component="li" sx={{ fontSize: '0.85rem', color: '#333' }}>
                                                {getDisplayText(edu.degree || edu.course)}
                                            </Typography>
                                        </Box>
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    )}
                </Box>
            </Box>

            {/* ================= BOTTOM SECTION (Giant Bordered Box) ================= */}
            <Box sx={{ border: '2px solid #111', p: '24px 32px', display: 'flex', gap: '40px' }}>
                
                {/* --- BOTTOM LEFT (Work Experience) --- */}
                <Box sx={{ flex: '1.6' }}>
                    {safeExperience.length > 0 && (
                        <>
                            <SectionTitle title="WORK EXPERIENCE" />
                            {safeExperience.map((exp, idx) => (
                                <Box key={idx} sx={{ mb: 3 }}>
                                    <Typography sx={{ fontWeight: '900', fontSize: '0.85rem', color: '#111', textTransform: 'uppercase', mb: 0.2 }}>
                                        {getDisplayText(exp.duration || exp.date)}
                                    </Typography>
                                    <Typography sx={{ fontSize: '0.85rem', color: '#333', mb: 0.5 }}>
                                        {getDisplayText(exp.company || exp.organization)}
                                    </Typography>
                                    <Typography sx={{ fontWeight: '900', fontSize: '0.95rem', color: '#111', fontFamily: '"Times New Roman", Times, serif', mb: 1 }}>
                                        {getDisplayText(exp.role || exp.position)}
                                    </Typography>
                                    
                                    {renderBullets(getDisplayText(exp.description || exp.summary))}
                                </Box>
                            ))}
                        </>
                    )}
                </Box>

                {/* --- BOTTOM RIGHT (Skills, References, Languages) --- */}
                <Box sx={{ flex: '1', display: 'flex', flexDirection: 'column' }}>
                    
                    {/* Skills */}
                    {safeSkills.length > 0 && (
                        <Box sx={{ mb: 2 }}>
                            <SectionTitle title="SKILLS" />
                            <Box component="ul" sx={{ m: 0, pl: 2.5 }}>
                                {safeSkills.map((skill, idx) => (
                                    <Typography component="li" key={idx} sx={{ fontSize: '0.85rem', color: '#333', mb: 0.5 }}>
                                        {getDisplayText(skill)}
                                    </Typography>
                                ))}
                            </Box>
                        </Box>
                    )}

                    {/* References */}
                    {safeReferences.length > 0 && (
                        <Box sx={{ mb: 2 }}>
                            <SectionTitle title="REFERENCE" />
                            {safeReferences.map((ref, idx) => (
                                <Box key={idx} sx={{ mb: 2 }}>
                                    <Typography sx={{ fontWeight: '900', fontSize: '0.85rem', color: '#111' }}>
                                        {getDisplayText(ref.name)}
                                    </Typography>
                                    <Typography sx={{ fontSize: '0.85rem', color: '#333', mb: 0.5 }}>
                                        {getDisplayText(ref.company)} / {getDisplayText(ref.role)}
                                    </Typography>
                                    {ref.phone && (
                                        <Typography sx={{ fontSize: '0.85rem', color: '#111', fontWeight: 600 }}>
                                            Phone <span style={{ fontWeight: 'normal', color: '#333', marginLeft: 8 }}>{getDisplayText(ref.phone)}</span>
                                        </Typography>
                                    )}
                                    {ref.email && (
                                        <Typography sx={{ fontSize: '0.85rem', color: '#111', fontWeight: 600 }}>
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
                            <Box component="ul" sx={{ m: 0, pl: 2.5 }}>
                                {safeLanguages.map((lang, idx) => (
                                    <Typography component="li" key={idx} sx={{ fontSize: '0.85rem', color: '#333', mb: 0.5 }}>
                                        {getDisplayText(lang)}
                                    </Typography>
                                ))}
                            </Box>
                        </Box>
                    )}
                    
                    <Box sx={{ mt: 2 }}>
                        <AdditionalSectionsBlock sections={data?.additionalSections} accentColor="#111" />
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}