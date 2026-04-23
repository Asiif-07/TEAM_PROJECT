import { useState, useCallback, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import * as cvApi from "../api/cv";

/**
 * Hook for managing CV drafts with auto-save functionality
 * @param {Object} options - Configuration options
 * @param {string} options.accessToken - User access token
 * @param {Function} options.refreshAccessToken - Function to refresh token
 * @param {string} options.userId - Current user ID
 */
export function useCVDraft({ accessToken, refreshAccessToken }) {
  const [drafts, setDrafts] = useState([]);
  const [currentDraftId, setCurrentDraftId] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState(null);
  const [isLoadingDrafts, setIsLoadingDrafts] = useState(false);

  // Auto-save timeout ref
  const autoSaveTimeoutRef = useRef(null);
  const isMountedRef = useRef(true);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, []);

  /**
   * Fetch all drafts for the current user
   */
  const fetchDrafts = useCallback(async () => {
    if (!accessToken) return;

    setIsLoadingDrafts(true);
    try {
      const response = await cvApi.getMyDrafts({ accessToken, refreshAccessToken });
      if (response.success && isMountedRef.current) {
        setDrafts(response.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch drafts:", error);
      toast.error("Failed to load drafts");
    } finally {
      if (isMountedRef.current) {
        setIsLoadingDrafts(false);
      }
    }
  }, [accessToken, refreshAccessToken]);

  /**
   * Save a new draft
   */
  const saveNewDraft = useCallback(
    async (cvData) => {
      if (!accessToken) {
        toast.error("Please login to save drafts");
        return null;
      }

      setIsSaving(true);
      const loadingToast = toast.loading("Saving draft...");

      try {
        const response = await cvApi.saveDraft({
          accessToken,
          refreshAccessToken,
          cv: cvData,
        });

        if (response.success && isMountedRef.current) {
          setCurrentDraftId(response.data._id);
          setLastSavedAt(new Date());
          toast.success("Draft saved successfully!", { id: loadingToast });
          // Refresh drafts list
          fetchDrafts();
          return response.data;
        }
      } catch (error) {
        console.error("Failed to save draft:", error);
        toast.error("Failed to save draft", { id: loadingToast });
        return null;
      } finally {
        if (isMountedRef.current) {
          setIsSaving(false);
        }
      }
    },
    [accessToken, refreshAccessToken, fetchDrafts]
  );

  /**
   * Update existing draft
   */
  const updateExistingDraft = useCallback(
    async (draftId, cvData) => {
      if (!accessToken || !draftId) return null;

      setIsSaving(true);

      try {
        const response = await cvApi.updateDraft({
          accessToken,
          refreshAccessToken,
          id: draftId,
          cvData,
        });

        if (response.success && isMountedRef.current) {
          setLastSavedAt(new Date());
          // Silently update - no toast for auto-save
          return response.data;
        }
      } catch (error) {
        console.error("Failed to update draft:", error);
        // Don't show error toast for auto-save to avoid spam
        return null;
      } finally {
        if (isMountedRef.current) {
          setIsSaving(false);
        }
      }
    },
    [accessToken, refreshAccessToken]
  );

  /**
   * Auto-save draft with debounce (3 seconds)
   */
  const autoSaveDraft = useCallback(
    (draftId, cvData, delay = 3000) => {
      // Clear existing timeout
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }

      // Set new timeout for debounced save
      autoSaveTimeoutRef.current = setTimeout(async () => {
        if (draftId) {
          await updateExistingDraft(draftId, cvData);
        } else {
          // If no draftId, create new draft silently
          await saveNewDraft(cvData);
        }
      }, delay);
    },
    [saveNewDraft, updateExistingDraft]
  );

  /**
   * Load a draft by ID
   */
  const loadDraft = useCallback(
    async (draftId) => {
      if (!accessToken || !draftId) return null;

      setIsLoadingDrafts(true);
      try {
        const response = await cvApi.getCvById({
          accessToken,
          refreshAccessToken,
          id: draftId,
        });

        if (response.success && isMountedRef.current) {
          setCurrentDraftId(draftId);
          return response.data;
        }
      } catch (error) {
        console.error("Failed to load draft:", error);
        toast.error("Failed to load draft");
        return null;
      } finally {
        if (isMountedRef.current) {
          setIsLoadingDrafts(false);
        }
      }
    },
    [accessToken, refreshAccessToken]
  );

  /**
   * Delete a draft
   */
  const deleteDraft = useCallback(
    async (draftId) => {
      if (!accessToken || !draftId) return false;

      const confirmDelete = window.confirm(
        "Are you sure you want to delete this draft?"
      );
      if (!confirmDelete) return false;

      try {
        const response = await cvApi.deleteCv({
          accessToken,
          refreshAccessToken,
          id: draftId,
        });

        if (response.success && isMountedRef.current) {
          // Remove from local state
          setDrafts((prev) => prev.filter((d) => d._id !== draftId));

          // Clear current draft if it was the deleted one
          if (currentDraftId === draftId) {
            setCurrentDraftId(null);
            setLastSavedAt(null);
          }

          toast.success("Draft deleted successfully");
          return true;
        }
      } catch (error) {
        console.error("Failed to delete draft:", error);
        toast.error("Failed to delete draft");
        return false;
      }
    },
    [accessToken, refreshAccessToken, currentDraftId]
  );

  /**
   * Finalize a draft (convert to completed CV)
   */
  const finalizeDraft = useCallback(
    async (draftId) => {
      if (!accessToken || !draftId) return null;

      setIsSaving(true);
      const loadingToast = toast.loading("Finalizing CV...");

      try {
        const response = await cvApi.finalizeCV({
          accessToken,
          refreshAccessToken,
          id: draftId,
        });

        if (response.success && isMountedRef.current) {
          // Remove from drafts list since it's now completed
          setDrafts((prev) => prev.filter((d) => d._id !== draftId));
          setCurrentDraftId(null);
          toast.success("CV finalized successfully!", { id: loadingToast });
          return response.data;
        }
      } catch (error) {
        console.error("Failed to finalize CV:", error);
        toast.error(error.message || "Failed to finalize CV", {
          id: loadingToast,
        });
        return null;
      } finally {
        if (isMountedRef.current) {
          setIsSaving(false);
        }
      }
    },
    [accessToken, refreshAccessToken]
  );

  /**
   * Clear current draft (for starting fresh)
   */
  const clearCurrentDraft = useCallback(() => {
    setCurrentDraftId(null);
    setLastSavedAt(null);
    // Cancel any pending auto-save
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }
  }, []);

  return {
    // State
    drafts,
    currentDraftId,
    isSaving,
    isLoadingDrafts,
    lastSavedAt,

    // Actions
    fetchDrafts,
    saveNewDraft,
    updateExistingDraft,
    autoSaveDraft,
    loadDraft,
    deleteDraft,
    finalizeDraft,
    clearCurrentDraft,
    setCurrentDraftId,
  };
}

export default useCVDraft;
