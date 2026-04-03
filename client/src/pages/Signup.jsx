import { Box, Button, TextField, Typography, Paper, Fade, MenuItem } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const Signup = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        gender: "male",
    });

    const { signup } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError("");
        setSuccessMessage("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;
        setError("");
        setSuccessMessage("");

        if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
            setError("All fields are required.");
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        setIsSubmitting(true);
        const result = await signup(formData.name, formData.email, formData.password, formData.gender);
        setIsSubmitting(false);

        if (!result.success) {
            setError(result.message);
            return;
        }

        setSuccessMessage(result.message || "Account has been created successfully. You can log in now.");
        setFormData({
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
            gender: "male",
        });
        setTimeout(() => navigate("/login"), 1200);
    };

    return (
        <Box
            className="bg-mesh"
            sx={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                py: 6,
                px: 2,
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            {/* Ambient Background Elements */}
            <Box sx={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(37, 99, 235, 0.05) 0%, transparent 70%)' }} />
            <Box sx={{ position: 'absolute', bottom: -100, left: -100, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124, 58, 237, 0.05) 0%, transparent 70%)' }} />

            <Paper
                className="glass"
                elevation={0}
                sx={{
                    p: { xs: 4, sm: 6 },
                    width: "100%",
                    maxWidth: "500px",
                    borderRadius: "32px",
                    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)",
                    border: "1px solid rgba(255, 255, 255, 0.8)",
                    display: "flex",
                    flexDirection: "column",
                    gap: 4,
                    position: 'relative',
                    zIndex: 1
                }}
            >
                <Box sx={{ textAlign: "center" }}>
                    <Typography
                        className="premium-text-gradient"
                        sx={{
                            fontSize: "32px",
                            fontWeight: 900,
                            mb: 1,
                            letterSpacing: '-1px'
                        }}
                    >
                        Join StoryLake
                    </Typography>
                    <Typography
                        sx={{
                            fontSize: "16px",
                            color: "#6B7280",
                            fontWeight: 500
                        }}
                    >
                        Start your journey with elite AI career tools
                    </Typography>
                </Box>

                {error && (
                    <Fade in={true}>
                        <Typography
                            sx={{
                                color: "#DC2626",
                                fontSize: "14px",
                                textAlign: "center",
                                bgcolor: "rgba(254, 226, 226, 0.5)",
                                p: 1.5,
                                borderRadius: "12px",
                                border: '1px solid rgba(239, 68, 68, 0.2)',
                                fontWeight: 600
                            }}
                        >
                            {error}
                        </Typography>
                    </Fade>
                )}

                {successMessage && (
                    <Fade in={true}>
                        <Typography
                            sx={{
                                color: "#065F46",
                                fontSize: "14px",
                                textAlign: "center",
                                bgcolor: "rgba(209, 250, 229, 0.6)",
                                p: 1.5,
                                borderRadius: "12px",
                                border: "1px solid rgba(16, 185, 129, 0.25)",
                                fontWeight: 600
                            }}
                        >
                            {successMessage}
                        </Typography>
                    </Fade>
                )}

                <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    <Box>
                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700, color: '#374151' }}>
                            Full Name
                        </Typography>
                        <TextField
                            fullWidth
                            name="name"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={handleChange}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    bgcolor: "rgba(255, 255, 255, 0.5)",
                                    borderRadius: "16px",
                                    transition: "all 0.3s ease",
                                    "& fieldset": { borderColor: "rgba(0,0,0,0.05)" },
                                    "&:hover fieldset": { borderColor: "#2563EB" },
                                    "&.Mui-focused": {
                                        bgcolor: "white",
                                        "& fieldset": { borderColor: "#2563EB", borderWidth: '2px' }
                                    }
                                }
                            }}
                        />
                    </Box>

                    <Box>
                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700, color: '#374151' }}>
                            Email Address
                        </Typography>
                        <TextField
                            fullWidth
                            name="email"
                            type="email"
                            placeholder="john@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    bgcolor: "rgba(255, 255, 255, 0.5)",
                                    borderRadius: "16px",
                                    transition: "all 0.3s ease",
                                    "& fieldset": { borderColor: "rgba(0,0,0,0.05)" },
                                    "&:hover fieldset": { borderColor: "#2563EB" },
                                    "&.Mui-focused": {
                                        bgcolor: "white",
                                        "& fieldset": { borderColor: "#2563EB", borderWidth: '2px' }
                                    }
                                }
                            }}
                        />
                    </Box>

                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700, color: '#374151' }}>
                                Password
                            </Typography>
                            <TextField
                                fullWidth
                                name="password"
                                type="password"
                                placeholder="Min. 6 chars"
                                value={formData.password}
                                onChange={handleChange}
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        bgcolor: "rgba(255, 255, 255, 0.5)",
                                        borderRadius: "16px",
                                        transition: "all 0.3s ease",
                                        "& fieldset": { borderColor: "rgba(0,0,0,0.05)" },
                                        "&:hover fieldset": { borderColor: "#2563EB" },
                                        "&.Mui-focused": {
                                            bgcolor: "white",
                                            "& fieldset": { borderColor: "#2563EB", borderWidth: '2px' }
                                        }
                                    }
                                }}
                            />
                        </Box>
                        <Box sx={{ flex: 1 }}>
                            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700, color: '#374151' }}>
                                Confirm
                            </Typography>
                            <TextField
                                fullWidth
                                name="confirmPassword"
                                type="password"
                                placeholder="Repeat password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        bgcolor: "rgba(255, 255, 255, 0.5)",
                                        borderRadius: "16px",
                                        transition: "all 0.3s ease",
                                        "& fieldset": { borderColor: "rgba(0,0,0,0.05)" },
                                        "&:hover fieldset": { borderColor: "#2563EB" },
                                        "&.Mui-focused": {
                                            bgcolor: "white",
                                            "& fieldset": { borderColor: "#2563EB", borderWidth: '2px' }
                                        }
                                    }
                                }}
                            />
                        </Box>
                    </Box>

                    <Box>
                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700, color: '#374151' }}>
                            Gender
                        </Typography>
                        <TextField
                            fullWidth
                            select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    bgcolor: "rgba(255, 255, 255, 0.5)",
                                    borderRadius: "16px",
                                    transition: "all 0.3s ease",
                                    "& fieldset": { borderColor: "rgba(0,0,0,0.05)" },
                                    "&:hover fieldset": { borderColor: "#2563EB" },
                                    "&.Mui-focused": {
                                        bgcolor: "white",
                                        "& fieldset": { borderColor: "#2563EB", borderWidth: '2px' }
                                    }
                                }
                            }}
                        >
                            <MenuItem value="male">Male</MenuItem>
                            <MenuItem value="female">Female</MenuItem>
                            <MenuItem value="other">Other</MenuItem>
                        </TextField>
                    </Box>

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        disabled={isSubmitting}
                        sx={{
                            bgcolor: "#111827",
                            fontSize: "16px",
                            fontWeight: 700,
                            borderRadius: "16px",
                            py: 2,
                            mt: 1,
                            textTransform: "none",
                            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                            "&:hover": { bgcolor: "#1F2937", transform: 'translateY(-2px)' },
                            transition: 'all 0.3s ease'
                        }}
                    >
                        {isSubmitting ? "Creating account..." : "Create Elite Account"}
                    </Button>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Box sx={{ flex: 1, height: "1px", bgcolor: "rgba(0,0,0,0.05)" }} />
                        <Typography variant="caption" sx={{ color: "#9CA3AF", fontWeight: 700, textTransform: 'uppercase' }}>Social Entry</Typography>
                        <Box sx={{ flex: 1, height: "1px", bgcolor: "rgba(0,0,0,0.05)" }} />
                    </Box>

                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                            fullWidth
                            variant="outlined"
                            disabled
                            sx={{
                                py: 1.5,
                                borderRadius: "12px",
                                textTransform: "none",
                                fontWeight: 600,
                                borderColor: "rgba(0,0,0,0.1)",
                                color: "#374151",
                                "&:hover": { bgcolor: "white", borderColor: "#2563EB" }
                            }}
                        >
                            Google
                        </Button>
                        <Button
                            fullWidth
                            variant="outlined"
                            disabled
                            sx={{
                                py: 1.5,
                                borderRadius: "12px",
                                textTransform: "none",
                                fontWeight: 600,
                                borderColor: "rgba(0,0,0,0.1)",
                                color: "#374151",
                                "&:hover": { bgcolor: "white", borderColor: "#0A66C2" }
                            }}
                        >
                            LinkedIn
                        </Button>
                    </Box>
                </Box>

                <Box sx={{ textAlign: "center" }}>
                    <Typography variant="body2" sx={{ color: "#6B7280", fontWeight: 500 }}>
                        Already have an account?{" "}
                        <Box
                            component={Link}
                            to="/login"
                            sx={{
                                color: "#2563EB",
                                fontWeight: 700,
                                textDecoration: "none",
                                "&:hover": { textDecoration: "underline" },
                            }}
                        >
                            Log in here
                        </Box>
                    </Typography>
                </Box>
            </Paper>
        </Box>
    );
};

export default Signup;
