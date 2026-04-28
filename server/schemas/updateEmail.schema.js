import * as z from "zod";

const updateEmailSchema = z.object({
    email: z.string().email("Please provide a valid email address")
});

export default updateEmailSchema;
