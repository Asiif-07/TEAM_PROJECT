import { apiRequest } from "./http";

export async function generateSummary({ accessToken, refreshAccessToken, title }) {
    return apiRequest("/api/v1/ai/generate-summary", {
        method: "POST",
        accessToken,
        refreshAccessToken,
        body: { title },
    });
}

export async function enhanceExperience({ accessToken, refreshAccessToken, role, company, description }) {
    return apiRequest("/api/v1/ai/enhance-experience", {
        method: "POST",
        accessToken,
        refreshAccessToken,
        body: { role, company, description },
    });
}
