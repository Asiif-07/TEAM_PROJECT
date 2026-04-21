import React from "react";
import { Box, TextField, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

export default function PremiumInput({ label, ...props }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  
  return (
    <Box sx={{ mb: 4 }}>
      <Typography
        variant="subtitle2"
        sx={{
          mb: 1.5,
          fontWeight: 700,
          color: theme.palette.text.primary,
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
            bgcolor: isDark ? "rgba(30, 41, 59, 0.5)" : "rgba(255, 255, 255, 0.5)",
            borderRadius: "16px",
            "& fieldset": { borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)" },
            "&:hover fieldset": { borderColor: theme.palette.primary.main },
            "&.Mui-focused": {
              bgcolor: isDark ? "rgba(30, 41, 59, 0.8)" : "white",
              "& fieldset": { borderColor: theme.palette.primary.main, borderWidth: "2px" },
            },
            transition: "all 0.3s ease",
          },
          "& .MuiInputBase-input": {
            color: theme.palette.text.primary,
            "&::placeholder": {
              color: theme.palette.text.secondary,
              opacity: 0.7,
            },
          },
          "& .MuiInputLabel-root": {
            color: theme.palette.text.secondary,
            "&.Mui-focused": {
              color: theme.palette.primary.main,
            },
          },
        }}
      />
    </Box>
  );
}

