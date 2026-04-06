import React from "react";
import { Box, Grow, Typography, Button } from "@mui/material";
import PremiumInput from "../PremiumInput";

export default function PersonalInfoStep({ formData, handleChange }) {
  return (
    <Grow in={true}>
      <Box>
        <Box sx={{ mb: 3, p: 2, border: "1px dashed #CBD5E1", borderRadius: "12px", textAlign: "center", bgcolor: "#F8FAFC" }}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 700, color: "#334155" }}>
            Profile Picture (Optional)
          </Typography>
          <Button variant="outlined" component="label" sx={{ textTransform: "none", borderRadius: "8px" }}>
            Upload Image
            <input type="file" name="profileImage" hidden accept="image/png, image/jpeg, image/jpg" onChange={(e) => handleChange(e, "personalInfo")} />
          </Button>
          {formData.personalInfo?.profileImage && (
            <Typography variant="caption" display="block" sx={{ mt: 1, color: "#16A34A", fontWeight: 700 }}>
              {formData.personalInfo.profileImage.name} selected
            </Typography>
          )}
        </Box>
        <PremiumInput
          label="What is your full name?"
          placeholder="e.g. John Doe"
          name="name"
          value={formData.personalInfo.name}
          onChange={(e) => handleChange(e, "personalInfo")}
        />
        <PremiumInput
          label="What is your current or target job title?"
          placeholder="e.g. Senior Software Engineer"
          name="title"
          value={formData.personalInfo.title}
          onChange={(e) => handleChange(e, "personalInfo")}
        />
        <PremiumInput
          label="Email address"
          placeholder="e.g. name@email.com"
          name="email"
          value={formData.personalInfo.email}
          onChange={(e) => handleChange(e, "personalInfo")}
        />
        <PremiumInput
          label="Phone number"
          placeholder="e.g. +44 7000 123456"
          name="phone"
          value={formData.personalInfo.phone}
          onChange={(e) => handleChange(e, "personalInfo")}
        />
        <PremiumInput
          label="GitHub profile (optional)"
          placeholder="e.g. github.com/username"
          name="github"
          value={formData.personalInfo.github}
          onChange={(e) => handleChange(e, "personalInfo")}
        />
        <PremiumInput
          label="LinkedIn profile (optional)"
          placeholder="e.g. linkedin.com/in/username"
          name="linkedin"
          value={formData.personalInfo.linkedin}
          onChange={(e) => handleChange(e, "personalInfo")}
        />
        <PremiumInput
          label="Write a short pitch about yourself"
          placeholder="Describe your passion and what makes you unique..."
          multiline
          rows={4}
          name="about"
          value={formData.personalInfo.about}
          onChange={(e) => handleChange(e, "personalInfo")}
        />
      </Box>
    </Grow>
  );
}

