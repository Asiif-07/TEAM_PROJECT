import { apiRequest } from "./http";

export async function generateContent({ accessToken, refreshAccessToken, type, data }) {
    return apiRequest("/api/v1/ai/ai-generate", {
        method: "POST",
        accessToken,
        refreshAccessToken,
        body: { type, data },
    });
}

export async function extractFromPdf({ accessToken, refreshAccessToken, file }) {
    const formData = new FormData();
    formData.append("resumeFile", file);

    return apiRequest("/api/v1/ai/upload-and-extract", {
        method: "POST",
        accessToken,
        refreshAccessToken,
        body: formData,
        isMultipart: true
    });
}
