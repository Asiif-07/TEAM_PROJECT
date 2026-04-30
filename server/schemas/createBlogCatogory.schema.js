import z from "zod";

const updateBlogCategorySchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters long")
    .max(20, "Name must be at most 20 characters long")
    .optional(),
    
  description: z
    .string()
    .min(10, "Description must be at least 10 characters long")
    .max(100, "Description must be at most 100 characters long")
    .optional(),
    
  slug: z
    .string()
    .min(3, "Slug must be at least 3 characters long")
    .max(20, "Slug must be at most 20 characters long")
    .optional(),
    
}).strict("You can only update name, description, or slug. Unrecognized fields are not allowed.");

export default updateBlogCategorySchema;