import React from "react";
import { Box, Typography } from "@mui/material";

export default function AdditionalSectionsBlock({ sections, accentColor = "#111827" }) {
  const safe = (sections || []).filter(
    (s) => String(s?.title || "").trim() && String(s?.content || "").trim()
  );
  if (!safe.length) return null;

  return (
    <Box sx={{ mt: 3 }}>
      {safe.map((section, idx) => (
        <Box key={section.id || idx} sx={{ mb: 2 }}>
          <Typography sx={{ fontWeight: 800, color: accentColor, fontSize: "0.95rem", mb: 0.5 }}>
            {section.title}
          </Typography>
          <Typography sx={{ color: "#475569", fontSize: "0.86rem", lineHeight: 1.7, whiteSpace: "pre-line" }}>
            {section.content}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}
