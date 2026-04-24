import React from 'react';
import { Box, Typography, Divider } from '@mui/material';
import { Mail, Phone, Home, Linkedin } from 'lucide-react';
import AdditionalSectionsBlock from "./AdditionalSectionsBlock";

// ─── Module-level constants ───────────────────────────────────────────────────
const primaryOrange = "#E8612D";

// ─── Module-level sub-components ─────────────────────────────────────────────
function SectionBanner({ title }) {
    return (
        <Box sx={{ mb: 2.5, mt: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box sx={{ width: 5, height: 20, bgcolor: primaryOrange, borderRadius: '2px' }} />
                <Typography variant="subtitle1" fontWeight="900" sx={{ color: '#111', textTransform: 'uppercase', letterSpacing: '2.5px', fontSize: '0.78rem' }}>
                    {title}
                </Typography>
                <Divider sx={{ flex: 1, borderColor: primaryOrange, opacity: 0.25, borderBottomWidth: '2px' }} />
            </Box>
        </Box>
    );
}

function ContactIconRow({ icon: Icon, text }) {
    if (!text) return null;
    return (
        <Box sx={{ display: 'flex', gap: 1.2, alignItems: 'flex-start', mb: 1.2 }}>
            <Icon size={13} color={primaryOrange} strokeWidth={2.5} style={{ marginTop: 2, flexShrink: 0 }} />
            <Typography variant="body2" sx={{ color: '#444', fontSize: '0.8rem', wordBreak: 'break-word', overflowWrap: 'break-word', fontWeight: 500 }}>{text}</Typography>
        </Box>
    );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
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

function parseArray(item) {
    if (Array.isArray(item)) return item;
    if (typeof item === 'string' && item.trim() !== '') return item.split(',').map(s => s.trim());
    return [];
}

function renderBullets(text) {
    if (!text) return null;
    const bullets = text.split(/\n|•/).filter(b => b.trim() !== '');
    return (
        <Box sx={{ pl: 2, mt: 1, mb: 2 }}>
            {bullets.map((b, idx) => (
                <Box key={idx} sx={{ display: 'flex', gap: 1, mb: 0.8 }}>
                    <Box sx={{ width: 5, height: 5, bgcolor: primaryOrange, borderRadius: '50%', mt: '7px', flexShrink: 0 }} />
                    <Typography variant="body2" sx={{ color: '#555', lineHeight: 1.7, fontSize: '0.88rem', wordBreak: 'break-word', overflowWrap: 'break-word' }}>{b.trim()}</Typography>
                </Box>
            ))}
        </Box>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function OrangeWhite({ data }) {
    const {
        personalInfo = {},
        experience = [],
        education = [],
        skills = [],
        languages = [],
        certifications = [],
        certificates = [],
        awards = []
    } = data || {};

    const safeExperience = Array.isArray(experience) ? experience : [];
    const safeEducation = Array.isArray(education) ? education : [];
    const safeSkills = parseArray(skills);
    const safeLanguages = parseArray(languages);
    const safeCertifications = parseArray(certifications.length > 0 ? certifications : (certificates.length > 0 ? certificates : awards));

    const displayPhone = personalInfo.phone || personalInfo.contactNo;
    const displayAddress = personalInfo.address || personalInfo.location;
    const displayEmail = personalInfo.email;
    const displayLinkedin = personalInfo.website || personalInfo.portfolio || personalInfo.linkedin;

    const nameString = personalInfo.name || "";
    const nameParts = nameString.split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

    return (
        <Box className="cv-document" sx={{ minHeight: '297mm', width: '100%', fontFamily: '"Inter", "Arial", sans-serif', bgcolor: 'white', color: '#333', p: 6, pt: 7, '@media print': { boxShadow: 0 } }}>
            {/* HEADER */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 5 }}>
                <Box sx={{ flex: 1 }}>
                    <Typography variant="h2" sx={{ letterSpacing: '1.5px', mb: 0.5, textTransform: 'uppercase', lineHeight: 1.1, wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                        <span style={{ fontWeight: 300, color: '#333' }}>{firstName} </span>
                        {lastName && <span style={{ fontWeight: 900, color: primaryOrange }}>{lastName}</span>}
                    </Typography>
                    <Typography variant="h6" fontWeight="700" sx={{ color: '#666', letterSpacing: '2px', fontSize: '0.85rem', textTransform: 'uppercase', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                        {personalInfo.title}
                    </Typography>
                    <Box sx={{ width: 60, height: 3, bgcolor: primaryOrange, borderRadius: '2px', mt: 2 }} />
                </Box>

                {/* Contact Box */}
                <Box sx={{ bgcolor: '#F8F8F9', p: 3, borderBottom: `4px solid ${primaryOrange}`, minWidth: '210px', borderRadius: '4px 4px 0 0' }}>
                    <ContactIconRow icon={Home} text={displayAddress} />
                    <ContactIconRow icon={Phone} text={displayPhone} />
                    <ContactIconRow icon={Mail} text={displayEmail} />
                    <ContactIconRow icon={Linkedin} text={displayLinkedin} />
                </Box>
            </Box>

            {/* Profile Summary */}
            {(personalInfo.about || personalInfo.summary) && (
                <Typography variant="body2" sx={{ color: '#555', lineHeight: 1.8, mb: 3, fontSize: '0.9rem', whiteSpace: 'pre-wrap', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                    {personalInfo.about || personalInfo.summary}
                </Typography>
            )}

            {/* WORK EXPERIENCE */}
            {safeExperience.length > 0 && (
                <Box>
                    <SectionBanner title="Work Experience" />
                    {safeExperience.map((exp, idx) => (
                        <Box key={idx} sx={{ mb: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0.5 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Box sx={{ width: 0, height: 0, borderTop: '4px solid transparent', borderBottom: '4px solid transparent', borderLeft: `6px solid ${primaryOrange}` }} />
                                    <Typography variant="subtitle2" fontWeight="900" sx={{ color: '#222', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                                        {getDisplayText(exp.role || exp.position)}{' '}
                                        <span style={{ fontWeight: 400, color: '#888', margin: '0 4px' }}>|</span>{' '}
                                        {getDisplayText(exp.company || exp.organization)}
                                    </Typography>
                                </Box>
                                <Typography variant="caption" fontWeight="700" sx={{ color: primaryOrange, flexShrink: 0, ml: 1, wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                                    {getDisplayText(exp.duration || exp.date)}
                                </Typography>
                            </Box>
                            {renderBullets(getDisplayText(exp.description || exp.summary))}
                        </Box>
                    ))}
                </Box>
            )}

            {/* SKILLS */}
            {safeSkills.length > 0 && (
                <Box>
                    <SectionBanner title="Skills" />
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                        {safeSkills.map((skill, idx) => (
                            <Box key={idx} sx={{
                                px: 1.8, py: 0.5, borderRadius: '6px',
                                border: `1.5px solid ${primaryOrange}30`,
                                bgcolor: `${primaryOrange}08`,
                                color: '#333', fontSize: '0.8rem', fontWeight: 700,
                                transition: 'all 0.2s',
                                '&:hover': { bgcolor: primaryOrange, color: '#fff', borderColor: primaryOrange }
                            }}>
                                {getDisplayText(skill)}
                            </Box>
                        ))}
                    </Box>
                </Box>
            )}

            {/* EDUCATION */}
            {safeEducation.length > 0 && (
                <Box>
                    <SectionBanner title="Education" />
                    {safeEducation.map((edu, idx) => (
                        <Box key={idx} sx={{ mb: 2.5 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <Typography variant="subtitle2" fontWeight="900" sx={{ color: '#222', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                                    {getDisplayText(edu.degree || edu.course)}
                                </Typography>
                                <Typography variant="body2" fontWeight="700" sx={{ color: primaryOrange, ml: 1, flexShrink: 0, wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                                    {getDisplayText(edu.year || edu.date)}
                                </Typography>
                            </Box>
                            <Typography variant="body2" sx={{ color: '#666', fontSize: '0.87rem', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                                {getDisplayText(edu.institute || edu.school)}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            )}

            {/* OTHER */}
            {(safeCertifications.length > 0 || safeLanguages.length > 0) && (
                <Box>
                    <SectionBanner title="Other" />
                    <Box sx={{ display: 'flex', gap: 4 }}>
                        {safeCertifications.length > 0 && (
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="caption" fontWeight="900" sx={{ color: '#555', textTransform: 'uppercase', letterSpacing: 1, display: 'block', mb: 1 }}>Certifications</Typography>
                                {safeCertifications.map((c, i) => (
                                    <Typography key={i} variant="body2" sx={{ color: '#555', mb: 0.5, fontSize: '0.87rem', wordBreak: 'break-word', overflowWrap: 'break-word' }}>• {getDisplayText(c)}</Typography>
                                ))}
                            </Box>
                        )}
                        {safeLanguages.length > 0 && (
                            <Box sx={{ flex: 1 }}>
                                <Typography variant="caption" fontWeight="900" sx={{ color: '#555', textTransform: 'uppercase', letterSpacing: 1, display: 'block', mb: 1 }}>Languages</Typography>
                                {safeLanguages.map((l, i) => (
                                    <Typography key={i} variant="body2" sx={{ color: '#555', mb: 0.5, fontSize: '0.87rem', wordBreak: 'break-word', overflowWrap: 'break-word' }}>• {getDisplayText(l)}</Typography>
                                ))}
                            </Box>
                        )}
                    </Box>
                </Box>
            )}
            <AdditionalSectionsBlock sections={data?.additionalSections} accentColor={primaryOrange} />
        </Box>
    );
}