import React from "react";
import { Box, Button, Grow, Paper, TextField, Typography, FormControlLabel, Checkbox } from "@mui/material";
import PremiumInput from "../PremiumInput";

export default function SkillsEducationStep({
  formData,
  setFormData,
  skillInput,
  setSkillInput,
  handleChange,
}) {
  return (
    <Grow in={true}>
      <Box>
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 900, color: "#374151" }}>
            Skills
          </Typography>

          <Box sx={{ display: "flex", gap: 1, mb: 1.5 }}>
            <TextField
              size="small"
              fullWidth
              placeholder="Type a skill and press Add"
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
              Add
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
                  Education #{idx + 1}
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
                  Remove
                </Button>
              </Box>

              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 1.5 }}>
                <TextField
                  label="Degree"
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
                  label="Institute"
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
                  label="Start Date"
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
                    label={item.current ? "Present" : "End Date (or expected)"}
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
                    label={<Typography variant="caption" sx={{ color: "#475569", fontWeight: 600 }}>I currently study here</Typography>}
                    sx={{ mt: 0.5, ml: 0 }}
                  />
                </Box>
              </Box>
            </Paper>
          ))}
        </Box>

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
          + Add education
        </Button>

        <PremiumInput
          label="Languages (optional)"
          placeholder="e.g. English, Hindi, Spanish"
          multiline
          rows={3}
          name="languages"
          value={formData.languages}
          onChange={handleChange}
        />
        <PremiumInput
          label="Certifications (optional)"
          placeholder="One per line, e.g. AWS Certified Developer Associate"
          multiline
          rows={4}
          name="certifications"
          value={formData.certifications}
          onChange={handleChange}
        />
      </Box>
    </Grow>
  );
}

