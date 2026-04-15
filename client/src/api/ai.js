import { apiRequest } from "./http";

export async function generateContent({ accessToken, refreshAccessToken, type, data }) {
    return apiRequest("/api/v1/ai/ai-generate", {
        method: "POST",
        accessToken,
        refreshAccessToken,
        body: { type, data },
    });
}
