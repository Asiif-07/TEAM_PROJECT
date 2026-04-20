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

    const [formData, setFormData] = useState({
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
    });

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
                    />
                );
            case 3:
                return <GenerateStep generateCV={() => setActiveStep(4)} loading={loading} />;
            default:
                return null;
        }
    };

    if (cvContent && activeStep === 4) {
        return <PreviewCV formData={formData} selectedTemplate={selectedTemplate} selectedCategory={selectedCategory} />;
    }

    return (
        <Box sx={{ minHeight: '100vh', py: 12 }} className="bg-mesh">
            <Container maxWidth="xl">
                <Box sx={{ textAlign: 'center', mb: 10 }}>
                    <Typography variant="h2" fontWeight="900" sx={{ mb: 2 }}>{cvId ? t('Edit Your CV') : t('Create Your Future')}</Typography>
                    <Typography variant="h6" color="textSecondary">{t("Active Template")}: {selectedTemplate.toUpperCase()}</Typography>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, gap: 4, justifyContent: 'center', alignItems: 'flex-start' }}>
                    <Paper className="glass" sx={{ p: 6, borderRadius: '32px', flex: '0 1 800px', width: '100%' }}>
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