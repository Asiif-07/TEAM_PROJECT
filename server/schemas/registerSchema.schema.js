import * as z from "zod";

const registerSchema = z.object({
    name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
    email: z.email(),
    password: z.string().min(6, "Password must be at least 6 characters").max(100, "Password must be less than 100 characters"),
    gender: z.enum(["male", "female", "other"], "gender must be either male or female or other"),
})

export default registerSchema;