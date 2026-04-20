import React from "react";
import { Box, Typography, Divider, Grid, Avatar } from "@mui/material";

/**
 * Common Section Wrapper (Enhanced with Icon support)
 */
export const CVSection = ({ title, icon: Icon, children, color = "#1e293b", sx = {} }) => {
    if (!children || (Array.isArray(children) && children.length === 0)) return null;

    return (
        <Box sx={{ mb: 4, ...sx }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
                {Icon && <Icon size={20} color={color} />}
                <Typography
                    variant="subtitle1"
                    sx={{
                        fontWeight: 900,
                        textTransform: "uppercase",
                        color: color,
                        letterSpacing: "2px",
                        fontSize: "0.95rem"
                    }}
                >
                    {title}
                </Typography>
            </Box>
            <Box sx={{ width: "40px", height: "4px", bgcolor: color, borderRadius: 2, mb: 2, opacity: 0.8 }} />
            {children}
        </Box>
    );
};

/**
 * Experience Content Block
 */
export const ExperienceItem = ({ role, company, duration, description, color = "#475569" }) => {
    if (!role && !company) return null;

    return (
        <Box sx={{ mb: 3, position: "relative", pl: 3, borderLeft: `2px solid #f1f5f9` }}>
            <Box sx={{
                position: "absolute",
                left: -6,
                top: 8,
                width: 10,
                height: 10,
                borderRadius: "50%",
                bgcolor: "#fff",
                border: `2px solid ${color}`
            }} />
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 0.5 }}>
                <Typography variant="body1" sx={{ fontWeight: 800, color: "#0f172a", fontSize: "1.05rem" }}>
                    {role}
                </Typography>
                <Typography variant="caption" sx={{ fontWeight: 700, color: "#94a3b8", bgcolor: "#f8fafc", px: 1, py: 0.5, borderRadius: 1 }}>
                    {duration}
                </Typography>
            </Box>
            <Typography variant="body2" sx={{ fontWeight: 700, color: color, mb: 1.5 }}>
                {company}
            </Typography>
            {description && (
                <Typography
                    variant="body2"
                    sx={{
                        color: "#475569",
                        lineHeight: 1.7,
                        whiteSpace: "pre-line",
                        fontSize: "0.9rem"
                    }}
                >
                    {description}
                </Typography>
            )}
        </Box>
    );
};

/**
 * Education Content Block
 */
export const EducationItem = ({ degree, institute, year, color = "#64748b" }) => {
    if (!degree && !institute) return null;

    return (
        <Box sx={{ mb: 3 }}>
            <Typography variant="body1" sx={{ fontWeight: 800, color: "#0f172a" }}>
                {degree}
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 0.5 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: color }}>
                    {institute}
                </Typography>
                <Typography variant="caption" sx={{ fontWeight: 700, color: "#94a3b8" }}>
                    {year}
                </Typography>
            </Box>
        </Box>
    );
};

/**
 * Skill Display (Pill Style)
 */
export const SkillList = ({ skills, color = "#6366f1" }) => {
    if (!skills || skills.length === 0) return null;

    return (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.2 }}>
            {skills.map((skill, index) => (
                <Box
                    key={index}
                    sx={{
                        px: 2,
                        py: 0.8,
                        borderRadius: "20px",
                        bgcolor: "#f8fafc",
                        border: `1px solid #e2e8f0`,
                        color: "#334155",
                        fontSize: "0.8rem",
                        fontWeight: 700,
                        transition: "all 0.2s",
                        "&:hover": {
                            bgcolor: color,
                            color: "#fff",
                            borderColor: color,
                            transform: "translateY(-1px)"
                        }
                    }}
                >
                    {skill}
                </Box>
            ))}
        </Box>
    );
};

/**
 * Skill Display (Progress Bar Style)
 */
export const SkillProgress = ({ name, level = 80, color = "#6366f1" }) => (
    <Box sx={{ mb: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.8 }}>
            <Typography variant="caption" sx={{ fontWeight: 800, color: "#334155", textTransform: "uppercase", letterSpacing: 0.5 }}>{name}</Typography>
            <Typography variant="caption" sx={{ fontWeight: 700, color: "#94a3b8" }}>{level}%</Typography>
        </Box>
        <Box sx={{ width: "100%", height: 8, bgcolor: "#f1f5f9", borderRadius: 4, overflow: "hidden" }}>
            <Box sx={{ width: `${level}%`, height: "100%", bgcolor: color, borderRadius: 4 }} />
        </Box>
    </Box>
);

/**
 * Simple List Display
 */
export const SimpleList = ({ data, bullet = true, color = "#475569" }) => {
    if (!data) return null;

    const items = typeof data === "string" ? data.split("\n").filter(i => i.trim()) : data;
    if (!items.length) return null;

    return (
        <Box component="ul" sx={{ p: 0, m: 0, listStyle: "none" }}>
            {items.map((item, index) => (
                <Box component="li" key={index} sx={{ mb: 1, display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                    {bullet && <Box sx={{ width: 6, height: 6, bgcolor: "#cbd5e1", borderRadius: "50%", mt: 1, flexShrink: 0 }} />}
                    <Typography variant="body2" sx={{ color: color, fontSize: "0.9rem", lineHeight: 1.6 }}>
                        {item}
                    </Typography>
                </Box>
            ))}
        </Box>
    );
};

/**
 * Premium Divider
 */
export const DecorativeSeparator = ({ color = "#6366f1", height = 1 }) => (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2, my: 4 }}>
        <Box sx={{ flex: 1, height: `${height}px`, bgcolor: color, opacity: 0.15 }} />
        <Box sx={{ width: 10, height: 10, rotate: "45deg", bgcolor: color, opacity: 0.3 }} />
        <Box sx={{ flex: 1, height: `${height}px`, bgcolor: color, opacity: 0.15 }} />
    </Box>
);
