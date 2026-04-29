import { Box, Button, IconButton, Paper, Typography, useMediaQuery, useTheme, GlobalStyles } from "@mui/material";
import { X } from "lucide-react";

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

export default function LivePreview({ formData, selectedTemplate, selectedCategory, ...props }) {
    const theme = useTheme();
    const isLg = useMediaQuery(theme.breakpoints.up('lg'));
    const isMobile = !isLg;
    const [scale, setScale] = React.useState(isMobile ? 0.45 : 0.65);

    const normalizedData = React.useMemo(() => {
        // Deep clone manually to preserve File objects (JSON.stringify strips them)
        const d = {
            ...formData,
            personalInfo: { ...(formData.personalInfo || {}) },
            experience: formData.experience ? formData.experience.map(exp => ({ ...exp })) : [],
            education: formData.education ? formData.education.map(edu => ({ ...edu })) : [],
            skills: formData.skills ? [...formData.skills] : []
        };
        d.customFields = formData.customFields || {};

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
                className="no-print"
                sx={{
                    position: isMobile ? "fixed" : "sticky",
                    top: isMobile ? 0 : "120px",
                    left: 0,
                    right: 0,
                    bottom: 0,
                    height: isMobile ? "100vh" : "calc(100vh - 120px)",
                    zIndex: isMobile ? 2000 : 1,
                    display: isMobile && !props.showMobilePreview ? "none" : "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    overflowY: "auto",
                    width: isMobile ? "100%" : "auto",
                    minWidth: isMobile ? "auto" : "500px",
                    perspective: "1000px",
                    bgcolor: isMobile ? "rgba(0,0,0,0.8)" : "transparent",
                    backdropFilter: isMobile ? "blur(8px)" : "none",
                    pt: isMobile ? 4 : 0
                }}
            >
                <Box sx={{ mb: 2, display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", px: 2, position: "relative" }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "#6366F1", animation: "pulse 2s infinite" }} />
                        <Typography variant="caption" fontWeight="900" sx={{ color: "#6366F1", letterSpacing: "1px", textTransform: "uppercase", fontSize: { xs: '0.65rem', lg: '0.75rem' } }}>
                            {isMobile ? 'Preview' : `Live Preview (${scale === 0.5 || scale === 0.45 ? 'Small' : scale === 0.65 || scale === 0.55 ? 'Medium' : 'Large'})`}
                        </Typography>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Box sx={{ display: "flex", bgcolor: "rgba(99, 102, 241, 0.1)", borderRadius: "20px", p: 0.5 }}>
                            {(isMobile ? [
                                { label: "S", val: 0.45 },
                                { label: "M", val: 0.55 },
                                { label: "L", val: 0.65 }
                            ] : [
                                { label: "S", val: 0.5 },
                                { label: "M", val: 0.65 },
                                { label: "L", val: 0.8 }
                            ]).map((s) => (
                                <Box
                                    key={s.label}
                                    onClick={() => setScale(s.val)}
                                    sx={{
                                        px: { xs: 1.5, lg: 2 },
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

                        {isMobile && (
                            <IconButton
                                onClick={props.onCloseMobile}
                                sx={{ color: "white", bgcolor: "rgba(255,255,255,0.1)", p: 0.8, borderRadius: "10px", "&:hover": { bgcolor: "rgba(255,255,255,0.2)" } }}
                            >
                                <X size={18} />
                            </IconButton>
                        )}
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