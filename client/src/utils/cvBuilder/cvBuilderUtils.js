const splitLines = (text) =>
  (text || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

export function buildCvPayload(formData, selectedTemplate, selectedCategory) {
  const education = (formData.education || []).map((e) => ({
    degree: (e?.degree || "").trim() || "Degree",
    institute: (e?.institute || "").trim() || "Institute",
    year: (e?.year || "").trim() || "N/A",
  }));

  const experience = (formData.experience || []).map((x) => ({
    role: (x?.role || "").trim() || "Role",
    company: (x?.company || "").trim() || "Company",
    duration: (x?.duration || "").trim() || "N/A",
    description: (x?.description || "").trim() || "Professional experience details",
  }));

  const skills = (formData.skills || [])
    .map((s) => String(s || "").trim())
    .filter(Boolean);

  const projects = splitLines(formData.projects).map((line) => {
    // Format: Title | Description | githubLink(optional) | liveLink(optional)
    const [title = "", description = "", githubLink = "", liveLink = ""] = line
      .split("|")
      .map((v) => v.trim());

    return {
      title: title || "Project",
      description: description || "Project description",
      githubLink: githubLink || undefined,
      liveLink: liveLink || undefined,
    };
  });

  const languageList = (formData.languages || "")
    .split(/[,\n]/)
    .map((l) => l.trim())
    .filter(Boolean);

  const certificationList = splitLines(formData.certifications);

  const extraSummaryParts = [];
  if (languageList.length) extraSummaryParts.push(`Languages: ${languageList.join(", ")}`);
  if (certificationList.length)
    extraSummaryParts.push(`Certifications: ${certificationList.join(", ")}`);

  const summaryBase = (formData.personalInfo.about || "").trim();
  const summary = extraSummaryParts.length
    ? `${summaryBase}\n\n${extraSummaryParts.join("\n")}`
    : summaryBase;

  return {
    name: formData.personalInfo.name.trim(),
    email: formData.personalInfo.email.trim(),
    phone: formData.personalInfo.phone.trim(),
    github: formData.personalInfo.github.trim(),
    linkedin: formData.personalInfo.linkedin.trim(),
    summary: summary.slice(0, 500),
    education,
    skills,
    projects,
    experience,
    templateId: selectedTemplate,
    templateCategory: selectedCategory,
  };
}

export function getTemplateClassName(selectedTemplate) {
  if (selectedTemplate === "classic-red") return "cv-template-classic-red";
  if (selectedTemplate === "modern-blue") return "cv-template-modern-blue";
  if (selectedTemplate === "minimal-black") return "cv-template-minimal-black";
  if (selectedTemplate === "creative-purple") return "cv-template-creative-purple";
  return "cv-template-modern-blue";
}

export function buildMarkdownPreview(cv, { selectedTemplate, personalInfoTitle }) {
  const skillsLine = cv.skills.length ? cv.skills.join(", ") : "N/A";
  const educationLines = cv.education.length
    ? cv.education.map((e) => `- **${e.degree}**, ${e.institute} (${e.year})`).join("\n")
    : "- N/A";
  const experienceLines = cv.experience.length
    ? cv.experience
        .map((e) => `- **${e.role}** at **${e.company}** (${e.duration})\n  - ${e.description}`)
        .join("\n")
    : "- N/A";
  const projectsLines = cv.projects?.length
    ? cv.projects
        .map((p) => {
          const links = [
            p.githubLink ? `GitHub: ${p.githubLink}` : "",
            p.liveLink ? `Live: ${p.liveLink}` : "",
          ]
            .filter(Boolean)
            .join(" | ");
          return `- **${p.title}**\n  - ${p.description}${links ? `\n  - ${links}` : ""}`;
        })
        .join("\n")
    : "- N/A";

  const sectionMap = {
    summary: `## Summary\n${cv.summary}\n`,
    skills: `## Skills\n${skillsLine}\n`,
    education: `## Education\n${educationLines}\n`,
    experience: `## Experience\n${experienceLines}\n`,
    projects: `## Projects\n${projectsLines}\n`,
  };

  const defaultOrder = ["summary", "skills", "education", "experience"];
  const orderWithProjects = (base) => [...base, "projects"];

  const templateOrder =
    selectedTemplate === "classic-red"
      ? ["summary", "education", "experience", "skills"]
      : selectedTemplate === "modern-blue"
        ? ["summary", "skills", "education", "experience"]
        : selectedTemplate === "minimal-black"
          ? ["summary", "skills", "education", "experience"]
          : selectedTemplate === "creative-purple"
            ? ["summary", "experience", "skills", "education"]
            : defaultOrder;

  const orderedSections = orderWithProjects(templateOrder)
    .map((key) => sectionMap[key])
    .join("\n");

  // Template-specific header content (still data comes from backend CV form).
  const titleBlock = `**Title:** ${personalInfoTitle || "Professional"}`;
  const contactBlock =
    selectedTemplate === "minimal-black"
      ? `**Contact:** ${cv.email} | ${cv.phone}`
      : selectedTemplate === "creative-purple"
        ? `**Contact:** ${cv.email} | ${cv.phone}\n**Links:** ${
            cv.github ? `GitHub: ${cv.github}` : "GitHub: N/A"
          } | ${cv.linkedin ? `LinkedIn: ${cv.linkedin}` : "LinkedIn: N/A"}`
        : `**Email:** ${cv.email}\n**Phone:** ${cv.phone}\n**GitHub:** ${cv.github || "N/A"}\n**LinkedIn:** ${
            cv.linkedin || "N/A"
          }`;

  return `# ${cv.name}\n\n${titleBlock}\n\n${contactBlock}\n\n${orderedSections}`;
}

