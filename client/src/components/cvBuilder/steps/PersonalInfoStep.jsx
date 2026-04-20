import React, { useState, useMemo } from "react";
import toast from "react-hot-toast";
import { Box, Grow, Typography, Button, CircularProgress } from "@mui/material";
import { Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import PremiumInput from "../PremiumInput";
import { useAuth } from "../../../context/AuthContext";
import * as aiApi from "../../../api/ai";
import { getTemplateConfig } from "../../../utils/cvBuilder/templateConfig";

export default function PersonalInfoStep({ formData, handleChange, selectedTemplate, handleMagicImport, isExtracting }) {
  const { t } = useTranslation();
  const { accessToken, refreshAccessToken } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);

  const config = useMemo(() => getTemplateConfig(selectedTemplate), [selectedTemplate]);
  const fields = config.customFields.personalInfo;

  const handleGenerateSummary = async () => {
    const title = formData.personalInfo.title;
    if (!title?.trim()) {
      toast.error(t("Please enter a job title first"));
      return;
    }

    let loadingToast = null;
    try {
      setIsGenerating(true);
      loadingToast = toast.loading(t("AI Crafting Summary"));
      
      const res = await aiApi.generateContent({
        accessToken, refreshAccessToken,
        type: 'summary',
        data: {
          name: formData.personalInfo.name || "A professional",
          role: title,
          skills: formData.skills || []
        }
      });
      if (res.success && res.data && res.data.summary) {
        handleChange({ target: { name: 'about', value: res.data.summary } }, "personalInfo");
        toast.success(t("Summary Generated"), { id: loadingToast });
      } else {
        toast.dismiss(loadingToast);
      }
    } catch (error) {
      console.error(error);
      if (loadingToast) toast.dismiss(loadingToast);
      // Handled globally
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Grow in={true}>
      <Box>
        {/* Magic Extraction Box */}
        <Box
          sx={{
            mb: 4,
            p: 3,
            borderRadius: "20px",
            background: "linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%)",
            border: "1px solid rgba(99, 102, 241, 0.1)",
            textAlign: "center"
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 1 }}>
            <Sparkles size={20} color="#4F46E5" />
            <Typography variant="h6" sx={{ fontWeight: 800, color: "#1E1B4B" }}>
              {t("Magic Import")}
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ mb: 2, color: "#4338CA", fontWeight: 500 }}>
            {t("Magic Import Description")}
          </Typography>
          <Button
            variant="contained"
            component="label"
            disabled={isExtracting}
            startIcon={isExtracting ? <CircularProgress size={20} color="inherit" /> : null}
            sx={{
              textTransform: "none",
              borderRadius: "12px",
              px: 4,
              py: 1,
              fontWeight: 700,
              boxShadow: "0 10px 15px -3px rgba(99, 102, 241, 0.3)",
              bgcolor: "#4F46E5",
              "&:hover": { bgcolor: "#4338CA" }
            }}
          >
            {isExtracting ? t("Extracting") : t("Import PDF")}
            <input
              type="file"
              hidden
              accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={(e) => handleMagicImport(e.target.files[0])}
            />
          </Button>
        </Box>
        <Box sx={{ mb: 3, p: 2, border: "1px dashed #CBD5E1", borderRadius: "12px", textAlign: "center", bgcolor: "#F8FAFC" }}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700, color: "#334155" }}>
            {t("Profile Picture")}
          </Typography>
          <Button variant="outlined" component="label" sx={{ textTransform: "none", borderRadius: "8px" }}>
            {t("Upload Image")}
            <input type="file" name="profileImage" hidden accept="image/png, image/jpeg, image/jpg" onChange={(e) => handleChange(e, "personalInfo")} />
          </Button>
          {formData.personalInfo?.profileImage && (
            <Typography variant="caption" display="block" sx={{ mt: 1, color: "#16A34A", fontWeight: 700 }}>
              {formData.personalInfo.profileImage.name || "Image"} {t("Selected")}
            </Typography>
          )}
        </Box>

        {fields.map((field) => (
          <PremiumInput
            key={field.name}
            label={t(field.label)}
            placeholder={t(field.placeholder || "")}
            type={field.type || "text"}
            name={field.name}
            value={formData.personalInfo[field.name] || ""}
            onChange={(e) => handleChange(e, "personalInfo")}
            InputLabelProps={field.type === "date" ? { shrink: true } : undefined}
          />
        ))}

        {config.sections?.includes("about") && (
          <>
            <Box sx={{ mb: 1, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#374151" }}>
                {t("Summary Pitch")}
              </Typography>
              <Button
                size="small"
                onClick={handleGenerateSummary}
                disabled={isGenerating}
                startIcon={isGenerating ? <CircularProgress size={16} /> : <Sparkles size={16} />}
                sx={{
                  textTransform: "none",
                  borderRadius: "8px",
                  color: "#6366F1",
                  fontWeight: 700,
                  bgcolor: "rgba(99, 102, 241, 0.1)",
                  "&:hover": {
                    bgcolor: "rgba(99, 102, 241, 0.2)"
                  }
                }}
              >
                {isGenerating ? t("Generating") : t("Auto Generate AI")}
              </Button>
            </Box>
            <PremiumInput
              placeholder={t("Pitch Placeholder")}
              multiline
              rows={4}
              name="about"
              value={formData.personalInfo.about}
              onChange={(e) => handleChange(e, "personalInfo")}
            />
          </>
        )}
      </Box>
    </Grow>
  );
}

