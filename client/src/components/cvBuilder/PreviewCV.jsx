import React from "react";
import { Box, Button, Container, Paper, Typography } from "@mui/material";
import { Download, RefreshCcw } from "lucide-react";
import ClassicTemplate from "./templates/ClassicTemplate";
import EuropassTemplate from "./templates/EuropassTemplate";
import KoreanTemplate from "./templates/KoreanTemplate";
import ModernTemplate from "./templates/ModernTemplate";

export default function PreviewCV({ formData, selectedTemplate, selectedCategory, setCvContent, setActiveStep }) {
 
  // Looks at the ID and Category from the URL and picks the perfect layout
  const renderTemplate = () => {
    const tId = String(selectedTemplate || "").toLowerCase();
    const tCat = String(selectedCategory || "").toLowerCase();

    if (tId.includes('euro') || tCat.includes('euro')) return <EuropassTemplate data={formData} />;
    if (tId.includes('korean') || tCat.includes('korean')) return <KoreanTemplate data={formData} />;
    if (tId.includes('modern') || tCat.includes('modern')) return <ModernTemplate data={formData} />;
    
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