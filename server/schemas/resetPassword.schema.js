import * as z from "zod";

const resetPasswordSchema = z.object({
    password: z.string().min(6, "Password must be at least 6 characters").max(100, "Password must be less than 100 characters"),
    confirmPassword: z.string().min(6, "Confirm password must be at least 6 characters").max(100, "Confirm password must be less than 100 characters"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "password should be equal to confirm password",
    path: ["confirmPassword"],
});

export default resetPasswordSchema;
