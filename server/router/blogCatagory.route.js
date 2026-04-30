import { Router } from "express";
import authMiddleware from "../middleWare/authMiddleWare.js";
import validate from "../middleWare/validate.js";
import createBlogSchema from "../schemas/createBlogCatogory.schema.js";
import { createBlogCategory } from "../controller/blogCatagory.controller.js";

export const catagoryRouter = Router();


catagoryRouter.route("/").post(authMiddleware,validate(createBlogSchema), createBlogCategory);
