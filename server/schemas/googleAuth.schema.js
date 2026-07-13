import * as z from "zod";

const googleAuthSchema = z.object({
  credential: z.string().min(20).optional(),
  access_token: z.string().min(10).optional(),
}).refine(data => data.credential || data.access_token, {
  message: "Either credential or access_token is required",
});

export default googleAuthSchema;
