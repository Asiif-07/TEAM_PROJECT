import React from "react";
import { Box, Button, Container, Paper, Typography } from "@mui/material";
import ReactMarkdown from "react-markdown";
import { Download, RefreshCcw } from "lucide-react";
import { getTemplateClassName } from "../../utils/cvBuilder/cvBuilderUtils";

export default function PreviewCV({ cvContent, selectedTemplate, setCvContent, setActiveStep }) {
  return (
    <Box sx={{ py: 10, bgcolor: "#F8FAF8", minHeight: "100vh" }} className="bg-mesh">
      <Container maxWidth="md">
        <Box
          sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", mb: 6, px: 2 }}
          className="no-print"
        >
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <Box sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: "#10B981" }} />
              <Typography
                variant="caption"
                fontWeight="800"
                color="#10B981"
                sx={{ letterSpacing: "1px" }}
              >
                READY TO DOWNLOAD
              </Typography>
            </Box>
            <Typography variant="h3" fontWeight="900" color="#111827">
              Your Masterpiece
            </Typography>
          </Box>

          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<RefreshCcw size={18} />}
              onClick={() => {
                setCvContent("");
                setActiveStep(0);
              }}
              sx={{
                borderRadius: "16px",
                textTransform: "none",
                fontWeight: 700,
                px: 4,
                height: "56px",
                border: "2px solid #E5E7EB",
                color: "#374151",
                "&:hover": { border: "2px solid #2563EB", color: "#2563EB" },
              }}
            >
              Edit Data
            </Button>

            <Button
              variant="contained"
              startIcon={<Download size={18} />}
              onClick={() => window.print()}
              sx={{
                borderRadius: "16px",
                textTransform: "none",
                fontWeight: 700,
                px: 6,
                height: "56px",
                bgcolor: "#111827",
                transition: "all 0.3s ease",
                "&:hover": {
                  bgcolor: "#1F2937",
                  transform: "translateY(-2px)",
                  boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
                },
              }}
            >
              Download as PDF
            </Button>
          </Box>
        </Box>

        <Paper
          className={`cv-document ${getTemplateClassName(selectedTemplate)}`}
          elevation={0}
          sx={{
            p: { xs: 4, sm: 10 },
            borderRadius: "4px",
            bgcolor: "white",
            minHeight: "297mm",
            width: "100%",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Premium Design Accent */}
          <Box
            sx={{
              position: "absolute",
              top: 0,
              right: 0,
              width: "300px",
              height: "300px",
              background: "radial-gradient(circle at top right, #EEF2FF 0%, transparent 70%)",
              zIndex: 0,
            }}
          />

          <Box className="prose prose-slate max-w-none cv-content" sx={{ position: "relative", zIndex: 1 }}>
            <ReactMarkdown>{cvContent}</ReactMarkdown>
          </Box>

          <Box
            sx={{
              mt: 15,
              pt: 6,
              borderTop: "1px solid #F3F4F6",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="caption" color="#9CA3AF" sx={{ letterSpacing: "2px", fontWeight: 800 }}>
              STORYLAKE AI
            </Typography>
            <Typography variant="caption" color="#9CA3AF">
              Professional Document ID: #{Math.random().toString(36).substr(2, 9).toUpperCase()}
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

