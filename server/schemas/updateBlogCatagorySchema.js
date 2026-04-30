import { z } from "zod";

export const updateBlogCategorySchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(3, "Category name must be at least 3 characters long")
      .optional(), 

    description: z
      .string()
      .trim()
      .max(500, "Description bohat lambi hai, max 500 characters allow hain")
      .optional(),


  }).strict("Aap sirf name aur description update kar sakte hain"), 
});