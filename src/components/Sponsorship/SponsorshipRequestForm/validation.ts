import * as z from "zod";

export const formSchema = z.object({
  fullName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  phone: z.string().optional(),
  facebookUrl: z.string().url("URL Facebook invalide").optional().or(z.literal("")),
  motivation: z.string().min(50, "La motivation doit contenir au moins 50 caractères"),
  childId: z.string().uuid().optional(),
  termsAccepted: z.boolean().refine((val) => val === true, "Vous devez accepter les conditions"),
});

export type FormValues = z.infer<typeof formSchema>;