import z from "zod";

const createBlogSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters long")
    .max(20, "Name must be at most 20 characters long"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters long")
    .max(100, "Description must be at most 100 characters long"),
  slug: z
    .string()
    .min(3, "Slug must be at least 3 characters long")
    .max(20, "Slug must be at most 20 characters long")
    .optional(),
});

export default createBlogSchema;
