import React from 'react';
import { Box, Typography } from '@mui/material';
import { Mail, Phone, Globe, Home, Briefcase, GraduationCap } from 'lucide-react';
import AdditionalSectionsBlock from "./AdditionalSectionsBlock";

const SectionHeader = ({ title }) => (
    <Box sx={{ position: 'relative', mb: 2.5, mt: 4, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#1a1a1a', flexShrink: 0 }} />
        <Typography variant="subtitle1" fontWeight="900" sx={{ textTransform: 'uppercase', letterSpacing: '2px', color: '#1a1a1a', fontSize: '0.78rem' }}>
            {title}
        </Typography>
        <Box sx={{ flex: 1, height: '1px', bgcolor: '#e5e7eb' }} />
    </Box>
);

// eslint-disable-next-line
const ContactRow = ({ icon: IconComponent, text }) => {
    if (!text) return null;
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
            <Box sx={{
                width: 30, height: 30, borderRadius: '8px', border: '1.5px solid #333',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
            }}>
                <IconComponent size={14} color="#000" strokeWidth={2} />
            </Box>
            <Typography variant="body2" sx={{ color: '#444', fontWeight: 500, wordBreak: 'break-word', overflowWrap: 'break-word', fontSize: '0.82rem' }}>
                {text}
            </Typography>
        </Box>
    );
};

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

    const getDisplayText = (item) => {
        if (!item) return "";
        if (typeof item === 'string') return item;
        if (typeof item === 'object') {
            const keys = ['name', 'title', 'label', 'value', 'description', 'text', 'degree', 'institute', 'role', 'company'];
            for (let key of keys) { if (item[key]) return item[key]; }
            return Object.values(item).find(v => typeof v === 'string') || "";
        }
        return String(item);
    };

    const safeExperience = Array.isArray(experience) ? experience : [];
    const safeEducation = Array.isArray(education) ? education : [];
    const safeSkills = parseArray(skills);

    const profileImage = personalInfo.profileImage;
    const profileImagePreview = personalInfo.profileImagePreview;
    const [profileImageUrl, setProfileImageUrl] = React.useState(null);

    React.useEffect(() => {
        let url = null;
        if (profileImagePreview) {
            url = profileImagePreview;
        } else if (profileImage) {
            if (typeof profileImage === 'string') {
                url = profileImage;
            } else if (profileImage.secure_url) {
                url = profileImage.secure_url;
            } else if (profileImage instanceof File || profileImage instanceof Blob) {
                url = URL.createObjectURL(profileImage);
            }
        }
        setProfileImageUrl(url);
        return () => {
            if (url && url.startsWith('blob:')) URL.revokeObjectURL(url);
        };
    }, [profileImage, profileImagePreview]);

    return (
        <Box className="cv-document" sx={{ minHeight: '297mm', width: '100%', fontFamily: '"Inter", sans-serif', bgcolor: 'white', display: 'flex', flexDirection: 'column', '@media print': { boxShadow: 0 } }}>
            {/* HEADER — dark bar matching reference */}
            <Box sx={{ bgcolor: '#1a1a1a', pt: 5, pb: 4, px: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <Box>
                    <Typography variant="h3" fontWeight="900" sx={{ textTransform: 'uppercase', color: '#fff', letterSpacing: '3px', lineHeight: 1.1, wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                        {personalInfo.name}
                    </Typography>
                    <Typography variant="h6" sx={{ textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', letterSpacing: '4px', fontWeight: 400, fontSize: '0.78rem', mt: 1, wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                        {personalInfo.title}
                    </Typography>
                </Box>
                {/* Profile image or initials badge */}
                {profileImageUrl ? (
                    <Box component="img" src={profileImageUrl} sx={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,255,255,0.3)', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }} />
                ) : (
                    <Box sx={{ width: 64, height: 64, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.3)', bgcolor: 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Typography sx={{ color: '#fff', fontWeight: 900, fontSize: '1.5rem' }}>
                            {personalInfo.name?.charAt(0) || "P"}
                        </Typography>
                    </Box>
                )}
            </Box>

            {/* BODY */}
            <Box sx={{ display: 'flex', flex: 1, pt: 4, px: 6, pb: 6, gap: 5 }}>
                {/* LEFT COLUMN */}
                <Box sx={{ flex: 1.4, borderRight: '1px solid #E5E7EB', pr: 5 }}>
                    {(personalInfo.about || personalInfo.summary) && (
                        <Box>
                            <SectionHeader title="About Me" />
                            <Typography variant="body2" sx={{ color: '#444', lineHeight: 1.85, textAlign: 'justify', fontSize: '0.88rem', whiteSpace: 'pre-wrap', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                                {personalInfo.about || personalInfo.summary}
                            </Typography>
                        </Box>
                    )}

                    {safeExperience.length > 0 && (
                        <Box>
                            <SectionHeader title="Work Experience" />
                            {safeExperience.map((exp, idx) => (
                                <Box key={idx} sx={{ mb: 3.5, pl: 2.5, borderLeft: '2px solid #1a1a1a22', position: 'relative' }}>
                                    <Box sx={{ position: 'absolute', left: -5, top: 6, width: 8, height: 8, borderRadius: '50%', bgcolor: '#1a1a1a' }} />
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.3 }}>
                                        <Typography variant="body2" fontWeight="900" sx={{ color: '#1a1a1a', fontSize: '0.95rem', wordBreak: 'break-word', overflowWrap: 'break-word', maxWidth: '70%' }}>
                                            {getDisplayText(exp.role || exp.position)}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: '#1a1a1a', bgcolor: '#1a1a1a0a', px: 1.2, py: 0.4, borderRadius: '6px', ml: 1, flexShrink: 0, fontWeight: 700, fontSize: '0.72rem' }}>
                                            {getDisplayText(exp.duration || exp.date)}
                                        </Typography>
                                    </Box>
                                    <Typography variant="caption" sx={{ color: '#1a1a1a', mb: 0.8, display: 'block', fontWeight: 700, fontSize: '0.8rem', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                                        {getDisplayText(exp.company || exp.organization)}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#555', lineHeight: 1.75, fontSize: '0.87rem', whiteSpace: 'pre-wrap', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                                        {getDisplayText(exp.description || exp.summary)}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    )}
                </Box>

                {/* RIGHT COLUMN */}
                <Box sx={{ flex: 1 }}>
                    {/* Contact */}
                    <SectionHeader title="Contact" />
                    <ContactRow icon={Phone} text={personalInfo.phone || personalInfo.contactNo} />
                    <ContactRow icon={Mail} text={personalInfo.email} />
                    <ContactRow icon={Globe} text={personalInfo.linkedin || personalInfo.website} />
                    <ContactRow icon={Home} text={personalInfo.address} />

                    {/* Education */}
                    {safeEducation.length > 0 && (
                        <Box>
                            <SectionHeader title="Education" />
                            {safeEducation.map((edu, idx) => (
                                <Box key={idx} sx={{ mb: 3, pl: 2.5, borderLeft: '2px solid #1a1a1a22', position: 'relative' }}>
                                    <Box sx={{ position: 'absolute', left: -5, top: 6, width: 8, height: 8, borderRadius: '50%', bgcolor: '#1a1a1a' }} />
                                    <Typography variant="body2" fontWeight="900" sx={{ color: '#1a1a1a', textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.85rem', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                                        {getDisplayText(edu.degree || edu.course)}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#1a1a1a', mb: 0.3, fontSize: '0.82rem', fontWeight: 700, wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                                        {getDisplayText(edu.institute || edu.school)}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: '#888', fontWeight: 700 }}>
                                        {getDisplayText(edu.year || edu.date)}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    )}

                    {/* Skills */}
                    {safeSkills.length > 0 && (
                        <Box>
                            <SectionHeader title="Skills" />
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8, mt: 1 }}>
                                {safeSkills.map((skill, idx) => (
                                    <Box key={idx} sx={{
                                        px: 1.5, py: 0.5, border: '1.5px solid #1a1a1a', borderRadius: '6px',
                                        fontSize: '0.78rem', fontWeight: 700, color: '#1a1a1a',
                                        transition: 'all 0.2s',
                                        '&:hover': { bgcolor: '#1a1a1a', color: '#fff' }
                                    }}>
                                        {getDisplayText(skill)}
                                    </Box>
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