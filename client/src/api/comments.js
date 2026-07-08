import { apiRequest } from "./http";

export const getComments = (postId, options = {}) =>
    apiRequest(`/blog/${postId}/comments`, options);

export const addComment = (postId, content, parentCommentId = null, options = {}) =>
    apiRequest(`/blog/${postId}/comments`, {
        ...options,
        method: "POST",
        body: { content, parentCommentId },
    });

export const deleteComment = (postId, commentId, options = {}) =>
    apiRequest(`/blog/${postId}/comments/${commentId}`, { ...options, method: "DELETE" });
