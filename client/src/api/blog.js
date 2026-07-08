import { apiRequest } from "./http.js";

export const getPosts = async ({ query = "", accessToken, refreshAccessToken }) => {
  return await apiRequest(`/blog${query ? `?${query}` : ""}`, {
    method: "GET",
    accessToken,
    refreshAccessToken,
  });
};

export const getPostBySlug = async ({ slug, accessToken, refreshAccessToken }) => {
  return await apiRequest(`/blog/${slug}`, {
    method: "GET",
    accessToken,
    refreshAccessToken,
  });
};

export const createPost = async ({ formData, accessToken, refreshAccessToken }) => {
  return await apiRequest(`/blog`, {
    method: "POST",
    body: formData,
    accessToken,
    refreshAccessToken,
    // Note: multi-part form data is handled by fetch/axios automatically if body is FormData
  });
};

export const likePost = async ({ id, accessToken, refreshAccessToken }) => {
  return await apiRequest(`/blog/${id}/like`, {
    method: "POST",
    accessToken,
    refreshAccessToken,
  });
};

export const getComments = async ({ postId, accessToken, refreshAccessToken }) => {
  return await apiRequest(`/blog/${postId}/comments`, {
    method: "GET",
    accessToken,
    refreshAccessToken,
  });
};

export const updatePost = async ({ id, formData, accessToken, refreshAccessToken }) => {
  return await apiRequest(`/blog/${id}`, {
    method: "PUT",
    body: formData,
    accessToken,
    refreshAccessToken,
  });
};

export const deletePost = async ({ id, accessToken, refreshAccessToken }) => {
  return await apiRequest(`/blog/${id}`, {
    method: "DELETE",
    accessToken,
    refreshAccessToken,
  });
};

export const getMyPosts = async ({ accessToken, refreshAccessToken }) => {
  return await apiRequest(`/blog/mine`, {
    method: "GET",
    accessToken,
    refreshAccessToken,
  });
};

export const addComment = async ({ postId, data, accessToken, refreshAccessToken }) => {
  return await apiRequest(`/blog/${postId}/comments`, {
    method: "POST",
    body: JSON.stringify(data),
    accessToken,
    refreshAccessToken,
  });
};
export const getAuthorProfile = async ({ userId }) => {
  return await apiRequest(`/user/blog-profile/${userId}`, {
    method: "GET"
  });
};

export const getCategories = async () => {
  return await apiRequest(`/blog/categories`, {
    method: "GET"
  });
};
