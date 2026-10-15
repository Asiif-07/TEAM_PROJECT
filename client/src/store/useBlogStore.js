import { create } from 'zustand';
import * as blogApi from '../api/blog';

// Monotonic id so an older, slower response can never overwrite a newer one
let postsRequestId = 0;

const useBlogStore = create((set, get) => ({
    posts: [],
    postsQuery: null, // query string the current `posts` list was loaded with
    totalPages: 1,
    currentPage: 1,
    activePost: null,
    myPosts: [],
    categories: [],
    loading: false,
    error: null,
    draft: {
        title: "",
        content: "",
        category: "",
        images: [], // For uploading new images
        primaryImageIndex: 0,
        seoTitle: "",
        seoDescription: "",
        isPublic: true,
        lastSaved: null
    },
    authorProfile: null,

    updateDraft: (fields) => {
        set((state) => ({
            draft: { ...state.draft, ...fields }
        }));
    },

    resetDraft: () => {
        set({
            draft: {
                title: "",
                content: "",
                category: "",
                images: [],
                primaryImageIndex: 0,
                seoTitle: "",
                seoDescription: "",
                isPublic: true,
                lastSaved: null
            }
        });
    },

    fetchPosts: async (query = "") => {
        const { posts, postsQuery } = get();
        // Skip only when this exact query is already loaded. (A different query - e.g. switching
        // from a category back to "All", which has an empty query - must always refetch.)
        if (postsQuery === query && posts.length > 0) {
            postsRequestId++; // invalidate any in-flight request for a different query
            set({ loading: false });
            return;
        }

        const requestId = ++postsRequestId;
        set({ loading: true });
        try {
            const response = await blogApi.getPosts({ query });
            if (requestId !== postsRequestId) return; // a newer request superseded this one
            set({
                posts: response.posts || [],
                postsQuery: query,
                totalPages: response.totalPages || 1,
                currentPage: response.currentPage || 1,
                loading: false
            });
        } catch (err) {
            if (requestId !== postsRequestId) return;
            set({ error: err.message, loading: false });
        }
    },

    fetchPostBySlug: async (slug) => {
        set({ loading: true });
        try {
            const response = await blogApi.getPostBySlug({ slug });
            set({ activePost: response, loading: false });
        } catch (error) {
            set({ error: error.message, loading: false });
        }
    },

    likePost: async (postId, { accessToken, refreshAccessToken }) => {
        const { posts, activePost } = get();
        
        try {
            const response = await blogApi.likePost({ id: postId, accessToken, refreshAccessToken });
            const { likes, likeCount } = response;

            if (activePost && activePost._id === postId) {
                set({ 
                    activePost: { 
                        ...activePost, 
                        likes: likes,
                        likeCount: likeCount
                    } 
                });
            }

            set({
                posts: posts.map(p => p._id === postId 
                    ? { ...p, likes: likes, likeCount: likeCount } 
                    : p
                )
            });
        } catch (err) {
            console.error("Failed to like post:", err);
            set({ error: "Failed to update appreciation" });
        }
    },

    fetchMyPosts: async ({ accessToken, refreshAccessToken }) => {
        set({ loading: true });
        try {
            const response = await blogApi.getMyPosts({ accessToken, refreshAccessToken });
            set({ myPosts: Array.isArray(response) ? response : [], loading: false });
        } catch (err) {
            set({ error: err.message, loading: false });
        }
    },

    deletePost: async (postId, { accessToken, refreshAccessToken }) => {
        try {
            await blogApi.deletePost({ id: postId, accessToken, refreshAccessToken });
            set((state) => ({
                posts: state.posts.filter(p => p._id !== postId),
                myPosts: state.myPosts.filter(p => p._id !== postId)
            }));
            return true;
        } catch (err) {
            console.error(err);
            set({ error: "Failed to delete post" });
            return false;
        }
    },

    updatePost: async (postId, formData, { accessToken, refreshAccessToken }) => {
        set({ loading: true });
        try {
            const response = await blogApi.updatePost({ id: postId, formData, accessToken, refreshAccessToken });
            set((state) => ({
                posts: state.posts.map(p => p._id === postId ? response : p),
                myPosts: state.myPosts.map(p => p._id === postId ? response : p),
                loading: false
            }));
            return response;
        } catch (err) {
            set({ error: err.message, loading: false });
            throw err;
        }
    },

    createPost: async (formData, { accessToken, refreshAccessToken }) => {
        set({ loading: true });
        try {
            const response = await blogApi.createPost({ formData, accessToken, refreshAccessToken });
            set((state) => ({
                posts: [response, ...state.posts],
                myPosts: [response, ...state.myPosts],
                loading: false
            }));
            return response;
        } catch (err) {
            set({ error: err.message, loading: false });
            throw err;
        }
    },

    addComment: async (postId, commentData, { accessToken, refreshAccessToken }) => {
        try {
            const response = await blogApi.addComment({ postId, data: commentData, accessToken, refreshAccessToken });
            return response;
        } catch (err) {
            set({ error: "Failed to add comment" });
            throw err;
        }
    },

    fetchCategories: async () => {
        if (get().categories.length > 0) return;
        try {
            const response = await blogApi.getCategories();
            set({ categories: response || [] });
        } catch (err) {
            console.error("Failed to fetch categories:", err);
        }
    },

    fetchAuthorProfile: async (userId) => {
        set({ loading: true });
        try {
            const response = await blogApi.getAuthorProfile({ userId });
            set({ authorProfile: response.data, loading: false });
        } catch (error) {
            set({ error: error.message, loading: false });
        }
    }
}));

export default useBlogStore;
