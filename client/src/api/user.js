import { apiRequest } from "./http";

export function forgetPassword({ email }) {
  return apiRequest("/api/v1/user/forget_password", {
    method: "POST",
    body: { email },
    credentials: "include",
    retryOn401: false,
  });
}

export function updateProfilePic({ accessToken, refreshAccessToken, file }) {
  const formData = new FormData();
  formData.append("profileImage", file);

  return apiRequest("/api/v1/user/update-profile-pic", {
    method: "POST",
    accessToken,
    refreshAccessToken,
    body: formData,
    credentials: "include",
    retryOn401: true,
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

