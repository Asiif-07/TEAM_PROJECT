import toast from "react-hot-toast";

async function readJsonSafe(res) {
  try {
    const text = await res.text();
    return text ? JSON.parse(text) : null;
  } catch {
    return null;
  }
}

export async function apiRequest(path, options = {}) {
  const {
    method = "GET",
    body,
    accessToken,
    headers = {},
    refreshAccessToken,
    showToast = true,
    retryOn401 = true
  } = options;

  const fetchHeaders = {
    ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    ...(!(body instanceof FormData) && body != null && { "Content-Type": "application/json" }),
    ...headers,
  };

  const url = `${import.meta.env.VITE_API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
  const res = await fetch(url, {
    method,
    headers: fetchHeaders,
    credentials: "include",
    body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
  });

  // Handle Token Refresh on 401
  if (res.status === 401 && retryOn401 && refreshAccessToken) {
    const refreshed = await refreshAccessToken();
    if (refreshed?.accessToken) {
      return apiRequest(path, { ...options, accessToken: refreshed.accessToken, retryOn401: false });
    }
  }

  const data = await readJsonSafe(res);

  if (!res.ok) {
    let message = data?.message || data?.error || `Error ${res.status}`;

    // Simple sanitization for a cleaner UI
    message = message.replace(/\[.*?\]/g, "").trim() || "Something went wrong. Please try again.";

    if (showToast) toast.error(message);
    const err = new Error(message);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}

