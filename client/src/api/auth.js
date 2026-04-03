import { apiRequest } from "./http";

export function register({ name, email, password, gender }) {
  return apiRequest("/api/v1/auth/register", {
    method: "POST",
    body: { name, email, password, gender },
  });
}

export function login({ email, password }) {
  // Must include credentials so refreshToken cookie is stored by browser
  return apiRequest("/api/v1/auth/login", {
    method: "POST",
    body: { email, password },
    credentials: "include",
  });
}

export function refreshToken() {
  return apiRequest("/api/v1/auth/refresh-Token", {
    method: "POST",
    credentials: "include",
    retryOn401: false,
  });
}

export function logout() {
  return apiRequest("/api/v1/auth/logout", {
    method: "POST",
    credentials: "include",
    retryOn401: false,
  });
}

