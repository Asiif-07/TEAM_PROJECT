import React from 'react';
import { Box, Typography, Divider } from '@mui/material';

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

    const primaryOrange = "#F05A28"; 

    const parseArray = (item) => {
        if (Array.isArray(item)) return item;
        if (typeof item === 'string' && item.trim() !== '') return item.split(',').map(s => s.trim());
        return [];
    };


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
    const safeCertifications = parseArray(certifications.length > 0 ? certifications : (certificates.length > 0 ? certificates : awards));

    const displayPhone = personalInfo.phone || personalInfo.contactNo || personalInfo.contact;
    const displayAddress = personalInfo.address || personalInfo.location;
    const displayEmail = personalInfo.email;
    const displayWebsite = personalInfo.website || personalInfo.portfolio || personalInfo.linkedin;

    const nameString = personalInfo.name || "OLIVIA SCHWAIGER";
    const nameParts = nameString.split(' ');
    const firstName = nameParts[0];
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

    const halfSkillsLength = Math.ceil(safeSkills.length / 2);
    const skillsCol1 = safeSkills.slice(0, halfSkillsLength);
    const skillsCol2 = safeSkills.slice(halfSkillsLength);

    const SectionBanner = ({ title }) => (
        <Box sx={{ mb: 3, mt: 4 }}>
            <Typography variant="subtitle1" fontWeight="900" sx={{ color: primaryOrange, textTransform: 'uppercase', letterSpacing: '1px' }}>
                {title}
            </Typography>
            <Divider sx={{ borderColor: primaryOrange, borderWidth: '1px', opacity: 0.7, mt: 0.5 }} />
        </Box>
    );

    // Bullet Point Renderer for descriptions
    const renderBullets = (text) => {
        if (!text) return null;
        const bullets = text.split(/\n|•/).filter(b => b.trim() !== '');
        return (
            <Box sx={{ pl: 2, mt: 1.5, mb: 3 }}>
                {bullets.map((bullet, idx) => (
                    <Typography key={idx} variant="body2" sx={{ color: '#555', mb: 1, display: 'list-item', textAlign: 'justify', lineHeight: 1.7 }}>
                        {bullet.trim()}
                    </Typography>
                ))}
            </Box>
        );
    };

    return (
        <Box sx={{ minHeight: '297mm', width: '210mm', mx: 'auto', fontFamily: '"Arial", sans-serif', boxShadow: 3, bgcolor: 'white', color: '#333', p: 6 }}>
            
            {/* ================= HEADER SECTION ================= */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
                
                {/* Left: Name & Title */}
                <Box sx={{ pt: 1, flex: 1 }}>
                    <Typography variant="h2" sx={{ letterSpacing: '1px', mb: 1, textTransform: 'uppercase' }}>
                        <span style={{ fontWeight: 300, color: '#333' }}>{firstName}</span>
                        {lastName && <span style={{ fontWeight: 900, color: primaryOrange }}> {lastName}</span>}
                    </Typography>
                    <Typography variant="h6" fontWeight="800" sx={{ color: '#444' }}>
                        {personalInfo.title || "Mechanical Engineering"}
                    </Typography>
                </Box>

                {/* Right: Grey Contact Box */}
                <Box sx={{ bgcolor: '#F5F6F8', p: 3, pr: 5, borderBottom: `4px solid ${primaryOrange}`, minWidth: '220px' }}>
                    {displayAddress && <Typography variant="body2" sx={{ color: '#555', display: 'list-item', ml: 2, mb: 1 }}>{displayAddress}</Typography>}
                    {displayPhone && <Typography variant="body2" sx={{ color: '#555', display: 'list-item', ml: 2, mb: 1 }}>{displayPhone}</Typography>}
                    {displayEmail && <Typography variant="body2" sx={{ color: '#555', display: 'list-item', ml: 2, mb: 1 }}>{displayEmail}</Typography>}
                    {displayWebsite && <Typography variant="body2" sx={{ color: '#555', display: 'list-item', ml: 2 }}>{displayWebsite}</Typography>}
                </Box>
            </Box>

            {/* Profile Summary */}
            {(personalInfo.about || personalInfo.summary) && (
                <Typography variant="body2" sx={{ color: '#555', lineHeight: 1.7, textAlign: 'justify', mb: 2 }}>
                    {personalInfo.about || personalInfo.summary}
                </Typography>
            )}

            {/* ================= WORK EXPERIENCE ================= */}
            {safeExperience.length > 0 && (
                <Box>
                    <SectionBanner title="WORK EXPERIENCE" />
                    {safeExperience.map((exp, idx) => (
                        <Box key={idx}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                {/* Left side: Chevron + Role + Company */}
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    {/* Pure CSS Right-pointing Chevron */}
                                    <Box sx={{ width: 0, height: 0, borderTop: '4px solid transparent', borderBottom: '4px solid transparent', borderLeft: '6px solid #333', mr: 1.5 }} />
                                    <Typography variant="subtitle1" fontWeight="900" sx={{ color: '#333' }}>
                                        {getDisplayText(exp.role || exp.position)} <span style={{ fontWeight: 400, margin: '0 4px', color: '#777' }}>|</span> {getDisplayText(exp.company || exp.organization)}
                                    </Typography>
                                </Box>
                                {/* Right side: Orange Dates */}
                                <Typography variant="body2" fontWeight="600" sx={{ color: primaryOrange }}>
                                    {getDisplayText(exp.duration || exp.date)}
                                </Typography>
                            </Box>
                            
                            {/* Bullets */}
                            {renderBullets(getDisplayText(exp.description || exp.summary))}
                        </Box>
                    ))}
                </Box>
            )}

            {/* ================= SKILLS ================= */}
            {safeSkills.length > 0 && (
                <Box>
                    <SectionBanner title="SKILLS" />
                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4, mb: 2 }}>
                        {/* Column 1 */}
                        <Box>
                            <Typography variant="subtitle2" fontWeight="900" sx={{ mb: 1.5, color: '#111' }}>Core Skills</Typography>
                            <Box sx={{ pl: 2 }}>
                                {skillsCol1.map((skill, idx) => (
                                    <Typography key={idx} variant="body2" sx={{ color: '#555', mb: 1, display: 'list-item' }}>
                                        {getDisplayText(skill)}
                                    </Typography>
                                ))}
                            </Box>
                        </Box>
                        {/* Column 2 */}
                        <Box>
                            <Typography variant="subtitle2" fontWeight="900" sx={{ mb: 1.5, color: '#111' }}>Technical Skills</Typography>
                            <Box sx={{ pl: 2 }}>
                                {skillsCol2.map((skill, idx) => (
                                    <Typography key={idx} variant="body2" sx={{ color: '#555', mb: 1, display: 'list-item' }}>
                                        {getDisplayText(skill)}
                                    </Typography>
                                ))}
                            </Box>
                        </Box>
                    </Box>
                </Box>
            )}

            {/* ================= EDUCATION ================= */}
            {safeEducation.length > 0 && (
                <Box>
                    <SectionBanner title="EDUCATION" />
                    {safeEducation.map((edu, idx) => (
                        <Box key={idx} sx={{ mb: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0.5 }}>
                                <Typography variant="subtitle1" fontWeight="900" sx={{ color: '#333' }}>
                                    {getDisplayText(edu.degree || edu.course)}
                                </Typography>
                                <Typography variant="body2" fontWeight="600" sx={{ color: primaryOrange }}>
                                    {getDisplayText(edu.year || edu.date)}
                                </Typography>
                            </Box>
                            <Typography variant="body2" sx={{ color: '#555' }}>
                                {getDisplayText(edu.institute || edu.school)} 
                                {getDisplayText(edu.description) && ` | ${getDisplayText(edu.description)}`}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            )}

            {/* ================= OTHER (Certifications & Languages) ================= */}
            {(safeCertifications.length > 0 || safeLanguages.length > 0) && (
                <Box>
                    <SectionBanner title="OTHER" />
                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4, pl: 2 }}>
                        {safeCertifications.length > 0 && (
                            <Box>
                                <Typography variant="body2" sx={{ color: '#333', display: 'list-item', mb: 1 }}>
                                    <span style={{ fontWeight: 900 }}>Certified:</span> {safeCertifications.map(c => getDisplayText(c)).join(', ')}
                                </Typography>
                            </Box>
                        )}
                        {safeLanguages.length > 0 && (
                            <Box>
                                <Typography variant="body2" sx={{ color: '#333', display: 'list-item', mb: 1 }}>
                                    <span style={{ fontWeight: 900 }}>Languages:</span> {safeLanguages.map(l => getDisplayText(l)).join(', ')}
                                </Typography>
                            </Box>
                        )}
                    </Box>
                </Box>
            )}

        </Box>
    );
}