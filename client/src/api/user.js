import { apiRequest } from "./http";

export function forgetPassword({ email }) {
  return apiRequest("/user/forget_password", {
    method: "POST",
    body: { email },
    credentials: "include",
    retryOn401: false,
  });
}

export function updateProfilePic({ accessToken, refreshAccessToken, file }) {
  const formData = new FormData();
  formData.append("profileImage", file);

  return apiRequest("/user/update-profile-pic", {
    method: "POST",
    accessToken,
    refreshAccessToken,
    body: formData,
    credentials: "include",
    retryOn401: true,
  });
}

export function resetPassword({ token, password, confirmPassword }) {
  return apiRequest(`/user/resetpassword/${token}`, {
    method: "POST",
    body: { password, confirmPassword },
    credentials: "include",
    retryOn401: false,
  });
}

export function updateEmail({ accessToken, refreshAccessToken, email }) {
  return apiRequest("/user/update-email", {
    method: "PUT",
    accessToken,
    refreshAccessToken,
    body: { email },
    credentials: "include",
    retryOn401: true,
  });
}

export function changePassword({ accessToken, refreshAccessToken, oldPassword, newPassword }) {
  return apiRequest("/user/change-password", {
    method: "POST",
    accessToken,
    refreshAccessToken,
    body: { oldPassword, newPassword },
    credentials: "include",
    retryOn401: true,
  });
}
