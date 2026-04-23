import React from "react";
import { Box, Button, Container, Paper, Typography, CircularProgress } from "@mui/material";
import { Download, RefreshCcw, Save } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
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

export default function PreviewCV({ formData, selectedTemplate, selectedCategory, setCvContent, setActiveStep, onSaveCV, isSaving }) {
 
  // Looks at the ID and Category from the URL and picks the perfect layout
  const renderTemplate = () => {
    const tId = String(selectedTemplate || "").toLowerCase();
    const tCat = String(selectedCategory || "").toLowerCase();

    if (tId === 'black-pro' || tId.includes('black-pro')) return <BlackPro data={formData} />;
    if (tId === 'black-white' || tId.includes('black-white')) return <BlackWhite data={formData} />;
    if (tId === 'monochrome-simple' || tId.includes('monochrome')) return <MonochromeSimple data={formData} />;
    if (tId === 'orange-white' || tId.includes('orange')) return <OrangeWhite data={formData} />;
    if (tId === 'royal-blue' || tId.includes('royal-blue')) return <RoyalBlue data={formData} />;
    if (tId === 'royal-brown' || tId.includes('royal-brown')) return <RoyalBrown data={formData} />;

    if (tId.includes('euro') || tCat.includes('euro')) return <EuropassTemplate data={formData} />;
    if (tId.includes('korean') || tCat.includes('korean')) return <KoreanTemplate data={formData} />;
    if (tId.includes('modern') || tCat.includes('modern')) return <ModernTemplate data={formData} />;
    if (tId.includes('minimalist') || tCat.includes('minimalist')) return <MinimalistTemplate data={formData} />;
    if (tId.includes('creative') || tCat.includes('creative')) return <CreativeTemplate data={formData} />;
    if (tId.includes('executive') || tCat.includes('executive')) return <ExecutiveTemplate data={formData} />;
    if (tId.includes('wave') || tCat.includes('wave')) return <GradientWaveTemplate data={formData} />;

    // Fallback for Classic/General
    return <ClassicTemplate data={formData} />;
  };

  return (
    <Box sx={{ py: 10, bgcolor: "#F8FAF8", minHeight: "100vh" }} className="bg-mesh">
      <Container maxWidth="md">
        
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", mb: 6, px: 2 }} className="no-print">
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <Box sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: "#10B981" }} />
              <Typography variant="caption" fontWeight="800" color="#10B981" sx={{ letterSpacing: "1px" }}>READY TO DOWNLOAD</Typography>
            </Box>
            <Typography variant="h3" fontWeight="900" color="#111827">Your Masterpiece</Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 2 }}>
            <Button variant="outlined" startIcon={<RefreshCcw size={18} />} onClick={() => { setCvContent(""); setActiveStep(0); }} sx={{ borderRadius: "16px", textTransform: "none", fontWeight: 700, px: 4, height: "56px", border: "2px solid #E5E7EB", color: "#374151" }}>
              Edit Data
            </Button>
            <Button 
              variant="contained" 
              startIcon={isSaving ? <CircularProgress size={18} color="inherit" /> : <Save size={18} />} 
              onClick={onSaveCV} 
              disabled={isSaving}
              sx={{ borderRadius: "16px", textTransform: "none", fontWeight: 700, px: 4, height: "56px", bgcolor: "#2563EB" }}
            >
              {isSaving ? "Saving..." : "Save to My CVs"}
            </Button>
            <Button variant="contained" startIcon={<Download size={18} />} onClick={() => window.print()} sx={{ borderRadius: "16px", textTransform: "none", fontWeight: 700, px: 6, height: "56px", bgcolor: "#111827" }}>
              Download as PDF
            </Button>
          </Box>
        </Box>

        {/* This Paper box acts as an exact A4 piece of paper. 
          The chosen template renders perfectly inside it! 
        */}
        <Paper className="cv-document" elevation={0} sx={{ p: 0, bgcolor: "white", minHeight: "297mm", width: "210mm", margin: "0 auto", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)", position: "relative", overflow: "hidden" }}>
          <Box sx={{ position: "relative", zIndex: 1 }}>
            {renderTemplate()}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}