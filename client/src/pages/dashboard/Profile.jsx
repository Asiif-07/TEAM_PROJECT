import React, { useState, useRef, useEffect } from "react";
import { Box, Container, Paper, Typography, Avatar, Divider, Button, IconButton, CircularProgress, TextField, Collapse } from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import { FileText, User, Mail, Calendar, Camera, XCircle, Lock, ChevronDown, ChevronUp, Linkedin } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { updateProfilePic, updateEmail, changePassword } from "../../api/user";
import { verifySession, cancelSubscription } from "../../api/stripe";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";

export default function Profile() {
    const { t } = useTranslation();
    const { user, setUser, accessToken, refreshAccessToken } = useAuth();
    const [uploading, setUploading] = useState(false);
    const [verifying, setVerifying] = useState(false);
    const [canceling, setCanceling] = useState(false);
    const fileInputRef = useRef(null);
    const [searchParams, setSearchParams] = useSearchParams();

    const [showEmailForm, setShowEmailForm] = useState(false);
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [emailData, setEmailData] = useState({ email: "" });
    const [passwordData, setPasswordData] = useState({ oldPassword: "", newPassword: "", confirmPassword: "" });
    const [updatingEmail, setUpdatingEmail] = useState(false);
    const [updatingPassword, setUpdatingPassword] = useState(false);


    useEffect(() => {
        const sessionId = searchParams.get("session_id");
        const success = searchParams.get("success");

        if (success === "true" && sessionId && !verifying) {
            setVerifying(true);
            toast.loading(t("Verifying your payment..."), { id: "verify-payment" });

            verifySession({ sessionId, accessToken, refreshAccessToken })
                .then((res) => {
                    if (res && res.user) {
                        setUser(res.user);
                        localStorage.setItem("currentUser", JSON.stringify(res.user));
                        toast.success(t("Payment Successful! Premium activated."), { id: "verify-payment" });
                    }
                    searchParams.delete("session_id");
                    searchParams.delete("success");
                    setSearchParams(searchParams, { replace: true });
                })
                .catch((err) => {
                    toast.error(err.message || t("Could not verify payment."), { id: "verify-payment" });
                })
                .finally(() => {
                    setVerifying(false);
                });
        }
    }, [searchParams, accessToken, refreshAccessToken, t, setUser, setSearchParams, verifying]);

    const handleCancelSubscription = async () => {
        setCanceling(true);
        toast.loading(t("Canceling subscription..."), { id: "cancel-sub" });

        try {
            const res = await cancelSubscription({ accessToken, refreshAccessToken });
            if (res && res.user) {
                setUser(res.user);
                localStorage.setItem("currentUser", JSON.stringify(res.user));
                toast.success(t("Your subscription has been successfully canceled."), { id: "cancel-sub" });
            }
        } catch (error) {
            toast.error(error.message || t("Failed to cancel subscription."), { id: "cancel-sub" });
        } finally {
            setCanceling(false);
        }
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        try {
            const response = await updateProfilePic({
                accessToken,
                refreshAccessToken,
                file
            });

            if (response.success && response.data) {
                setUser(response.data);
                localStorage.setItem("currentUser", JSON.stringify(response.data));
                toast.success(t("Profile picture updated!"));
            }
        } catch (error) {
            console.error("Failed to upload profile picture:", error);
            toast.error(t("Failed to update profile picture"));
        } finally {
            setUploading(false);
        }
    };

    const handleUpdateEmail = async (e) => {
        e.preventDefault();
        if (!emailData.email) return toast.error(t("Please enter a new email"));
        if (emailData.email === user.email) return toast.error(t("New email must be different"));

        setUpdatingEmail(true);
        try {
            const res = await updateEmail({
                accessToken,
                refreshAccessToken,
                email: emailData.email
            });
            if (res.success) {
                setUser(res.data);
                localStorage.setItem("currentUser", JSON.stringify(res.data));
                toast.success(t("Email updated successfully!"));
                setShowEmailForm(false);
                setEmailData({ email: "" });
            }
        } catch (error) {
            toast.error(error.message || t("Failed to update email"));
        } finally {
            setUpdatingEmail(false);
        }
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        const { oldPassword, newPassword, confirmPassword } = passwordData;

        if (!oldPassword || !newPassword || !confirmPassword) {
            return toast.error(t("Please fill in all fields"));
        }
        if (newPassword !== confirmPassword) {
            return toast.error(t("Passwords do not match"));
        }
        if (newPassword.length < 6) {
            return toast.error(t("Password must be at least 6 characters"));
        }

        setUpdatingPassword(true);
        try {
            const res = await changePassword({
                accessToken,
                refreshAccessToken,
                oldPassword,
                newPassword
            });
            if (res.success) {
                toast.success(t("Password updated successfully!"));
                setShowPasswordForm(false);
                setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
            }
        } catch (error) {
            toast.error(error.message || t("Failed to update password"));
        } finally {
            setUpdatingPassword(false);
        }
    };

    if (!user) {
        return (
            <Container maxWidth="sm" sx={{ py: 20, textAlign: "center" }}>
                <Typography variant="h5">{t("Login To View Profile")}</Typography>
            </Container>
        );
    }

    return (
        <Box sx={{ minHeight: "100vh", position: "relative", py: { xs: 8, md: 12 }, overflow: "hidden" }} className="bg-mesh">
            {/* Ambient Background Orbs */}
            <Box sx={{ position: "absolute", top: "-10%", left: "-10%", width: "50vw", height: "50vw", background: "radial-gradient(circle, rgba(66,133,244,0.1) 0%, rgba(255,255,255,0) 70%)", borderRadius: "50%", zIndex: 0 }} />
            <Box sx={{ position: "absolute", bottom: "-10%", right: "-10%", width: "60vw", height: "60vw", background: "radial-gradient(circle, rgba(16,185,129,0.08) 0%, rgba(255,255,255,0) 70%)", borderRadius: "50%", zIndex: 0 }} />
            <Box sx={{ position: "absolute", top: "40%", left: "60%", width: "30vw", height: "30vw", background: "radial-gradient(circle, rgba(236,72,153,0.06) 0%, rgba(255,255,255,0) 70%)", borderRadius: "50%", zIndex: 0 }} />

            <Container maxWidth="sm" sx={{ position: "relative", zIndex: 1 }}>
                <Paper elevation={0} sx={{
                    p: { xs: 4, md: 5 },
                    borderRadius: "32px",
                    background: "rgba(255, 255, 255, 0.65)",
                    backdropFilter: "blur(24px)",
                    WebkitBackdropFilter: "blur(24px)",
                    boxShadow: "0 24px 64px rgba(0, 0, 0, 0.08), inset 0 0 0 1px rgba(255, 255, 255, 0.6)",
                    textAlign: "center"
                }}>

                    {/* Animated Gradient Avatar */}
                    <Box sx={{ position: "relative", width: 140, height: 140, mx: "auto", mb: 4 }}>
                        <Box sx={{
                            position: "absolute", top: -4, left: -4, right: -4, bottom: -4,
                            background: "linear-gradient(45deg, #FF6B6B, #4ECDC4, #45B7D1, #FFBE0B)",
                            backgroundSize: "400% 400%",
                            animation: "gradientBG 10s ease infinite",
                            borderRadius: "50%",
                            zIndex: 0
                        }}>
                            <style>
                                {`
                                @keyframes gradientBG {
                                    0% { background-position: 0% 50%; }
                                    50% { background-position: 100% 50%; }
                                    100% { background-position: 0% 50%; }
                                }
                                `}
                            </style>
                        </Box>

                        <Avatar
                            src={user.profileImage?.secure_url}
                            sx={{
                                width: 140, height: 140,
                                bgcolor: "#111827",
                                fontSize: "56px",
                                fontWeight: 800,
                                border: "4px solid #ffffff",
                                position: "relative",
                                zIndex: 1,
                                boxShadow: "0 8px 24px rgba(0,0,0,0.15)"
                            }}
                        >
                            {!user.profileImage?.secure_url && user.name?.charAt(0).toUpperCase()}
                        </Avatar>

                        <input
                            type="file"
                            hidden
                            ref={fileInputRef}
                            accept="image/*"
                            onChange={handleFileChange}
                        />

                        <IconButton
                            onClick={() => fileInputRef.current.click()}
                            disabled={uploading}
                            sx={{
                                position: "absolute", bottom: 4, right: 4,
                                bgcolor: "#111827", color: "white", p: 1.2,
                                zIndex: 2,
                                transition: "all 0.3s ease",
                                "&:hover": { bgcolor: "#374151", transform: "scale(1.1)" },
                                boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
                            }}
                        >
                            {uploading ? <CircularProgress size={20} color="inherit" /> : <Camera size={20} />}
                        </IconButton>
                    </Box>

                    {/* Header Info */}
                    <Typography variant="h4" fontWeight="800" color="#111827" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, letterSpacing: "-0.5px" }}>
                        {user.name}
                    </Typography>

                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1, mb: 5, mt: 1.5 }}>
                        <Typography variant="body2" sx={{
                            background: user.subscriptionStatus === "active"
                                ? "linear-gradient(90deg, #F59E0B, #EF4444, #EC4899)"
                                : "#E5E7EB",
                            color: user.subscriptionStatus === "active" ? "#ffffff" : "#6B7280",
                            px: 2, py: 0.6,
                            borderRadius: "100px",
                            fontWeight: "800",
                            fontSize: "12px",
                            letterSpacing: "0.5px",
                            textTransform: "uppercase",
                            display: "inline-flex",
                            alignItems: "center",
                            boxShadow: user.subscriptionStatus === "active" ? "0 4px 14px rgba(239, 68, 68, 0.4)" : "none",
                            transition: "all 0.3s ease",
                            "&:hover": { transform: "translateY(-1px)", boxShadow: user.subscriptionStatus === "active" ? "0 6px 20px rgba(239, 68, 68, 0.5)" : "none" }
                        }}>
                            {user.subscriptionStatus === "active" ? `👑 ${t("Premium Member")}` : t("Free Plan")}
                        </Typography>

                        {user.subscriptionStatus === "active" && (
                            <Button
                                onClick={handleCancelSubscription}
                                disabled={canceling}
                                color="error"
                                size="small"
                                startIcon={canceling ? <CircularProgress size={12} color="inherit" /> : <XCircle size={14} />}
                                sx={{ textTransform: 'none', fontSize: '11px', fontWeight: 600, mt: 0.5, opacity: 0.6, "&:hover": { opacity: 1, backgroundColor: "rgba(239, 68, 68, 0.08)" }, borderRadius: '8px', px: 1.5 }}
                            >
                                {canceling ? t("Canceling...") : t("Cancel Premium")}
                            </Button>
                        )}
                    </Box>

                    <Divider sx={{ mb: 4, borderColor: "rgba(0,0,0,0.06)" }} />

                    {/* Data List container */}
                    <Box sx={{ textAlign: "left", mb: 4 }}>
                        {/* Email Row */}
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1, p: 2, borderRadius: "16px", transition: "all 0.3s ease", "&:hover": { background: "rgba(255, 255, 255, 0.8)", transform: "translateX(4px)", boxShadow: "0 4px 12px rgba(0,0,0,0.02)" } }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2.5 }}>
                                <Box sx={{ p: 1.2, borderRadius: "12px", background: "rgba(37, 99, 235, 0.1)", color: "#2563EB" }}>
                                    <Mail size={20} />
                                </Box>
                                <Box>
                                    <Typography variant="caption" sx={{ color: "#9CA3AF", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", fontSize: "10px" }}>{t("Email Address")}</Typography>
                                    <Typography variant="body1" fontWeight="700" color="#1F2937">{user.email}</Typography>
                                </Box>
                            </Box>
                            <Button size="small" onClick={() => setShowEmailForm(!showEmailForm)} sx={{ textTransform: "none", fontSize: "12px", fontWeight: 600, borderRadius: "20px", color: "#2563EB", bgcolor: "rgba(37, 99, 235, 0.05)", px: 2 }} endIcon={showEmailForm ? <ChevronUp size={14} /> : <ChevronDown size={14} />}>
                                {t("Edit")}
                            </Button>
                        </Box>

                        <Collapse in={showEmailForm}>
                            <Box component="form" onSubmit={handleUpdateEmail} sx={{ mb: 3, ml: 2, mr: 2, p: 2.5, background: "rgba(255,255,255,0.9)", borderRadius: "16px", border: "1px solid rgba(0,0,0,0.05)", boxShadow: "0 4px 12px rgba(0,0,0,0.02)" }}>
                                <TextField fullWidth size="small" type="email" placeholder={t("Enter new email")} value={emailData.email} onChange={(e) => setEmailData({ email: e.target.value })}
                                    sx={{ mb: 2, "& .MuiOutlinedInput-root": { borderRadius: "10px", bgcolor: "#fff", transition: "all 0.2s", "&:focus-within": { boxShadow: "0 0 0 3px rgba(37, 99, 235, 0.1)" } } }}
                                />
                                <Button fullWidth type="submit" variant="contained" disabled={updatingEmail} sx={{ borderRadius: "10px", bgcolor: "#111827", textTransform: "none", py: 1.2, fontWeight: 700, boxShadow: "0 4px 12px rgba(17, 24, 39, 0.2)", "&:hover": { bgcolor: "#1F2937" } }}>
                                    {updatingEmail ? <CircularProgress size={20} color="inherit" /> : t("Update Email")}
                                </Button>
                            </Box>
                        </Collapse>

                        {/* Password Row */}
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1, p: 2, borderRadius: "16px", transition: "all 0.3s ease", "&:hover": { background: "rgba(255, 255, 255, 0.8)", transform: "translateX(4px)", boxShadow: "0 4px 12px rgba(0,0,0,0.02)" } }}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 2.5 }}>
                                <Box sx={{ p: 1.2, borderRadius: "12px", background: "rgba(239, 68, 68, 0.1)", color: "#EF4444" }}>
                                    <Lock size={20} />
                                </Box>
                                <Box>
                                    <Typography variant="caption" sx={{ color: "#9CA3AF", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", fontSize: "10px" }}>{t("Password")}</Typography>
                                    <Typography variant="body1" fontWeight="800" sx={{ letterSpacing: "2px" }} color="#1F2937">••••••••</Typography>
                                </Box>
                            </Box>
                            <Button size="small" onClick={() => setShowPasswordForm(!showPasswordForm)} sx={{ textTransform: "none", fontSize: "12px", fontWeight: 600, borderRadius: "20px", color: "#EF4444", bgcolor: "rgba(239, 68, 68, 0.05)", px: 2 }} endIcon={showPasswordForm ? <ChevronUp size={14} /> : <ChevronDown size={14} />}>
                                {t("Change")}
                            </Button>
                        </Box>

                        <Collapse in={showPasswordForm}>
                            <Box component="form" onSubmit={handleUpdatePassword} sx={{ mb: 3, ml: 2, mr: 2, p: 2.5, background: "rgba(255,255,255,0.9)", borderRadius: "16px", border: "1px solid rgba(0,0,0,0.05)", boxShadow: "0 4px 12px rgba(0,0,0,0.02)" }}>
                                <TextField fullWidth size="small" type="password" placeholder={t("Current Password")} value={passwordData.oldPassword} onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                                    sx={{ mb: 1.5, "& .MuiOutlinedInput-root": { borderRadius: "10px", bgcolor: "#fff", transition: "all 0.2s", "&:focus-within": { boxShadow: "0 0 0 3px rgba(239, 68, 68, 0.1)" } } }}
                                />
                                <TextField fullWidth size="small" type="password" placeholder={t("New Password")} value={passwordData.newPassword} onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                    sx={{ mb: 1.5, "& .MuiOutlinedInput-root": { borderRadius: "10px", bgcolor: "#fff", transition: "all 0.2s", "&:focus-within": { boxShadow: "0 0 0 3px rgba(239, 68, 68, 0.1)" } } }}
                                />
                                <TextField fullWidth size="small" type="password" placeholder={t("Confirm New Password")} value={passwordData.confirmPassword} onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                    sx={{ mb: 2.5, "& .MuiOutlinedInput-root": { borderRadius: "10px", bgcolor: "#fff", transition: "all 0.2s", "&:focus-within": { boxShadow: "0 0 0 3px rgba(239, 68, 68, 0.1)" } } }}
                                />
                                <Button fullWidth type="submit" variant="contained" disabled={updatingPassword} sx={{ borderRadius: "10px", bgcolor: "#EF4444", textTransform: "none", py: 1.2, fontWeight: 700, boxShadow: "0 4px 12px rgba(239, 68, 68, 0.2)", "&:hover": { bgcolor: "#DC2626" } }}>
                                    {updatingPassword ? <CircularProgress size={20} color="inherit" /> : t("Change Password")}
                                </Button>
                            </Box>
                        </Collapse>

                        {/* Username Row */}
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2.5, mb: 1, p: 2, borderRadius: "16px", transition: "all 0.3s ease", "&:hover": { background: "rgba(255, 255, 255, 0.8)", transform: "translateX(4px)", boxShadow: "0 4px 12px rgba(0,0,0,0.02)" } }}>
                            <Box sx={{ p: 1.2, borderRadius: "12px", background: "rgba(16, 185, 129, 0.1)", color: "#10B981" }}>
                                <User size={20} />
                            </Box>
                            <Box>
                                <Typography variant="caption" sx={{ color: "#9CA3AF", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", fontSize: "10px" }}>{t("Username")}</Typography>
                                <Typography variant="body1" fontWeight="700" color="#1F2937">@{user.username || user.email.split("@")[0]}</Typography>
                            </Box>
                        </Box>

                        <Box sx={{ display: "flex", alignItems: "center", gap: 2.5, mb: 1, p: 2, borderRadius: "16px", transition: "all 0.3s ease", "&:hover": { background: "rgba(255, 255, 255, 0.8)", transform: "translateX(4px)", boxShadow: "0 4px 12px rgba(0,0,0,0.02)" } }}>
                            <Box sx={{ p: 1.2, borderRadius: "12px", background: "rgba(139, 92, 246, 0.1)", color: "#8B5CF6" }}>
                                <Calendar size={20} />
                            </Box>
                            <Box>
                                <Typography variant="caption" sx={{ color: "#9CA3AF", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", fontSize: "10px" }}>{t("Member Since")}</Typography>
                                <Typography variant="body1" fontWeight="700" color="#1F2937">
                                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : "Active Member"}
                                </Typography>
                            </Box>
                        </Box>

                    </Box>

                    <Divider sx={{ mb: 4, borderColor: "rgba(0,0,0,0.06)" }} />

                    {/* Action Buttons */}
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <Link to="/my-cvs" style={{ textDecoration: "none" }}>
                            <Button
                                variant="contained"
                                fullWidth
                                startIcon={<FileText size={18} />}
                                sx={{
                                    py: 1.5,
                                    borderRadius: "14px",
                                    textTransform: "none",
                                    fontWeight: 700,
                                    background: "linear-gradient(45deg, #111827, #374151)",
                                    boxShadow: "0 8px 16px rgba(17, 24, 39, 0.2)",
                                    "&:hover": { transform: "translateY(-2px)", boxShadow: "0 12px 20px rgba(17, 24, 39, 0.3)", background: "linear-gradient(45deg, #000000, #1F2937)" },
                                    transition: "all 0.3s ease"
                                }}
                            >
                                {t("My CV Dashboard")}
                            </Button>
                        </Link>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
}
