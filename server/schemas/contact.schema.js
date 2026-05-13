import { z } from 'zod';

export const contactValidationSchema = z.object({
  fullName: z
    .string({ required_error: "Full Name is required" })
    .min(2, "Full Name must be at least 2 characters")
    .max(100, "Full Name cannot exceed 100 characters")
    .trim(),
  email: z
    .email("Please provide a valid email address")
    .trim()
    .toLowerCase(),
  company: z
    .string()
    .max(100, "Company name is too long")
    .trim()
    .optional(),
  phone: z
    .string()
    .max(20, "Phone number is too long")
    .trim()
    .optional(),
  message: z
    .string({ required_error: "Message is required" })
    .min(10, "Please provide more details (at least 10 characters)")
    .max(2000, "Message cannot exceed 2000 characters")
    .trim(),
});