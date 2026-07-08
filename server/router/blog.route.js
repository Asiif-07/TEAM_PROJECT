import express from "express";
import { 
    getPosts, 
    getPostBySlug, 
    createPost, 
    likePost, 
    addComment, 
    deleteComment,
    getComments,
    updatePost,
    deletePost,
    getMyPosts,
    getCategories
} from "../controller/blog.controller.js";
import authMiddleWare from "../middleWare/authMiddleWare.js";
import { imageMulter } from "../middleWare/imageMulter.middleWare.js";

const router = express.Router();
const upload = imageMulter(5, ["image/jpeg", "image/png", "image/webp"]);

const multiUpload = upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "bodyImages", maxCount: 10 }
]);

router.get("/categories", getCategories);
router.get("/", getPosts);
router.get("/mine", authMiddleWare, getMyPosts);
router.get("/:slug", getPostBySlug);
router.post("/", authMiddleWare, multiUpload, createPost);
router.put("/:id", authMiddleWare, multiUpload, updatePost);
router.delete("/:id", authMiddleWare, deletePost);
router.post("/:id/like", authMiddleWare, likePost);
router.get("/:postId/comments", getComments);
router.post("/:postId/comments", authMiddleWare, addComment);
router.delete("/:postId/comments/:commentId", authMiddleWare, deleteComment);

export default router;
