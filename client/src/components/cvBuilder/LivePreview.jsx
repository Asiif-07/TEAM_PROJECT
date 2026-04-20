import React from "react";
import { Box, Paper, Typography, useMediaQuery, useTheme, GlobalStyles } from "@mui/material";

import ClassicTemplate from "./templates/ClassicTemplate";
import EuropassTemplate from "./templates/EuropassTemplate";
import KoreanTemplate from "./templates/KoreanTemplate";
import ModernTemplate from "./templates/ModernTemplate";
import MinimalistTemplate from "./templates/MinimalistTemplate";
import CreativeTemplate from "./templates/CreativeTemplate";

import BlackPro from "./templates/BlackPro";
import BlackWhite from "./templates/BlackWhite";
import MonochromeSimple from "./templates/MonochromeSimple";
import OrangeWhite from "./templates/OrangeWhite";
import RoyalBlue from "./templates/RoyalBlue";
import RoyalBrown from "./templates/RoyalBrown";

export default function LivePreview({ formData, selectedTemplate, selectedCategory }) {
    const theme = useTheme();
    const isLg = useMediaQuery(theme.breakpoints.up('lg'));

    const normalizedData = React.useMemo(() => {
        const d = JSON.parse(JSON.stringify(formData));
        
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

  
        if (tId === 'black-pro' || tId.includes('black-pro')) return <BlackPro data={normalizedData} />;
        if (tId === 'black-white' || tId.includes('black-white')) return <BlackWhite data={normalizedData} />;
        if (tId === 'monochrome-simple' || tId.includes('monochrome')) return <MonochromeSimple data={normalizedData} />;
        if (tId === 'orange-white' || tId.includes('orange')) return <OrangeWhite data={normalizedData} />;
        if (tId === 'royal-blue' || tId.includes('royal-blue')) return <RoyalBlue data={normalizedData} />;
        if (tId === 'royal-brown' || tId.includes('royal-brown')) return <RoyalBrown data={normalizedData} />;

        if (tId.includes('euro') || tCat.includes('euro')) return <EuropassTemplate data={normalizedData} />;
        if (tId.includes('korean') || tCat.includes('korean')) return <KoreanTemplate data={normalizedData} />;
        if (tId.includes('modern') || tCat.includes('modern')) return <ModernTemplate data={normalizedData} />;
        if (tId.includes('minimalist') || tCat.includes('minimalist')) return <MinimalistTemplate data={normalizedData} />;
        if (tId.includes('creative') || tCat.includes('creative')) return <CreativeTemplate data={normalizedData} />;

        // Fallback default
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
                    overflow: "hidden",
                    width: "450px",
                    perspective: "1000px",
                }}
            >
                <Box sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#6366F1", animation: "pulse 2s infinite" }} />
                    <Typography variant="caption" fontWeight="900" sx={{ color: "#6366F1", letterSpacing: "1px", textTransform: "uppercase" }}>
                        Live Preview
                    </Typography>
                </Box>

                <Box
                    sx={{
                        transform: "scale(0.48)",
                        transformOrigin: "top center",
                        transition: "transform 0.3s ease",
                        boxShadow: "0 50px 100px -20px rgba(0,0,0,0.25)",
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