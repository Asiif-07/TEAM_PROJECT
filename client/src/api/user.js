import { apiRequest } from "./http";

export function forgetPassword({ email }) {
  return apiRequest("/api/v1/user/forget_password", {
    method: "POST",
    body: { email },
    credentials: "include",
    retryOn401: false,
  });
}

export function resetPassword({ token, password, confirmPassword }) {
  return apiRequest(`/api/v1/user/resetpassword/${token}`, {
    method: "POST",
    body: { password, confirmPassword },
    credentials: "include",
    retryOn401: false,
  });
}

