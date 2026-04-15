import React, { useState, useMemo } from "react";
import { Box, Grow, Typography, Button, CircularProgress } from "@mui/material";
import { Sparkles } from "lucide-react";
import PremiumInput from "../PremiumInput";
import { useAuth } from "../../../context/AuthContext";
import * as aiApi from "../../../api/ai";
import { getTemplateConfig } from "../../../utils/cvBuilder/templateConfig";

export default function PersonalInfoStep({ formData, handleChange, selectedTemplate }) {
  const { accessToken, refreshAccessToken } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);

  const config = useMemo(() => getTemplateConfig(selectedTemplate), [selectedTemplate]);
  const fields = config.customFields.personalInfo;

  const handleGenerateSummary = async () => {
    const title = formData.personalInfo.title;
    if (!title?.trim()) {
      alert("Please enter a current or target job title first so the AI can generate a relevant summary.");
      return;
    }

    try {
      setIsGenerating(true);
      const res = await aiApi.generateSummary({ accessToken, refreshAccessToken, title });
      if (res.success && res.data) {
        handleChange({ target: { name: 'about', value: res.data } }, "personalInfo");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to connect to the AI service. Please ensure the backend is running and the API key is configured.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Grow in={true}>
      <Box>
        <Box sx={{ mb: 3, p: 2, border: "1px dashed #CBD5E1", borderRadius: "12px", textAlign: "center", bgcolor: "#F8FAFC" }}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700, color: "#334155" }}>
            Profile Picture (Optional)
          </Typography>
          <Button variant="outlined" component="label" sx={{ textTransform: "none", borderRadius: "8px" }}>
            Upload Image
            <input type="file" name="profileImage" hidden accept="image/png, image/jpeg, image/jpg" onChange={(e) => handleChange(e, "personalInfo")} />
          </Button>
          {formData.personalInfo?.profileImage && (
            <Typography variant="caption" display="block" sx={{ mt: 1, color: "#16A34A", fontWeight: 700 }}>
              {formData.personalInfo.profileImage.name || "Image"} selected
            </Typography>
          )}
        </Box>

        {fields.map((field) => (
          <PremiumInput
            key={field.name}
            label={field.label}
            placeholder={field.placeholder || ""}
            type={field.type || "text"}
            name={field.name}
            value={formData.personalInfo[field.name] || ""}
            onChange={(e) => handleChange(e, "personalInfo")}
            InputLabelProps={field.type === "date" ? { shrink: true } : undefined}
          />
        ))}

        <Box sx={{ mb: 1, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#374151" }}>
            Write a short pitch about yourself
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
            {isGenerating ? "Generating..." : "Auto-generate with AI"}
          </Button>
        </Box>
        <PremiumInput
          placeholder="Describe your passion and what makes you unique..."
          multiline
          rows={4}
          name="about"
          value={formData.personalInfo.about}
          onChange={(e) => handleChange(e, "personalInfo")}
        />
      </Box>
    </Grow>
  );
}

