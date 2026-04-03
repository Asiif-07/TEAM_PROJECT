import { apiRequest } from "./http";

export function getMyCvs({ accessToken, refreshAccessToken }) {
  return apiRequest("/api/v1/cv/cv", {
    method: "GET",
    accessToken,
    refreshAccessToken,
  });
}

export function createCv({ accessToken, refreshAccessToken, cv }) {
  return apiRequest("/api/v1/cv/cv", {
    method: "POST",
    body: cv,
    accessToken,
    refreshAccessToken,
  });
}

export function deleteCv({ accessToken, refreshAccessToken, id }) {
  return apiRequest(`/api/v1/cv/cv/${id}`, {
    method: "DELETE",
    accessToken,
    refreshAccessToken,
  });
}
