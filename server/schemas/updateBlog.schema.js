import { z } from "zod";
import mongoose from "mongoose";

// Helper for MongoDB ObjectId validation
const objectIdValidation = z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
  message: "Invalid category ID format",
});

export const updateBlogSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, "Title must be at least 5 characters long")
    .optional(),

  description: z
    .string()
    .trim()
    .min(20, "Description must be at least 20 characters long")
    .optional(),

  category: objectIdValidation.optional(),

  tags: z
    .array(z.string().min(1, "Tag cannot be empty"))
    .nonempty("Tags array cannot be empty if provided")
    .optional(),

  status: z
    .enum(["draft", "published"], {
      invalid_type_error: "Status can only be 'draft' or 'published'",
    })
    .optional(),

}).strict("You can only update title, description, category, tags, or status. Unrecognized fields are not allowed.");