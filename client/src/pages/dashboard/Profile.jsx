import React, { useState, useRef, useEffect } from "react";
import { Box, Container, Paper, Typography, Avatar, Divider, Button, IconButton, CircularProgress } from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import { FileText, User, Mail, Calendar, Camera, XCircle } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { updateProfilePic } from "../../api/user";
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
                    // Clean the URL without causing a full reload
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

    if (!user) {
        return (
            <Container maxWidth="sm" sx={{ py: 20, textAlign: "center" }}>
                <Typography variant="h5">{t("Login To View Profile")}</Typography>
            </Container>
        );
    }

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
            }
        } catch (error) {
            console.error("Failed to upload profile picture:", error);
        } finally {
            setUploading(false);
        }
    };

    return (
        <Box sx={{ minHeight: "100vh", py: 12, bgcolor: "#F8FAF8" }} className="bg-mesh">
            <Container maxWidth="sm">
                <Paper elevation={0} sx={{ p: { xs: 4, md: 6 }, borderRadius: "24px", border: "1px solid #E5E7EB", textAlign: "center" }}>
                    <Box sx={{ position: "relative", width: 120, height: 120, mx: "auto", mb: 3 }}>
                        <Avatar
                            src={user.profileImage?.secure_url}
                            sx={{
                                width: 120,
                                height: 120,
                                bgcolor: "#2563EB",
                                fontSize: "48px",
                                fontWeight: 700,
                                border: "4px solid #fff",
                                boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
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
                                position: "absolute",
                                bottom: 0,
                                right: 0,
                                bgcolor: "#111827",
                                color: "white",
                                p: 1,
                                "&:hover": { bgcolor: "#374151" },
                                boxShadow: "0 2px 8px rgba(0,0,0,0.2)"
                            }}
                        >
                            {uploading ? <CircularProgress size={20} color="inherit" /> : <Camera size={18} />}
                        </IconButton>
                    </Box>

                    <Typography variant="h4" fontWeight="900" color="#111827" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                        {user.name}
                    </Typography>
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1, mb: 4, mt: 1 }}>
                        <Typography variant="body2" sx={{
                            bgcolor: user.subscriptionStatus === "active" ? "#10B98120" : "#E5E7EB",
                            color: user.subscriptionStatus === "active" ? "#059669" : "#6B7280",
                            px: 1.5,
                            py: 0.5,
                            borderRadius: "100px",
                            fontWeight: "bold",
                            fontSize: "12px",
                            display: "inline-flex",
                            alignItems: "center"
                        }}>
                            {user.subscriptionStatus === "active" ? `🌟 ${t("Premium Member")}` : t("Free Plan")}
                        </Typography>

                        {user.subscriptionStatus === "active" && (
                            <Button
                                onClick={handleCancelSubscription}
                                disabled={canceling}
                                color="error"
                                size="small"
                                startIcon={canceling ? <CircularProgress size={12} color="inherit" /> : <XCircle size={14} />}
                                sx={{ textTransform: 'none', fontSize: '11px', fontWeight: 600, mt: 0.5, opacity: 0.8, borderRadius: '8px' }}>
                                {canceling ? t("Canceling...") : t("Cancel Premium")}
                            </Button>
                        )}
                    </Box>

                    <Divider sx={{ mb: 4 }} />

                    <Box sx={{ textAlign: "left", mb: 4 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                            <Mail size={20} color="#6B7280" />
                            <Box>
                                <Typography variant="caption" color="textSecondary" fontWeight="bold">{t("Email Address")}</Typography>
                                <Typography variant="body1" fontWeight="600">{user.email}</Typography>
                            </Box>
                        </Box>

                        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                            <User size={20} color="#6B7280" />
                            <Box>
                                <Typography variant="caption" color="textSecondary" fontWeight="bold">{t("Username")}</Typography>
                                <Typography variant="body1" fontWeight="600">{user.username || user.email.split("@")[0]}</Typography>
                            </Box>
                        </Box>

                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                            <Calendar size={20} color="#6B7280" />
                            <Box>
                                <Typography variant="caption" color="textSecondary" fontWeight="bold">{t("Member Since")}</Typography>
                                <Typography variant="body1" fontWeight="600">
                                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Active Member"}
                                </Typography>
                            </Box>
                        </Box>
                    </Box>

                    <Divider sx={{ mb: 4 }} />

                    <Link to="/my-cvs" style={{ textDecoration: "none" }}>
                        <Button variant="contained" fullWidth startIcon={<FileText size={18} />} sx={{ py: 1.5, borderRadius: "12px", textTransform: "none", fontWeight: 700, bgcolor: "#111827" }}>
                            {t("My CV Dashboard")}
                        </Button>
                    </Link>
                </Paper>
            </Container>
        </Box>
    );
}
