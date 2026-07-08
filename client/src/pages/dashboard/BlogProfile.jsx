import React, { useState, useEffect, useRef } from "react";
import {
    Box, Container, Paper, Typography, Avatar, Divider, Button,
    IconButton, CircularProgress, TextField, Collapse
} from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import { getBlogProfile, updateBlogProfile } from "../../api/user";
import {
    Camera, User, Globe, Github, Linkedin, Pencil, Save,
    ChevronDown, ChevronUp, BookOpen, ArrowLeft
} from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import toast from "react-hot-toast";
import MyBlogs from "../../components/blog/MyBlogs.jsx";

export default function BlogProfile() {
    const { t } = useTranslation();
    const { user, accessToken, refreshAccessToken } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [editing, setEditing] = useState(false);
    const fileRef = useRef(null);

    const [form, setForm] = useState({
        displayName: "",
        bio: "",
        github: "",
        linkedin: "",
        website: ""
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await getBlogProfile({ accessToken, refreshAccessToken });
                if (res.success) {
                    setProfile(res.data);
                    setForm({
                        displayName: res.data.displayName || "",
                        bio: res.data.bio || "",
                        github: res.data.socialLinks?.github || "",
                        linkedin: res.data.socialLinks?.linkedin || "",
                        website: res.data.socialLinks?.website || ""
                    });
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        if (accessToken) fetchProfile();
    }, [accessToken, refreshAccessToken]);

    const handleSave = async () => {
        setSaving(true);
        try {
            const fd = new FormData();
            fd.append("displayName", form.displayName);
            fd.append("bio", form.bio);
            fd.append("github", form.github);
            fd.append("linkedin", form.linkedin);
            fd.append("website", form.website);
            const res = await updateBlogProfile({ accessToken, refreshAccessToken, formData: fd });
            if (res.success) {
                setProfile(res.data);
                setEditing(false);
                toast.success(t("Blog profile updated!"));
            }
        } catch (e) {
            toast.error(t("Failed to update blog profile"));
            console.error(e);
        } finally {
            setSaving(false);
        }
    };

    const handleAvatarUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setSaving(true);
        try {
            const fd = new FormData();
            fd.append("avatar", file);
            fd.append("displayName", form.displayName);
            fd.append("bio", form.bio);
            const res = await updateBlogProfile({ accessToken, refreshAccessToken, formData: fd });
            if (res.success) {
                setProfile(res.data);
                toast.success(t("Avatar updated!"));
            }
        } catch {
            toast.error(t("Failed to upload avatar"));
        } finally {
            setSaving(false);
        }
    };

    if (!user) {
        return (
            <Container maxWidth="sm" sx={{ py: 20, textAlign: "center" }}>
                <Typography variant="h5">{t("Login To View Profile")}</Typography>
            </Container>
        );
    }

    const avatarUrl = profile?.avatar?.secure_url || user?.profileImage?.secure_url;
    const displayName = profile?.displayName || user?.name || "Author";
    const initial = displayName.charAt(0).toUpperCase();

    return (
        <Box sx={{ minHeight: "100vh", py: 12, bgcolor: "#F8FAF8" }} className="bg-mesh">
            <Container maxWidth="sm">
                {/* Back to Account */}
                <Box sx={{ mb: 3 }}>
                    <Link to="/profile" style={{ textDecoration: "none" }}>
                        <Button
                            startIcon={<ArrowLeft size={16} />}
                            sx={{ textTransform: "none", color: "#6B7280", fontWeight: 600, fontSize: "13px", borderRadius: "10px" }}
                        >
                            {t("Account Settings")}
                        </Button>
                    </Link>
                </Box>

                <Paper elevation={0} sx={{ p: { xs: 4, md: 6 }, borderRadius: "24px", border: "1px solid #E5E7EB", textAlign: "center" }}>
                    {/* Header badge */}
                    <Box sx={{ display: "inline-flex", alignItems: "center", gap: 1, bgcolor: "#EFF6FF", px: 2.5, py: 1, borderRadius: "100px", mb: 4 }}>
                        <BookOpen size={14} color="#2563EB" />
                        <Typography sx={{ fontSize: "11px", fontWeight: 800, color: "#2563EB", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                            {t("Blog Author Profile")}
                        </Typography>
                    </Box>

                    {/* Avatar */}
                    {loading ? (
                        <Box sx={{ py: 4 }}><CircularProgress size={32} /></Box>
                    ) : (
                        <>
                            <Box sx={{ position: "relative", width: 120, height: 120, mx: "auto", mb: 3 }}>
                                <Avatar
                                    src={avatarUrl}
                                    sx={{
                                        width: 120, height: 120,
                                        bgcolor: "linear-gradient(135deg, #2563EB 0%, #1d4ed8 100%)",
                                        background: "linear-gradient(135deg, #2563EB 0%, #1d4ed8 100%)",
                                        fontSize: "48px", fontWeight: 700,
                                        border: "4px solid #fff",
                                        boxShadow: "0 4px 20px rgba(37, 99, 235, 0.2)"
                                    }}
                                >
                                    {!avatarUrl && initial}
                                </Avatar>
                                <input type="file" hidden ref={fileRef} accept="image/*" onChange={handleAvatarUpload} />
                                <IconButton
                                    onClick={() => fileRef.current.click()}
                                    disabled={saving}
                                    sx={{
                                        position: "absolute", bottom: 0, right: 0,
                                        bgcolor: "#2563EB", color: "white", p: 1,
                                        "&:hover": { bgcolor: "#1d4ed8" },
                                        boxShadow: "0 2px 8px rgba(37,99,235,0.3)"
                                    }}
                                >
                                    {saving ? <CircularProgress size={18} color="inherit" /> : <Camera size={16} />}
                                </IconButton>
                            </Box>

                            {/* Display Name & Bio */}
                            {editing ? (
                                <Box sx={{ textAlign: "left", mb: 4 }}>
                                    <TextField
                                        fullWidth size="small" label={t("Display Name")}
                                        value={form.displayName}
                                        onChange={(e) => setForm({ ...form, displayName: e.target.value })}
                                        sx={{ mb: 2, "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                                    />
                                    <TextField
                                        fullWidth size="small" label={t("Bio")} multiline rows={3}
                                        value={form.bio}
                                        onChange={(e) => setForm({ ...form, bio: e.target.value })}
                                        inputProps={{ maxLength: 280 }}
                                        helperText={`${form.bio.length}/280`}
                                        sx={{ mb: 2, "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                                    />

                                    {/* Social Links */}
                                    <Typography variant="caption" fontWeight="bold" color="textSecondary" sx={{ mb: 1, display: "block" }}>
                                        {t("Social Links")}
                                    </Typography>
                                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                                        <TextField
                                            fullWidth size="small" placeholder="github.com/username"
                                            value={form.github}
                                            onChange={(e) => setForm({ ...form, github: e.target.value })}
                                            InputProps={{ startAdornment: <Github size={16} color="#6B7280" style={{ marginRight: 8 }} /> }}
                                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                                        />
                                        <TextField
                                            fullWidth size="small" placeholder="linkedin.com/in/username"
                                            value={form.linkedin}
                                            onChange={(e) => setForm({ ...form, linkedin: e.target.value })}
                                            InputProps={{ startAdornment: <Linkedin size={16} color="#6B7280" style={{ marginRight: 8 }} /> }}
                                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                                        />
                                        <TextField
                                            fullWidth size="small" placeholder="https://yourwebsite.com"
                                            value={form.website}
                                            onChange={(e) => setForm({ ...form, website: e.target.value })}
                                            InputProps={{ startAdornment: <Globe size={16} color="#6B7280" style={{ marginRight: 8 }} /> }}
                                            sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                                        />
                                    </Box>

                                    <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
                                        <Button
                                            fullWidth variant="outlined"
                                            onClick={() => setEditing(false)}
                                            sx={{ borderRadius: "12px", textTransform: "none", fontWeight: 700, color: "#6B7280", borderColor: "#E5E7EB" }}
                                        >
                                            {t("Cancel")}
                                        </Button>
                                        <Button
                                            fullWidth variant="contained"
                                            onClick={handleSave} disabled={saving}
                                            startIcon={saving ? <CircularProgress size={16} color="inherit" /> : <Save size={16} />}
                                            sx={{ borderRadius: "12px", textTransform: "none", fontWeight: 700, bgcolor: "#2563EB" }}
                                        >
                                            {t("Save Profile")}
                                        </Button>
                                    </Box>
                                </Box>
                            ) : (
                                <>
                                    <Typography variant="h4" fontWeight="900" color="#111827" sx={{ mb: 0.5 }}>
                                        {displayName}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary" sx={{ mb: 1, maxWidth: 360, mx: "auto" }}>
                                        {profile?.bio || t("No bio yet. Click edit to add one.")}
                                    </Typography>

                                    {/* Social pills */}
                                    {(profile?.socialLinks?.github || profile?.socialLinks?.linkedin || profile?.socialLinks?.website) && (
                                        <Box sx={{ display: "flex", gap: 1, justifyContent: "center", mb: 3, flexWrap: "wrap" }}>
                                            {profile.socialLinks.github && (
                                                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, bgcolor: "#F3F4F6", px: 1.5, py: 0.5, borderRadius: "100px" }}>
                                                    <Github size={12} color="#6B7280" />
                                                    <Typography sx={{ fontSize: "11px", color: "#6B7280", fontWeight: 600 }}>GitHub</Typography>
                                                </Box>
                                            )}
                                            {profile.socialLinks.linkedin && (
                                                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, bgcolor: "#F3F4F6", px: 1.5, py: 0.5, borderRadius: "100px" }}>
                                                    <Linkedin size={12} color="#6B7280" />
                                                    <Typography sx={{ fontSize: "11px", color: "#6B7280", fontWeight: 600 }}>LinkedIn</Typography>
                                                </Box>
                                            )}
                                            {profile.socialLinks.website && (
                                                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, bgcolor: "#F3F4F6", px: 1.5, py: 0.5, borderRadius: "100px" }}>
                                                    <Globe size={12} color="#6B7280" />
                                                    <Typography sx={{ fontSize: "11px", color: "#6B7280", fontWeight: 600 }}>Website</Typography>
                                                </Box>
                                            )}
                                        </Box>
                                    )}

                                    <Button
                                        onClick={() => setEditing(true)}
                                        startIcon={<Pencil size={14} />}
                                        sx={{
                                            textTransform: "none", fontWeight: 700, fontSize: "13px",
                                            color: "#2563EB", borderRadius: "12px", mb: 3,
                                            border: "1px solid #DBEAFE", px: 3, py: 1,
                                            "&:hover": { bgcolor: "#EFF6FF" }
                                        }}
                                    >
                                        {t("Edit Profile")}
                                    </Button>
                                </>
                            )}

                            <Divider sx={{ mb: 4 }} />

                            {/* My Articles */}
                            <MyBlogs />
                        </>
                    )}
                </Paper>
            </Container>
        </Box>
    );
}
