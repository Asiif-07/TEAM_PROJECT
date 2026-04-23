import React, { useMemo } from "react";
import { Box, Button, IconButton, Paper, TextField, Typography, Autocomplete } from "@mui/material";
import { Plus, Trash2 } from "lucide-react";

const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const SUGGESTED_TITLES = [
  "Hobbies",
  "Awards",
  "Interests",
  "Publications",
  "Volunteering",
  "Certifications",
  "Languages",
  "References",
  "Achievements",
  "Extracurricular",
  "Conferences",
  "Patents",
  "Memberships",
  "Soft Skills",
  "Testimonials"
];

const normalize = (s) => s?.toString().toLowerCase().trim() || "";

export default function AdditionalSectionsEditor({ formData, setFormData }) {
  const sections = formData.additionalSections || [];

  const suggestions = useMemo(() => {
    const existing = new Set(sections.map((s) => normalize(s.title)));
    return SUGGESTED_TITLES.filter((t) => !existing.has(normalize(t)));
  }, [sections]);

  const updateSections = (next) => {
    setFormData((prev) => ({ ...prev, additionalSections: next }));
  };

  const addSection = () => {
    updateSections([...sections, { id: uid(), title: "", content: "" }]);
  };

  const removeSection = (id) => {
    updateSections(sections.filter((s) => s.id !== id));
  };

  const updateSection = (id, key, value) => {
    updateSections(sections.map((s) => (s.id === id ? { ...s, [key]: value } : s)));
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.2 }}>
        <Typography sx={{ fontWeight: 800, color: "#0F172A" }}>Additional Sections</Typography>
        <Button variant="outlined" onClick={addSection} startIcon={<Plus size={16} />} sx={{ textTransform: "none" }}>
          Add a Section
        </Button>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.2 }}>
        {sections.map((section, idx) => (
          <Paper key={section.id || idx} variant="outlined" sx={{ p: 1.4, borderRadius: "12px" }}>
            <Box sx={{ display: "flex", gap: 1, alignItems: "center", mb: 1 }}>
              <Autocomplete
                freeSolo
                fullWidth
                size="small"
                options={suggestions}
                value={section.title || ""}
                onInputChange={(_, value) => updateSection(section.id, "title", value)}
                onChange={(_, value) => updateSection(section.id, "title", value || "")}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Section title"
                    placeholder="e.g. Hobbies, Awards, Interests"
                  />
                )}
              />
              <IconButton color="error" onClick={() => removeSection(section.id)}>
                <Trash2 size={16} />
              </IconButton>
            </Box>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Section content"
              placeholder="Add values (one per line or comma-separated)"
              value={section.content || ""}
              onChange={(e) => updateSection(section.id, "content", e.target.value)}
            />
          </Paper>
        ))}
      </Box>
    </Box>
  );
}
