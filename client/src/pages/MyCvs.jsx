import { useEffect, useMemo, useState } from "react";
import { Box, Button, Container, Paper, TextField, Typography } from "@mui/material";
import { useAuth } from "../context/AuthContext";
import * as cvApi from "../api/cv";

const emptyCv = {
  name: "",
  email: "",
  phone: "",
  github: "",
  linkedin: "",
  summary: "",
  education: JSON.stringify([{ degree: "", institute: "", year: "" }], null, 2),
  skills: JSON.stringify([""], null, 2),
  projects: JSON.stringify([{ title: "", description: "", githubLink: "", liveLink: "" }], null, 2),
  experience: JSON.stringify([{ role: "", company: "", duration: "", description: "" }], null, 2),
};

function parseJsonField(label, value) {
  try {
    return { ok: true, data: JSON.parse(value) };
  } catch {
    return { ok: false, message: `${label} must be valid JSON` };
  }
}

export default function MyCvs() {
  const { accessToken, refreshAccessToken } = useAuth();
  const [cvs, setCvs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyCv);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const apiCtx = useMemo(
    () => ({ accessToken, refreshAccessToken }),
    [accessToken, refreshAccessToken]
  );

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await cvApi.getMyCvs(apiCtx);
      setCvs(data?.data || []);
    } catch (e) {
      setCvs([]);
      setError(e?.message || "Failed to load CVs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChange = (e) => {
    setNotice("");
    setError("");
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const onCreate = async () => {
    setError("");
    setNotice("");

    const edu = parseJsonField("Education", form.education);
    const skills = parseJsonField("Skills", form.skills);
    const projects = parseJsonField("Projects", form.projects);
    const experience = parseJsonField("Experience", form.experience);
    if (!edu.ok) return setError(edu.message);
    if (!skills.ok) return setError(skills.message);
    if (!projects.ok) return setError(projects.message);
    if (!experience.ok) return setError(experience.message);

    const cv = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      github: form.github || undefined,
      linkedin: form.linkedin || undefined,
      summary: form.summary,
      education: edu.data,
      skills: skills.data,
      projects: projects.data,
      experience: experience.data,
    };

    try {
      await cvApi.createCv({ ...apiCtx, cv });
      setNotice("CV created.");
      setForm(emptyCv);
      await load();
    } catch (e) {
      const serverErrors = e?.data?.errors;
      if (serverErrors && typeof serverErrors === "object") {
        setError(Object.values(serverErrors).join("\n"));
      } else {
        setError(e?.message || "Failed to create CV");
      }
    }
  };

  const onDelete = async (id) => {
    setError("");
    setNotice("");
    try {
      await cvApi.deleteCv({ ...apiCtx, id });
      setNotice("CV deleted.");
      await load();
    } catch (e) {
      setError(e?.message || "Failed to delete CV");
    }
  };

  return (
    <Box className="bg-mesh" sx={{ minHeight: "100vh", py: 8 }}>
      <Container maxWidth="md">
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight={900} sx={{ color: "#111827" }}>
            My CVs
          </Typography>
          <Typography sx={{ color: "#6B7280", fontWeight: 500 }}>
            Create and manage your CVs (stored in your backend).
          </Typography>
        </Box>

        {(error || notice) && (
          <Paper
            elevation={0}
            sx={{
              p: 2,
              mb: 3,
              borderRadius: 3,
              border: "1px solid rgba(0,0,0,0.08)",
              bgcolor: notice ? "rgba(16,185,129,0.08)" : "rgba(239,68,68,0.08)",
              whiteSpace: "pre-line",
            }}
          >
            <Typography fontWeight={700} color={notice ? "#065F46" : "#7F1D1D"}>
              {notice || error}
            </Typography>
          </Paper>
        )}

        <Paper elevation={0} className="glass" sx={{ p: { xs: 3, sm: 4 }, borderRadius: 6, mb: 4 }}>
          <Typography variant="h6" fontWeight={900} sx={{ mb: 2 }}>
            Create CV
          </Typography>

          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
            <TextField label="Name" name="name" value={form.name} onChange={onChange} />
            <TextField label="Email" name="email" value={form.email} onChange={onChange} />
            <TextField label="Phone" name="phone" value={form.phone} onChange={onChange} />
            <TextField label="GitHub (optional)" name="github" value={form.github} onChange={onChange} />
            <TextField label="LinkedIn (optional)" name="linkedin" value={form.linkedin} onChange={onChange} />
          </Box>

          <TextField
            sx={{ mt: 2 }}
            fullWidth
            multiline
            minRows={3}
            label="Summary"
            name="summary"
            value={form.summary}
            onChange={onChange}
          />

          <Box sx={{ mt: 2, display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
            <TextField
              fullWidth
              multiline
              minRows={7}
              label="Education (JSON array)"
              name="education"
              value={form.education}
              onChange={onChange}
            />
            <TextField
              fullWidth
              multiline
              minRows={7}
              label="Skills (JSON array)"
              name="skills"
              value={form.skills}
              onChange={onChange}
            />
          </Box>

          <Box sx={{ mt: 2, display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 2 }}>
            <TextField
              fullWidth
              multiline
              minRows={9}
              label="Projects (JSON array)"
              name="projects"
              value={form.projects}
              onChange={onChange}
            />
            <TextField
              fullWidth
              multiline
              minRows={9}
              label="Experience (JSON array)"
              name="experience"
              value={form.experience}
              onChange={onChange}
            />
          </Box>

          <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
            <Button variant="contained" onClick={onCreate} sx={{ textTransform: "none", fontWeight: 800 }}>
              Create
            </Button>
            <Button variant="outlined" onClick={load} sx={{ textTransform: "none", fontWeight: 800 }}>
              Refresh list
            </Button>
          </Box>
        </Paper>

        <Paper elevation={0} className="glass" sx={{ p: { xs: 3, sm: 4 }, borderRadius: 6 }}>
          <Typography variant="h6" fontWeight={900} sx={{ mb: 2 }}>
            Saved CVs
          </Typography>

          {loading ? (
            <Typography sx={{ color: "#6B7280" }}>Loading...</Typography>
          ) : cvs.length === 0 ? (
            <Typography sx={{ color: "#6B7280" }}>No CVs yet.</Typography>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {cvs.map((cv) => (
                <Paper
                  key={cv._id}
                  elevation={0}
                  sx={{ p: 2, borderRadius: 4, border: "1px solid rgba(0,0,0,0.08)", bgcolor: "rgba(255,255,255,0.6)" }}
                >
                  <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, alignItems: "flex-start" }}>
                    <Box>
                      <Typography fontWeight={900}>{cv.name}</Typography>
                      <Typography variant="body2" sx={{ color: "#6B7280" }}>
                        {cv.email} · {cv.phone}
                      </Typography>
                    </Box>
                    <Button
                      color="error"
                      variant="outlined"
                      onClick={() => onDelete(cv._id)}
                      sx={{ textTransform: "none", fontWeight: 800 }}
                    >
                      Delete
                    </Button>
                  </Box>
                </Paper>
              ))}
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
}

