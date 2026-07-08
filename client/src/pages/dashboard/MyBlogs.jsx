import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Box, Button, Container, Paper, Typography, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Eye, Plus, Trash2, Edit2, BookOpen, Clock, BarChart2 } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import useBlogStore from "../../store/useBlogStore";
import { useTranslation } from "react-i18next";
import { formatDate } from "../../utils/blogUtils";

/**
 * MyBlogs Page - Dedicated dashboard for user's blog posts
 * Mirrors the premium look and feel of the CV dashboard
 */
export default function MyBlogs() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { accessToken, refreshAccessToken, isAuthenticated } = useAuth();
    const { myPosts, fetchMyPosts, deletePost, loading } = useBlogStore();

    const [deleteId, setDeleteId] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        if (isAuthenticated && accessToken) {
            fetchMyPosts({ accessToken, refreshAccessToken });
        }
    }, [isAuthenticated, accessToken, refreshAccessToken, fetchMyPosts]);

    const handleDelete = async () => {
        if (!deleteId) return;
        setIsDeleting(true);
        try {
            const success = await deletePost(deleteId, { accessToken, refreshAccessToken });
            if (success) {
                toast.success(t("Article Deleted"));
            } else {
                toast.error(t("Failed to delete article"));
            }
        } catch (e) {
            toast.error(e?.message || t("Failed Delete"));
        } finally {
            setIsDeleting(false);
            setDeleteId(null);
        }
    };

    return (
        <Box sx={{ minHeight: "100vh", py: 10, bgcolor: "#F8FAF8" }}>
            <Container maxWidth="lg">
                {/* Header Section */}
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        mb: 5,
                        gap: 2,
                        flexWrap: "wrap",
                    }}
                >
                    <Box>
                        <Typography variant="h3" fontWeight="900" color="#111827">
                            {t("My Articles")}
                        </Typography>
                        <Typography sx={{ color: "#6B7280", mt: 1 }}>
                            {t("Manage and track your published stories")}
                        </Typography>
                    </Box>
                    <Button
                        variant="contained"
                        startIcon={<Plus size={18} />}
                        onClick={() => navigate("/blogs/create")}
                        sx={{
                            borderRadius: "12px",
                            textTransform: "none",
                            fontWeight: 700,
                            bgcolor: "#2563EB",
                            "&:hover": { bgcolor: "#1D4ED8" },
                            px: 3,
                            py: 1.2,
                            boxShadow: "0 4px 14px 0 rgba(37,99,235,0.39)"
                        }}
                    >
                        {t("Write New Article")}
                    </Button>
                </Box>

                {loading && myPosts.length === 0 ? (
                    <Paper sx={{ p: 10, borderRadius: "24px", textAlign: "center", border: "1px solid #E5E7EB" }}>
                        <CircularProgress size={40} thickness={4} sx={{ color: "#2563EB" }} />
                        <Typography sx={{ mt: 2, color: "#6B7280", fontWeight: 600 }}>{t("Fetching your articles...")}</Typography>
                    </Paper>
                ) : !loading && myPosts.length === 0 ? (
                    <Paper
                        sx={{
                            p: 8,
                            borderRadius: "24px",
                            textAlign: "center",
                            border: "2px dashed #E5E7EB",
                            bgcolor: "transparent"
                        }}
                    >
                        <Box sx={{ bgcolor: "#F3F4F6", width: 64, height: 64, borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", mx: "auto", mb: 3 }}>
                            <BookOpen size={32} color="#9CA3AF" />
                        </Box>
                        <Typography variant="h5" sx={{ fontWeight: 800, color: "#111827" }}>
                            {t("No Articles Yet")}
                        </Typography>
                        <Typography sx={{ color: "#6B7280", mt: 1, mb: 4, maxWidth: 400, mx: "auto" }}>
                            {t("Share your knowledge and experiences with the community. Start by writing your first post!")}
                        </Typography>
                        <Button
                            variant="outlined"
                            onClick={() => navigate("/blogs/create")}
                            sx={{ borderRadius: "12px", textTransform: "none", fontWeight: 700, px: 4 }}
                        >
                            {t("Get Started")}
                        </Button>
                    </Paper>
                ) : (
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: { xs: "1fr", md: "repeat(2, 1fr)" },
                            gap: 3,
                        }}
                    >
                        {myPosts.map((post) => (
                            <Paper
                                key={post._id}
                                sx={{
                                    p: 0,
                                    borderRadius: "24px",
                                    overflow: "hidden",
                                    border: "1px solid #E5E7EB",
                                    transition: "all 0.3s ease",
                                    "&:hover": {
                                        transform: "translateY(-4px)",
                                        boxShadow: "0 12px 24px -10px rgba(0,0,0,0.1)",
                                        borderColor: "#DBEAFE"
                                    }
                                }}
                            >
                                {/* Cover Image Area */}
                                <Box sx={{ position: "relative", height: 160, bgcolor: "#F3F4F6" }}>
                                    <Box
                                        component="img"
                                        src={post.coverImage?.secure_url}
                                        sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                                    />
                                    <Box sx={{
                                        position: "absolute", top: 16, left: 16,
                                        bgcolor: "rgba(255,255,255,0.9)", backdropFilter: "blur(4px)",
                                        px: 1.5, py: 0.5, borderRadius: "8px",
                                        fontSize: "10px", fontWeight: 800, color: "#2563EB",
                                        textTransform: "uppercase", letterSpacing: "0.05em"
                                    }}>
                                        {post.category}
                                    </Box>
                                </Box>

                                <Box sx={{ p: 3 }}>
                                    <Typography variant="h6" fontWeight={800} color="#111827" sx={{
                                        mb: 1,
                                        display: "-webkit-box",
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: "vertical",
                                        overflow: "hidden",
                                        minHeight: "3.2rem"
                                    }}>
                                        {post.title}
                                    </Typography>

                                    <Box sx={{ display: "flex", gap: 3, mb: 3 }}>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                            <Clock size={14} color="#6B7280" />
                                            <Typography variant="caption" sx={{ color: "#6B7280", fontWeight: 600 }}>
                                                {formatDate(post.createdAt)}
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                            <BarChart2 size={14} color="#6B7280" />
                                            <Typography variant="caption" sx={{ color: "#6B7280", fontWeight: 600 }}>
                                                {post.views} {t("Views")}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <Box sx={{ display: "flex", gap: 1 }}>
                                            <Button
                                                variant="text"
                                                size="small"
                                                startIcon={<Eye size={16} />}
                                                onClick={() => navigate(`/blogs/${post.slug}`)}
                                                sx={{ textTransform: "none", fontWeight: 700, color: "#6B7280", borderRadius: "10px" }}
                                            >
                                                {t("View")}
                                            </Button>
                                        </Box>

                                        <Box sx={{ display: "flex", gap: 1 }}>
                                            <Button
                                                variant="soft"
                                                size="small"
                                                onClick={() => navigate(`/blogs/edit/${post.slug}`)}
                                                sx={{
                                                    textTransform: "none", fontWeight: 700,
                                                    borderRadius: "10px", minWidth: 0, p: 1,
                                                    bgcolor: "#EFF6FF", color: "#2563EB",
                                                    "&:hover": { bgcolor: "#DBEAFE" }
                                                }}
                                            >
                                                <Edit2 size={18} />
                                            </Button>
                                            <Button
                                                variant="soft"
                                                size="small"
                                                color="error"
                                                onClick={() => setDeleteId(post._id)}
                                                sx={{
                                                    textTransform: "none", fontWeight: 700,
                                                    borderRadius: "10px", minWidth: 0, p: 1,
                                                    bgcolor: "#FEF2F2", color: "#EF4444",
                                                    "&:hover": { bgcolor: "#FEE2E2" }
                                                }}
                                            >
                                                <Trash2 size={18} />
                                            </Button>
                                        </Box>
                                    </Box>
                                </Box>
                            </Paper>
                        ))}
                    </Box>
                )}

                {/* Delete Confirmation Dialog */}
                <Dialog
                    open={Boolean(deleteId)}
                    onClose={() => !isDeleting && setDeleteId(null)}
                    PaperProps={{ sx: { borderRadius: "24px", p: 1, maxWidth: 400 } }}
                >
                    <DialogTitle sx={{ fontWeight: 900, fontSize: "1.5rem" }}>{t("Delete Article?")}</DialogTitle>
                    <DialogContent>
                        <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 500, fontSize: "1rem" }}>
                            {t("This action cannot be undone. Your article will be permanently removed from CareerForge.AI.")}
                        </Typography>
                    </DialogContent>
                    <DialogActions sx={{ p: 3, gap: 1 }}>
                        <Button
                            onClick={() => setDeleteId(null)}
                            disabled={isDeleting}
                            sx={{ textTransform: "none", fontWeight: 700, color: "#6B7280", px: 3 }}
                        >
                            {t("Keep It")}
                        </Button>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={handleDelete}
                            disabled={isDeleting}
                            sx={{
                                textTransform: "none",
                                fontWeight: 700,
                                borderRadius: "12px",
                                px: 3,
                                bgcolor: "#EF4444",
                                "&:hover": { bgcolor: "#DC2626" }
                            }}
                        >
                            {isDeleting ? <CircularProgress size={20} color="inherit" /> : t("Delete Forever")}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </Box>
    );
}
