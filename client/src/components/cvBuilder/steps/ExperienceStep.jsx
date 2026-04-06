import React from "react";
import { Box, Button, Grow, Paper, TextField, Typography } from "@mui/material";
import PremiumInput from "../PremiumInput";

export default function ExperienceStep({ formData, setFormData, handleChange }) {
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
                  type="month"
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
                <TextField
                  label="End Date (or expected)"
                  type="month"
                  InputLabelProps={{ shrink: true }}
                  helperText="Leave empty for 'Present'"
                  value={item.endDate || ''}
                  onChange={(e) => {
                    const v = e.target.value;
                    setFormData((prev) => ({
                      ...prev,
                      experience: prev.experience.map((x, i) => (i === idx ? { ...x, endDate: v } : x)),
                    }));
                  }}
                  fullWidth
                />
              </Box>

              <TextField
                sx={{ mt: 1.5 }}
                label="Description"
                value={item.description}
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
                { role: "", company: "", startDate: "", endDate: "", description: "" },
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

