import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Paper, Container } from "@mui/material";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as cvApi from "../api/cv";
import PreviewCV from "../components/cvBuilder/PreviewCV";
import { buildCvPayload as buildCvPayloadUtil } from "../utils/cvBuilder/cvBuilderUtils";
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

    const { accessToken, refreshAccessToken, isAuthenticated } = useAuth();
    const [activeStep, setActiveStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [cvContent, setCvContent] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [skillInput, setSkillInput] = useState("");

    const [formData, setFormData] = useState({
        personalInfo: { name: "", title: "", about: "", email: "", phone: "", github: "", linkedin: "", profileImage: null },
        experience: [{ role: "", company: "", startDate: "", endDate: "", description: "" }],
        skills: [],
        education: [{ degree: "", institute: "", startDate: "", endDate: "" }],
        projects: "",
        languages: "",
        certifications: ""
    });

    const handleNext = () => setActiveStep((prev) => prev + 1);
    const handleBack = () => setActiveStep((prev) => prev - 1);

    // If they bypass the templates page, kick them back
    useEffect(() => {
        if (!selectedTemplate || !selectedCategory) navigate("/cv-templates");
    }, [selectedTemplate, selectedCategory, navigate]);

    const handleChange = (e, section) => {
        setErrorMessage("");
        if (section === 'personalInfo') {
            if (e.target.name === 'profileImage') {
                setFormData({ ...formData, personalInfo: { ...formData.personalInfo, profileImage: e.target.files[0] } });
            } else {
                setFormData({ ...formData, personalInfo: { ...formData.personalInfo, [e.target.name]: e.target.value } });
            }
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const buildCvPayload = () => buildCvPayloadUtil(formData, selectedTemplate, selectedCategory);

    const generateCV = async () => {
        setLoading(true);
        setErrorMessage("");
        try {
            if (!isAuthenticated || !accessToken) {
                setErrorMessage("Please log in first to generate and save your CV.");
                return;
            }
            if (!formData.personalInfo.name.trim()) return setErrorMessage("Please enter your name.");
            if (!formData.personalInfo.email.trim()) return setErrorMessage("Please enter your email.");

            const payload = buildCvPayload();
            
            const form = new FormData();
            Object.keys(payload).forEach(key => {
                if (typeof payload[key] === 'object' && payload[key] !== null) {
                    form.append(key, JSON.stringify(payload[key]));
                } else {
                    form.append(key, payload[key]);
                }
            });

            if (formData.personalInfo.profileImage) {
                form.append("profileImage", formData.personalInfo.profileImage);
            }

            await cvApi.createCv({ accessToken, refreshAccessToken, cv: form });

            // Triggers the final preview step
            setCvContent("success");
            handleNext();
        } catch (error) {
            setErrorMessage(error?.message || "Failed to create CV.");
        } finally {
            setLoading(false);
        }
    };

    const renderStepContent = (step) => {
        switch (step) {
            case 0: return <PersonalInfoStep formData={formData} handleChange={handleChange} />;
            case 1: return <ExperienceStep formData={formData} setFormData={setFormData} handleChange={handleChange} />;
            case 2: return <SkillsEducationStep formData={formData} setFormData={setFormData} skillInput={skillInput} setSkillInput={setSkillInput} handleChange={handleChange} />;
            case 3: return <GenerateStep generateCV={generateCV} loading={loading} />;
            default: return null;
        }
    };


    if (cvContent && activeStep === 4) {
        return (
            <PreviewCV
                formData={formData}
                selectedTemplate={selectedTemplate}
                selectedCategory={selectedCategory}
                cvContent={cvContent}
                setCvContent={setCvContent}
                setActiveStep={setActiveStep}
            />
        );
    }

    return (
        <Box sx={{ minHeight: '100vh', py: 12, position: 'relative', overflow: 'hidden' }} className="bg-mesh">
            <Container maxWidth="md">
                <Box sx={{ textAlign: 'center', mb: 10 }}>
                    <Typography variant="h2" fontWeight="900" sx={{ mb: 2 }}>Create Your Future</Typography>
                    <Typography variant="h6" color="textSecondary">Selected Template: {selectedCategory} / {selectedTemplate}</Typography>
                </Box>

                <Paper className="glass" elevation={0} sx={{ p: { xs: 4, md: 8 }, borderRadius: '32px' }}>
                    <CustomStepper activeStep={activeStep} />
                    {errorMessage && <Typography sx={{ mb: 3, color: "#B91C1C", fontWeight: 700, textAlign: "center" }}>{errorMessage}</Typography>}

                    <Box sx={{ minHeight: 400 }}>{renderStepContent(activeStep)}</Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 8, pt: 4, borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                        <Button disabled={activeStep === 0 || loading} onClick={handleBack} startIcon={<ChevronLeft size={20} />}>Previous Step</Button>
                        {activeStep < 3 && <Button variant="contained" onClick={handleNext} endIcon={<ChevronRight size={20} />}>Next Step</Button>}
                    </Box>
                </Paper>
            </Container>
        </Box>
    );
}