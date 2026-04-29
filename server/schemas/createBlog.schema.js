import z from "zod"

export const createBlogSchema = z.object({

    title: z.string().min(5, "Title is required").max(200, "Title is too long"),

    description: z.string().min(50, "Description is required").max(2000, "Description is too long"),

    coverImage: z.url("Invalid URL").optional(),

    image: z.array(z.string().url("Invalid URL")).optional(),

    category: z.string().min(1, "Category is required").max(40, "Category is too long"),

    tags: z.array(z.string()).min(1, "At least one tag is required").max(10, "Too many tags").optional(),

    status: z.enum(["draft", "published"]).default("draft").optional(),

})
