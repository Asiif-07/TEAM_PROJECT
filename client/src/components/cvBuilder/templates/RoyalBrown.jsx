import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import { Phone, Mail, MapPin, Globe } from 'lucide-react';
import AdditionalSectionsBlock from "./AdditionalSectionsBlock";

// ─── Constants ───────────────────────────────────────────────────────────────
const brownHeaderBg = "#5C4F46";
const greySidebarBg = "#EFEFED";
const textDark = "#2a2a2a";
const textLight = "#666666";

// ─── Module-level helpers ─────────────────────────────────────────────────────
function getDisplayTextBR(item) {
    if (!item) return "";
    if (typeof item === 'string') return item;
    if (typeof item === 'object') {
        const possibleKeys = ['name', 'title', 'label', 'value', 'description', 'text', 'degree', 'institute', 'role', 'company', 'award'];
        for (const key of possibleKeys) {
            if (item[key]) return item[key];
        }
        const fallbackString = Object.values(item).find(v => typeof v === 'string');
        if (fallbackString) return fallbackString;
        return "";
    }
    return String(item);
}

function parseArrayBR(item) {
    if (Array.isArray(item)) return item;
    if (typeof item === 'string' && item.trim() !== '') return item.split(',').map(s => s.trim());
    return [];
}

// ─── Module-level sub-components ─────────────────────────────────────────────
function BRSectionHeader({ title }) {
    return (
        <Box sx={{ mb: 2, mt: 3.5 }}>
            <Typography variant="overline" sx={{ color: textLight, fontWeight: 900, letterSpacing: '2.5px', fontSize: '0.65rem', display: 'block' }}>
                {title}
            </Typography>
            <Box sx={{ width: 26, height: 2, bgcolor: brownHeaderBg, borderRadius: 1, mt: 0.5 }} />
        </Box>
    );
}

function BRContactRow({ icon: Icon, text }) {
    if (!text) return null;
    return (
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.2, mb: 1.8 }}>
            <Box sx={{ width: 24, height: 24, borderRadius: '6px', bgcolor: `${brownHeaderBg}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, mt: '1px' }}>
                <Icon size={12} color={brownHeaderBg} strokeWidth={2.5} />
            </Box>
            <Typography variant="body2" sx={{ color: textDark, fontWeight: 500, wordBreak: 'break-word', overflowWrap: 'break-word', fontSize: '0.82rem', lineHeight: 1.5 }}>
                {text}
            </Typography>
        </Box>
    );
}

function BRTimelineItem({ dates, role, company, description, isLast }) {
    return (
        <Box sx={{ display: 'flex', position: 'relative', mb: 3 }}>
            <Box sx={{ width: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', mr: 2, flexShrink: 0 }}>
                <Box sx={{ width: '12px', height: '12px', borderRadius: '50%', bgcolor: brownHeaderBg, zIndex: 2, mt: 0.5, boxShadow: `0 0 0 3px ${brownHeaderBg}22` }} />
                {!isLast && (
                    <Box sx={{ position: 'absolute', top: '16px', bottom: '-16px', left: '7px', width: '2px', bgcolor: '#ddd', zIndex: 1 }} />
                )}
            </Box>
            <Box sx={{ flex: 1, pb: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5 }}>
                    <Typography variant="subtitle2" fontWeight="900" sx={{ color: textDark, textTransform: 'uppercase', fontSize: '0.82rem', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                        {role}
                    </Typography>
                    <Typography variant="caption" sx={{ color: brownHeaderBg, fontWeight: 700, bgcolor: `${brownHeaderBg}12`, px: 1, py: 0.3, borderRadius: 1, ml: 1, flexShrink: 0 }}>
                        {dates}
                    </Typography>
                </Box>
                <Typography variant="body2" fontWeight="700" sx={{ color: brownHeaderBg, mb: 1, fontSize: '0.85rem', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                    {company}
                </Typography>
                <Typography variant="body2" sx={{ color: textLight, lineHeight: 1.6, fontSize: '0.87rem', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                    {description}
                </Typography>
            </Box>
        </Box>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function RoyalBrown({ data }) {
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

    const safeExperience = Array.isArray(experience) ? experience : [];
    const safeEducation = Array.isArray(education) ? education : [];
    const safeSkills = parseArrayBR(skills);
    const safeLanguages = parseArrayBR(languages);
    const safeAchievements = parseArrayBR(achievements.length > 0 ? achievements : (awards.length > 0 ? awards : certifications));

    const displayPhone = personalInfo.phone || personalInfo.contactNo || personalInfo.contact;
    const displayAddress = personalInfo.address || personalInfo.location;
    const displayEmail = personalInfo.email;
    const displayWebsite = personalInfo.website || personalInfo.portfolio || personalInfo.linkedin;

    const profileImg = personalInfo.profileImage;
    const profileImageUrl = typeof profileImg === 'string'
        ? profileImg
        : profileImg?.secure_url
            ? profileImg.secure_url
            : null;

    const nameString = personalInfo.name || "";
    const nameParts = nameString.split(' ');
    const firstName = nameParts[0] || "";
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : "";

    return (
        <Box className="cv-document" sx={{ minHeight: '297mm', width: '210mm', mx: 'auto', fontFamily: '"Inter", "Arial", sans-serif', display: 'flex', bgcolor: 'white', '@media print': { boxShadow: 0 } }}>
            {/* SIDEBAR */}
            <Box sx={{ width: '38%', bgcolor: greySidebarBg, p: 4, pt: 5, display: 'flex', flexDirection: 'column' }}>
                {/* Profile Picture */}
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 5, mt: 2 }}>
                    {profileImageUrl ? (
                        <Avatar src={profileImageUrl} sx={{ width: 160, height: 160, border: `4px solid ${brownHeaderBg}30`, boxShadow: '0 12px 32px rgba(0,0,0,0.12)' }} />
                    ) : (
                        <Box sx={{ width: 160, height: 160, borderRadius: '50%', bgcolor: '#d5d0cc', border: `4px solid ${brownHeaderBg}30`, boxShadow: '0 12px 32px rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Typography variant="h3" sx={{ color: '#fff', fontWeight: 900 }}>{personalInfo.name?.charAt(0) || 'U'}</Typography>
                        </Box>
                    )}
                </Box>

                {/* Education */}
                {safeEducation.length > 0 && (
                    <Box sx={{ mb: 2 }}>
                        <BRSectionHeader title="Education" />
                        {safeEducation.map((edu, idx) => (
                            <Box key={idx} sx={{ mb: 3 }}>
                                <Typography variant="caption" fontWeight="700" sx={{ color: brownHeaderBg, display: 'block', mb: 0.3, wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                                    {getDisplayTextBR(edu.year || edu.date)}
                                </Typography>
                                <Typography variant="subtitle2" fontWeight="900" sx={{ color: textDark, textTransform: 'uppercase', fontSize: '0.82rem', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                                    {getDisplayTextBR(edu.degree || edu.course)}
                                </Typography>
                                <Typography variant="body2" sx={{ color: textLight, mt: 0.2, fontSize: '0.82rem', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                                    {getDisplayTextBR(edu.institute || edu.school)}
                                </Typography>
                                {edu.description && (
                                    <Typography variant="body2" sx={{ color: textLight, display: 'list-item', ml: 2, fontSize: '0.82rem', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                                        {getDisplayTextBR(edu.description)}
                                    </Typography>
                                )}
                            </Box>
                        ))}
                    </Box>
                )}

                {/* Skills */}
                {safeSkills.length > 0 && (
                    <Box sx={{ mb: 2 }}>
                        <BRSectionHeader title="Skills" />
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8, mt: 0.5 }}>
                            {safeSkills.map((skill, idx) => (
                                <Box key={idx} sx={{
                                    px: 1.5, py: 0.4, borderRadius: '6px',
                                    bgcolor: `${brownHeaderBg}18`, border: `1px solid ${brownHeaderBg}30`,
                                    fontSize: '0.75rem', fontWeight: 700, color: textDark
                                }}>
                                    {getDisplayTextBR(skill)}
                                </Box>
                            ))}
                        </Box>
                    </Box>
                )}

                {/* Languages */}
                {safeLanguages.length > 0 && (
                    <Box sx={{ mb: 2 }}>
                        <BRSectionHeader title="Languages" />
                        <Box sx={{ pl: 2 }}>
                            {safeLanguages.map((lang, idx) => (
                                <Typography key={idx} variant="body2" sx={{ color: textDark, fontWeight: 500, mb: 0.8, fontSize: '0.82rem' }}>
                                    • {getDisplayTextBR(lang)}
                                </Typography>
                            ))}
                        </Box>
                    </Box>
                )}

                {/* Contact */}
                <Box sx={{ mb: 2 }}>
                    <BRSectionHeader title="Contact" />
                    <Box sx={{ mt: 1 }}>
                        <BRContactRow icon={Phone} text={displayPhone} />
                        <BRContactRow icon={Mail} text={displayEmail} />
                        <BRContactRow icon={MapPin} text={displayAddress} />
                        <BRContactRow icon={Globe} text={displayWebsite} />
                    </Box>
                </Box>
            </Box>

            {/* MAIN CONTENT */}
            <Box sx={{ width: '62%', display: 'flex', flexDirection: 'column' }}>
                {/* HEADER BOX */}
                <Box sx={{ bgcolor: brownHeaderBg, p: 5, pt: 7, pb: 5, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <Typography variant="h3" sx={{ color: 'white', letterSpacing: '4px', textTransform: 'uppercase', lineHeight: 1.1, wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                        <span style={{ fontWeight: 300 }}>{firstName}</span><br />
                        <span style={{ fontWeight: 900 }}>{lastName}</span>
                    </Typography>
                    <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.7)', textAlign: 'right', mt: 2, letterSpacing: '3px', fontWeight: 300, fontSize: '0.85rem', textTransform: 'uppercase', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                        {personalInfo.title}
                    </Typography>
                </Box>

                {/* BODY */}
                <Box sx={{ p: 5, flex: 1 }}>
                    {(personalInfo.about || personalInfo.summary) && (
                        <Box sx={{ mb: 4 }}>
                            <BRSectionHeader title="Profile Info" />
                            <Typography variant="body2" sx={{ color: textLight, lineHeight: 1.8, textAlign: 'justify', fontSize: '0.87rem', whiteSpace: 'pre-wrap', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                                {personalInfo.about || personalInfo.summary}
                            </Typography>
                        </Box>
                    )}

                    {safeExperience.length > 0 && (
                        <Box sx={{ mb: 4 }}>
                            <BRSectionHeader title="Experience" />
                            <Box sx={{ mt: 2 }}>
                                {safeExperience.map((exp, idx) => (
                                    <BRTimelineItem
                                        key={idx}
                                        dates={getDisplayTextBR(exp.duration || exp.date)}
                                        role={getDisplayTextBR(exp.role || exp.position)}
                                        company={getDisplayTextBR(exp.company || exp.organization)}
                                        description={getDisplayTextBR(exp.description || exp.summary)}
                                        isLast={idx === safeExperience.length - 1}
                                    />
                                ))}
                            </Box>
                        </Box>
                    )}

                    {safeAchievements.length > 0 && (
                        <Box>
                            <BRSectionHeader title="Achievement" />
                            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, mt: 2 }}>
                                {safeAchievements.map((achieve, idx) => (
                                    <Box key={idx}>
                                        <Typography variant="body2" fontWeight="900" sx={{ color: brownHeaderBg, mb: 0.5, fontSize: '0.82rem', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                                            {typeof achieve === 'object' && achieve.title ? achieve.title : "Achievement"}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: textLight, lineHeight: 1.5, fontSize: '0.82rem', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                                            {getDisplayTextBR(achieve)}
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    )}
                    <AdditionalSectionsBlock sections={data?.additionalSections} accentColor={brownHeaderBg} />
                </Box>
            </Box>
        </Box>
    );
}