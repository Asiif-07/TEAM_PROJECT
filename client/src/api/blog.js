import { apiRequest } from "./http.js";

export const getBlogs = async ({ accessToken, refreshAccessToken, query = "" }) => {
  return await apiRequest(`/blog${query ? `?${query}` : ""}`, {
    method: "GET",
    accessToken,
    refreshAccessToken,
  });
};

export const getSingleBlog = async ({ accessToken, refreshAccessToken, id }) => {
  return await apiRequest(`/blog/${id}`, {
    method: "GET",
    accessToken,
    refreshAccessToken,
  });
};

export const getCategories = async ({ accessToken, refreshAccessToken }) => {
  return await apiRequest(`/blogCategory`, {
    method: "GET",
    accessToken,
    refreshAccessToken,
  });
};

