import toast from 'react-hot-toast';
import { getApiBaseUrl } from '../utils/apiBaseUrl';

const RETRY_DELAY_MS = 3000;
const DEFAULT_MAX_RETRIES = 2;
const REQUEST_TIMEOUT_MS = 15000;

async function readJsonSafe(res) {
  try {
    const text = await res.text();
    return text ? JSON.parse(text) : null;
  } catch {
    return null;
  }
}

function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function isRetryableError(error, status) {
  if (status === 400 || status === 401) return false;
  if (status >= 500) return true;

  const message = (error?.message || '').toLowerCase();
  return (
    error?.name === 'AbortError'
    || message.includes('failed to fetch')
    || message.includes('network')
    || message.includes('timeout')
  );
}

function toUserMessage(error, status) {
  if (status === 400 || status === 401) {
    return error?.message || 'Invalid email or password.';
  }

  if (error?.name === 'AbortError') {
    return 'The server took too long to respond. The backend may be waking up — please try again.';
  }

  const message = (error?.message || '').toLowerCase();
  if (message.includes('failed to fetch') || error?.name === 'TypeError') {
    if (typeof navigator !== 'undefined' && navigator.onLine === false) {
      return 'You appear to be offline. Check your internet connection.';
    }
    return 'Unable to reach the server. If this persists, ask your admin to verify the deployment API URL.';
  }

  return error?.message || 'Something went wrong. Please try again.';
}

async function fetchWithTimeout(url, options, timeoutMs = REQUEST_TIMEOUT_MS) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function apiRequest(path, options = {}) {
  const {
    method = 'GET',
    body,
    accessToken,
    headers = {},
    refreshAccessToken,
    showToast = true,
    retryOn401 = true,
    maxRetries = DEFAULT_MAX_RETRIES,
  } = options;

  const fetchHeaders = {
    ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    ...(!(body instanceof FormData) && body != null && { 'Content-Type': 'application/json' }),
    ...headers,
  };

  const url = `${getApiBaseUrl()}${path.startsWith('/') ? path : `/${path}`}`;
  const fetchOptions = {
    method,
    headers: fetchHeaders,
    credentials: 'include',
    body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
  };

  let lastError = null;
  let lastStatus;

  for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
    try {
      const res = await fetchWithTimeout(url, fetchOptions);

      if (res.status === 401 && retryOn401 && refreshAccessToken) {
        const refreshed = await refreshAccessToken();
        if (refreshed?.accessToken) {
          return apiRequest(path, { ...options, accessToken: refreshed.accessToken, retryOn401: false });
        }
      }

      const data = await readJsonSafe(res);
      lastStatus = res.status;

      if (!res.ok) {
        let message = data?.message || data?.error;

        if (!message && data?.errors && typeof data.errors === 'object') {
          message = Object.values(data.errors).join(', ');
        }

        message = (message || `Error ${res.status}`).replace(/\[.*?\]/g, '').trim()
          || 'Something went wrong. Please try again.';

        const err = new Error(message);
        err.status = res.status;
        err.data = data;

        if (!isRetryableError(err, res.status) || attempt >= maxRetries) {
          if (showToast) toast.error(toUserMessage(err, res.status));
          throw err;
        }

        lastError = err;
        await delay(RETRY_DELAY_MS);
        continue;
      }

      return data;
    } catch (error) {
      lastError = error;
      lastStatus = error?.status ?? lastStatus;

      if (!isRetryableError(error, lastStatus) || attempt >= maxRetries) {
        const message = toUserMessage(error, lastStatus);
        if (showToast) toast.error(message);
        const err = new Error(message);
        err.status = lastStatus;
        err.cause = error;
        throw err;
      }

      await delay(RETRY_DELAY_MS);
    }
  }

  throw lastError;
}
