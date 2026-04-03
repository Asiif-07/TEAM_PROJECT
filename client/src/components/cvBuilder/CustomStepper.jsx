import React from "react";
import { Box, Typography } from "@mui/material";
import { User, Briefcase, GraduationCap, Wand2 } from "lucide-react";

const steps = [
  { label: "Personal Info", icon: <User size={20} /> },
  { label: "Experience", icon: <Briefcase size={20} /> },
  { label: "Skills & Education", icon: <GraduationCap size={20} /> },
  { label: "Generate", icon: <Wand2 size={20} /> },
];

export default function CustomStepper({ activeStep }) {
  return (
    <Box sx={{ mb: 10 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          position: "relative",
          px: { xs: 0, sm: 4 },
        }}
      >
        {/* Progress Line */}
        <Box
          sx={{
            position: "absolute",
            top: "24px",
            left: { xs: "10%", sm: "15%" },
            right: { xs: "10%", sm: "15%" },
            height: "2px",
            bgcolor: "#E5E7EB",
            zIndex: 0,
          }}
        >
          <Box
            sx={{
              width: `${(activeStep / (steps.length - 1)) * 100}%`,
              height: "100%",
              bgcolor: "#2563EB",
              transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          />
        </Box>

        {steps.map((step, index) => {
          const isActive = index === activeStep;
          const isCompleted = index < activeStep;

          return (
            <Box
              key={index}
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                zIndex: 1,
                width: "25%",
              }}
            >
              <Box
                sx={{
                  width: 50,
                  height: 50,
                  borderRadius: "18px",
                  bgcolor: isActive ? "#2563EB" : isCompleted ? "#111827" : "white",
                  color: isActive || isCompleted ? "white" : "#9CA3AF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "2px solid",
                  borderColor: isActive ? "#2563EB" : isCompleted ? "#111827" : "#E5E7EB",
                  transition: "all 0.4s ease",
                  boxShadow: isActive ? "0 0 20px rgba(37, 99, 235, 0.3)" : "none",
                  transform: isActive ? "scale(1.1)" : "scale(1)",
                  mb: 1.5,
                }}
              >
                {step.icon}
              </Box>

              <Typography
                variant="caption"
                sx={{
                  fontWeight: 800,
                  color: isActive ? "#2563EB" : "#6B7280",
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  fontSize: "0.65rem",
                  textAlign: "center",
                }}
              >
                {step.label}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

