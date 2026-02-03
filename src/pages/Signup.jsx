import { Box, Button, TextField, Typography, Paper } from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const Signup = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const { signup } = useAuth();
    const navigate = useNavigate();
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError(""); // Clear error on input change
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

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

        const result = signup(formData.name, formData.email, formData.password);
        if (result.success) {
            alert("Account created successfully! Please log in.");
            navigate("/login");
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
                        Create Account
                    </Typography>
                    <Typography
                        sx={{
                            fontFamily: "Inter, sans-serif",
                            fontSize: "16px",
                            color: "#6B7280",
                        }}
                    >
                        Join us to get started with your journey
                    </Typography>
                </Box>



                {
                    error && (
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
                    )
                }

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
                            name="password"
                            type="password"
                            placeholder="Create a password"
                            value={formData.password}
                            onChange={handleChange}
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
                            Confirm Password
                        </Typography>
                        <TextField
                            fullWidth
                            name="confirmPassword"
                            type="password"
                            placeholder="Confirm your password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
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
                            mt: 1,
                            textTransform: "none",
                            boxShadow: "0 4px 6px -1px rgba(37, 99, 235, 0.1), 0 2px 4px -1px rgba(37, 99, 235, 0.06)",
                            "&:hover": { backgroundColor: "#1D4ED8" },
                        }}
                    >
                        Sign Up
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
                        Already have an account?{" "}
                        <Box
                            component={Link}
                            to="/login"
                            sx={{
                                color: "#2563EB",
                                fontWeight: 600,
                                textDecoration: "none",
                                "&:hover": { textDecoration: "underline" },
                            }}
                        >
                            Log in
                        </Box>
                    </Typography>
                </Box>
            </Paper>
        </Box>
    );
};

export default Signup;
