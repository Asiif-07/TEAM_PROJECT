import React from 'react';
import { Box, Typography, Avatar } from '@mui/material';
import { GraduationCap, Settings } from 'lucide-react';
import AdditionalSectionsBlock from "./AdditionalSectionsBlock";

// ─── Constants ───────────────────────────────────────────────────────────────
const royalBlue = "#1A3F7B";

// ─── Module-level helpers ─────────────────────────────────────────────────────
function getDisplayText(item) {
    if (!item) return "";
    if (typeof item === 'string') return item;
    if (typeof item === 'object') {
        const keys = ['name', 'title', 'label', 'value', 'description', 'text', 'degree', 'institute', 'role', 'company'];
        for (const k of keys) { if (item[k]) return item[k]; }
        return Object.values(item).find(v => typeof v === 'string') || "";
    }
    return String(item);
}

function parseArrayRB(item) {
    if (Array.isArray(item)) return item;
    if (typeof item === 'string' && item.trim() !== '') return item.split(',').map(s => s.trim());
    return [];
}

function splitDatesRB(dateStr) {
    const str = getDisplayText(dateStr);
    if (!str) return { top: '', bottom: '' };
    const parts = str.split(/-|–|—/).map(s => s.trim());
    if (parts.length >= 2) return { top: parts[0], bottom: parts[1] };
    return { top: parts[0], bottom: 'now' };
}

function renderBulletsRB(text) {
    if (!text) return null;
    const bullets = text.split(/\n|•/).filter(b => b.trim() !== '');
    return (
        <Box sx={{ mt: 0.8 }}>
            {bullets.map((b, idx) => (
                <Box key={idx} sx={{ display: 'flex', gap: 1, mb: 0.6 }}>
                    <Box sx={{ width: 5, height: 5, bgcolor: royalBlue, borderRadius: '50%', mt: '7px', flexShrink: 0, opacity: 0.7 }} />
                    <Typography variant="body2" sx={{ color: '#555', lineHeight: 1.65, fontSize: '0.87rem', wordBreak: 'break-word', overflowWrap: 'break-word' }}>{b.trim()}</Typography>
                </Box>
            ))}
        </Box>
    );
}

// ─── Module-level sub-components ─────────────────────────────────────────────
function RBSidebarHeader({ title }) {
    return (
        <Box sx={{ mb: 1.5, mt: 4 }}>
            <Typography variant="overline" sx={{ letterSpacing: '3px', color: 'rgba(255,255,255,0.55)', fontSize: '0.65rem', fontWeight: 900, display: 'block' }}>
                {title}
            </Typography>
            <Box sx={{ width: 30, height: 2, bgcolor: 'rgba(255,255,255,0.3)', borderRadius: 1, mt: 0.5 }} />
        </Box>
    );
}

// eslint-disable-next-line
function RBTimelineHeader({ icon: IconComponent, title }) {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <Box sx={{
                width: '32px', height: '32px', borderRadius: '50%', bgcolor: royalBlue,
                display: 'flex', justifyContent: 'center', alignItems: 'center',
                ml: '44px', zIndex: 2, boxShadow: `0 4px 12px ${royalBlue}44`
            }}>
                <IconComponent size={16} color="white" strokeWidth={2.5} />
            </Box>
            <Typography variant="subtitle1" fontWeight="900" sx={{ color: royalBlue, ml: 2, letterSpacing: '2px', textTransform: 'uppercase', fontSize: '0.8rem' }}>
                {title}
            </Typography>
        </Box>
    );
}

function RBTimelineItem({ dates, title, subtitle, description, isLast }) {
    const { top, bottom } = splitDatesRB(dates);
    return (
        <Box sx={{ display: 'flex', position: 'relative', mb: isLast ? 0 : 3 }}>
            <Box sx={{ width: '62px', flexShrink: 0, textAlign: 'right', pr: 2, pt: 0.5 }}>
                <Typography variant="caption" fontWeight="900" sx={{ color: royalBlue, display: 'block', lineHeight: 1.2, fontSize: '0.75rem' }}>{top}</Typography>
                <Typography variant="caption" fontWeight="700" sx={{ color: royalBlue, display: 'block', lineHeight: 1.2, opacity: 0.7, fontSize: '0.75rem' }}>{bottom}</Typography>
            </Box>
            <Box sx={{ width: '20px', position: 'relative', flexShrink: 0 }}>
                {!isLast && <Box sx={{ position: 'absolute', top: 0, bottom: '-24px', left: '0px', borderLeft: `2px solid ${royalBlue}40` }} />}
                {isLast && <Box sx={{ position: 'absolute', top: 0, bottom: '0px', left: '0px', borderLeft: `2px solid ${royalBlue}40` }} />}
                <Box sx={{ position: 'absolute', top: '8px', left: '-4px', width: 10, height: 10, borderRadius: '50%', bgcolor: royalBlue }} />
            </Box>
            <Box sx={{ flex: 1, pb: 3, pl: 1.5 }}>
                <Typography variant="subtitle2" fontWeight="900" sx={{ color: '#1a1a1a', textTransform: 'uppercase', letterSpacing: '0.5px', fontSize: '0.82rem', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                    {title}
                </Typography>
                <Typography variant="body2" sx={{ color: royalBlue, fontWeight: 700, mb: 0.5, fontSize: '0.85rem', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                    {subtitle}
                </Typography>
                {renderBulletsRB(description)}
            </Box>
        </Box>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function RoyalBlue({ data }) {
    const {
        personalInfo = {},
        experience = [],
        education = [],
        skills = [],
        languages = [],
        references = []
    } = data || {};

    const safeExperience = Array.isArray(experience) ? experience : [];
    const safeEducation = Array.isArray(education) ? education : [];
    const safeSkills = parseArrayRB(skills);
    const safeLanguages = parseArrayRB(languages);
    const safeReferences = Array.isArray(references) ? references : [];

    const displayPhone = personalInfo.phone || personalInfo.contactNo;
    const displayAddress = personalInfo.address || personalInfo.location;
    const displayEmail = personalInfo.email;

    const profileImg = personalInfo.profileImage;
    const profileImageUrl = personalInfo.profileImagePreview
        ? personalInfo.profileImagePreview
        : profileImg
            ? typeof profileImg === 'string'
                ? profileImg
                : profileImg.secure_url
                    ? profileImg.secure_url
                    : null
            : null;

    return (
        <Box className="cv-document" sx={{ minHeight: '297mm', width: '100%', fontFamily: '"Inter", "Arial", sans-serif', display: 'flex', bgcolor: 'white', '@media print': { boxShadow: 0 } }}>
            {/* SIDEBAR */}
            <Box sx={{ width: '34%', background: `linear-gradient(175deg, ${royalBlue} 0%, #0f2847 100%)`, color: 'white', p: 4, pt: 5, flexShrink: 0 }}>
                {/* Profile */}
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
                    {profileImageUrl ? (
                        <Avatar src={profileImageUrl} sx={{ width: 150, height: 150, border: '4px solid rgba(255,255,255,0.25)', boxShadow: `0 16px 40px rgba(0,0,0,0.35)` }} />
                    ) : (
                        <Box sx={{
                            width: 150, height: 150, borderRadius: '50%',
                            border: '4px solid rgba(255,255,255,0.2)', bgcolor: 'rgba(255,255,255,0.08)',
                            boxShadow: `0 16px 40px rgba(0,0,0,0.35)`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <Typography variant="h3" sx={{ color: 'rgba(255,255,255,0.8)', fontWeight: 900 }}>
                                {personalInfo.name?.charAt(0) || "U"}
                            </Typography>
                        </Box>
                    )}
                </Box>

                {/* Profile Summary */}
                {(personalInfo.about || personalInfo.summary) && (
                    <>
                        <RBSidebarHeader title="Profile" />
                        <Typography variant="body2" sx={{ lineHeight: 1.7, color: 'rgba(255,255,255,0.85)', fontSize: '0.82rem', whiteSpace: 'pre-wrap', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                            {personalInfo.about || personalInfo.summary}
                        </Typography>
                    </>
                )}

                {/* Skills */}
                {safeSkills.length > 0 && (
                    <>
                        <RBSidebarHeader title="Skills" />
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8 }}>
                            {safeSkills.map((skill, idx) => (
                                <Box key={idx} sx={{
                                    px: 1.5, py: 0.4, borderRadius: '6px',
                                    bgcolor: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)',
                                    fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.9)', wordBreak: 'break-word', overflowWrap: 'break-word'
                                }}>
                                    {getDisplayText(skill)}
                                </Box>
                            ))}
                        </Box>
                    </>
                )}

                {/* Languages */}
                {safeLanguages.length > 0 && (
                    <>
                        <RBSidebarHeader title="Languages" />
                        {safeLanguages.map((lang, idx) => (
                            <Typography key={idx} variant="body2" sx={{ mb: 0.6, color: 'rgba(255,255,255,0.85)', fontSize: '0.82rem', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                                • {getDisplayText(lang)}
                            </Typography>
                        ))}
                    </>
                )}

                {/* References */}
                {safeReferences.length > 0 && (
                    <>
                        <RBSidebarHeader title="References" />
                        {safeReferences.map((ref, idx) => (
                            <Box key={idx} sx={{ mb: 2 }}>
                                <Typography variant="body2" fontWeight="800" sx={{ color: 'white', fontSize: '0.82rem', wordBreak: 'break-word', overflowWrap: 'break-word' }}>{getDisplayText(ref.name)}</Typography>
                                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', display: 'block', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                                    {getDisplayText(ref.company)} {getDisplayText(ref.role) && `/ ${getDisplayText(ref.role)}`}
                                </Typography>
                            </Box>
                        ))}
                    </>
                )}
            </Box>

            {/* MAIN CONTENT */}
            <Box sx={{ flex: 1, p: 5, pt: 5, display: 'flex', flexDirection: 'column' }}>
                {/* Header */}
                <Box sx={{ mb: 5 }}>
                    <Typography variant="h3" fontWeight="900" sx={{ color: royalBlue, textTransform: 'uppercase', mb: 0.3, letterSpacing: '2px', lineHeight: 1.1, wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                        {personalInfo.name}
                    </Typography>
                    <Typography variant="h6" sx={{ color: '#666', letterSpacing: '3px', fontWeight: 400, fontSize: '0.82rem', textTransform: 'uppercase', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                        {personalInfo.title}
                    </Typography>
                    <Box sx={{ width: '100%', height: '2px', background: `linear-gradient(90deg, ${royalBlue}, transparent)`, mt: 2, mb: 1.5 }} />
                    <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        {displayEmail && <Typography variant="caption" sx={{ color: '#555', fontSize: '0.78rem', wordBreak: 'break-word', overflowWrap: 'break-word' }}>{displayEmail}</Typography>}
                        {displayPhone && <Typography variant="caption" sx={{ color: '#555', fontSize: '0.78rem', wordBreak: 'break-word', overflowWrap: 'break-word' }}>• {displayPhone}</Typography>}
                        {displayAddress && <Typography variant="caption" sx={{ color: '#555', fontSize: '0.78rem', wordBreak: 'break-word', overflowWrap: 'break-word' }}>• {displayAddress}</Typography>}
                    </Box>
                    <Box sx={{ width: '100%', height: '1px', bgcolor: '#E5E7EB', mt: 1.5 }} />
                </Box>

                {/* Education */}
                {safeEducation.length > 0 && (
                    <Box sx={{ mb: 3 }}>
                        <RBTimelineHeader icon={GraduationCap} title="Education" />
                        {safeEducation.map((edu, idx) => (
                            <RBTimelineItem
                                key={idx}
                                dates={getDisplayText(edu.year || edu.date)}
                                title={getDisplayText(edu.degree || edu.course)}
                                subtitle={getDisplayText(edu.institute || edu.school)}
                                description={getDisplayText(edu.description || edu.summary)}
                                isLast={idx === safeEducation.length - 1}
                            />
                        ))}
                    </Box>
                )}

                {/* Experience */}
                {safeExperience.length > 0 && (
                    <Box>
                        <RBTimelineHeader icon={Settings} title="Experience" />
                        {safeExperience.map((exp, idx) => (
                            <RBTimelineItem
                                key={idx}
                                dates={getDisplayText(exp.duration || exp.date)}
                                title={getDisplayText(exp.role || exp.position)}
                                subtitle={getDisplayText(exp.company || exp.organization)}
                                description={getDisplayText(exp.description || exp.summary)}
                                isLast={idx === safeExperience.length - 1}
                            />
                        ))}
                    </Box>
                )}
                <AdditionalSectionsBlock sections={data?.additionalSections} accentColor={royalBlue} />
            </Box>
        </Box>
    );
}