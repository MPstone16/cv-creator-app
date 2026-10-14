import { z } from "zod";

export const skillsSchema = z.object({
  skill: z.string().trim().min(1, "Escribe una habilidad"),
  category: z.enum(["soft", "hard"], {
    message: "Selecciona una categoría válida",
  }),
});

export type SkillsFormValues = z.infer<typeof skillsSchema>;
