import * as z from "zod";

const CvSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  
  email: z.string().email("Invalid email address"),
  
  phone: z.string().min(1, "Phone is required").max(20, "Phone must be less than 20 characters"),
  
  github: z.string().max(100, "GitHub must be less than 100 characters").optional(),
  
  linkedin: z.string().max(100, "LinkedIn must be less than 100 characters").optional(),
  
  summary: z.string().min(1, "Summary is required").max(500, "Summary must be less than 500 characters"),
  
  education: z.array(z.object({
    degree: z.string().min(1, "Degree is required"),
    institute: z.string().min(1, "Institute is required"),
    year: z.string().min(1, "Year is required")
  })),
  
  skills: z.array(z.string().min(1, "Skill is required")),
  
  projects: z.array(z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    githubLink: z.string().optional(),
    liveLink: z.string().optional()
  })),
  
  experience: z.array(z.object({
    role: z.string().min(1, "Role is required"),
    company: z.string().min(1, "Company is required"),
    duration: z.string().min(1, "Duration is required"),
    description: z.string().min(1, "Description is required")
  })),
});

const updateCvSchema = CvSchema.partial();


export { CvSchema, updateCvSchema };
