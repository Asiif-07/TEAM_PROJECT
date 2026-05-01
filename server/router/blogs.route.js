import { Router } from "express";
import {
  createBlog,
  deleteBlog,
  getAllBlogs,
  getSingleBlog,
  updateBlog,
} from "../controller/blog.controller.js";
import authMiddleWare from "../middleWare/authMiddleWare.js";
import validate from "../middleWare/validate.js";
import { createBlogSchema } from "../schemas/createBlog.schema.js";
import { imageMulter } from "../middleWare/imageMulter.middleWare.js"; // ✅ FIX: multer import

// ✅ Multer config: coverImage = 1 file, image = max 5 files, max 5MB each
const uploadBlogImages = imageMulter(5, ["image/jpeg", "image/png", "image/webp"]).fields([
  { name: "coverImage", maxCount: 1 },
  { name: "image", maxCount: 5 },
]);

const blogRoutes = Router();

blogRoutes
  .route("/")
  .post(authMiddleWare, uploadBlogImages, validate(createBlogSchema), createBlog)
  .get(getAllBlogs);

blogRoutes
  .route("/:id")
  .put(authMiddleWare, uploadBlogImages, updateBlog)
  .delete(authMiddleWare, deleteBlog)
  .get(getSingleBlog);

export default blogRoutes;
