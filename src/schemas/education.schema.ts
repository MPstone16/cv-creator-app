import { z } from "zod";

export const educationSchema = z.object({
  institution: z.string().trim().min(1, "La institución es obligatoria"),
  degree: z.string().trim().min(1, "El título o grado es obligatorio"),
  field: z.string().trim(),
  graduationYear: z
    .string()
    .trim()
    .refine(
      (value) => value === "" || /^\d{4}$/.test(value),
      "Selecciona un año de graduación válido"
    ),
});

export type EducationFormValues = z.infer<typeof educationSchema>;
