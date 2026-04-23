import { apiRequest } from "./http";

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result !== "string") {
        reject(new Error("Could not read file."));
        return;
      }
      const comma = result.indexOf(",");
      resolve(comma >= 0 ? result.slice(comma + 1) : result);
    };
    reader.onerror = () => reject(new Error("Could not read file."));
    reader.readAsDataURL(file);
  });
}

/**
 * Sends PDF/DOCX/TXT as JSON+base64 so the file always reaches the API (multipart often breaks behind Vite proxy).
 */
export async function parseCvUpload({ accessToken, refreshAccessToken, file }) {
  const fileBase64 = await fileToBase64(file);
  return apiRequest("/api/v1/cv/parse-upload-json", {
    method: "POST",
    body: {
      fileBase64,
      filename: file.name || "resume.pdf",
      mimeType: file.type || "application/octet-stream",
    },
    accessToken,
    refreshAccessToken,
  });
}

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

export function getCvById({ accessToken, refreshAccessToken, id }) {
  return apiRequest(`/api/v1/cv/${id}`, {
    method: "GET",
    accessToken,
    refreshAccessToken,
  });
}

export function updateCv({ accessToken, refreshAccessToken, id, cvData }) {
  return apiRequest(`/api/v1/cv/${id}`, {
    method: "PUT",
    body: cvData,
    accessToken,
    refreshAccessToken,
  });
}

async function withRetry(requestFn, retries = 2, delayMs = 900) {
  let lastErr;
  for (let i = 0; i <= retries; i += 1) {
    try {
      return await requestFn();
    } catch (err) {
      lastErr = err;
      if (i === retries) break;
      await new Promise((resolve) => setTimeout(resolve, delayMs * (i + 1)));
    }
  }
  throw lastErr;
}

// Draft API Functions
export function saveDraft({ accessToken, refreshAccessToken, cv }) {
  return withRetry(() =>
    apiRequest("/api/v1/cv/save-draft", {
      method: "POST",
      body: cv,
      accessToken,
      refreshAccessToken,
    })
  );
}

export function getMyDrafts({ accessToken, refreshAccessToken }) {
  return apiRequest("/api/v1/cv/my-drafts", {
    method: "GET",
    accessToken,
    refreshAccessToken,
  });
}

export function updateDraft({ accessToken, refreshAccessToken, id, cvData }) {
  return withRetry(() =>
    apiRequest(`/api/v1/cv/${id}`, {
      method: "PUT",
      body: cvData,
      accessToken,
      refreshAccessToken,
    })
  );
}

export function finalizeCV({ accessToken, refreshAccessToken, id }) {
  return apiRequest(`/api/v1/cv/finalize/${id}`, {
    method: "PUT",
    accessToken,
    refreshAccessToken,
  });
}
