import React, { useState } from "react";
import toast from "react-hot-toast";
import { Box, Button, Grow, Paper, TextField, Typography, FormControlLabel, Checkbox, CircularProgress } from "@mui/material";
import { Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../../context/AuthContext";
import * as aiApi from "../../../api/ai";
import PremiumInput from "../PremiumInput";
import { getTemplateConfig } from "../../../utils/cvBuilder/templateConfig";

export default function ExperienceStep({ formData, setFormData, handleChange, selectedTemplate }) {
  const { t } = useTranslation();
  const { accessToken, refreshAccessToken } = useAuth();
  const [loadingIdx, setLoadingIdx] = useState(null);
  const config = React.useMemo(() => getTemplateConfig(selectedTemplate), [selectedTemplate]);

  const handleEnhanceDescription = async (idx) => {
    const item = formData.experience[idx];
    if (!item.role?.trim() || !item.description?.trim()) {
      toast.error(t("Please provide Role and Description"));
      return;
    }

    let loadingToast = null;
    try {
      setLoadingIdx(idx);
      loadingToast = toast.loading(t("Enhancing"));

      const res = await aiApi.generateContent({
        accessToken,
        refreshAccessToken,
        type: "experience",
        data: {
          role: item.role,
          company: item.company,
          rawDescription: item.description
        }
      });

      if (res.success && res.data && res.data.description) {
        setFormData((prev) => ({
          ...prev,
          experience: prev.experience.map((x, i) => (i === idx ? { ...x, description: res.data.description } : x)),
        }));
        toast.success(t("Experience Enhanced"), { id: loadingToast });
      } else {
        toast.dismiss(loadingToast);
      }
    } catch (error) {
      console.error(error);
      if (loadingToast) toast.dismiss(loadingToast);
      // Handled globally
    } finally {
      setLoadingIdx(null);
    }
  };

  return (
    <Grow in={true}>
      <Box>
        <Typography
          variant="body2"
          color="textSecondary"
          sx={{
            mb: 4,
            bgcolor: "#EFF6FF",
            p: 2,
            borderRadius: "12px",
            border: "1px solid #DBEAFE",
            color: "#1E40AF",
          }}
        >
          💡 {t("Experience Tip")}
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 3 }}>
          {(formData.experience || []).map((item, idx) => (
            <Paper
              key={idx}
              variant="outlined"
              sx={{
                p: 2,
                borderRadius: "16px",
                bgcolor: "rgba(255,255,255,0.5)",
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                <Typography sx={{ fontWeight: 900, color: "#0F172A" }}>
                  {t("Work Experience")} #{idx + 1}
                </Typography>
                <Button
                  size="small"
                  color="error"
                  disabled={(formData.experience || []).length <= 1}
                  onClick={() => {
                    setFormData((prev) => ({
                      ...prev,
                      experience: prev.experience.filter((_, i) => i !== idx),
                    }));
                  }}
                >
                  {t("Remove")}
                </Button>
              </Box>

              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 1.5 }}>
                <TextField
                  label={t("Role")}
                  value={item.role}
                  onChange={(e) => {
                    const v = e.target.value;
                    setFormData((prev) => ({
                      ...prev,
                      experience: prev.experience.map((x, i) => (i === idx ? { ...x, role: v } : x)),
                    }));
                  }}
                  fullWidth
                />
                <TextField
                  label={t("Company")}
                  value={item.company}
                  onChange={(e) => {
                    const v = e.target.value;
                    setFormData((prev) => ({
                      ...prev,
                      experience: prev.experience.map((x, i) => (i === idx ? { ...x, company: v } : x)),
                    }));
                  }}
                  fullWidth
                />
                <TextField
                  label={t("Start Date")}
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={item.startDate || ''}
                  onChange={(e) => {
                    const v = e.target.value;
                    setFormData((prev) => ({
                      ...prev,
                      experience: prev.experience.map((x, i) => (i === idx ? { ...x, startDate: v } : x)),
                    }));
                  }}
                  fullWidth
                />
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                  <TextField
                    label={item.current ? t("Present") : t("End Date")}
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={item.endDate || ''}
                    disabled={item.current}
                    onChange={(e) => {
                      const v = e.target.value;
                      setFormData((prev) => ({
                        ...prev,
                        experience: prev.experience.map((x, i) => (i === idx ? { ...x, endDate: v } : x)),
                      }));
                    }}
                    fullWidth
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        size="small"
                        checked={item.current || false}
                        onChange={(e) => {
                          const checked = e.target.checked;
                          setFormData((prev) => ({
                            ...prev,
                            experience: prev.experience.map((x, i) => (i === idx ? { ...x, current: checked, endDate: checked ? '' : x.endDate } : x)),
                          }));
                        }}
                      />
                    }
                    label={<Typography variant="caption" sx={{ color: "#475569", fontWeight: 600 }}>{t("Current Work")}</Typography>}
                    sx={{ mt: 0.5, ml: 0 }}
                  />
                </Box>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2, mb: 1 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: "#475569" }}>
                  {t("Description")}
                </Typography>
                <Button
                  size="small"
                  onClick={() => handleEnhanceDescription(idx)}
                  disabled={loadingIdx === idx}
                  startIcon={loadingIdx === idx ? <CircularProgress size={12} /> : <Sparkles size={12} />}
                  sx={{
                    textTransform: "none",
                    fontSize: "0.7rem",
                    borderRadius: "6px",
                    fontWeight: 700,
                    bgcolor: "rgba(99, 102, 241, 0.1)",
                    color: "#6366F1",
                    "&:hover": { bgcolor: "rgba(99, 102, 241, 0.2)" }
                  }}
                >
                  {loadingIdx === idx ? t("Enhancing") : t("Enhance AI")}
                </Button>
              </Box>
              <TextField
                value={item.description}
                placeholder={t("Description Placeholder")}
                onChange={(e) => {
                  const v = e.target.value;
                  setFormData((prev) => ({
                    ...prev,
                    experience: prev.experience.map((x, i) => (i === idx ? { ...x, description: v } : x)),
                  }));
                }}
                fullWidth
                multiline
                rows={4}
              />
            </Paper>
          ))}
        </Box>

        <Button
          variant="outlined"
          onClick={() => {
            setFormData((prev) => ({
              ...prev,
              experience: [
                ...(prev.experience || []),
                { role: "", company: "", startDate: "", endDate: "", current: false, description: "" },
              ],
            }));
          }}
          sx={{ borderRadius: "16px", textTransform: "none", fontWeight: 900, mb: 2 }}
        >
          {t("Add Experience")}
        </Button>

        {config.sections?.includes("projects") && (
          <PremiumInput
            label={t("Projects Optional")}
            placeholder={t("Projects Placeholder")}
            multiline
            rows={6}
            name="projects"
            value={formData.projects}
            onChange={handleChange}
          />
        )}
      </Box>
    </Grow>
  );
}
