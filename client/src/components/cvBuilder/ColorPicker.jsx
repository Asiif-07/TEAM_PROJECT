import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import { Palette } from "lucide-react";

const PRESET_COLORS = [
    { color: "#2563EB", name: "Blue" },
    { color: "#7C3AED", name: "Violet" },
    { color: "#DC2626", name: "Red" },
    { color: "#059669", name: "Emerald" },
    { color: "#D97706", name: "Amber" },
    { color: "#0891B2", name: "Cyan" },
    { color: "#DB2777", name: "Pink" },
    { color: "#4F46E5", name: "Indigo" },
    { color: "#0F172A", name: "Slate" },
    { color: "#78350F", name: "Brown" },
    { color: "#EA580C", name: "Orange" },
    { color: "#16A34A", name: "Green" },
];

export default function ColorPicker({ value, onChange }) {
    const [showCustom, setShowCustom] = useState(false);

    return (
        <Box sx={{
            p: 2.5,
            borderRadius: "20px",
            border: "1px solid #E5E7EB",
            bgcolor: "#FAFAFA",
        }}>
            {/* Header */}
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Palette size={16} color="#6366F1" />
                    <Typography sx={{ fontSize: "12px", fontWeight: 800, color: "#374151", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                        Accent Color
                    </Typography>
                </Box>
                <Box sx={{
                    display: "flex", alignItems: "center", gap: 1,
                    bgcolor: "#fff", px: 1.5, py: 0.5, borderRadius: "100px",
                    border: "1px solid #E5E7EB"
                }}>
                    <Box sx={{ width: 14, height: 14, borderRadius: "50%", bgcolor: value, border: "2px solid #fff", boxShadow: "0 0 0 1px rgba(0,0,0,0.1)" }} />
                    <Typography sx={{ fontSize: "11px", fontWeight: 700, color: "#6B7280", fontFamily: "monospace" }}>
                        {value}
                    </Typography>
                </Box>
            </Box>

            {/* Preset Swatches */}
            <Box sx={{
                display: "grid",
                gridTemplateColumns: "repeat(6, 1fr)",
                gap: 1,
                mb: 2,
            }}>
                {PRESET_COLORS.map((preset) => (
                    <Box
                        key={preset.color}
                        onClick={() => onChange(preset.color)}
                        title={preset.name}
                        sx={{
                            width: "100%",
                            aspectRatio: "1/1",
                            borderRadius: "12px",
                            bgcolor: preset.color,
                            cursor: "pointer",
                            transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                            border: value === preset.color ? "3px solid #fff" : "2px solid transparent",
                            boxShadow: value === preset.color
                                ? `0 0 0 2px ${preset.color}, 0 4px 12px ${preset.color}40`
                                : "0 1px 3px rgba(0,0,0,0.1)",
                            transform: value === preset.color ? "scale(1.1)" : "scale(1)",
                            "&:hover": {
                                transform: "scale(1.15)",
                                boxShadow: `0 4px 15px ${preset.color}50`,
                            },
                        }}
                    />
                ))}
            </Box>

            {/* Custom Color Toggle */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Box
                    onClick={() => setShowCustom(!showCustom)}
                    sx={{
                        fontSize: "11px", fontWeight: 700, color: "#6366F1",
                        cursor: "pointer", "&:hover": { textDecoration: "underline" }
                    }}
                >
                    {showCustom ? "Hide" : "Custom color"}
                </Box>
                {showCustom && (
                    <Box sx={{ position: "relative", overflow: "hidden", borderRadius: "8px", width: 32, height: 32, border: "2px solid #E5E7EB" }}>
                        <input
                            type="color"
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                            style={{
                                position: "absolute",
                                top: -4,
                                left: -4,
                                width: 40,
                                height: 40,
                                border: "none",
                                cursor: "pointer",
                                padding: 0,
                            }}
                        />
                    </Box>
                )}
            </Box>
        </Box>
    );
}
