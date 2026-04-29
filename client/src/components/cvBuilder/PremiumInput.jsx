import React from "react";
import { Box, TextField, Typography } from "@mui/material";

export default function PremiumInput({ label, ...props }) {
  return (
    <Box sx={{ mb: { xs: 2.5, lg: 4 } }}>
      <Typography
        variant="subtitle2"
        sx={{
          mb: 1.5,
          fontWeight: 700,
          color: "#374151",
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        {label}
      </Typography>
      <TextField
        fullWidth
        variant="outlined"
        {...props}
        sx={{
          "& .MuiOutlinedInput-root": {
            bgcolor: "rgba(255, 255, 255, 0.5)",
            borderRadius: "16px",
            "& fieldset": { borderColor: "rgba(0,0,0,0.05)" },
            "&:hover fieldset": { borderColor: "#2563EB" },
            "&.Mui-focused": {
              bgcolor: "white",
              "& fieldset": { borderColor: "#2563EB", borderWidth: "2px" },
            },
            transition: "all 0.3s ease",
          },
        }}
      />
    </Box>
  );
}

