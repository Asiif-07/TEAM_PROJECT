import { apiRequest } from "./http";

export const getNotifications = (options = {}) =>
    apiRequest("/notification", options);

export const markAsRead = (notificationId, options = {}) =>
    apiRequest(`/notification/${notificationId}/read`, { ...options, method: "PATCH" });

export const markAllAsRead = (options = {}) =>
    apiRequest("/notification/read-all", { ...options, method: "PATCH" });
