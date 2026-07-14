import { Box, Button, TextField, Typography, Paper, Checkbox, FormControlLabel, Fade } from "@mui/material";
import LoginLoader from "./LoginLoader";

import { useTranslation } from "react-i18next";
import { useNavigate, Link, useLocation, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { getApiBaseUrl } from "../../utils/apiBaseUrl";
import { useGoogleLogin } from "@react-oauth/google";

const Login = () => {
    const { t } = useTranslation();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login, loginWithGoogle } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from || "/";
    const [searchParams, setSearchParams] = useSearchParams();
    const [error, setError] = useState(() => searchParams.get("oauth_error") || "");

    const [loggingIn, setLoggingIn] = useState(false);

    useEffect(() => {
        if (searchParams.has("oauth_error")) {
            const next = new URLSearchParams(searchParams);
            next.delete("oauth_error");
            setSearchParams(next, { replace: true });
        }
    }, [searchParams, setSearchParams]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoggingIn(true);

        if (!email || !password) {
            setError("Please fill in all fields.");
            setLoggingIn(false);
            return;
        }

        try {
            const result = await login(email, password);
            if (result.success) {
                navigate(from, { replace: true });
            } else {
                setError(result.message);
            }
        } finally {
            setLoggingIn(false);
        }
    };

    const handleGoogleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            setLoggingIn(true);
            try {
                const result = await loginWithGoogle({ access_token: tokenResponse.access_token });
                if (result.success) {
                    navigate(from, { replace: true });
                } else {
                    setError(result.message || "Google sign-in failed.");
                }
            } catch (e) {
                setError(e?.message || "Google sign-in failed.");
            } finally {
                setLoggingIn(false);
            }
        },
        onError: () => {
            setError("Google sign-in failed. Please try again.");
            setLoggingIn(false);
        },
    });

    return (
        <>
            <LoginLoader open={loggingIn} text={"Signing you in..."} />

            <Box
                className="bg-mesh"
                sx={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    py: 4,
                    px: 2,
                    position: "relative",
                    overflow: "hidden",
                }}
            >
                {/* Ambient Background Elements */}
                <Box
                    sx={{
                        position: "absolute",
                        top: -100,
                        right: -100,
                        width: 400,
                        height: 400,
                        borderRadius: "50%",
                        background:
                            "radial-gradient(circle, rgba(37, 99, 235, 0.05) 0%, transparent 70%)",
                    }}
                />
                <Box
                    sx={{
                        position: "absolute",
                        bottom: -100,
                        left: -100,
                        width: 400,
                        height: 400,
                        borderRadius: "50%",
                        background:
                            "radial-gradient(circle, rgba(124, 58, 237, 0.05) 0%, transparent 70%)",
                    }}
                />

                <Paper
                    className="glass"
                    elevation={0}
                    sx={{
                        p: { xs: 4, sm: 6 },
                        width: "100%",
                        maxWidth: "480px",
                        borderRadius: "32px",
                        boxShadow:
                            "0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)",
                        border: "1px solid rgba(255, 255, 255, 0.8)",
                        display: "flex",
                        flexDirection: "column",
                        gap: 4,
                        position: "relative",
                        zIndex: 1,
                    }}
                >
                    <Box sx={{ textAlign: "center" }}>
                        <Typography
                            className="premium-text-gradient"
                            sx={{
                                fontSize: "32px",
                                fontWeight: 900,
                                mb: 1,
                                letterSpacing: "-1px",
                            }}
                        >
                            {t("Welcome Back")}
                        </Typography>
                        <Typography
                            sx={{
                                fontSize: "16px",
                                color: "#6B7280",
                                fontWeight: 500,
                            }}
                        >
                            {t("Sign In Access")}
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
                                    border: "1px solid rgba(239, 68, 68, 0.2)",
                                    fontWeight: 600,
                                }}
                            >
                                {error}
                            </Typography>
                        </Fade>
                    )}

                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                        sx={{ display: "flex", flexDirection: "column", gap: 3 }}
                    >
                        <Box>
                            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700, color: "#374151" }}>
                                {t("Email Address")}
                            </Typography>
                            <TextField
                                fullWidth
                                placeholder="name@company.com"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        bgcolor: "rgba(255, 255, 255, 0.5)",
                                        borderRadius: "16px",
                                        transition: "all 0.3s ease",
                                        "& fieldset": { borderColor: "rgba(0,0,0,0.05)" },
                                        "&:hover fieldset": { borderColor: "#2563EB" },
                                        "&.Mui-focused": {
                                            bgcolor: "white",
                                            "& fieldset": { borderColor: "#2563EB", borderWidth: "2px" },
                                        },
                                    },
                                }}
                            />
                        </Box>

                        <Box>
                            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700, color: "#374151" }}>
                                {t("Password")}
                            </Typography>
                            <TextField
                                fullWidth
                                placeholder="Enter your secure password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                sx={{
                                    "& .MuiOutlinedInput-root": {
                                        bgcolor: "rgba(255, 255, 255, 0.5)",
                                        borderRadius: "16px",
                                        transition: "all 0.3s ease",
                                        "& fieldset": { borderColor: "rgba(0,0,0,0.05)" },
                                        "&:hover fieldset": { borderColor: "#2563EB" },
                                        "&.Mui-focused": {
                                            bgcolor: "white",
                                            "& fieldset": { borderColor: "#2563EB", borderWidth: "2px" },
                                        },
                                    },
                                }}
                            />
                        </Box>

                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <FormControlLabel
                                control={<Checkbox sx={{ color: "#D1D5DB", "&.Mui-checked": { color: "#2563EB" } }} />}
                                label={
                                    <Typography variant="body2" sx={{ color: "#4B5563", fontWeight: 500 }}>
                                        Remember me
                                    </Typography>
                                }
                            />
                            <Typography
                                component={Link}
                                to="/forgot-password"
                                sx={{
                                    fontSize: "14px",
                                    fontWeight: 600,
                                    color: "#2563EB",
                                    textDecoration: "none",
                                    "&:hover": { textDecoration: "underline" },
                                }}
                            >
                                Forgot Password?
                            </Typography>
                        </Box>

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
                                "&:hover": { bgcolor: "#1F2937", transform: "translateY(-2px)" },
                                transition: "all 0.3s ease",
                            }}
                        >
                            {t("Sign In")}
                        </Button>

                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                            <Box sx={{ flex: 1, height: "1px", bgcolor: "rgba(0,0,0,0.05)" }} />
                            <Typography variant="caption" sx={{ color: "#9CA3AF", fontWeight: 700, textTransform: "uppercase" }}>
                                {t("Secure Connect")}
                            </Typography>
                            <Box sx={{ flex: 1, height: "1px", bgcolor: "rgba(0,0,0,0.05)" }} />
                        </Box>

                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                            <Button
                                onClick={() => handleGoogleLogin()}
                                type="button"
                                fullWidth
                                variant="outlined"
                                startIcon={
                                    <svg width="18" height="18" viewBox="0 0 48 48">
                                        <path
                                            fill="#FFC107"
                                            d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.1 8 3l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.2-.1-2.4-.4-3.5z"
                                        />
                                        <path
                                            fill="#FF3D00"
                                            d="m6.3 14.7 6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.8 1.1 8 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"
                                        />
                                        <path
                                            fill="#4CAF50"
                                            d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.3 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8H6.1c3.4 6.5 10.2 11 17.9 11z"
                                        />
                                        <path
                                            fill="#1976D2"
                                            d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.4 4.3-4.4 5.7l6.2 5.2C41 35 44 30 44 24c0-1.2-.1-2.4-.4-3.5z"
                                        />
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
                                }}
                            >
                                Continue with Google
                            </Button>
                            <Button
                                component="a"
                                href={`${getApiBaseUrl()}/auth/linkedin/start`}
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
                                    gap: 1,
                                }}
                            >
                                Continue with LinkedIn
                            </Button>
                        </Box>
                    </Box>

                    <Box sx={{ textAlign: "center" }}>
                        <Typography variant="body2" sx={{ color: "#6B7280", fontWeight: 500 }}>
                            {t("Login Help")}{" "}
                            <Box
                                component={Link}
                                to="/signup"
                                sx={{
                                    color: "#2563EB",
                                    fontWeight: 700,
                                    textDecoration: "none",
                                    "&:hover": { textDecoration: "underline" },
                                }}
                            >
                                {t("Create Account Link")}
                            </Box>
                        </Typography>
                    </Box>
                </Paper>
            </Box>
        </>
    );
};

export default Login;

