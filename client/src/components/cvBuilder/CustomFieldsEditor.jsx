import React, { useMemo, useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Collapse,
  IconButton,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { GripVertical, Plus, Trash2 } from "lucide-react";

const SUGGESTED_FIELDS = [
  "Languages",
  "Interests",
  "Hobbies",
  "Awards",
  "Publications",
  "Volunteering",
  "Certifications",
  "Projects",
  "References",
  "Patents",
];

const normalize = (s) => String(s || "").trim().toLowerCase();
const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export default function CustomFieldsEditor({ formData, setFormData, sectionKey, title }) {
  const [open, setOpen] = useState(false);
  const [pendingName, setPendingName] = useState("");
  const [dragFieldId, setDragFieldId] = useState("");

  const fields = formData?.customFields?.[sectionKey] || [];

  const suggestions = useMemo(() => {
    const existing = new Set(fields.map((f) => normalize(f.name)));
    return SUGGESTED_FIELDS.filter((n) => !existing.has(normalize(n)));
  }, [fields]);

  const updateFields = (nextFields) => {
    setFormData((prev) => ({
      ...prev,
      customFields: {
        ...(prev.customFields || {}),
        [sectionKey]: nextFields,
      },
    }));
  };

  const addField = () => {
    const name = pendingName.trim();
    if (!name) return;
    if (fields.some((f) => normalize(f.name) === normalize(name))) return;
    updateFields([...fields, { id: uid(), name, items: [""] }]);
    setPendingName("");
  };

  const removeField = (id) => updateFields(fields.filter((f) => f.id !== id));

  const renameField = (id, name) => {
    const next = fields.map((f) => (f.id === id ? { ...f, name } : f));
    updateFields(next);
  };

  const updateItem = (fieldId, idx, value) => {
    updateFields(
      fields.map((f) =>
        f.id === fieldId ? { ...f, items: f.items.map((x, i) => (i === idx ? value : x)) } : f
      )
    );
  };

  const addItem = (fieldId) => {
    updateFields(fields.map((f) => (f.id === fieldId ? { ...f, items: [...f.items, ""] } : f)));
  };

  const removeItem = (fieldId, idx) => {
    updateFields(
      fields.map((f) => {
        if (f.id !== fieldId) return f;
        const items = f.items.filter((_, i) => i !== idx);
        return { ...f, items: items.length ? items : [""] };
      })
    );
  };

  const onDropField = (targetId) => {
    if (!dragFieldId || dragFieldId === targetId) return;
    const srcIdx = fields.findIndex((f) => f.id === dragFieldId);
    const dstIdx = fields.findIndex((f) => f.id === targetId);
    if (srcIdx < 0 || dstIdx < 0) return;
    const next = [...fields];
    const [moved] = next.splice(srcIdx, 1);
    next.splice(dstIdx, 0, moved);
    updateFields(next);
    setDragFieldId("");
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Button
        variant="text"
        onClick={() => setOpen((v) => !v)}
        startIcon={<Plus size={16} />}
        sx={{ textTransform: "none", fontWeight: 700 }}
      >
        {open ? "Hide custom fields" : `+ Add Field (${title})`}
      </Button>

      <Collapse in={open}>
        <Paper variant="outlined" sx={{ mt: 1.2, p: 2, borderRadius: "14px" }}>
          <Typography variant="caption" sx={{ color: "#64748B", display: "block", mb: 1 }}>
            Add suggested fields or type your own. Duplicate field names are blocked per section.
          </Typography>

          <Box sx={{ display: "flex", gap: 1, alignItems: "center", mb: 1.5 }}>
            <Autocomplete
              freeSolo
              options={suggestions}
              value={pendingName}
              onInputChange={(_, v) => setPendingName(v)}
              onChange={(_, v) => setPendingName(String(v || ""))}
              size="small"
              sx={{ flex: 1 }}
              renderInput={(params) => <TextField {...params} label="Field name" placeholder="e.g. Awards" />}
            />
            <Button variant="contained" onClick={addField} sx={{ textTransform: "none" }}>
              Add
            </Button>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {fields.map((field) => (
              <Paper
                key={field.id}
                variant="outlined"
                draggable
                onDragStart={() => setDragFieldId(field.id)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => onDropField(field.id)}
                sx={{ p: 1.2, borderRadius: "10px", cursor: "grab" }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                  <GripVertical size={16} color="#64748B" />
                  <TextField
                    size="small"
                    value={field.name}
                    onChange={(e) => renameField(field.id, e.target.value)}
                    fullWidth
                  />
                  <IconButton color="error" size="small" onClick={() => removeField(field.id)}>
                    <Trash2 size={14} />
                  </IconButton>
                </Box>

                <Box sx={{ display: "flex", flexDirection: "column", gap: 0.8 }}>
                  {(field.items || []).map((item, idx) => (
                    <Box key={`${field.id}-${idx}`} sx={{ display: "flex", gap: 1 }}>
                      <TextField
                        size="small"
                        value={item}
                        onChange={(e) => updateItem(field.id, idx, e.target.value)}
                        fullWidth
                        placeholder="Add item"
                      />
                      <IconButton color="error" size="small" onClick={() => removeItem(field.id, idx)}>
                        <Trash2 size={14} />
                      </IconButton>
                    </Box>
                  ))}
                  <Button
                    size="small"
                    variant="text"
                    onClick={() => addItem(field.id)}
                    sx={{ alignSelf: "flex-start", textTransform: "none" }}
                  >
                    + Add item
                  </Button>
                </Box>
              </Paper>
            ))}
          </Box>
        </Paper>
      </Collapse>
    </Box>
  );
}
