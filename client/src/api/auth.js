import { apiRequest } from "./http";

export function register({ name, email, password, gender }) {
  return apiRequest("/auth/register", {
    method: "POST",
    body: { name, email, password, gender },
  });
}

export function login({ email, password }) {
  // Must include credentials so refreshToken cookie is stored by browser
  return apiRequest("/auth/login", {
    method: "POST",
    body: { email, password },
    credentials: "include",
  });
}

export function googleLogin({ credential }) {
  return apiRequest("/auth/google", {
    method: "POST",
    body: { credential },
    credentials: "include",
  });
}

export function refreshToken() {
  return apiRequest("/auth/refresh-Token", {
    method: "POST",
    credentials: "include",
    retryOn401: false,
    showToast: false,
  });
}

export function logout() {
  return apiRequest("/auth/logout", {
    method: "POST",
    credentials: "include",
    retryOn401: false,
  });
}

