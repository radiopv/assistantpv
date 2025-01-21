import { z } from "zod";

// Child validation schema
export const childSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  gender: z.enum(["M", "F"]),
  birth_date: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Date de naissance invalide"
  }),
  city: z.string().min(2, "La ville doit contenir au moins 2 caractères"),
  needs: z.array(z.object({
    category: z.string(),
    description: z.string(),
    is_urgent: z.boolean().optional(),
  })).optional(),
});

// Sponsor validation schema
export const sponsorSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  phone: z.string().optional(),
  city: z.string().optional(),
  is_anonymous: z.boolean().optional(),
});

// Testimonial validation schema
export const testimonialSchema = z.object({
  content: z.string().min(10, "Le témoignage doit contenir au moins 10 caractères"),
  rating: z.number().min(1).max(5).optional(),
});

// Photo validation schema
export const photoSchema = z.object({
  url: z.string().url("URL invalide"),
  title: z.string().optional(),
  is_featured: z.boolean().optional(),
  type: z.enum(["image"]),
});