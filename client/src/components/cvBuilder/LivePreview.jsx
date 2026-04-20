import React from "react";
import { Box, Paper, Typography, useMediaQuery, useTheme, GlobalStyles } from "@mui/material";
import ClassicTemplate from "./templates/ClassicTemplate";
import EuropassTemplate from "./templates/EuropassTemplate";
import KoreanTemplate from "./templates/KoreanTemplate";
import ModernTemplate from "./templates/ModernTemplate";
import MinimalistTemplate from "./templates/MinimalistTemplate";
import CreativeTemplate from "./templates/CreativeTemplate";
import ExecutiveTemplate from "./templates/ExecutiveTemplate";
import GradientWaveTemplate from "./templates/GradientWaveTemplate";
import TechPremiumTemplate from "./templates/TechPremiumTemplate";

export default function LivePreview({ formData, selectedTemplate, selectedCategory }) {
    const theme = useTheme();
    const isLg = useMediaQuery(theme.breakpoints.up('lg'));
    const [scale, setScale] = React.useState(0.65); // Default to Medium

    const normalizedData = React.useMemo(() => {
        // Deep clone manually to preserve File objects (JSON.stringify strips them)
        const d = {
            ...formData,
            personalInfo: { ...(formData.personalInfo || {}) },
            experience: formData.experience ? formData.experience.map(exp => ({ ...exp })) : [],
            education: formData.education ? formData.education.map(edu => ({ ...edu })) : [],
            skills: formData.skills ? [...formData.skills] : []
        };

        const formatDate = (dateStr) => {
            if (!dateStr) return '';
            const date = new Date(dateStr);
            if (isNaN(date.getTime())) return dateStr;
            return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        };

        // Normalize experience duration
        if (d.experience) {
            d.experience = d.experience.map(exp => ({
                ...exp,
                duration: exp.duration || (exp.startDate ? `${formatDate(exp.startDate)} — ${exp.current ? 'Present' : formatDate(exp.endDate)}` : '')
            }));
        }

        // Normalize education year/duration
        if (d.education) {
            d.education = d.education.map(edu => ({
                ...edu,
                year: edu.year || (edu.startDate ? `${formatDate(edu.startDate)} — ${formatDate(edu.endDate)}` : '')
            }));
        }

        return d;
    }, [formData]);

    const renderTemplate = () => {
        const tId = String(selectedTemplate || "").toLowerCase();
        const tCat = String(selectedCategory || "").toLowerCase();

        if (tId.includes('euro') || tCat.includes('euro')) return <EuropassTemplate data={normalizedData} />;
        if (tId.includes('korean') || tCat.includes('korean')) return <KoreanTemplate data={normalizedData} />;
        if (tId.includes('modern') || tCat.includes('modern')) return <ModernTemplate data={normalizedData} />;
        if (tId.includes('minimalist') || tCat.includes('minimalist')) return <MinimalistTemplate data={normalizedData} />;
        if (tId.includes('creative') || tCat.includes('creative')) return <CreativeTemplate data={normalizedData} />;
        if (tId.includes('executive') || tCat.includes('executive')) return <ExecutiveTemplate data={normalizedData} />;
        if (tId.includes('wave') || tCat.includes('wave')) return <GradientWaveTemplate data={normalizedData} />;
        if (tId.includes('tech') || tCat.includes('tech')) return <TechPremiumTemplate data={normalizedData} />;

        return <ClassicTemplate data={normalizedData} />;
    };

    if (!isLg) return null;

    return (
        <>
            <GlobalStyles styles={{
                "@keyframes pulse": {
                    "0%": { opacity: 1, transform: "scale(1)" },
                    "50%": { opacity: 0.5, transform: "scale(1.2)" },
                    "100%": { opacity: 1, transform: "scale(1)" },
                }
            }} />
            <Box
                sx={{
                    position: "sticky",
                    top: "120px",
                    height: "calc(100vh - 120px)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    overflowY: "auto",
                    width: "auto", 
                    minWidth: "500px",
                    perspective: "1000px",
                }}
            >
                <Box sx={{ mb: 2, display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", px: 2 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#6366F1", animation: "pulse 2s infinite" }} />
                        <Typography variant="caption" fontWeight="900" sx={{ color: "#6366F1", letterSpacing: "1px", textTransform: "uppercase" }}>
                            Live Preview ({scale === 0.5 ? 'Small' : scale === 0.65 ? 'Medium' : 'Large'})
                        </Typography>
                    </Box>
                    <Box sx={{ display: "flex", bgcolor: "rgba(99, 102, 241, 0.1)", borderRadius: "20px", p: 0.5 }}>
                        {[
                            { label: "S", val: 0.5 },
                            { label: "M", val: 0.65 },
                            { label: "L", val: 0.8 }
                        ].map((s) => (
                            <Box
                                key={s.label}
                                onClick={() => setScale(s.val)}
                                sx={{
                                    px: 2,
                                    py: 0.5,
                                    borderRadius: "15px",
                                    cursor: "pointer",
                                    fontSize: "0.7rem",
                                    fontWeight: 900,
                                    transition: "all 0.2s",
                                    bgcolor: scale === s.val ? "#6366F1" : "transparent",
                                    color: scale === s.val ? "white" : "#6366F1",
                                    "&:hover": { bgcolor: scale === s.val ? "#6366F1" : "rgba(99, 102, 241, 0.2)" }
                                }}
                            >
                                {s.label}
                            </Box>
                        ))}
                    </Box>
                </Box>

                <Box
                    sx={{
                        transform: `scale(${scale})`,
                        transformOrigin: "top center",
                        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                        boxShadow: "0 50px 100px -20px rgba(0,0,0,0.25)",
                        mb: 10
                    }}
                >
                    <Paper
                        elevation={10}
                        sx={{
                            width: "210mm",
                            minHeight: "297mm",
                            bgcolor: "white",
                            overflow: "hidden",
                            borderRadius: "4px",
                        }}
                    >
                        {renderTemplate()}
                    </Paper>
                </Box>
            </Box>
        </>
    );
}
