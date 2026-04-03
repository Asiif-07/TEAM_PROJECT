import { Box, Button, Container, Paper, Typography, TextField } from "@mui/material";
import { CheckCircle2, ChevronRight } from "lucide-react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const templates = [
  {
    id: "classic-red",
    category: "Classic CV",
    title: "Classic (Red Accent)",
    description: "Clean and traditional structure with strong section headings.",
    highlights: ["Balanced spacing", "Section-first layout", "Professional red accent"],
  },
  {
    id: "modern-blue",
    category: "Modern CV",
    title: "Modern (Blue Gradient)",
    description: "Contemporary layout designed for quick recruiter scanning.",
    highlights: ["Gradient header", "Readable typography", "Modern section dividers"],
  },
  {
    id: "minimal-black",
    category: "Minimal CV",
    title: "Minimal (Black & White)",
    description: "Simple and high-contrast layout for maximum clarity.",
    highlights: ["No clutter", "Bold black headings", "Elegant minimal blocks"],
  },
  {
    id: "creative-purple",
    category: "Creative CV",
    title: "Creative (Purple Style)",
    description: "A more visual layout with decorative section styling.",
    highlights: ["Creative accents", "Distinct section rhythm", "Premium visual feel"],
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
      const matchesQuery = !q
        ? true
        : `${t.title} ${t.description} ${t.highlights.join(" ")}`.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, query]);

  const onSelectTemplate = (template) => {
    navigate(`/cv-builder?category=${encodeURIComponent(template.category)}&template=${encodeURIComponent(template.id)}`);
  };

  return (
    <Box className="bg-mesh" sx={{ minHeight: "100vh", py: 10 }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: "center", mb: 7 }}>
          <Typography variant="h3" fontWeight={900} sx={{ mb: 1 }}>
            CV Templates
          </Typography>
          <Typography color="text.secondary" sx={{ fontSize: 18, maxWidth: 720, mx: "auto" }}>
            Pick a design first. Then fill your details to generate your CV in that style.
          </Typography>
        </Box>

        <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 2, mb: 3, alignItems: "center", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            {categories.map((c) => (
              <Button
                key={c}
                onClick={() => setActiveCategory(c)}
                variant={activeCategory === c ? "contained" : "outlined"}
                size="small"
                sx={{ borderRadius: "999px", textTransform: "none", fontWeight: 800 }}
              >
                {c}
              </Button>
            ))}
          </Box>

          <TextField
            size="small"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search templates..."
            sx={{ width: { xs: "100%", md: 320 }, bgcolor: "white" }}
          />
        </Box>

        <Box sx={{ display: "grid", gap: 2.5, gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" } }}>
          {filteredTemplates.map((template) => {
            const thumbStyle =
              template.id === "classic-red"
                ? { background: "linear-gradient(135deg, #FEE2E2 0%, #FFFFFF 40%, #DCFCE7 100%)", border: "1px solid #FCA5A5" }
                : template.id === "modern-blue"
                  ? { background: "linear-gradient(135deg, #EFF6FF 0%, #FFFFFF 55%, #DBEAFE 100%)", border: "1px solid #93C5FD" }
                  : template.id === "minimal-black"
                    ? { background: "linear-gradient(135deg, #FFFFFF 0%, #F3F4F6 100%)", border: "1px solid #E5E7EB" }
                    : { background: "radial-gradient(circle at top left, #EEE5FF 0%, #FFFFFF 45%, #E0F2FE 100%)", border: "1px solid #C4B5FD" };

            return (
              <Paper
                key={template.id}
                elevation={0}
                sx={{
                  borderRadius: "20px",
                  border: "1px solid #E5E7EB",
                  backgroundColor: "rgba(255,255,255,0.82)",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Box sx={{ height: 110, px: 3, py: 2, ...thumbStyle }}>
                  <Typography sx={{ fontWeight: 900, fontSize: 16, color: "#0F172A" }}>{template.title}</Typography>
                  <Box sx={{ mt: 1.2, display: "flex", gap: 1 }}>
                    <Box sx={{ width: 46, height: 6, borderRadius: 999, bgcolor: "#2563EB" }} />
                    <Box sx={{ flex: 1, height: 6, borderRadius: 999, bgcolor: "rgba(37,99,235,0.15)" }} />
                  </Box>
                  <Box sx={{ mt: 1.2, display: "flex", flexDirection: "column", gap: 0.8 }}>
                    <Box sx={{ width: "90%", height: 5, borderRadius: 999, bgcolor: "rgba(0,0,0,0.12)" }} />
                    <Box sx={{ width: "76%", height: 5, borderRadius: 999, bgcolor: "rgba(0,0,0,0.10)" }} />
                    <Box sx={{ width: "66%", height: 5, borderRadius: 999, bgcolor: "rgba(0,0,0,0.09)" }} />
                  </Box>
                </Box>

                <Box sx={{ p: 3 }}>
                  <Typography variant="subtitle1" fontWeight={900} sx={{ mb: 0.8 }}>
                    {template.category}
                  </Typography>
                  <Typography color="text.secondary" sx={{ mb: 2 }}>
                    {template.description}
                  </Typography>

                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.9, mb: 2.5 }}>
                    {template.highlights.slice(0, 3).map((item) => (
                      <Box key={item} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <CheckCircle2 size={16} color="#2563EB" />
                        <Typography variant="body2" sx={{ color: "#334155", fontWeight: 600 }}>
                          {item}
                        </Typography>
                      </Box>
                    ))}
                  </Box>

                  <Button
                    variant="contained"
                    onClick={() => onSelectTemplate(template)}
                    endIcon={<ChevronRight size={16} />}
                    sx={{
                      borderRadius: "12px",
                      textTransform: "none",
                      fontWeight: 900,
                      py: 1.1,
                    }}
                  >
                    Select Template
                  </Button>
                </Box>
              </Paper>
            );
          })}
        </Box>

        {filteredTemplates.length === 0 && (
          <Typography sx={{ mt: 4, textAlign: "center", color: "#64748B", fontWeight: 700 }}>
            No templates found. Try another search.
          </Typography>
        )}
      </Container>
    </Box>
  );
}
