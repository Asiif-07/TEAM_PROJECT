import z from "zod";

export const aiGenSchema = z.object({
  type: z.enum(["summary", "project", "experience"]),
  data: z.object({
    name: z.string().optional(),
    skills: z.array(z.string()).optional(),
    experience: z.string().optional(),
    title: z.string().optional(),
    tech: z.string().optional(),
    role: z.string().optional(),
    company: z.string().optional(),
    work: z.string().optional()
  })
});