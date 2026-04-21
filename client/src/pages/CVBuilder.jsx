import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Box, Button, Typography, Paper, Container } from "@mui/material";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from "react-i18next";
import * as cvApi from "../api/cv";
import * as aiApi from "../api/ai";
import { mapParsedDataToTemplate } from "../utils/cvBuilder/dataMapper";

import CustomStepper from "../components/cvBuilder/CustomStepper";
import LivePreview from "../components/cvBuilder/LivePreview";
import PersonalInfoStep from "../components/cvBuilder/steps/PersonalInfoStep";
import ExperienceStep from "../components/cvBuilder/steps/ExperienceStep";
import SkillsEducationStep from "../components/cvBuilder/steps/SkillsEducationStep";
import GenerateStep from "../components/cvBuilder/steps/GenerateStep";
import PreviewCV from "../components/cvBuilder/PreviewCV";

const DRAFT_KEY = 'cv_draft';

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
    const [cvContent] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [skillInput, setSkillInput] = useState("");

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
        certifications: ""
    };

    const [formData, setFormData] = useState(() => {
        // Restore draft only if not editing existing CV
        if (!cvId) {
            try {
                const saved = localStorage.getItem(DRAFT_KEY);
                if (saved) {
                    const draft = JSON.parse(saved);
                    // Only restore if template matches
                    if (draft.template === selectedTemplate) {
                        toast.success(t("Draft restored"), { duration: 2000 });
                        return { ...defaultFormData, ...draft.formData };
                    }
                }
            } catch (e) {
                console.error('Failed to restore draft:', e);
            }
        }
        return defaultFormData;
    });

    // Auto-save draft to localStorage every 10 seconds
    useEffect(() => {
        if (cvId) return;

        const interval = setInterval(() => {
            try {
                const draftData = {
                    template: selectedTemplate,
                    formData: {
                        ...formData,
                        personalInfo: {
                            ...formData.personalInfo,
                            profileImage: null,
                            profileImagePreview: null
                        }
                    },
                    savedAt: new Date().toISOString()
                };
                localStorage.setItem(DRAFT_KEY, JSON.stringify(draftData));
            } catch (e) {
                console.error('Failed to save draft:', e);
            }
        }, 10000);

        return () => clearInterval(interval);
    }, [formData, selectedTemplate, cvId]);

    // Auto-save to My CVs when user leaves the page
    useEffect(() => {
        if (cvId || !accessToken) return;

        const saveToMyCVs = async () => {
            try {
                // Only save if there's actual data (not empty)
                const hasData = formData.personalInfo?.name?.trim() || 
                                formData.experience?.some(e => e.role?.trim()) ||
                                formData.skills?.length > 0;
                if (!hasData) return;

                const projectsArray = formData.projects
                    ? formData.projects.split("\n").filter(p => p.trim()).map(p => {
                        const parts = p.split("|");
                        return {
                            title: parts[0]?.trim() || "Project",
                            description: parts[1]?.trim() || p.trim(),
                            githubLink: "",
                            liveLink: ""
                        };
                    })
                    : [];

                const cvData = {
                    name: formData.personalInfo.name || "Untitled CV",
                    title: formData.personalInfo.title || "",
                    email: formData.personalInfo.email || "",
                    phone: formData.personalInfo.phone || "",
                    address: formData.personalInfo.address || "",
                    summary: formData.personalInfo.about || "",
                    linkedin: formData.personalInfo.linkedin || "",
                    github: formData.personalInfo.github || "",
                    template: selectedTemplate,
                    experience: formData.experience || [],
                    education: formData.education || [],
                    skills: formData.skills || [],
                    projects: projectsArray,
                    languages: formData.languages || "",
                    certifications: formData.certifications || ""
                };

                await cvApi.createCv({ accessToken, refreshAccessToken, cv: cvData });
                localStorage.removeItem(DRAFT_KEY);
            } catch (err) {
                console.error('Auto-save to My CVs failed:', err);
            }
        };

        const handleBeforeUnload = (e) => {
            // Save synchronously to localStorage first
            try {
                const draftData = {
                    template: selectedTemplate,
                    formData: { ...formData, personalInfo: { ...formData.personalInfo, profileImage: null, profileImagePreview: null } },
                    savedAt: new Date().toISOString(),
                    pendingSave: true
                };
                localStorage.setItem(DRAFT_KEY, JSON.stringify(draftData));
            } catch (e) {
                console.error(e);
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        
        // Also save when visibility changes (tab switch, minimize)
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden') {
                saveToMyCVs();
            }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [formData, selectedTemplate, accessToken, refreshAccessToken, cvId]);

    // Clear draft when component unmounts if on preview step
    useEffect(() => {
        return () => {
            if (activeStep === 4) {
                localStorage.removeItem(DRAFT_KEY);
            }
        };
    }, [activeStep]);

    useEffect(() => {
        const fetchCvData = async () => {
            if (!cvId || !accessToken) return;
            setLoading(true);
            try {
                const response = await cvApi.getCvById({ accessToken, refreshAccessToken, id: cvId });
                if (response.success && response.data) {
                    const cv = response.data;
                    setFormData(prev => ({
                        ...prev,
                        personalInfo: {
                            ...prev.personalInfo,
                            name: cv.name || "",
                            title: cv.title || "",
                            email: cv.email || "",
                            phone: cv.phone || "",
                            address: cv.address || "",
                            about: cv.summary || "",
                            linkedin: cv.linkedin || "",
                            github: cv.github || ""
                        },
                        experience: cv.experience?.length ? cv.experience : [{ role: "", company: "", startDate: "", endDate: "", current: false, description: "" }],
                        education: cv.education?.length ? cv.education : [{ degree: "", institute: "", startDate: "", endDate: "", current: false, description: "" }],
                        skills: cv.skills || [],
                        projects: (cv.projects || []).map(p => `${p.title} | ${p.description}`).join("\n"),
                        languages: cv.languages || "",
                        certifications: cv.certifications || ""
                    }));
                    // Clear draft when loading existing CV
                    localStorage.removeItem(DRAFT_KEY);
                }
            } catch {
                setErrorMessage(t("Failed CVs"));
            } finally {
                setLoading(false);
            }
        };
        fetchCvData();
    }, [cvId, accessToken, refreshAccessToken]);

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

    const handleMagicImport = async (file) => {
        if (!file) return;
        setIsExtracting(true);
        let loadingToast = null;
        try {
            loadingToast = toast.loading(t("AI Extraction"));
            const res = await aiApi.extractFromPdf({ accessToken, refreshAccessToken, file });
            if (res.success && res.data) {
                const mappedData = mapParsedDataToTemplate(res.data);
                setFormData(prev => ({
                    ...prev,
                    ...mappedData,
                    personalInfo: { ...prev.personalInfo, ...mappedData.personalInfo }
                }));
                toast.success(t("CV Extracted"), { id: loadingToast });
            } else {
                toast.dismiss(loadingToast);
            }
        } catch (err) {
            if (loadingToast) toast.dismiss(loadingToast);
            // Handled globally in http.js
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
            // Convert projects string to array format
            const projectsArray = formData.projects
                ? formData.projects.split("\n").filter(p => p.trim()).map(p => {
                    const parts = p.split("|");
                    return {
                        title: parts[0]?.trim() || "Project",
                        description: parts[1]?.trim() || p.trim(),
                        githubLink: "",
                        liveLink: ""
                    };
                })
                : [];

            const cvData = {
                name: formData.personalInfo.name,
                title: formData.personalInfo.title,
                email: formData.personalInfo.email,
                phone: formData.personalInfo.phone,
                address: formData.personalInfo.address,
                summary: formData.personalInfo.about,
                linkedin: formData.personalInfo.linkedin,
                github: formData.personalInfo.github,
                template: selectedTemplate,
                experience: formData.experience,
                education: formData.education,
                skills: formData.skills,
                projects: projectsArray,
                languages: formData.languages,
                certifications: formData.certifications
            };

            const res = await cvApi.createCv({ accessToken, refreshAccessToken, cv: cvData });
            if (res.success) {
                toast.success(t("CV saved successfully!"), { id: loadingToast });
                localStorage.removeItem(DRAFT_KEY); // Clear draft after saving
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

    if (activeStep === 4) {
        return <PreviewCV formData={formData} selectedTemplate={selectedTemplate} selectedCategory={selectedCategory} setCvContent={() => {}} setActiveStep={setActiveStep} onSaveCV={handleSaveCV} isSaving={loading} />;
    }

    return (
        <Box sx={{ minHeight: '100vh', py: 12, bgcolor: 'background.default' }}>
            <Container maxWidth="xl">
                <Box sx={{ textAlign: 'center', mb: 10 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                        <Box></Box>
                        <Typography variant="h2" fontWeight="900" sx={{ color: 'text.primary' }}>{cvId ? t('Edit Your CV') : t('Create Your Future')}</Typography>
                        <Box></Box>
                    </Box>
                    <Typography variant="h6" color="text.secondary">{t("Active Template")}: {selectedTemplate.toUpperCase()}</Typography>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 4, justifyContent: 'center', alignItems: 'flex-start' }}>
                    <Paper className='glass' sx={{ p: 6, borderRadius: '32px', flex: '0 1 800px', width: '100%', bgcolor: 'background.paper' }}>
                        <CustomStepper activeStep={activeStep} onStepClick={setActiveStep} />

                        <Box sx={{ minHeight: 400, mt: 4 }}>
                            {renderStepContent(activeStep)}
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 8 }}>
                            <Button disabled={activeStep === 0} onClick={handleBack} startIcon={<ChevronLeft size={20} />}>{t("Back")}</Button>
                            {activeStep < 3 && <Button variant="contained" onClick={handleNext} endIcon={<ChevronRight size={20} />}>{t("Next Step")}</Button>}
                        </Box>
                    </Paper>

                    <LivePreview formData={formData} selectedTemplate={selectedTemplate} selectedCategory={selectedCategory} />
                </Box>
            </Container>
        </Box>
    );
}