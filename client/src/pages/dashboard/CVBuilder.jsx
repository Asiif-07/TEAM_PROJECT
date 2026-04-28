import React, { useState, useEffect, useCallback, useRef } from 'react';
import toast from 'react-hot-toast';
import { Box, Button, Typography, Paper, Container } from "@mui/material";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from "react-i18next";
import * as cvApi from "../../api/cv";
import * as aiApi from "../../api/ai";
import { mapParsedDataToTemplate } from "../../utils/cvBuilder/dataMapper";
import { getTemplateConfig } from "../../utils/cvBuilder/templateConfig";

import CustomStepper from "../../components/cvBuilder/CustomStepper";
import LivePreview from "../../components/cvBuilder/LivePreview";
import PersonalInfoStep from "../../components/cvBuilder/steps/PersonalInfoStep";
import ExperienceStep from "../../components/cvBuilder/steps/ExperienceStep";
import SkillsEducationStep from "../../components/cvBuilder/steps/SkillsEducationStep";
import GenerateStep from "../../components/cvBuilder/steps/GenerateStep";
import PreviewCV from "../../components/cvBuilder/PreviewCV";

export default function CVBuilder() {
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const selectedCategory = searchParams.get("category");
    const selectedTemplate = searchParams.get("template") || "classic-red";
    const cvId = searchParams.get("cvId");

    const { accessToken, refreshAccessToken } = useAuth();
    const [activeStep, setActiveStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [isExtracting, setIsExtracting] = useState(false);
    const [skillInput, setSkillInput] = useState("");
    const [draftId, setDraftId] = useState(cvId || "");
    const [lastSavedAt, setLastSavedAt] = useState("");
    const autosaveTimerRef = useRef(null);
    const skipAutosaveRef = useRef(true);

    const defaultFormData = {
        personalInfo: {
            name: "",
            title: "",
            about: "",
            email: "",
            phone: "",
            github: "",
            linkedin: "",
            address: "",
            dob: "",
            profileImage: null
        },
        experience: [{ role: "", company: "", startDate: "", endDate: "", current: false, description: "" }],
        education: [{ degree: "", institute: "", startDate: "", endDate: "", current: false, description: "" }],
        skills: [],
        projects: "",
        languages: "",
        certifications: "",
        volunteer: [],
        awards: [],
        publications: [],
        interests: [],
        references: [],
        additionalSections: []
    };

    const [formData, setFormData] = useState(defaultFormData);

    useEffect(() => {
        const fetchCvData = async () => {
            if (!cvId || !accessToken) return;
            setLoading(true);
            try {
                const response = await cvApi.getCvById({ accessToken, refreshAccessToken, id: cvId });
                if (response.success && response.data) {
                    const cv = response.data;
                    const mappedData = mapParsedDataToTemplate(cv);
                    setFormData(prev => ({
                        ...prev,
                        ...mappedData,
                        personalInfo: {
                            ...prev.personalInfo,
                            ...mappedData.personalInfo,
                        }
                    }));
                    setDraftId(cv._id);
                    setLastSavedAt(cv.lastSavedAt || cv.updatedAt || "");
                }
            } catch (err) {
                console.error("Failed to fetch CV data:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchCvData();
    }, [cvId, accessToken, refreshAccessToken, t]);

    const handleChange = (e, section = null) => {
        const { name, value, files } = e.target;
        if (section) {
            setFormData((prev) => {
                const nextValue = files ? files[0] : value;
                const updates = { [name]: nextValue };

                // Handle profile image preview
                if (name === "profileImage" && files?.[0]) {
                    if (prev[section].profileImagePreview) {
                        URL.revokeObjectURL(prev[section].profileImagePreview);
                    }
                    updates.profileImagePreview = URL.createObjectURL(files[0]);
                }

                return {
                    ...prev,
                    [section]: {
                        ...prev[section],
                        ...updates,
                    },
                };
            });
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const buildProjectsArray = useCallback(() =>
        formData.projects
            ? formData.projects.split("\n").filter((p) => p.trim()).map((p) => {
                const parts = p.split("|");
                return {
                    title: parts[0]?.trim() || "Project",
                    description: parts[1]?.trim() || p.trim(),
                    githubLink: parts[2]?.trim() || "",
                    liveLink: parts[3]?.trim() || "",
                };
            })
            : [], [formData.projects]);

    const buildCvData = useCallback((status = "draft") => {
        // Transformations for Backend
        const languagesArray = formData.languages
            ? formData.languages.split(",").map(l => ({ language: l.trim(), fluency: "" })).filter(l => l.language)
            : [];

        const certificatesArray = formData.certifications
            ? formData.certifications.split("\n").map(c => ({ name: c.trim(), date: null, issuer: "", url: "" })).filter(c => c.name)
            : [];

        return {
            name: formData.personalInfo.name || "Untitled Draft",
            title: formData.personalInfo.title || "",
            label: formData.personalInfo.title || "", // New field
            email: formData.personalInfo.email || "",
            phone: formData.personalInfo.phone || "",
            url: "", // Personal Website placeholder
            github: formData.personalInfo.github || "",
            linkedin: formData.personalInfo.linkedin || "",
            location: {
                address: formData.personalInfo.address || "",
                city: "",
                region: "",
                countryCode: "",
                postalCode: ""
            },
            summary: formData.personalInfo.about || "",
            templateId: selectedTemplate,
            templateCategory: selectedCategory || "saved",
            experience: (formData.experience || [])
                .filter(exp => exp.role?.trim() || exp.company?.trim() || exp.description?.trim())
                .map(exp => ({ ...exp, isCurrent: !!exp.current })),
            education: (formData.education || [])
                .filter(edu => edu.degree?.trim() || edu.institute?.trim())
                .map(edu => ({ ...edu, isCurrent: !!edu.current })),
            skills: formData.skills || [],
            projects: buildProjectsArray(),
            languages: languagesArray,
            certificates: certificatesArray,
            volunteer: formData.volunteer || [],
            awards: formData.awards || [],
            publications: formData.publications || [],
            interests: formData.interests || [],
            references: formData.references || [],
            additionalSections: Array.isArray(formData.additionalSections) ? formData.additionalSections : [],
            status,
        };
    }, [formData, selectedTemplate, selectedCategory, buildProjectsArray]);

    const persistDraft = useCallback(async () => {
        if (!accessToken) return null;
        const cvData = buildCvData("draft");
        try {
            const res = await cvApi.saveDraft({
                accessToken,
                refreshAccessToken,
                cv: {
                    ...cvData,
                    draftId: draftId || undefined,
                },
            });
            if (res?.data?._id) {
                setDraftId(res.data._id);
                setLastSavedAt(res.data.lastSavedAt || new Date().toISOString());
            }
            return res?.data?._id || null;
        } catch {
            return null;
        }
    }, [accessToken, refreshAccessToken, buildCvData, draftId]);

    useEffect(() => {
        if (!accessToken) return;
        if (skipAutosaveRef.current) {
            skipAutosaveRef.current = false;
            return;
        }
        if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);
        autosaveTimerRef.current = setTimeout(() => {
            persistDraft(true);
        }, 3000);
        return () => {
            if (autosaveTimerRef.current) clearTimeout(autosaveTimerRef.current);
        };
    }, [formData, persistDraft, accessToken]);

    const handleMagicImport = async (file) => {
        if (!file) return;
        setIsExtracting(true);
        let loadingToast = null;
        try {
            loadingToast = toast.loading(t("AI Extraction"));
            const res = await aiApi.extractFromPdf({ accessToken, refreshAccessToken, file });
            if (res.success && res.data) {
                const mappedData = mapParsedDataToTemplate(res.data);
                const config = getTemplateConfig(selectedTemplate);

                setFormData(prev => {
                    // Step 1: Merge Experience & Education (Safety Rule)
                    const mergedExperience = [...(prev.experience || [])];
                    if (mappedData.experience?.length) {
                        mappedData.experience.forEach(newItem => {
                            // Check if this experience already exists (basic check by role and company)
                            const exists = mergedExperience.find(e =>
                                e.role?.toLowerCase() === newItem.role?.toLowerCase() &&
                                e.company?.toLowerCase() === newItem.company?.toLowerCase()
                            );
                            if (!exists && (newItem.role || newItem.company)) {
                                mergedExperience.push(newItem);
                            }
                        });
                    }

                    const mergedEducation = [...(prev.education || [])];
                    if (mappedData.education?.length) {
                        mappedData.education.forEach(newItem => {
                            const exists = mergedEducation.find(e =>
                                e.degree?.toLowerCase() === newItem.degree?.toLowerCase() &&
                                e.institute?.toLowerCase() === newItem.institute?.toLowerCase()
                            );
                            if (!exists && (newItem.degree || newItem.institute)) {
                                mergedEducation.push(newItem);
                            }
                        });
                    }

                    // Step 2: Handle Additional Sections (Dynamic Logic)
                    const updatedAdditional = [...(prev.additionalSections || [])];
                    if (mappedData.highValueExtras) {
                        Object.entries(mappedData.highValueExtras).forEach(([title, content]) => {
                            if (!content) return;

                            // RULE: Only create "New Section" if it's NOT a standard section 
                            // AND NOT visible in current template inputs
                            const standardSections = ["personalInfo", "experience", "education", "skills", "about"];
                            const isStandard = standardSections.includes(title.toLowerCase()) ||
                                (title.toLowerCase() === "summary" && standardSections.includes("about"));

                            const isVisible = config.sections?.some(s => s.toLowerCase() === title.toLowerCase());

                            if (!isStandard && !isVisible) {
                                // Check if this section already exists by title
                                const exists = updatedAdditional.find(s => s.title?.toLowerCase() === title.toLowerCase());
                                if (!exists) {
                                    updatedAdditional.push({
                                        id: Date.now() + Math.random().toString(36).substr(2, 9),
                                        title: title,
                                        content: typeof content === 'string' ? content : JSON.stringify(content, null, 2)
                                    });
                                }
                            }
                        });
                    }

                    const mergedSkills = [...(prev.skills || [])];
                    if (mappedData.skills?.length) {
                        mappedData.skills.forEach(skill => {
                            if (!mergedSkills.map(s => s.toLowerCase()).includes(skill.toLowerCase())) {
                                mergedSkills.push(skill);
                            }
                        });
                    }

                    return {
                        ...prev,
                        ...mappedData,
                        personalInfo: { ...prev.personalInfo, ...mappedData.personalInfo },
                        experience: mergedExperience.length ? mergedExperience : prev.experience,
                        education: mergedEducation.length ? mergedEducation : prev.education,
                        skills: mergedSkills,
                        additionalSections: updatedAdditional
                    };
                });
                toast.success(t("CV Extracted"), { id: loadingToast });
            } else {
                toast.dismiss(loadingToast);
            }
        } catch (err) {
            console.error("Extraction error:", err);
            if (loadingToast) toast.dismiss(loadingToast);
        } finally {
            setIsExtracting(false);
        }
    };

    const handleNext = () => setActiveStep((prev) => prev + 1);
    const handleBack = () => setActiveStep((prev) => prev - 1);

    const renderStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <PersonalInfoStep
                        formData={formData}
                        handleChange={handleChange}
                        selectedTemplate={selectedTemplate}
                        handleMagicImport={handleMagicImport}
                        isExtracting={isExtracting}
                    />
                );
            case 1:
                return (
                    <ExperienceStep
                        formData={formData}
                        setFormData={setFormData}
                        handleChange={handleChange}
                        selectedTemplate={selectedTemplate}
                    />
                );
            case 2:
                return (
                    <SkillsEducationStep
                        formData={formData}
                        setFormData={setFormData}
                        skillInput={skillInput}
                        setSkillInput={setSkillInput}
                        handleChange={handleChange}
                        selectedTemplate={selectedTemplate}
                    />
                );
            case 3:
                return <GenerateStep generateCV={() => setActiveStep(4)} loading={loading} />;
            default:
                return null;
        }
    };

    const handleSaveCV = async () => {
        setLoading(true);
        const loadingToast = toast.loading(t("Saving CV..."));
        try {
            let targetId = draftId;
            if (!targetId) {
                targetId = await persistDraft(true);
            }
            if (!targetId) {
                throw new Error("Draft save failed before finalize.");
            }

            const res = await cvApi.finalizeCV({ accessToken, refreshAccessToken, id: targetId });
            if (res.success) {
                toast.success(t("CV saved successfully!"), { id: loadingToast });
                setLastSavedAt(res?.data?.updatedAt || new Date().toISOString());
            } else {
                toast.error(t("Failed to save CV"), { id: loadingToast });
            }
        } catch (err) {
            console.error(err);
            toast.error(t("Failed to save CV"), { id: loadingToast });
        } finally {
            setLoading(false);
        }
    };

    const [showMobilePreview, setShowMobilePreview] = useState(false);

    if (activeStep === 4) {
        return <PreviewCV formData={formData} selectedTemplate={selectedTemplate} selectedCategory={selectedCategory} setCvContent={() => { }} setActiveStep={setActiveStep} onSaveCV={handleSaveCV} isSaving={loading} />;
    }

    return (
        <Box sx={{ minHeight: '100vh', py: { xs: 6, lg: 12 }, bgcolor: 'background.default' }}>
            <Container maxWidth="xl">
                <Box sx={{ textAlign: 'center', mb: { xs: 5, lg: 10 } }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                        <Box></Box>
                        <Typography variant="h2" fontWeight="900" sx={{ color: 'text.primary', fontSize: { xs: '2.5rem', lg: '3.75rem' } }}>{cvId ? t('Edit Your CV') : t('Create Your Future')}</Typography>
                        <Box></Box>
                    </Box>
                    <Typography variant="h6" color="text.secondary">{t("Active Template")}: {selectedTemplate.toUpperCase()}</Typography>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 4, justifyContent: 'center', alignItems: 'flex-start' }}>
                    <Paper className='glass' sx={{ p: { xs: 3, lg: 6 }, borderRadius: '32px', flex: '0 1 800px', width: '100%', bgcolor: 'background.paper' }}>
                        <CustomStepper activeStep={activeStep} onStepClick={setActiveStep} />

                        <Box sx={{ minHeight: 400, mt: 4 }}>
                            {renderStepContent(activeStep)}
                        </Box>

                        {lastSavedAt && (
                            <Typography variant="caption" sx={{ color: "#6B7280", mt: 2, display: "block" }}>
                                {t("Last saved at")}: {new Date(lastSavedAt).toLocaleString()}
                            </Typography>
                        )}

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 8 }}>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Button disabled={activeStep === 0} onClick={handleBack} startIcon={<ChevronLeft size={20} />}>{t("Back")}</Button>
                            </Box>
                            {activeStep < 3 && <Button variant="contained" onClick={handleNext} endIcon={<ChevronRight size={20} />}>{t("Next Step")}</Button>}
                        </Box>
                    </Paper>

                    <LivePreview
                        formData={formData}
                        selectedTemplate={selectedTemplate}
                        selectedCategory={selectedCategory}
                        showMobilePreview={showMobilePreview}
                        onCloseMobile={() => setShowMobilePreview(false)}
                    />
                </Box>

                {/* Mobile Preview Toggle Button */}
                <Box sx={{ display: { xs: 'flex', lg: 'none' }, position: 'fixed', bottom: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 1000 }}>
                    <Button
                        variant="contained"
                        onClick={() => setShowMobilePreview(true)}
                        startIcon={<Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#fff', animation: 'pulse 2s infinite' }} />}
                        sx={{
                            borderRadius: '30px',
                            px: 4,
                            py: 1.5,
                            bgcolor: '#1E1B4B',
                            boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
                            '&:hover': { bgcolor: '#2D2A6E' }
                        }}
                    >
                        {t("Live Preview")}
                    </Button>
                </Box>
            </Container>
        </Box>
    );
}
