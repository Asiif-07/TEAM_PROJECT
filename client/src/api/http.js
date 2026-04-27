import toast from "react-hot-toast";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function buildUrl(path) {
  if (!path.startsWith("/")) return `${API_BASE_URL}/${path}`;
  return `${API_BASE_URL}${path}`;
}

async function readJsonSafe(res) {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
}

export async function apiRequest(path, options = {}) {
  const {
    method = "GET",
    body,
    /** Use for file uploads: multipart body is often consumed on the first fetch; rebuild on 401 retry. */
    rebuildBody,
    accessToken,
    headers,
    credentials = "include",
    retryOn401 = true,
    refreshAccessToken,
    showToast = true,
  } = options;

  const resolveBody = () => {
    if (typeof rebuildBody === "function") return rebuildBody();
    return body;
  };

  const payload = resolveBody();

  const fetchHeaders = {
    ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : null),
    ...(headers || {}),
  };

  if (!(payload instanceof FormData) && payload != null) {
    fetchHeaders["Content-Type"] = "application/json";
  }

  const res = await fetch(buildUrl(path), {
    method,
    credentials,
    headers: fetchHeaders,
    body:
      payload == null
        ? undefined
        : payload instanceof FormData
          ? payload
          : JSON.stringify(payload),
  });

  if (res.status === 401 && retryOn401 && typeof refreshAccessToken === "function") {
    const refreshed = await refreshAccessToken();
    if (refreshed?.accessToken) {
      return apiRequest(path, {
        ...options,
        accessToken: refreshed.accessToken,
        retryOn401: false,
      });
    }
  }

  const data = await readJsonSafe(res);
  if (!res.ok) {
    const validationMessage =
      data &&
        data.errors &&
        typeof data.errors === "object" &&
        Object.values(data.errors).length > 0
        ? String(Object.values(data.errors)[0])
        : "";

    let message =
      validationMessage ||
      (data && (data.message || data.error)) ||
      `Request failed (${res.status})`;

    // Sanitize technical jargon for a premium "human" experience
    message = message
      .replace(/\[?GoogleGenerativeAI Error\]?:?/gi, "")
      .replace(/Error fetching from https:\/\/\S+/gi, "")
      .replace(/\[\d{3} [^\]]+\]/gi, "")
      .replace(/\s+/g, " ")
      .trim();

    if (!message || message.length < 5) {
      message = "AI service is momentarily unavailable. Retrying...";
    }

    // Global Toasting: Make errors "pop" as requested by user
    if (showToast) {
      toast.error(message);
    }

    const err = new Error(message);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}

