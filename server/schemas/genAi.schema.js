import z from "zod";

export const aiGenSchema = z.object({
  // 1. ADDED THE NEW TYPES HERE
  type: z.enum([
    "summary", 
    "project", 
    "experience", 
    "skills",
    "label",
    "volunteer",
    "awards",
    "publications"
  ]),
  
  data: z.object({
    name: z.string().optional(),
    
    // Accept either a string or an array of strings (coerce array → comma-separated string)
    skills: z.preprocess(
      (val) => Array.isArray(val) ? val.join(", ") : val,
      z.string().optional()
    ),
    
    experience: z.string().optional(),
    title: z.string().optional(),
    tech: z.string().optional(),
    role: z.string().optional(),
    company: z.string().optional(),
    work: z.string().optional(),
    rawDescription: z.string().optional(),
    
    description: z.string().optional(),
    organization: z.string().optional(),
    position: z.string().optional(),
    awarder: z.string().optional(),
    publisher: z.string().optional()
  })
});