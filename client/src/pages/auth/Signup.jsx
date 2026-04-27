import { Box, Button, TextField, Typography, Paper, Fade, MenuItem } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";

const Signup = () => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        gender: "male",
    });

    const { signup } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();
    const [error, setError] = useState(() => searchParams.get("oauth_error") || "");
    const [successMessage, setSuccessMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (searchParams.has("oauth_error")) {
            const next = new URLSearchParams(searchParams);
            next.delete("oauth_error");
            setSearchParams(next, { replace: true });
        }
    }, [searchParams, setSearchParams]);


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
        setTimeout(() => navigate("/login", { state: { from: location.state?.from || "/" } }), 1200);
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
                        {t("Sign Up")}
                    </Typography>
                    <Typography
                        sx={{
                            fontSize: "16px",
                            color: "#6B7280",
                            fontWeight: 500
                        }}
                    >
                        {t("Join Journey")}
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
                            {t("Full Name")}
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
                            {t("Email Address")}
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
                                {t("Password")}
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
                                {t("Confirm")}
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
                        {isSubmitting ? t("Signing Up") : t("Create Elite Account")}
                    </Button>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Box sx={{ flex: 1, height: "1px", bgcolor: "rgba(0,0,0,0.05)" }} />
                        <Typography variant="caption" sx={{ color: "#9CA3AF", fontWeight: 700, textTransform: 'uppercase' }}>{t("Social Entry")}</Typography>
                        <Box sx={{ flex: 1, height: "1px", bgcolor: "rgba(0,0,0,0.05)" }} />
                    </Box>

                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                        <Button
                            component="a"
                            href="/api/v1/auth/google/start"
                            fullWidth
                            variant="outlined"
                            startIcon={
                                <svg width="18" height="18" viewBox="0 0 18 18">
                                    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285f4" />
                                    <path d="M9 18c2.43 0 4.467-.806 5.956-2.184L12.048 13.558c-.824.551-1.879.878-3.048.878-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.34 18 9 18z" fill="#34a853" />
                                    <path d="M3.964 10.725A5.456 5.456 0 013.682 9c0-.6.103-1.176.282-1.725V4.943H.957A8.996 8.996 0 000 9c0 1.451.347 2.822.957 4.032l3.007-2.307z" fill="#fbbc05" />
                                    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.34 0 2.438 2.017.957 4.943L3.964 7.275C4.672 5.148 6.656 3.58 9 3.58z" fill="#ea4335" />
                                </svg>
                            }
                            sx={{
                                py: 1.5,
                                borderRadius: "12px",
                                textTransform: "none",
                                fontWeight: 600,
                                borderColor: "rgba(0,0,0,0.12)",
                                color: "#374151",
                                textDecoration: "none",
                                gap: 1
                            }}
                        >
                            Continue with Google
                        </Button>
                        <Button
                            fullWidth
                            variant="outlined"
                            disabled
                            title="LinkedIn sign-in coming soon"
                            sx={{
                                py: 1.5,
                                borderRadius: "12px",
                                textTransform: "none",
                                fontWeight: 600,
                                borderColor: "rgba(0,0,0,0.1)",
                                color: "#9CA3AF",
                            }}
                        >
                            LinkedIn (coming soon)
                        </Button>
                    </Box>
                </Box>

                <Box sx={{ textAlign: "center" }}>
                    <Typography variant="body2" sx={{ color: "#6B7280", fontWeight: 500 }}>
                        {t("Already have an account?")}{" "}
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
                            {t("Log in here")}
                        </Box>
                    </Typography>
                </Box>
            </Paper>
        </Box>
    );
};

export default Signup;
