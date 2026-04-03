import { Box, Button, Container, Paper, TextField, Typography, Fade } from "@mui/material";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { resetPassword } from "../api/user";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!token) {
      setError("Invalid or missing reset token.");
      return;
    }

    if (!password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await resetPassword({ token, password, confirmPassword });
      setMessage(res?.message || "Password changed successfully.");
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setError(err?.message || "Failed to reset password. Please try again.");
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
              Reset Password
            </Typography>
            <Typography sx={{ color: "#6B7280", fontWeight: 500 }}>
              Choose a new password for your account.
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
                {message} Redirecting to login...
              </Typography>
            </Fade>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              fullWidth
              label="New Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <TextField
              fullWidth
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={isSubmitting}
              sx={{ bgcolor: "#111827", py: 1.5, fontWeight: 800, borderRadius: "16px", textTransform: "none", "&:hover": { bgcolor: "#1F2937" } }}
            >
              {isSubmitting ? "Updating..." : "Update Password"}
            </Button>

            <Typography sx={{ textAlign: "center", mt: 1, color: "#6B7280", fontWeight: 500, fontSize: 13 }}>
              Remembered it?{" "}
              <Link to="/login" style={{ color: "#2563EB", textDecoration: "none", fontWeight: 800 }}>
                Back to login
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}

