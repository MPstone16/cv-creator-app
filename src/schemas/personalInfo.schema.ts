import { z } from "zod";

export const personalInfoSchema = z.object({
  fullName: z.string().trim().min(1, "El nombre completo es obligatorio"),
  email: z
    .string()
    .trim()
    .min(1, "El correo electrónico es obligatorio")
    .email("Ingresa un correo electrónico válido"),
  phone: z.string().trim(),
  location: z.string().trim(),
  summary: z.string().trim(),
});

export type PersonalInfoFormValues = z.infer<typeof personalInfoSchema>;
