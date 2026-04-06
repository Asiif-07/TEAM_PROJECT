import * as z from "zod";

const googleAuthSchema = z.object({
  credential: z.string().min(20, "Invalid Google credential"),
});

export default googleAuthSchema;
