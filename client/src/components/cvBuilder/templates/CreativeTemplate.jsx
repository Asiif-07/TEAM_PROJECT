import React from 'react';
import { Box, Typography } from '@mui/material';
import { User, Briefcase, GraduationCap, Plus, Award, Wrench, Languages } from 'lucide-react';
import AdditionalSectionsBlock from "./AdditionalSectionsBlock";

const SectionIcon = ({ icon: Icon, color }) => (
    <Box sx={{ width: 28, height: 28, borderRadius: '8px', bgcolor: `${color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon size={15} color={color} strokeWidth={2.5} />
    </Box>
);

const RightHeader = ({ icon: Icon, title, mainColor }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5, mt: 4 }}>
        <SectionIcon icon={Icon} color={mainColor} />
        <Typography variant="subtitle1" fontWeight="900" sx={{ color: mainColor, textTransform: 'uppercase', letterSpacing: '1.5px', fontSize: '0.8rem' }}>{title}</Typography>
        <Box sx={{ flex: 1, height: '1px', bgcolor: mainColor, opacity: 0.2 }} />
    </Box>
);

export default function CreativeTemplate({ data }) {
    const {
        personalInfo = {},
        experience = [],
        education = [],
        skills = [],
        projects = "",
        languages = [],
        hobbies = [],
        interests = [],
        certifications = [],
        certificates = [],
        awards = [],
        achievements = []
    } = data || {};

    const mainColor = "#1B629A";

    const parseArray = (item) => {
        if (Array.isArray(item)) return item;
        if (typeof item === 'string' && item.trim() !== '') return item.split(',').map(s => s.trim());
        return [];
    };

    const getDisplayText = (item) => {
        if (!item) return "";
        if (typeof item === 'string') return item;
        if (typeof item === 'object') {
            const keys = ['name', 'title', 'label', 'value', 'certification', 'certName', 'hobby', 'interest', 'award', 'description', 'text', 'proficiency', 'authority'];
            for (let k of keys) { if (item[k]) return item[k]; }
            return Object.values(item).find(v => typeof v === 'string') || "";
        }
        return String(item);
    };

    const safeExperience = Array.isArray(experience) ? experience : [];
    const safeEducation = Array.isArray(education) ? education : [];
    const safeSkills = parseArray(skills);
    const safeLanguages = parseArray(languages);
    const safeHobbies = parseArray(hobbies.length > 0 ? hobbies : interests);
    const safeCertifications = parseArray(certifications.length > 0 ? certifications : certificates);

    const displayPhone = personalInfo.phone || personalInfo.contactNo;
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
    }, [personalInfo.profileImage, personalInfo.profileImagePreview]);

    return (
        <Box sx={{ display: 'flex', minHeight: '297mm', width: '100%', fontFamily: '"Inter", "Arial", sans-serif', bgcolor: 'white' }}>
            {/* SIDEBAR */}
            <Box sx={{
                width: '33%', flexShrink: 0,
                background: `linear-gradient(175deg, ${mainColor} 0%, #0d3d5e 100%)`,
                color: 'white', p: 4, pt: 5, display: 'flex', flexDirection: 'column'
            }}>
                {/* Avatar */}
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', mb: 4 }}>
                    {profileImageUrl ? (
                        <Box component="img" src={profileImageUrl} sx={{
                            width: 140, height: 140, borderRadius: '50%', objectFit: 'cover', mb: 2,
                            border: '4px solid rgba(255,255,255,0.3)',
                            boxShadow: '0 16px 40px rgba(0,0,0,0.3)'
                        }} />
                    ) : (
                        <Box sx={{
                            width: 140, height: 140, borderRadius: '50%', mb: 2,
                            background: 'rgba(255,255,255,0.1)', border: '4px solid rgba(255,255,255,0.25)',
                            boxShadow: '0 16px 40px rgba(0,0,0,0.25)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <Typography variant="h3" sx={{ color: 'rgba(255,255,255,0.85)', fontWeight: 900 }}>
                                {personalInfo.name?.charAt(0) || "U"}
                            </Typography>
                        </Box>
                    )}
                    <Typography variant="h5" fontWeight="900" sx={{ mb: 0.5, lineHeight: 1.2, letterSpacing: '0.5px', wordBreak: 'break-word', overflowWrap: 'break-word' }}>{personalInfo.name}</Typography>
                    <Typography variant="body2" sx={{ opacity: 0.8, fontWeight: 500, letterSpacing: '1px', textTransform: 'uppercase', fontSize: '0.78rem', wordBreak: 'break-word', overflowWrap: 'break-word' }}>{personalInfo.title}</Typography>
                    <Box sx={{ width: 40, height: 2, bgcolor: 'rgba(255,255,255,0.35)', mt: 2.5 }} />
                </Box>

                {/* Details */}
                <Box sx={{ mb: 4 }}>
                    <Typography variant="overline" sx={{ fontWeight: 900, opacity: 0.7, letterSpacing: 2, fontSize: '0.65rem' }}>Details</Typography>
                    <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 0.8 }}>
                        {displayAddress && <Typography variant="body2" sx={{ opacity: 0.9, fontSize: '0.82rem', wordBreak: 'break-word', overflowWrap: 'break-word' }}>{displayAddress}</Typography>}
                        {displayPhone && <Typography variant="body2" sx={{ opacity: 0.9, fontSize: '0.82rem', wordBreak: 'break-word', overflowWrap: 'break-word' }}>{displayPhone}</Typography>}
                        {displayEmail && <Typography variant="body2" sx={{ opacity: 0.9, wordBreak: 'break-word', overflowWrap: 'break-word', fontSize: '0.82rem' }}>{displayEmail}</Typography>}
                        {displayLinkedin && <Typography variant="body2" sx={{ opacity: 0.9, wordBreak: 'break-word', overflowWrap: 'break-word', fontSize: '0.82rem' }}>{displayLinkedin}</Typography>}
                    </Box>
                </Box>

                {/* Skills */}
                {safeSkills.length > 0 && (
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="overline" sx={{ fontWeight: 900, opacity: 0.7, letterSpacing: 2, fontSize: '0.65rem' }}>Skills</Typography>
                        <Box sx={{ mt: 1.5, display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
                            {safeSkills.map((skill, idx) => (
                                <Box key={idx} sx={{
                                    px: 1.5, py: 0.5, borderRadius: '6px',
                                    bgcolor: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)',
                                    fontSize: '0.75rem', fontWeight: 700
                                }}>
                                    {getDisplayText(skill)}
                                </Box>
                            ))}
                        </Box>
                    </Box>
                )}

                {/* Languages */}
                {safeLanguages.length > 0 && (
                    <Box sx={{ mb: 4 }}>
                        <Typography variant="overline" sx={{ fontWeight: 900, opacity: 0.7, letterSpacing: 2, fontSize: '0.65rem' }}>Languages</Typography>
                        <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
                            {safeLanguages.map((lang, idx) => (
                                <Typography key={idx} variant="body2" sx={{ opacity: 0.9, fontSize: '0.82rem', wordBreak: 'break-word', overflowWrap: 'break-word' }}>{getDisplayText(lang)}</Typography>
                            ))}
                        </Box>
                    </Box>
                )}

                {/* Hobbies */}
                {safeHobbies.length > 0 && (
                    <Box>
                        <Typography variant="overline" sx={{ fontWeight: 900, opacity: 0.7, letterSpacing: 2, fontSize: '0.65rem' }}>Hobbies</Typography>
                        <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                            {safeHobbies.map((h, idx) => (
                                <Typography key={idx} variant="body2" sx={{ opacity: 0.9, fontSize: '0.82rem', wordBreak: 'break-word', overflowWrap: 'break-word' }}>• {getDisplayText(h)}</Typography>
                            ))}
                        </Box>
                    </Box>
                )}
            </Box>

            {/* MAIN CONTENT */}
            <Box sx={{ flex: 1, color: '#1a1a1a', p: 5, pt: 4 }}>
                {(personalInfo.about || personalInfo.summary) && (
                    <>
                        <RightHeader icon={User} title="Profile" mainColor={mainColor} />
                        <Typography variant="body2" sx={{ lineHeight: 1.75, textAlign: 'justify', whiteSpace: 'pre-wrap', color: '#374151', fontSize: '0.9rem', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                            {personalInfo.about || personalInfo.summary}
                        </Typography>
                    </>
                )}

                {safeExperience.length > 0 && (
                    <>
                        <RightHeader icon={Briefcase} title="Experience" mainColor={mainColor} />
                        {safeExperience.map((exp, idx) => (
                            <Box key={idx} sx={{ mb: 3, pl: 2, borderLeft: `2px solid ${mainColor}22` }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.3 }}>
                                    <Typography variant="subtitle2" fontWeight="900" sx={{ color: '#111', wordBreak: 'break-word', overflowWrap: 'break-word', maxWidth: '70%' }}>
                                        {getDisplayText(exp.role || exp.position)}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: mainColor, fontWeight: 700, bgcolor: `${mainColor}12`, px: 1, py: 0.3, borderRadius: 1, ml: 1, flexShrink: 0 }}>
                                        {getDisplayText(exp.duration || exp.date)}
                                    </Typography>
                                </Box>
                                <Typography variant="caption" sx={{ color: mainColor, fontWeight: 700, display: 'block', mb: 0.8, wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                                    {getDisplayText(exp.company || exp.organization)}
                                </Typography>
                                <Typography variant="body2" sx={{ lineHeight: 1.65, color: '#555', fontSize: '0.87rem', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                                    {getDisplayText(exp.description || exp.summary)}
                                </Typography>
                            </Box>
                        ))}
                    </>
                )}

                {safeEducation.length > 0 && (
                    <>
                        <RightHeader icon={GraduationCap} title="Education" mainColor={mainColor} />
                        {safeEducation.map((edu, idx) => (
                            <Box key={idx} sx={{ mb: 2.5 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <Typography variant="subtitle2" fontWeight="900" sx={{ wordBreak: 'break-word', overflowWrap: 'break-word', maxWidth: '70%' }}>{getDisplayText(edu.degree || edu.course)}</Typography>
                                    <Typography variant="caption" sx={{ color: '#888', ml: 1, flexShrink: 0 }}>{getDisplayText(edu.year || edu.date)}</Typography>
                                </Box>
                                <Typography variant="body2" sx={{ color: mainColor, fontWeight: 600, wordBreak: 'break-word', overflowWrap: 'break-word' }}>{getDisplayText(edu.institute || edu.school)}</Typography>
                            </Box>
                        ))}
                    </>
                )}

                {projects && String(projects).trim() && (
                    <>
                        <RightHeader icon={Award} title="Projects" mainColor={mainColor} />
                        {String(projects).split("\n").filter(p => p.trim()).map((project, idx) => (
                            <Typography key={idx} variant="body2" sx={{ mb: 1, color: '#374151', fontSize: '0.88rem', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                                • {project.trim()}
                            </Typography>
                        ))}
                    </>
                )}

                {safeCertifications.length > 0 && (
                    <>
                        <RightHeader icon={Plus} title="Certifications" mainColor={mainColor} />
                        {safeCertifications.map((cert, idx) => (
                            <Box key={idx} sx={{ mb: 1.5 }}>
                                <Typography variant="body2" fontWeight="700" sx={{ color: '#111', wordBreak: 'break-word', overflowWrap: 'break-word' }}>{getDisplayText(cert)}</Typography>
                            </Box>
                        ))}
                    </>
                )}
                <AdditionalSectionsBlock sections={data?.additionalSections} accentColor={mainColor} />
            </Box>
        </Box>
    );
}