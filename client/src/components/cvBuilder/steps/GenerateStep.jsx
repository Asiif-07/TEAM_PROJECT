import React from "react";
import { Box, Button, CircularProgress, Grow, Typography } from "@mui/material";
import { ChevronRight, Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function GenerateStep({ generateCV, loading }) {
  const { t } = useTranslation();
  return (
    <Grow in={true}>
      <Box sx={{ textAlign: "center", py: 6 }}>
        <Box
          sx={{
            width: 80,
            height: 80,
            bgcolor: "#EFF6FF",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            mx: "auto",
            mb: 4,
            color: "#2563EB",
          }}
        >
          <Sparkles size={40} className="shimmer-fast" />
        </Box>

        <Typography variant="h4" fontWeight="900" sx={{ mb: 2, color: "#111827" }}>
          {t("Magic Ready")}
        </Typography>

        <Typography variant="body1" color="textSecondary" sx={{ mb: 6, maxWidth: "400px", mx: "auto" }}>
          {t("Magic Ready Desc")}
        </Typography>

        <Button
          variant="contained"
          onClick={generateCV}
          disabled={loading}
          sx={{
            px: 8,
            py: 2.5,
            borderRadius: "16px",
            fontSize: "1.1rem",
            fontWeight: 700,
            textTransform: "none",
            bgcolor: "#2563EB",
            boxShadow: "0 10px 15px -3px rgba(37, 99, 235, 0.4)",
            "&:hover": { bgcolor: "#1D4ED8", transform: "translateY(-2px)" },
            transition: "all 0.3s ease",
          }}
        >
          {loading ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <CircularProgress size={24} color="inherit" />
              <span>{t("AI Thinking")}</span>
            </Box>
          ) : (
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <span>{t("Generate My CV")}</span>
              <ChevronRight size={20} />
            </Box>
          )}
        </Button>
      </Box>
    </Grow>
  );
}

