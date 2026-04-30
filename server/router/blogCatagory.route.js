import { Router } from "express";
import authMiddleware from "../middleWare/authMiddleWare.js";
import validate from "../middleWare/validate.js";
import createBlogSchema from "../schemas/createBlogCatogory.schema.js";
import { createBlogCategory, getBlogCategorys, getSingleBlogCategory, updateBlogCategory } from "../controller/blogCatagory.controller.js";
import updateBlogCategorySchema from "../schemas/createBlogCatogory.schema.js";

export const catagoryRouter = Router();

catagoryRouter.use(authMiddleware);

catagoryRouter.route("/")
    .post(validate(createBlogSchema), createBlogCategory)
    .get(getBlogCategorys);
catagoryRouter.route("/:id")
    .put(validate(updateBlogCategorySchema),updateBlogCategory)
    .get(getSingleBlogCategory);
