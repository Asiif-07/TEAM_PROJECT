import { Box, Button, TextField, Typography, Paper, Fade, MenuItem } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useGoogleLogin } from "@react-oauth/google";

const Signup = () => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        gender: "male",
    });

    const { signup, loginWithGoogle } = useAuth();
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

    const handleGoogleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            const result = await loginWithGoogle({ access_token: tokenResponse.access_token });
            if (result.success) {
                navigate(location.state?.from || "/", { replace: true });
            } else {
                setError(result.message || "Google sign-in failed.");
            }
        },
        onError: () => setError("Google sign-in failed. Please try again."),
    });
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
                            {t("Gender")}
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

                    <Box>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{
                                bgcolor: "#111827",
                                fontSize: "16px",
                                fontWeight: 700,
                                borderRadius: "16px",
                                py: 2,
                                textTransform: "none",
                                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                                "&:hover": { bgcolor: "#1F2937", transform: 'translateY(-2px)' },
                                transition: 'all 0.3s ease'
                            }}
                        >
                            {isSubmitting ? t("Signing Up") : t("Create Elite Account")}
                        </Button>
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Box sx={{ flex: 1, height: "1px", bgcolor: "rgba(0,0,0,0.05)" }} />
                        <Typography variant="caption" sx={{ color: "#9CA3AF", fontWeight: 700, textTransform: 'uppercase' }}>{t("Social Entry")}</Typography>
                        <Box sx={{ flex: 1, height: "1px", bgcolor: "rgba(0,0,0,0.05)" }} />
                    </Box>

                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                        <Button
                            type="button"
                            onClick={() => handleGoogleLogin()}
                            disabled={isSubmitting}
                            fullWidth
                            variant="outlined"
                            startIcon={
                                <svg width="18" height="18" viewBox="0 0 48 48">
                                    <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.4-.4-3.5z" />
                                    <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.8 1.1 8 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
                                    <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.3 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8H6.1c3.4 6.5 10.2 11 17.9 11z" />
                                    <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.4 4.3-4.4 5.7l6.2 5.2C41 35 44 30 44 24c0-1.2-.1-2.4-.4-3.5z" />
                                </svg>
                            }
                            sx={{
                                py: 1.5,
                                borderRadius: "12px",
                                textTransform: "none",
                                fontWeight: 600,
                                borderColor: "rgba(0,0,0,0.12)",
                                color: "#374151",
                                gap: 1,
                                "&:hover": { borderColor: "#4285F4", bgcolor: "rgba(66,133,244,0.04)" }
                            }}
                        >
                            Continue with Google
                        </Button>
                        <Button
                            component="a"
                            href={`${import.meta.env.VITE_API_BASE_URL}/auth/linkedin/start`}
                            disabled={isSubmitting}
                            fullWidth
                            variant="outlined"
                            startIcon={
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="#0077b5">
                                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
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
                            Continue with LinkedIn
                        </Button>
                    </Box>
                </Box>

                <Box sx={{ textAlign: "center" }}>
                    <Typography variant="body2" sx={{ color: "#6B7280", fontWeight: 500 }}>
                        {t("Already have an account?")} {" "}
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
