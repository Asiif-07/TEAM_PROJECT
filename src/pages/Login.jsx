import { Box, Button, TextField, Typography, Paper, Checkbox, FormControlLabel } from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!email || !password) {
            setError("Please fill in all fields.");
            return;
        }

        const result = login(email, password);
        if (result.success) {
            navigate("/");
        } else {
            setError(result.message);
        }
    };

    return (
        <Box
            sx={{
                minHeight: "80vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(180deg, #D1E9FF 0%, #FFFFFF 100%)",
                py: 4,
                px: 2,
            }}
        >
            <Paper
                elevation={0}
                sx={{
                    p: { xs: 3, sm: 5 },
                    width: "100%",
                    maxWidth: "450px",
                    borderRadius: "16px",
                    boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
                    border: "1px solid #E5E7EB",
                    display: "flex",
                    flexDirection: "column",
                    gap: 3,
                }}
            >
                <Box sx={{ textAlign: "center", mb: 1 }}>
                    <Typography
                        sx={{
                            fontFamily: "Inter, sans-serif",
                            fontSize: "28px",
                            fontWeight: 700,
                            color: "#1E3A8A",
                            mb: 1,
                        }}
                    >
                        Welcome Back
                    </Typography>
                    <Typography
                        sx={{
                            fontFamily: "Inter, sans-serif",
                            fontSize: "16px",
                            color: "#6B7280",
                        }}
                    >
                        Please enter your details to sign in
                    </Typography>
                </Box>

                {error && (
                    <Typography
                        sx={{
                            color: "#EF4444",
                            fontSize: "14px",
                            textAlign: "center",
                            mb: 2,
                            bgcolor: "#FEE2E2",
                            p: 1,
                            borderRadius: "6px",
                        }}
                    >
                        {error}
                    </Typography>
                )}

                <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
                    <Box>
                        <Typography
                            sx={{
                                fontFamily: "Inter, sans-serif",
                                fontSize: "14px",
                                fontWeight: 500,
                                color: "#1F2937",
                                mb: 1,
                            }}
                        >
                            Email Address
                        </Typography>
                        <TextField
                            fullWidth
                            placeholder="Enter your email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: "8px",
                                    "& fieldset": { borderColor: "#E5E7EB" },
                                    "&:hover fieldset": { borderColor: "#2563EB" },
                                    "&.Mui-focused fieldset": { borderColor: "#2563EB" },
                                },
                                "& input": {
                                    fontFamily: "Inter, sans-serif",
                                    fontSize: "14px",
                                    padding: "12px 14px",
                                },
                            }}
                        />
                    </Box>

                    <Box>
                        <Typography
                            sx={{
                                fontFamily: "Inter, sans-serif",
                                fontSize: "14px",
                                fontWeight: 500,
                                color: "#1F2937",
                                mb: 1,
                            }}
                        >
                            Password
                        </Typography>
                        <TextField
                            fullWidth
                            placeholder="Enter your password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            sx={{
                                "& .MuiOutlinedInput-root": {
                                    borderRadius: "8px",
                                    "& fieldset": { borderColor: "#E5E7EB" },
                                    "&:hover fieldset": { borderColor: "#2563EB" },
                                    "&.Mui-focused fieldset": { borderColor: "#2563EB" },
                                },
                                "& input": {
                                    fontFamily: "Inter, sans-serif",
                                    fontSize: "14px",
                                    padding: "12px 14px",
                                },
                            }}
                        />
                    </Box>

                    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    sx={{
                                        color: "#D1D5DB",
                                        "&.Mui-checked": { color: "#2563EB" },
                                    }}
                                />
                            }
                            label={
                                <Typography sx={{ fontFamily: "Inter, sans-serif", fontSize: "14px", color: "#4B5563" }}>
                                    Remember me
                                </Typography>
                            }
                        />
                        <Typography
                            component={Link}
                            to="/forgot-password"
                            sx={{
                                fontFamily: "Inter, sans-serif",
                                fontSize: "14px",
                                fontWeight: 500,
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
                            backgroundColor: "#2563EB",
                            fontFamily: "Inter, sans-serif",
                            fontSize: "16px",
                            fontWeight: 600,
                            borderRadius: "8px",
                            py: "12px",
                            textTransform: "none",
                            boxShadow: "0 4px 6px -1px rgba(37, 99, 235, 0.1), 0 2px 4px -1px rgba(37, 99, 235, 0.06)",
                            "&:hover": { backgroundColor: "#1D4ED8" },
                        }}
                    >
                        Sign In
                    </Button>
                </Box>

                <Box sx={{ textAlign: "center", mt: 1 }}>
                    <Typography
                        sx={{
                            fontFamily: "Inter, sans-serif",
                            fontSize: "14px",
                            color: "#6B7280",
                        }}
                    >
                        Don't have an account?{" "}
                        <Box
                            component={Link}
                            to="/signup"
                            sx={{
                                color: "#2563EB",
                                fontWeight: 600,
                                textDecoration: "none",
                                "&:hover": { textDecoration: "underline" },
                            }}
                        >
                            Sign up
                        </Box>
                    </Typography>
                </Box>
            </Paper>
        </Box>
    );
};

export default Login;
