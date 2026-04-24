import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Box, Button, Container, Paper, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Eye, FileText, Plus, Trash2, Download } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import * as cvApi from "../api/cv";
import { useTranslation } from "react-i18next";

export default function MyCvs() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { accessToken, refreshAccessToken, isAuthenticated } = useAuth();
  const [cvs, setCvs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    const loadCvs = async () => {
      if (!isAuthenticated || !accessToken) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");
        const response = await cvApi.getMyCvs({ accessToken, refreshAccessToken });
        setCvs(Array.isArray(response?.data) ? response.data : []);
      } catch (e) {
        setError(e?.message || t("Failed CVs"));
      } finally {
        setLoading(false);
      }
    };

    loadCvs();
  }, [isAuthenticated, accessToken, refreshAccessToken, t]);

  const openCv = (cv) => {
    const params = new URLSearchParams({
      cvId: cv._id,
      template: cv.templateId || "modern-blue",
      category: cv.templateCategory || "saved",
    });
    navigate(`/cv-builder?${params.toString()}`);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await cvApi.deleteCv({ accessToken, refreshAccessToken, id: deleteId });
      setCvs(cvs.filter((c) => c._id !== deleteId));
      toast.success(t("CV Deleted"));
    } catch (e) {
      toast.error(e?.message || t("Failed Delete"));
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <Box sx={{ minHeight: "100vh", py: 10, bgcolor: "#F8FAF8" }}>
      <Container maxWidth="lg">
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
              {t("My CVs")}
            </Typography>
            <Typography sx={{ color: "#6B7280", mt: 1 }}>
              {t("View Edit CVs")}
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<Plus size={18} />}
            onClick={() => navigate("/cv-templates")}
            sx={{ borderRadius: "12px", textTransform: "none", fontWeight: 700 }}
          >
            {t("Create New CV")}
          </Button>
        </Box>

        {loading && (
          <Paper sx={{ p: 4, borderRadius: "16px" }}>
            <Typography>{t("Loading CVs")}</Typography>
          </Paper>
        )}

        {!loading && error && (
          <Paper sx={{ p: 4, borderRadius: "16px" }}>
            <Typography color="error" fontWeight={700}>
              {error}
            </Typography>
          </Paper>
        )}

        {!loading && !error && cvs.length === 0 && (
          <Paper sx={{ p: 6, borderRadius: "16px", textAlign: "center" }}>
            <FileText size={36} />
            <Typography variant="h6" sx={{ mt: 2, fontWeight: 700 }}>
              {t("No CVs")}
            </Typography>
            <Typography sx={{ color: "#6B7280", mt: 1 }}>
              {t("Create First CV")}
            </Typography>
          </Paper>
        )}

        {!loading && !error && cvs.length > 0 && (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" },
              gap: 3,
            }}
          >
            {cvs.map((cv) => (
              <Paper
                key={cv._id}
                sx={{
                  p: 3,
                  borderRadius: "16px",
                  border: "1px solid #E5E7EB",
                }}
              >
                <Typography variant="h6" fontWeight={800} color="#111827" sx={{ wordBreak: "break-word" }}>
                  {cv.name || t("Untitled CV")}
                </Typography>
                <Typography sx={{ color: "#4B5563", mt: 0.5, wordBreak: "break-word" }}>{cv.email || "-"}</Typography>
                <Typography sx={{ color: "#6B7280", mt: 1, minHeight: "48px", wordBreak: "break-word", overflowWrap: "anywhere" }}>
                  {cv.summary ? `${cv.summary.slice(0, 120)}${cv.summary.length > 120 ? "..." : ""}` : t("No Summary")}
                </Typography>
                <Typography variant="caption" sx={{ color: "#6B7280", display: "block", mt: 1.5, wordBreak: "break-word" }}>
                  {t("Template")}: {cv.templateId || "modern-blue"}
                </Typography>
                <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end", gap: 1.5 }}>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    startIcon={<Trash2 size={16} />}
                    onClick={() => setDeleteId(cv._id)}
                    sx={{ borderRadius: "10px", textTransform: "none", fontWeight: 700 }}
                  >
                    {t("Delete")}
                  </Button>
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    startIcon={<Eye size={16} />}
                    onClick={() => openCv(cv)}
                    sx={{ borderRadius: "10px", textTransform: "none", fontWeight: 700 }}
                  >
                    {t("Open")}
                  </Button>
                </Box>
              </Paper>
            ))}
          </Box>
        )}

        <Dialog open={Boolean(deleteId)} onClose={() => setDeleteId(null)} PaperProps={{ sx: { borderRadius: "16px", p: 1 } }}>
          <DialogTitle sx={{ fontWeight: 900 }}>{t("Confirm Delete Title")}</DialogTitle>
          <DialogContent>
            <Typography variant="body2" color="textSecondary">
              {t("Confirm Delete Message")}
            </Typography>
          </DialogContent>
          <DialogActions sx={{ p: 2, gap: 1 }}>
            <Button onClick={() => setDeleteId(null)} sx={{ textTransform: "none", fontWeight: 700 }}>{t("Cancel")}</Button>
            <Button variant="contained" color="error" onClick={handleDelete} sx={{ textTransform: "none", fontWeight: 700, borderRadius: "8px" }}>{t("Delete Forever")}</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
}
