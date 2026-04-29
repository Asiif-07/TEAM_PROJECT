import { Router} from "express";
import { createBlog, deleteBlog, updateBlog } from "../controller/blog.controller.js";
import authMiddleWare from "../middleWare/authMiddleWare.js";
import validate from "../middleWare/validate.js";
import { createBlogSchema } from "../schemas/createBlog.schema.js";

const blogRoutes = Router()

blogRoutes.use(authMiddleWare);

blogRoutes.route("/").post(validate(createBlogSchema),createBlog);
blogRoutes.route("/:id").post(updateBlog).delete(deleteBlog)


export default blogRoutes;