import React, { useEffect } from "react";
import { Box, Typography, Button, Container, Paper } from "@mui/material";
import { Plus, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import { useCVDraft } from "../hooks/useCVDraft";
import DraftList from "../components/cvBuilder/DraftList";
import toast from "react-hot-toast";

/**
 * MyDrafts Page - Displays all user's CV drafts
 */
export default function MyDrafts() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { accessToken, refreshAccessToken } = useAuth();

  const {
    drafts,
    isLoadingDrafts,
    fetchDrafts,
    loadDraft,
    deleteDraft,
    finalizeDraft,
  } = useCVDraft({
    accessToken,
    refreshAccessToken,
  });

  // Fetch drafts on mount
  useEffect(() => {
    fetchDrafts();
  }, [fetchDrafts]);

  // Handle load draft - navigate to CV builder with draft ID
  const handleLoadDraft = async (draftId) => {
    const draft = await loadDraft(draftId);
    if (draft) {
      // Navigate to CV builder with draft ID and template
      navigate(
        `/cv-builder?template=${draft.templateId || "classic-red"}&draftId=${draftId}`
      );
    }
  };

  // Handle delete draft
  const handleDeleteDraft = async (draftId) => {
    const success = await deleteDraft(draftId);
    if (success) {
      toast.success(t("Draft deleted"));
    }
  };

  // Handle finalize draft
  const handleFinalizeDraft = async (draftId) => {
    const result = await finalizeDraft(draftId);
    if (result) {
      toast.success(t("CV finalized successfully!"));
      // Refresh drafts list
      fetchDrafts();
    }
  };

  // Navigate to create new CV
  const handleCreateNew = () => {
    navigate("/cv-templates");
  };

  // Navigate back
  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <Box sx={{ minHeight: "100vh", py: 8, bgcolor: "background.default" }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 6 }}>
          <Button
            onClick={handleGoBack}
            startIcon={<ArrowLeft size={20} />}
            sx={{ mb: 2, textTransform: "none" }}
          >
            {t("Back")}
          </Button>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Typography variant="h3" fontWeight="900">
              {t("My Drafts")}
            </Typography>

            <Button
              variant="contained"
              onClick={handleCreateNew}
              startIcon={<Plus size={20} />}
              sx={{
                textTransform: "none",
                borderRadius: 3,
                px: 3,
                py: 1.5,
              }}
            >
              {t("Create New CV")}
            </Button>
          </Box>

          <Typography variant="h6" color="text.secondary" sx={{ mt: 1 }}>
            {t("Continue working on your saved CV drafts")}
          </Typography>
        </Box>

        {/* Drafts List */}
        <Paper sx={{ p: 4, borderRadius: 4, bgcolor: "background.paper" }}>
          <DraftList
            drafts={drafts}
            isLoading={isLoadingDrafts}
            onLoadDraft={handleLoadDraft}
            onDeleteDraft={handleDeleteDraft}
            onFinalizeDraft={handleFinalizeDraft}
          />
        </Paper>

        {/* Info Box */}
        {drafts.length > 0 && (
          <Paper
            sx={{
              mt: 4,
              p: 3,
              borderRadius: 3,
              bgcolor: "info.light",
              border: "1px solid",
              borderColor: "info.main",
            }}
          >
            <Typography variant="body2" sx={{ color: "info.dark" }}>
              {t(
                "Tip: Drafts are automatically saved every few seconds when you're editing. You can also manually save by clicking 'Save Draft'."
              )}
            </Typography>
          </Paper>
        )}
      </Container>
    </Box>
  );
}
