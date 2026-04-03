import React, { useEffect, useState } from 'react';
import { Box, Button, Typography, Paper, Container } from "@mui/material";
import { Download, RefreshCcw, ChevronRight, ChevronLeft } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as cvApi from "../api/cv";

import {
    buildCvPayload as buildCvPayloadUtil,
    buildMarkdownPreview as buildMarkdownPreviewUtil,
    getTemplateClassName as getTemplateClassNameUtil,
} from "../utils/cvBuilder/cvBuilderUtils";

import PersonalInfoStep from "../components/cvBuilder/steps/PersonalInfoStep";
import ExperienceStep from "../components/cvBuilder/steps/ExperienceStep";
import SkillsEducationStep from "../components/cvBuilder/steps/SkillsEducationStep";
import GenerateStep from "../components/cvBuilder/steps/GenerateStep";
import CustomStepper from "../components/cvBuilder/CustomStepper";

export default function CVBuilder() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const selectedCategory = searchParams.get("category");
    const selectedTemplate = searchParams.get("template");
    const cvId = searchParams.get("cvId");
    const { accessToken, refreshAccessToken, isAuthenticated } = useAuth();
    const [activeStep, setActiveStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [cvContent, setCvContent] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [savedCvId, setSavedCvId] = useState("");
    const [currentTemplate, setCurrentTemplate] = useState(selectedTemplate || "modern-blue");
    const [currentCategory, setCurrentCategory] = useState(selectedCategory || "saved");
    const [skillInput, setSkillInput] = useState("");
    const [formData, setFormData] = useState({
        personalInfo: { name: "", title: "", about: "", email: "", phone: "", github: "", linkedin: "" },
        experience: [{ role: "", company: "", duration: "", description: "" }],
        skills: [],
        education: [{ degree: "", institute: "", year: "" }],
        projects: "",
        languages: "",
        certifications: ""
    });

    const handleNext = () => {
        setActiveStep((prev) => {
            const next = prev + 1;
            // Push history entry so browser Back navigates steps.
            window.history.pushState({ cvBuilderStep: next }, "");
            return next;
        });
    };

    const handleBack = () => {
        if (activeStep <= 0) return;
        // Keep history + step perfectly in sync.
        window.history.back();
    };

    useEffect(() => {
        if (!cvId && (!selectedTemplate || !selectedCategory)) {
            navigate("/cv-templates");
        }
    }, [cvId, selectedTemplate, selectedCategory, navigate]);

    // If editing an existing CV, load it and prefill the form.
    useEffect(() => {
        const run = async () => {
            if (!cvId) return;
            if (!isAuthenticated || !accessToken) return;
            try {
                setLoading(true);
                setErrorMessage("");
                const data = await cvApi.getCv({ accessToken, refreshAccessToken, id: cvId });
                const cv = data?.data;
                if (!cv) return;

                setSavedCvId(cv._id);
                setCurrentTemplate(cv.templateId || selectedTemplate || "modern-blue");
                setCurrentCategory(cv.templateCategory || selectedCategory || "saved");
                setFormData({
                    personalInfo: {
                        name: cv.name || "",
                        title: "",
                        about: cv.summary || "",
                        email: cv.email || "",
                        phone: cv.phone || "",
                        github: cv.github || "",
                        linkedin: cv.linkedin || "",
                    },
                    experience: Array.isArray(cv.experience) && cv.experience.length ? cv.experience : [{ role: "", company: "", duration: "", description: "" }],
                    skills: Array.isArray(cv.skills) ? cv.skills : [],
                    education: Array.isArray(cv.education) && cv.education.length ? cv.education : [{ degree: "", institute: "", year: "" }],
                    projects: Array.isArray(cv.projects)
                        ? cv.projects
                            .map((p) => `${p.title || ""} | ${p.description || ""} | ${p.githubLink || ""} | ${p.liveLink || ""}`.trim())
                            .filter(Boolean)
                            .join("\n")
                        : "",
                    languages: "",
                    certifications: "",
                });
                const previewPayload = {
                    name: cv.name || "",
                    email: cv.email || "",
                    phone: cv.phone || "",
                    github: cv.github || "",
                    linkedin: cv.linkedin || "",
                    summary: cv.summary || "",
                    education: Array.isArray(cv.education) ? cv.education : [],
                    skills: Array.isArray(cv.skills) ? cv.skills : [],
                    projects: Array.isArray(cv.projects) ? cv.projects : [],
                    experience: Array.isArray(cv.experience) ? cv.experience : [],
                    templateId: cv.templateId || selectedTemplate || "modern-blue",
                };
                setCvContent(
                    buildMarkdownPreviewUtil(previewPayload, {
                        selectedTemplate: cv.templateId || selectedTemplate || "modern-blue",
                        personalInfoTitle: "",
                    })
                );
                setActiveStep(4);
            } catch (e) {
                setErrorMessage(e?.message || "Failed to load CV for editing.");
            } finally {
                setLoading(false);
            }
        };
        run();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cvId, isAuthenticated, accessToken]);

    // Initialize history state and keep step synced with browser Back/Forward.
    useEffect(() => {
        window.history.replaceState({ cvBuilderStep: 0 }, "");

        const onPopState = (e) => {
            const stepFromState = e?.state?.cvBuilderStep;
            if (typeof stepFromState === "number") {
                setActiveStep(stepFromState);
            }
        };

        window.addEventListener("popstate", onPopState);
        return () => window.removeEventListener("popstate", onPopState);
    }, []);

    const handleChange = (e, section) => {
        setErrorMessage("");
        if (section === 'personalInfo') {
            setFormData({ ...formData, personalInfo: { ...formData.personalInfo, [e.target.name]: e.target.value } });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const buildCvPayload = () => buildCvPayloadUtil(formData, currentTemplate, currentCategory);

    const buildMarkdownPreview = (cv) =>
        buildMarkdownPreviewUtil(cv, {
            selectedTemplate: currentTemplate,
            personalInfoTitle: formData.personalInfo.title,
        });

    const getTemplateClassName = () => getTemplateClassNameUtil(currentTemplate);

    const generateCV = async () => {
        setLoading(true);
        setErrorMessage("");
        try {
            if (!isAuthenticated || !accessToken) {
                setErrorMessage("Please log in first to generate and save your CV.");
                return;
            }

            // Frontend guardrails for required backend schema fields.
            if (!formData.personalInfo.name.trim()) {
                setErrorMessage("Please enter your name.");
                return;
            }
            if (!formData.personalInfo.email.trim()) {
                setErrorMessage("Please enter your email.");
                return;
            }
            if (!formData.personalInfo.phone.trim()) {
                setErrorMessage("Please enter your phone number.");
                return;
            }
            if (!formData.personalInfo.about.trim()) {
                setErrorMessage("Please write a short summary/pitch about yourself.");
                return;
            }
            const skillsArr = (formData.skills || [])
                .map((s) => String(s || "").trim())
                .filter(Boolean);
            if (!skillsArr.length) {
                setErrorMessage("Please add at least 1 skill.");
                return;
            }
            if (!formData.education?.length) {
                setErrorMessage("Please add your education (one line per entry).");
                return;
            }
            if (!formData.experience?.length) {
                setErrorMessage("Please add your work history (one line per role).");
                return;
            }

            const payload = buildCvPayload();
            if (cvId) {
                const updated = await cvApi.updateCv({
                    accessToken,
                    refreshAccessToken,
                    id: cvId,
                    cv: payload,
                });
                setSavedCvId(updated?.data?._id || cvId);
            } else {
                const created = await cvApi.createCv({
                    accessToken,
                    refreshAccessToken,
                    cv: payload,
                });
                setSavedCvId(created?.data?._id || "");
            }

            setCvContent(buildMarkdownPreview(payload));
            handleNext();
        } catch (error) {
            setErrorMessage(error?.message || "Failed to create CV. Please review your details and try again.");
        } finally {
            setLoading(false);
        }
    };

    const renderStepContent = (step) => {
        switch (step) {
            case 0:
                return <PersonalInfoStep formData={formData} handleChange={handleChange} />;
            case 1:
                return <ExperienceStep formData={formData} setFormData={setFormData} handleChange={handleChange} />;
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
                return <GenerateStep generateCV={generateCV} loading={loading} />;
            default:
                return null;
        }
    };

    const handleEnterKeyFlow = (e) => {
        if (e.key !== "Enter" || e.shiftKey) return;

        const target = e.target;
        const currentTarget = e.currentTarget;
        if (!(target instanceof HTMLElement) || !(currentTarget instanceof HTMLElement)) return;

        // Keep normal Enter behavior for multiline fields and explicitly ignored inputs.
        const tagName = target.tagName?.toLowerCase();
        if (tagName === "textarea") return;
        if (target.closest('[data-enter-ignore="true"]')) return;

        // Only remap Enter while filling fields (not for random buttons/containers).
        const isField =
            tagName === "input" ||
            tagName === "select" ||
            target.getAttribute("role") === "textbox" ||
            target.isContentEditable;
        if (!isField) return;

        e.preventDefault();

        const focusable = Array.from(
            currentTarget.querySelectorAll(
                'input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [contenteditable="true"]'
            )
        ).filter((el) => el instanceof HTMLElement && el.offsetParent !== null);

        const index = focusable.indexOf(target);
        if (index >= 0 && index < focusable.length - 1) {
            const next = focusable[index + 1];
            if (next instanceof HTMLElement) next.focus();
        }
    };

    if (cvContent && activeStep === 4) {
        return (
            <Box sx={{ py: 10, bgcolor: '#F8FAF8', minHeight: '100vh' }} className="bg-mesh">
                <Container maxWidth="md">
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 6, px: 2 }} className="no-print">
                        <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#10B981' }} />
                                <Typography variant="caption" fontWeight="800" color="#10B981" sx={{ letterSpacing: '1px' }}>READY TO DOWNLOAD</Typography>
                            </Box>
                            <Typography variant="h3" fontWeight="900" color="#111827">Your Masterpiece</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Button
                                variant="outlined"
                                startIcon={<RefreshCcw size={18} />}
                                onClick={() => { setCvContent(""); setActiveStep(0); }}
                                sx={{ borderRadius: '16px', textTransform: 'none', fontWeight: 700, px: 4, height: '56px', border: '2px solid #E5E7EB', color: '#374151', '&:hover': { border: '2px solid #2563EB', color: '#2563EB' } }}
                            >
                                Edit Data
                            </Button>
                            {savedCvId && (
                                <Button
                                    color="error"
                                    variant="outlined"
                                    onClick={async () => {
                                        try {
                                            await cvApi.deleteCv({ accessToken, refreshAccessToken, id: savedCvId });
                                            setSavedCvId("");
                                            setCvContent("");
                                            setActiveStep(0);
                                            navigate("/my-cvs");
                                        } catch (e) {
                                            setErrorMessage(e?.message || "Failed to delete CV.");
                                        }
                                    }}
                                    sx={{ borderRadius: '16px', textTransform: 'none', fontWeight: 700, px: 4, height: '56px', border: '2px solid #FCA5A5' }}
                                >
                                    Delete CV
                                </Button>
                            )}
                            <Button
                                variant="outlined"
                                onClick={() => navigate("/my-cvs")}
                                sx={{ borderRadius: '16px', textTransform: 'none', fontWeight: 700, px: 4, height: '56px', border: '2px solid #E5E7EB', color: '#374151', '&:hover': { border: '2px solid #2563EB', color: '#2563EB' } }}
                            >
                                My CVs
                            </Button>
                            <Button
                                variant="contained"
                                startIcon={<Download size={18} />}
                                onClick={() => window.print()}
                                sx={{ borderRadius: '16px', textTransform: 'none', fontWeight: 700, px: 6, height: '56px', bgcolor: '#111827', transition: 'all 0.3s ease', '&:hover': { bgcolor: '#1F2937', transform: 'translateY(-2px)', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' } }}
                            >
                                Download as PDF
                            </Button>
                        </Box>
                    </Box>

                    <Paper
                        className={`cv-document ${getTemplateClassName()}`}
                        elevation={0}
                        sx={{
                            p: { xs: 4, sm: 10 },
                            borderRadius: '4px',
                            bgcolor: 'white',
                            minHeight: '297mm',
                            width: '100%',
                            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        {/* Premium Design Accent */}
                        <Box sx={{ position: 'absolute', top: 0, right: 0, width: '300px', height: '300px', background: 'radial-gradient(circle at top right, #EEF2FF 0%, transparent 70%)', zIndex: 0 }} />

                        <Box className="prose prose-slate max-w-none cv-content" sx={{ position: 'relative', zIndex: 1 }}>
                            <ReactMarkdown>{cvContent}</ReactMarkdown>
                        </Box>

                        <Box sx={{ mt: 15, pt: 6, borderTop: '1px solid #F3F4F6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="caption" color="#9CA3AF" sx={{ letterSpacing: '2px', fontWeight: 800 }}>
                                STORYLAKE AI
                            </Typography>
                            <Typography variant="caption" color="#9CA3AF">
                                Professional Document ID: #{Math.random().toString(36).substr(2, 9).toUpperCase()}
                            </Typography>
                        </Box>
                    </Paper>
                </Container>
            </Box>
        );
    }

    return (
        <Box sx={{ minHeight: '100vh', py: 12, position: 'relative', overflow: 'hidden' }} className="bg-mesh">
            {/* Background elements */}
            <Box sx={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(37, 99, 235, 0.05) 0%, transparent 70%)' }} />
            <Box sx={{ position: 'absolute', bottom: -100, left: -100, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124, 58, 237, 0.05) 0%, transparent 70%)' }} />

            <Container maxWidth="md">
                <Box sx={{ textAlign: 'center', mb: 10 }}>
                    <Typography
                        variant="h2"
                        fontWeight="900"
                        className="premium-text-gradient"
                        sx={{ mb: 2, letterSpacing: '-2px' }}
                    >
                        Create Your Future
                    </Typography>
                    <Typography variant="h6" color="textSecondary" sx={{ fontWeight: 500 }}>
                        The most advanced AI CV builder for elite professionals.
                    </Typography>
                    <Typography sx={{ mt: 2, color: '#1D4ED8', fontWeight: 700 }}>
                        Selected Template: {currentCategory} / {currentTemplate}
                    </Typography>
                </Box>

                <Paper
                    className="glass"
                    elevation={0}
                    onKeyDown={handleEnterKeyFlow}
                    sx={{
                        p: { xs: 4, md: 8 },
                        borderRadius: '32px',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.8)'
                    }}
                >
                    <CustomStepper activeStep={activeStep} />
                    {errorMessage && (
                        <Typography sx={{ mb: 3, color: "#B91C1C", fontWeight: 700, textAlign: "center" }}>
                            {errorMessage}
                        </Typography>
                    )}

                    <Box sx={{ minHeight: 400 }}>
                        {renderStepContent(activeStep)}
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 8, pt: 4, borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                        <Button
                            disabled={activeStep === 0 || loading}
                            onClick={handleBack}
                            startIcon={<ChevronLeft size={20} />}
                            sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 700, color: '#6B7280', '&:hover': { bgcolor: '#F3F4F6' } }}
                        >
                            Previous Step
                        </Button>
                        {activeStep < 3 && (
                            <Button
                                variant="contained"
                                onClick={handleNext}
                                endIcon={<ChevronRight size={20} />}
                                sx={{
                                    px: 5,
                                    py: 1.5,
                                    borderRadius: '12px',
                                    textTransform: 'none',
                                    fontWeight: 700,
                                    bgcolor: '#111827',
                                    '&:hover': { bgcolor: '#1F2937' }
                                }}
                            >
                                Next Step
                            </Button>
                        )}
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
}
