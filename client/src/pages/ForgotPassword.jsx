import { Box, Button, Container, Paper, TextField, Typography, Fade } from "@mui/material";
import { useState } from "react";
import { Link } from "react-router-dom";
import { forgetPassword } from "../api/user";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!email.trim()) {
      setError("Email is required.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await forgetPassword({ email });
      setMessage(res?.message || "If this email exists, reset instructions were sent.");
    } catch (err) {
      setError(err?.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box className="bg-mesh" sx={{ minHeight: "100vh", py: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <Container maxWidth="sm">
        <Paper
          className="glass"
          elevation={0}
          sx={{
            p: { xs: 3, sm: 5 },
            borderRadius: "32px",
            border: "1px solid rgba(255,255,255,0.8)",
          }}
        >
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Typography className="premium-text-gradient" sx={{ fontSize: 30, fontWeight: 900, mb: 1 }}>
              Reset Your Password
            </Typography>
            <Typography sx={{ color: "#6B7280", fontWeight: 500 }}>
              Enter your email and we will send you a reset link.
            </Typography>
          </Box>

          {error && (
            <Fade in={true}>
              <Typography sx={{ color: "#DC2626", fontWeight: 700, fontSize: 14, mb: 2, bgcolor: "rgba(254,226,226,0.5)", p: 1.5, borderRadius: 2, border: "1px solid rgba(239,68,68,0.2)" }}>
                {error}
              </Typography>
            </Fade>
          )}

          {message && (
            <Fade in={true}>
              <Typography sx={{ color: "#065F46", fontWeight: 700, fontSize: 14, mb: 2, bgcolor: "rgba(209,250,229,0.6)", p: 1.5, borderRadius: 2, border: "1px solid rgba(16,185,129,0.25)" }}>
                {message}
              </Typography>
            </Fade>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isSubmitting}
              sx={{ bgcolor: "#111827", py: 1.5, fontWeight: 800, borderRadius: "16px", textTransform: "none", "&:hover": { bgcolor: "#1F2937" } }}
            >
              {isSubmitting ? "Sending..." : "Send Reset Link"}
            </Button>

            <Typography sx={{ textAlign: "center", mt: 1, color: "#6B7280", fontWeight: 500, fontSize: 13 }}>
              Remembered your password?{" "}
              <Link to="/login" style={{ color: "#2563EB", textDecoration: "none", fontWeight: 800 }}>
                Go to login
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

