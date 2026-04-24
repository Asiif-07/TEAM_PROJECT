import * as z from "zod";

const CvSchema = z.object({
  // --- ORIGINAL ---
  name: z.string().min(1, "Name is required").max(100, "Name must be less than 100 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(1, "Phone is required").max(20, "Phone must be less than 20 characters"),
  github: z.string().max(100, "GitHub must be less than 100 characters").optional(),
  linkedin: z.string().max(100, "LinkedIn must be less than 100 characters").optional(),
  summary: z.string().min(1, "Summary is required").max(500, "Summary must be less than 500 characters"),
  
  // --- NEW BASIC FIELDS ---
  label: z.string().optional(),
  url: z.string().optional(),
  location: z.object({
    address: z.string().optional(),
    postalCode: z.string().optional(),
    city: z.string().optional(),
    countryCode: z.string().optional(),
    region: z.string().optional()
  }).optional(),

  // --- ORIGINAL ARRAYS ---
  education: z.array(z.object({
    degree: z.string().min(1, "Degree is required"),
    institute: z.string().min(1, "Institute is required"),
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().optional().nullable(),
    isCurrent: z.boolean().optional()
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
    startDate: z.string().min(1, "Start date is required"),
    endDate: z.string().optional().nullable(),
    isCurrent: z.boolean().optional(),
    description: z.string().min(1, "Description is required")
  })),
  
  // --- NEW ARRAYS ---
  volunteer: z.array(z.object({
    organization: z.string().optional(),
    position: z.string().optional(),
    url: z.string().optional(),
    startDate: z.string().optional().nullable(),
    endDate: z.string().optional().nullable(),
    summary: z.string().optional(),
    highlights: z.array(z.string()).optional()
  })).optional(),
  
  awards: z.array(z.object({
    title: z.string().optional(),
    date: z.string().optional().nullable(),
    awarder: z.string().optional(),
    summary: z.string().optional()
  })).optional(),

  certificates: z.array(z.object({
    name: z.string().optional(),
    date: z.string().optional().nullable(),
    issuer: z.string().optional(),
    url: z.string().optional()
  })).optional(),

  publications: z.array(z.object({
    name: z.string().optional(),
    publisher: z.string().optional(),
    releaseDate: z.string().optional().nullable(),
    url: z.string().optional(),
    summary: z.string().optional()
  })).optional(),

  languages: z.array(z.object({
    language: z.string().optional(),
    fluency: z.string().optional()
  })).optional(),

  interests: z.array(z.object({
    name: z.string().optional(),
    keywords: z.array(z.string()).optional()
  })).optional(),

  references: z.array(z.object({
    name: z.string().optional(),
    reference: z.string().optional()
  })).optional(),

  templateId: z.string().optional(),
});

const updateCvSchema = CvSchema.partial();

export { CvSchema, updateCvSchema };