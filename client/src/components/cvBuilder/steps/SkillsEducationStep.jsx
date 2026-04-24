import React, { useState } from "react";
import toast from "react-hot-toast";
import { Box, Button, Grow, Paper, TextField, Typography, FormControlLabel, Checkbox, CircularProgress } from "@mui/material";
import { Sparkles } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../../context/AuthContext";
import * as aiApi from "../../../api/ai";
import PremiumInput from "../PremiumInput";
import { getTemplateConfig } from "../../../utils/cvBuilder/templateConfig";
import AdditionalSectionsEditor from "../AdditionalSectionsEditor";

export default function SkillsEducationStep({
  formData,
  setFormData,
  skillInput,
  setSkillInput,
  handleChange,
  selectedTemplate
}) {
  const { t } = useTranslation();
  const { accessToken, refreshAccessToken } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const config = React.useMemo(() => getTemplateConfig(selectedTemplate), [selectedTemplate]);

  const handleGenerateSkills = async () => {
    const role = formData.personalInfo?.title;
    if (!role?.trim()) {
      toast.error(t("Please enter a job title first"));
      return;
    }

    let loadingToast = null;
    try {
      setIsGenerating(true);
      loadingToast = toast.loading(t("Suggesting"));

      const res = await aiApi.generateContent({
        accessToken,
        refreshAccessToken,
        type: "skills",
        data: { role }
      });

      if (res.success && res.data && res.data.skills) {
        // Find skills that aren't already added
        const currentSkills = (formData.skills || []).map(s => s.toLowerCase());
        const newSkills = res.data.skills.filter(s => !currentSkills.includes(s.toLowerCase()));

        if (newSkills.length > 0) {
          setFormData((prev) => ({
            ...prev,
            skills: [...(prev.skills || []), ...newSkills],
          }));
        }
        toast.success(t("Skills Suggested"), { id: loadingToast });
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
        {config.sections?.includes("skills") && (
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 900, color: "#374151" }}>
                {t("Skills")}
              </Typography>
              <Button
                size="small"
                onClick={handleGenerateSkills}
                disabled={isGenerating}
                startIcon={isGenerating ? <CircularProgress size={16} /> : <Sparkles size={16} />}
                sx={{
                  textTransform: "none",
                  borderRadius: "8px",
                  color: "#6366F1",
                  fontWeight: 700,
                  bgcolor: "rgba(99, 102, 241, 0.1)",
                  "&:hover": { bgcolor: "rgba(99, 102, 241, 0.2)" }
                }}
              >
                {isGenerating ? t("Suggesting") : t("Suggest AI Skills")}
              </Button>
            </Box>

            <Box sx={{ display: "flex", gap: 1, mb: 1.5 }}>
              <TextField
                size="small"
                fullWidth
                placeholder={t("Skills Placeholder")}
                value={skillInput}
                inputProps={{ "data-enter-ignore": "true" }}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    const val = skillInput.trim();
                    if (!val) return;
                    setFormData((prev) => ({
                      ...prev,
                      skills: [...(prev.skills || []), val],
                    }));
                    setSkillInput("");
                  }
                }}
              />

              <Button
                variant="contained"
                onClick={() => {
                  const val = skillInput.trim();
                  if (!val) return;
                  setFormData((prev) => ({
                    ...prev,
                    skills: [...(prev.skills || []), val],
                  }));
                  setSkillInput("");
                }}
                sx={{ borderRadius: "14px", textTransform: "none", fontWeight: 900 }}
              >
                {t("Add")}
              </Button>
            </Box>

            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {(formData.skills || []).map((s, i) => (
                <Button
                  key={`${s}-${i}`}
                  variant="outlined"
                  size="small"
                  sx={{
                    borderRadius: "999px",
                    textTransform: "none",
                    fontWeight: 900,
                    borderColor: "#93C5FD",
                    color: "#1D4ED8",
                  }}
                  onClick={() => {
                    setFormData((prev) => ({
                      ...prev,
                      skills: (prev.skills || []).filter((_, idx) => idx !== i),
                    }));
                  }}
                >
                  {s} ✕
                </Button>
              ))}
            </Box>
          </Box>
        )}

        {config.sections?.includes("education") && (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mb: 3 }}>
            {(formData.education || []).map((item, idx) => (
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
                    {t("Education")} #{idx + 1}
                  </Typography>
                  <Button
                    size="small"
                    color="error"
                    disabled={(formData.education || []).length <= 1}
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        education: prev.education.filter((_, i) => i !== idx),
                      }));
                    }}
                  >
                    {t("Remove")}
                  </Button>
                </Box>

                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 1.5 }}>
                  <TextField
                    label={t("Degree")}
                    value={item.degree}
                    onChange={(e) => {
                      const v = e.target.value;
                      setFormData((prev) => ({
                        ...prev,
                        education: prev.education.map((x, i) => (i === idx ? { ...x, degree: v } : x)),
                      }));
                    }}
                    fullWidth
                  />
                  <TextField
                    label={t("Institute")}
                    value={item.institute}
                    onChange={(e) => {
                      const v = e.target.value;
                      setFormData((prev) => ({
                        ...prev,
                        education: prev.education.map((x, i) => (i === idx ? { ...x, institute: v } : x)),
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
                        education: prev.education.map((x, i) => (i === idx ? { ...x, startDate: v } : x)),
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
                          education: prev.education.map((x, i) => (i === idx ? { ...x, endDate: v } : x)),
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
                              education: prev.education.map((x, i) => (i === idx ? { ...x, current: checked, endDate: checked ? '' : x.endDate } : x)),
                            }));
                          }}
                        />
                      }
                      label={<Typography variant="caption" sx={{ color: "#475569", fontWeight: 600 }}>{t("Current Study")}</Typography>}
                      sx={{ mt: 0.5, ml: 0 }}
                    />
                  </Box>
                </Box>
              </Paper>
            ))}
            <Button
              variant="outlined"
              onClick={() => {
                setFormData((prev) => ({
                  ...prev,
                  education: [
                    ...(prev.education || []),
                    { degree: "", institute: "", startDate: "", endDate: "", current: false },
                  ],
                }));
              }}
              sx={{ borderRadius: "16px", textTransform: "none", fontWeight: 900, mb: 2 }}
            >
              {t("Add Education")}
            </Button>
          </Box>
        )}

        {config.sections?.includes("languages") && (
          <PremiumInput
            label={t("Languages Optional")}
            placeholder={t("Languages Placeholder")}
            multiline
            rows={3}
            name="languages"
            value={formData.languages}
            onChange={handleChange}
          />
        )}
        {config.sections?.includes("certifications") && (
          <PremiumInput
            label={t("Certifications Optional")}
            placeholder={t("Certifications Placeholder")}
            multiline
            rows={4}
            name="certifications"
            value={formData.certifications}
            onChange={handleChange}
          />
        )}
        <AdditionalSectionsEditor formData={formData} setFormData={setFormData} />
      </Box>
    </Grow>
  );
}
