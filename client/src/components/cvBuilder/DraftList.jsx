import React from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  IconButton,
  Chip,
  Skeleton,
  Fade,
  Tooltip,
} from "@mui/material";
import {
  FileText,
  Trash2,
  Edit3,
  CheckCircle,
  Clock,
  Calendar,
  ChevronRight,
} from "lucide-react";
import { useTranslation } from "react-i18next";

/**
 * DraftList Component - Displays user's CV drafts with actions
 */
export default function DraftList({
  drafts,
  isLoading,
  currentDraftId,
  onLoadDraft,
  onDeleteDraft,
  onFinalizeDraft,
}) {
  const { t } = useTranslation();

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get time ago string
  const getTimeAgo = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return t("Just now");
    if (diffMins < 60) return t(`${diffMins}m ago`);
    if (diffHours < 24) return t(`${diffHours}h ago`);
    if (diffDays < 7) return t(`${diffDays}d ago`);
    return formatDate(dateString);
  };

  if (isLoading) {
    return (
      <Box sx={{ p: 2 }}>
        {[1, 2, 3].map((i) => (
          <Skeleton
            key={i}
            variant="rectangular"
            height={80}
            sx={{ mb: 2, borderRadius: 2 }}
          />
        ))}
      </Box>
    );
  }

  if (drafts.length === 0) {
    return (
      <Paper
        sx={{
          p: 4,
          textAlign: "center",
          bgcolor: "background.paper",
          borderRadius: 3,
        }}
      >
        <FileText size={48} color="#94A3B8" style={{ marginBottom: 16 }} />
        <Typography variant="h6" sx={{ color: "text.secondary", mb: 1 }}>
          {t("No drafts yet")}
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {t(
            "Start creating a CV and save it as a draft to see it here"
          )}
        </Typography>
      </Paper>
    );
  }

  return (
    <Box>
      <Typography
        variant="h6"
        sx={{ mb: 2, fontWeight: 700, display: "flex", alignItems: "center", gap: 1 }}
      >
        <FileText size={20} />
        {t("My Drafts")}
        <Chip
          label={drafts.length}
          size="small"
          sx={{ ml: 1, bgcolor: "primary.main", color: "white" }}
        />
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {drafts.map((draft, index) => (
          <Fade in={true} key={draft._id} timeout={300 + index * 100}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 3,
                border:
                  currentDraftId === draft._id
                    ? "2px solid #4F46E5"
                    : "1px solid #E2E8F0",
                bgcolor:
                  currentDraftId === draft._id ? "rgba(79, 70, 229, 0.05)" : "background.paper",
                transition: "all 0.2s ease",
                "&:hover": {
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  transform: "translateY(-2px)",
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: 700, mb: 0.5 }}
                  >
                    {draft.name || t("Untitled CV")}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{ color: "text.secondary", mb: 1 }}
                  >
                    {draft.title || t("No title")}
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      flexWrap: "wrap",
                    }}
                  >
                    <Chip
                      icon={<Clock size={14} />}
                      label={getTimeAgo(draft.lastSavedAt || draft.updatedAt)}
                      size="small"
                      variant="outlined"
                      sx={{ fontSize: "0.75rem" }}
                    />

                    <Chip
                      icon={<Calendar size={14} />}
                      label={formatDate(draft.lastSavedAt || draft.updatedAt)}
                      size="small"
                      variant="outlined"
                      sx={{ fontSize: "0.75rem" }}
                    />

                    <Chip
                      label={draft.templateId || "classic-red"}
                      size="small"
                      sx={{
                        bgcolor: "primary.light",
                        color: "primary.dark",
                        fontSize: "0.75rem",
                        textTransform: "capitalize",
                      }}
                    />
                  </Box>
                </Box>

                <Box sx={{ display: "flex", gap: 1 }}>
                  <Tooltip title={t("Continue editing")}>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => onLoadDraft(draft._id)}
                      startIcon={<Edit3 size={16} />}
                      sx={{
                        textTransform: "none",
                        borderRadius: 2,
                      }}
                    >
                      {t("Edit")}
                    </Button>
                  </Tooltip>

                  {onFinalizeDraft && (
                    <Tooltip title={t("Finalize CV")}>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => onFinalizeDraft(draft._id)}
                        startIcon={<CheckCircle size={16} />}
                        sx={{
                          textTransform: "none",
                          borderRadius: 2,
                          borderColor: "success.main",
                          color: "success.main",
                          "&:hover": {
                            bgcolor: "success.light",
                          },
                        }}
                      >
                        {t("Finalize")}
                      </Button>
                    </Tooltip>
                  )}

                  <Tooltip title={t("Delete draft")}>
                    <IconButton
                      size="small"
                      onClick={() => onDeleteDraft(draft._id)}
                      sx={{
                        color: "error.main",
                        "&:hover": { bgcolor: "error.light" },
                      }}
                    >
                      <Trash2 size={18} />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>

              {/* Preview of CV data */}
              <Box
                sx={{
                  mt: 2,
                  pt: 2,
                  borderTop: "1px solid #E2E8F0",
                  display: "flex",
                  gap: 3,
                  flexWrap: "wrap",
                }}
              >
                {draft.experience?.length > 0 && (
                  <Typography variant="caption" sx={{ color: "text.secondary" }}>
                    <strong>{draft.experience.length}</strong> {t("Experience")}
                  </Typography>
                )}
                {draft.education?.length > 0 && (
                  <Typography variant="caption" sx={{ color: "text.secondary" }}>
                    <strong>{draft.education.length}</strong> {t("Education")}
                  </Typography>
                )}
                {draft.skills?.length > 0 && (
                  <Typography variant="caption" sx={{ color: "text.secondary" }}>
                    <strong>{draft.skills.length}</strong> {t("Skills")}
                  </Typography>
                )}
                {draft.projects?.length > 0 && (
                  <Typography variant="caption" sx={{ color: "text.secondary" }}>
                    <strong>{draft.projects.length}</strong> {t("Projects")}
                  </Typography>
                )}
              </Box>
            </Paper>
          </Fade>
        ))}
      </Box>
    </Box>
  );
}
