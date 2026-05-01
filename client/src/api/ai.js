import { apiRequest } from "./http";

export async function generateContent({ accessToken, refreshAccessToken, type, data }) {
    return apiRequest("/ai/ai-generate", {
        method: "POST",
        accessToken,
        refreshAccessToken,
        body: { type, data },
    });
}

export async function extractFromPdf({ accessToken, refreshAccessToken, file }) {
    const formData = new FormData();
    // Multer on the server expects the field name 'resume_file'
    formData.append("resume_file", file);

    return apiRequest("/ai/upload-and-extract", {
        method: "POST",
        accessToken,
        refreshAccessToken,
        body: formData,
        isMultipart: true
    });
}
