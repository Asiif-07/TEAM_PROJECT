import * as z from "zod";

const changePasswordSchema = z.object({
    oldPassword : z.string().min(6, "Old password must be at least 6 characters long"),
    newPassword : z.string().min(6, "New password must be at least 6 characters long")
})

export default changePasswordSchema;