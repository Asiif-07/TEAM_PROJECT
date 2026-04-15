import React, { useState } from "react";
import { Box, Button, Grow, Paper, TextField, Typography, FormControlLabel, Checkbox, CircularProgress } from "@mui/material";
import { Sparkles } from "lucide-react";
import PremiumInput from "../PremiumInput";
import { useAuth } from "../../../context/AuthContext";
import * as aiApi from "../../../api/ai";

export default function ExperienceStep({ formData, setFormData, handleChange }) {
  const { accessToken, refreshAccessToken } = useAuth();
  const [loadingIdx, setLoadingIdx] = useState(null);

  const handleEnhanceDescription = async (idx) => {
    const item = formData.experience[idx];
    if (!item.role?.trim() || !item.description?.trim()) {
      alert("Please provide at least the job Role and a basic Description first.");
      return;
    }

    try {
      setLoadingIdx(idx);
      const res = await aiApi.enhanceExperience({
        accessToken,
        refreshAccessToken,
        role: item.role,
        company: item.company,
        description: item.description
      });

      if (res.success && res.data) {
        setFormData((prev) => ({
          ...prev,
          experience: prev.experience.map((x, i) => (i === idx ? { ...x, description: res.data } : x)),
        }));
      }
    } catch (error) {
      console.error(error);
      alert("Failed to enhance description. Please check your connection and API key.");
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
          💡 Tip: Add your most recent work experience first. Leave 'End Date' blank if it's your current job.
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
                  Work Experience #{idx + 1}
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
                  Remove
                </Button>
              </Box>

              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 1.5 }}>
                <TextField
                  label="Role"
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
                  label="Company"
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
                  label="Start Date"
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
                    label={item.current ? "Present" : "End Date (or expected)"}
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
                    label={<Typography variant="caption" sx={{ color: "#475569", fontWeight: 600 }}>I currently work here</Typography>}
                    sx={{ mt: 0.5, ml: 0 }}
                  />
                </Box>
              </Box>

              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2, mb: 1 }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: "#475569" }}>
                  Description
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
                  {loadingIdx === idx ? "Enhancing..." : "Enhance with AI"}
                </Button>
              </Box>
              <TextField
                value={item.description}
                placeholder="List your key responsibilities and achievements..."
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
          + Add work experience
        </Button>

        <PremiumInput
          label="Projects (optional but recommended)"
          placeholder="Title | Description | githubLink(optional) | liveLink(optional)"
          multiline
          rows={6}
          name="projects"
          value={formData.projects}
          onChange={handleChange}
        />
      </Box>
    </Grow>
  );
}

