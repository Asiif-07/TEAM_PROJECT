import { apiRequest } from "./http";

export function createCheckoutSession({ planTitle, accessToken, refreshAccessToken }) {
    return apiRequest("/api/v1/stripe/create-checkout-session", {
        method: "POST",
        accessToken,
        refreshAccessToken,
        body: { planTitle },
    });
}

export function verifySession({ sessionId, accessToken, refreshAccessToken }) {
    return apiRequest("/api/v1/stripe/verify-session", {
        method: "POST",
        accessToken,
        refreshAccessToken,
        body: { sessionId },
    });
}

export function cancelSubscription({ accessToken, refreshAccessToken }) {
    return apiRequest("/api/v1/stripe/cancel-subscription", {
        method: "POST",
        accessToken,
        refreshAccessToken,
    });
}
