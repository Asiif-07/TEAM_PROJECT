import React from 'react';
import { Box, Typography } from '@mui/material';
import { Mail, Phone, MapPin } from 'lucide-react';
import AdditionalSectionsBlock from "./AdditionalSectionsBlock";

const SidebarSection = ({ title, children }) => (
    <Box sx={{ mb: 4 }}>
        <Typography variant="overline" sx={{ fontWeight: 900, color: 'rgba(255,255,255,0.5)', letterSpacing: '3px', fontSize: '0.62rem', display: 'block', mb: 1 }}>
            {title}
        </Typography>
        <Box sx={{ width: 28, height: 2, bgcolor: 'rgba(255,255,255,0.4)', borderRadius: 1, mb: 1.5 }} />
        {children}
    </Box>
);

const MainSection = ({ title, accentColor, children }) => (
    <Box sx={{ mb: 5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            <Typography variant="overline" sx={{ fontWeight: 900, color: '#1a1a1a', letterSpacing: '2px', fontSize: '0.72rem' }}>
                {title}
            </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0, mb: 2.5 }}>
            <Box sx={{ width: 30, height: 3, bgcolor: accentColor, borderRadius: '2px' }} />
            <Box sx={{ flex: 1, height: '1px', bgcolor: '#E5E7EB' }} />
        </Box>
        {children}
    </Box>
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

    const accentColor = "#2C3E50";

    const parseArray = (item) => {
        if (Array.isArray(item)) return item;
        if (typeof item === 'string' && item.trim() !== '') return item.split(',').map(s => s.trim());
        return [];
    };

    const getDisplayText = (item) => {
        if (!item) return "";
        if (typeof item === 'string') return item;
        if (typeof item === 'object') {
            const keys = ['name', 'title', 'label', 'value', 'certification', 'certName', 'hobby', 'interest', 'award', 'description', 'text'];
            for (let k of keys) { if (item[k]) return item[k]; }
            return Object.values(item).find(v => typeof v === 'string') || "";
        }
        return String(item);
    };

    const safeExperience = Array.isArray(experience) ? experience : [];
    const safeEducation = Array.isArray(education) ? education : [];
    const safeSkills = parseArray(skills);
    const safeLanguages = parseArray(languages);
    const safeHobbies = parseArray(hobbies.length > 0 ? hobbies : (interests.length > 0 ? interests : activities));
    const safeCertifications = parseArray(certifications.length > 0 ? certifications : (certificates.length > 0 ? certificates : awards));

    const displayPhone = personalInfo.phone || personalInfo.contactNo;
    const displayAddress = personalInfo.address || personalInfo.location;
    const displayEmail = personalInfo.email;

    const profileImageUrl = React.useMemo(() => {
        const img = personalInfo.profileImage;
        if (personalInfo.profileImagePreview) return personalInfo.profileImagePreview;
        if (!img) return null;
        if (typeof img === 'string') return img;
        if (img.secure_url) return img.secure_url;
        if (img instanceof File || img instanceof Blob) return URL.createObjectURL(img);
        return null;
    }, [personalInfo.profileImage, personalInfo.profileImagePreview]);

    return (
        <Box className="cv-document" sx={{ display: 'flex', minHeight: '297mm', width: '100%', fontFamily: '"Inter", "Helvetica", sans-serif', bgcolor: 'white', '@media print': { boxShadow: 0 } }}>
            {/* SIDEBAR */}
            <Box sx={{ width: '34%', flexShrink: 0, background: 'linear-gradient(180deg, #2C3E50 0%, #1a252f 100%)', color: 'white', p: 5, pt: 6 }}>
                {/* Profile Picture */}
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 5 }}>
                    {profileImageUrl ? (
                        <Box component="img" src={profileImageUrl} alt="Profile" sx={{
                            width: 140, height: 140, borderRadius: '50%', objectFit: 'cover',
                            border: '4px solid rgba(255,255,255,0.2)',
                            boxShadow: '0 16px 40px rgba(0,0,0,0.35)'
                        }} />
                    ) : (
                        <Box sx={{
                            width: 140, height: 140, borderRadius: '50%',
                            background: 'rgba(255,255,255,0.08)', border: '4px solid rgba(255,255,255,0.15)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 16px 40px rgba(0,0,0,0.3)'
                        }}>
                            <Typography variant="h3" sx={{ color: 'rgba(255,255,255,0.75)', fontWeight: 900 }}>
                                {personalInfo.name?.charAt(0) || "U"}
                            </Typography>
                        </Box>
                    )}
                </Box>

                {/* Contact */}
                <SidebarSection title="Contact">
                    {displayAddress && (
                        <Box sx={{ display: 'flex', gap: 1.2, mb: 1.8, alignItems: 'flex-start' }}>
                            <MapPin size={13} color="rgba(255,255,255,0.45)" strokeWidth={2} style={{ marginTop: 2, flexShrink: 0 }} />
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.82rem', lineHeight: 1.5, wordBreak: 'break-word', overflowWrap: 'break-word' }}>{displayAddress}</Typography>
                        </Box>
                    )}
                    {displayPhone && (
                        <Box sx={{ display: 'flex', gap: 1.2, mb: 1.8, alignItems: 'center' }}>
                            <Phone size={13} color="rgba(255,255,255,0.45)" strokeWidth={2} style={{ flexShrink: 0 }} />
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.82rem', wordBreak: 'break-word', overflowWrap: 'break-word' }}>{displayPhone}</Typography>
                        </Box>
                    )}
                    {displayEmail && (
                        <Box sx={{ display: 'flex', gap: 1.2, mb: 1.8, alignItems: 'center' }}>
                            <Mail size={13} color="rgba(255,255,255,0.45)" strokeWidth={2} style={{ flexShrink: 0 }} />
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.85)', wordBreak: 'break-word', overflowWrap: 'break-word', fontSize: '0.82rem' }}>{displayEmail}</Typography>
                        </Box>
                    )}
                </SidebarSection>

                {safeSkills.length > 0 && (
                    <SidebarSection title="Skills">
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
                            {safeSkills.map((skill, idx) => (
                                <Box key={idx} sx={{
                                    px: 1.5, py: 0.5, borderRadius: '6px',
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    bgcolor: 'rgba(255,255,255,0.08)',
                                    fontSize: '0.75rem', fontWeight: 600, color: 'rgba(255,255,255,0.85)'
                                }}>
                                    {getDisplayText(skill)}
                                </Box>
                            ))}
                        </Box>
                    </SidebarSection>
                )}

                {safeLanguages.length > 0 && (
                    <SidebarSection title="Languages">
                        {safeLanguages.map((lang, idx) => (
                            <Typography key={idx} variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mb: 0.5, fontSize: '0.82rem' }}>• {getDisplayText(lang)}</Typography>
                        ))}
                    </SidebarSection>
                )}

                {safeHobbies.length > 0 && (
                    <SidebarSection title="Hobbies">
                        {safeHobbies.map((h, idx) => (
                            <Typography key={idx} variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mb: 0.5, fontSize: '0.82rem' }}>• {getDisplayText(h)}</Typography>
                        ))}
                    </SidebarSection>
                )}

                {safeCertifications.length > 0 && (
                    <SidebarSection title="Certifications">
                        {safeCertifications.map((cert, idx) => (
                            <Typography key={idx} variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', mb: 0.5, fontSize: '0.82rem' }}>• {getDisplayText(cert)}</Typography>
                        ))}
                    </SidebarSection>
                )}
            </Box>

            {/* MAIN CONTENT */}
            <Box sx={{ flex: 1, color: '#111', p: 6, pt: 7 }}>
                {/* Name & Title */}
                <Box sx={{ mb: 5 }}>
                    <Typography variant="h3" fontWeight="900" sx={{ letterSpacing: '1px', textTransform: 'uppercase', color: '#111', mb: 0.5, lineHeight: 1.1, wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                        {personalInfo.name}
                    </Typography>
                    <Typography variant="h6" sx={{ color: '#555', fontWeight: 500, letterSpacing: '1px', fontSize: '0.95rem', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                        {personalInfo.title}
                    </Typography>
                    <Box sx={{ width: 40, height: 3, bgcolor: accentColor, borderRadius: 1, mt: 2 }} />
                </Box>

                {(personalInfo.about || personalInfo.summary) && (
                    <MainSection title="Profile" accentColor={accentColor}>
                        <Typography variant="body2" sx={{ lineHeight: 1.8, color: '#444', textAlign: 'justify', whiteSpace: 'pre-wrap', fontSize: '0.9rem' }}>
                            {personalInfo.about || personalInfo.summary}
                        </Typography>
                    </MainSection>
                )}

                {safeExperience.length > 0 && (
                    <MainSection title="Work Experience" accentColor={accentColor}>
                        {safeExperience.map((exp, idx) => (
                            <Box key={idx} sx={{ mb: 3.5, pl: 2, borderLeft: '2px solid #E5E7EB' }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.3 }}>
                                    <Typography variant="subtitle2" fontWeight="900" sx={{ color: '#111', wordBreak: 'break-word', overflowWrap: 'break-word', maxWidth: '70%' }}>
                                        {getDisplayText(exp.role || exp.position)}
                                    </Typography>
                                    <Typography variant="caption" fontWeight="700" sx={{ color: '#888', bgcolor: '#F3F4F6', px: 1, py: 0.3, borderRadius: 1, ml: 1, flexShrink: 0 }}>
                                        {getDisplayText(exp.duration || exp.date)}
                                    </Typography>
                                </Box>
                                <Typography variant="caption" sx={{ color: accentColor, fontWeight: 700, display: 'block', mb: 1, fontSize: '0.8rem', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                                    {getDisplayText(exp.company || exp.organization)}
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#444', lineHeight: 1.7, whiteSpace: 'pre-wrap', fontSize: '0.87rem', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                                    {getDisplayText(exp.description || exp.summary)}
                                </Typography>
                            </Box>
                        ))}
                    </MainSection>
                )}

                {safeEducation.length > 0 && (
                    <MainSection title="Education" accentColor={accentColor}>
                        {safeEducation.map((edu, idx) => (
                            <Box key={idx} sx={{ mb: 2.5 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <Typography variant="subtitle2" fontWeight="900" sx={{ color: '#111', wordBreak: 'break-word', overflowWrap: 'break-word', maxWidth: '70%' }}>
                                        {getDisplayText(edu.degree || edu.course)}
                                    </Typography>
                                    <Typography variant="caption" fontWeight="700" sx={{ color: '#888', ml: 1, flexShrink: 0 }}>
                                        {getDisplayText(edu.year || edu.date)}
                                    </Typography>
                                </Box>
                                <Typography variant="body2" sx={{ color: '#666', fontWeight: 600, mt: 0.2, fontSize: '0.87rem', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                                    {getDisplayText(edu.institute || edu.school)}
                                </Typography>
                            </Box>
                        ))}
                    </MainSection>
                )}
                <AdditionalSectionsBlock sections={data?.additionalSections} accentColor={accentColor} />
            </Box>
        </Box>
    );
}