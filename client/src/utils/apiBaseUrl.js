/**
 * Resolves the API base URL for dev and production.
 * Production should use /api/v1 so Vercel rewrites proxy to Render (same-origin, no CORS).
 */
export function getApiBaseUrl() {
  const fromEnv = import.meta.env.VITE_API_BASE_URL;

  if (fromEnv && fromEnv !== 'undefined') {
    return fromEnv.replace(/\/$/, '');
  }

  return '/api/v1';
}
