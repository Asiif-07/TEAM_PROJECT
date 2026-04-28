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
    
    // 2. CHANGED TO STRING (to match the Postman test payload)
    // If your frontend actually sends an array, you can change this back to z.array(z.string()).optional()
    skills: z.string().optional(), 
    
    experience: z.string().optional(),
    title: z.string().optional(),
    tech: z.string().optional(),
    role: z.string().optional(),
    company: z.string().optional(),
    work: z.string().optional(),
    rawDescription: z.string().optional(),
    
    // 3. ADDED THE NEW FIELDS USED IN POSTMAN
    description: z.string().optional(),
    organization: z.string().optional(),
    position: z.string().optional(),
    awarder: z.string().optional(),
    publisher: z.string().optional()
  })
});