import { Box, Button, Container, Paper, Typography, TextField } from "@mui/material";
import { CheckCircle2, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const templates = [
  {
    id: "classic-red",
    category: "General CV",
    title: "Classic Professional",
    description: "Clean and traditional structure with strong section headings.",
    highlights: ["Balanced spacing", "Section-first layout", "Professional accent"],
    image: "src/assets/images/classical cv.png" 
  },
  {
    id: "europass-standard",
    category: "Europass",
    title: "Standard EU Format",
    description: "The official layout required for many European institutions.",
    highlights: ["Official format", "Left-aligned labels", "Recognized Europe-wide"],
    image: "src/assets/images/euro poass.png" 
  },
  {
    id: "korean-standard",
    category: "Korean CV",
    title: "Standard 이력서",
    description: "Traditional grid-based layout for the Korean job market.",
    highlights: ["Photo inclusion", "Strict table grid", "Standard data fields"],
    image: "src/assets/images/korean cv teof.jpg" 
  },
  {
    id: "modern-blue",
    category: "Modern CV",
    title: "Modern Split-Layout",
    description: "Contemporary layout designed for quick recruiter scanning.",
    highlights: ["Sidebar header", "Readable typography", "Modern section dividers"],
    image: "src/assets/images/modern cv.webp" 
  },
];

export default function CVTemplates() {
  const navigate = useNavigate();
  const categories = useMemo(() => ["All", ...Array.from(new Set(templates.map((t) => t.category)))], []);
  const [activeCategory, setActiveCategory] = useState("All");
  const [query, setQuery] = useState("");

  const filteredTemplates = useMemo(() => {
    const q = query.trim().toLowerCase();
    return templates.filter((t) => {
      const matchesCategory = activeCategory === "All" ? true : t.category === activeCategory;
      const matchesQuery = !q ? true : `${t.title} ${t.description} ${t.highlights.join(" ")}`.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, query]);

  // 👉 THE CRITICAL ROUTING FUNCTION
  // It sends the user to /cv-builder and attaches the template ID to the URL!
  const onSelectTemplate = (template) => {
    navigate(`/cv-builder?category=${encodeURIComponent(template.category)}&template=${encodeURIComponent(template.id)}`);
  };

  return (
    <Box className="bg-mesh" sx={{ minHeight: "100vh", py: 10, bgcolor: "#F8FAFC" }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: "center", mb: 7 }}>
          <Typography variant="h3" fontWeight={900} sx={{ mb: 1, color: "#0F172A" }}>CV Templates</Typography>
          <Typography color="text.secondary" sx={{ fontSize: 18, maxWidth: 720, mx: "auto" }}>
            Pick a design first. Then fill your details to generate your CV in that style.
          </Typography>
        </Box>

        <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 2, mb: 4, alignItems: "center", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            {categories.map((c) => (
              <Button key={c} onClick={() => setActiveCategory(c)} variant={activeCategory === c ? "contained" : "outlined"} size="small" sx={{ borderRadius: "999px", textTransform: "none", fontWeight: 800 }}>
                {c}
              </Button>
            ))}
          </Box>
          <TextField size="small" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search templates..." sx={{ width: { xs: "100%", md: 320 }, bgcolor: "white", borderRadius: 1 }} />
        </Box>

        <Box sx={{ display: "grid", gap: 4, gridTemplateColumns: { xs: "1fr", md: "1fr 1fr", lg: "1fr 1fr 1fr" } }}>
          {filteredTemplates.map((template) => (
            <Paper key={template.id} elevation={0} sx={{ borderRadius: "20px", border: "1px solid #E5E7EB", backgroundColor: "white", overflow: "hidden", display: "flex", flexDirection: "column", transition: "transform 0.3s ease", '&:hover': { transform: "translateY(-4px)", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)" } }}>
              <Box sx={{ height: 320, width: "100%", overflow: "hidden", borderBottom: "1px solid #E5E7EB", bgcolor: "#F1F5F9" }}>
                <Box component="img" src={template.image} alt={template.title} sx={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
              </Box>
              <Box sx={{ p: 3, display: "flex", flexDirection: "column", flexGrow: 1 }}>
                <Typography variant="subtitle2" sx={{ color: "#2563EB", fontWeight: 800, textTransform: "uppercase", letterSpacing: 1, mb: 0.5 }}>{template.category}</Typography>
                <Typography variant="h6" fontWeight={900} sx={{ mb: 1, color: "#0F172A", lineHeight: 1.2 }}>{template.title}</Typography>
                <Typography color="text.secondary" variant="body2" sx={{ mb: 2, flexGrow: 1 }}>{template.description}</Typography>
                <Button variant="contained" onClick={() => onSelectTemplate(template)} endIcon={<ChevronRight size={16} />} fullWidth sx={{ borderRadius: "12px", textTransform: "none", fontWeight: 800, py: 1.2, boxShadow: 'none' }}>
                  Select Template
                </Button>
              </Box>
            </Paper>
          ))}
        </Box>
      </Container>
    </Box>
  );
}