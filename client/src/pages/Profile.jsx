import React, { useState, useRef } from "react";
import { Box, Container, Paper, Typography, Avatar, Divider, Button, IconButton, CircularProgress } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { FileText, User, Mail, Calendar, Camera } from "lucide-react";
import { Link } from "react-router-dom";
import { updateProfilePic } from "../api/user";
import { useTranslation } from "react-i18next";

export default function Profile() {
    const { t } = useTranslation();
    const { user, setUser, accessToken, refreshAccessToken } = useAuth();
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);

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

                    <Typography variant="h4" fontWeight="900" color="#111827">{user.name}</Typography>
                    <Typography color="textSecondary" sx={{ mb: 4 }}>{t("CV Member")}</Typography>

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
