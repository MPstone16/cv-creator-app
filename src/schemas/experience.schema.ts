import { z } from "zod";
import { isCalendarDateString } from "../utils/date";

export const experienceSchema = z
  .object({
    company: z.string().trim().min(1, "La empresa es obligatoria"),
    position: z.string().trim().min(1, "El cargo es obligatorio"),
    startDate: z
      .string()
      .trim()
      .min(1, "La fecha de inicio es obligatoria")
      .refine(isCalendarDateString, "Selecciona una fecha válida"),
    endDate: z
      .string()
      .trim()
      .refine(
        (value) => value === "" || isCalendarDateString(value),
        "Selecciona una fecha válida"
      ),
    description: z.string().trim(),
  })
  .superRefine(({ startDate, endDate }, context) => {
    if (
      endDate &&
      isCalendarDateString(startDate) &&
      isCalendarDateString(endDate) &&
      endDate < startDate
    ) {
      context.addIssue({
        code: "custom",
        message: "La fecha de fin no puede ser anterior a la de inicio",
        path: ["endDate"],
      });
    }
  });

export type ExperienceFormValues = z.infer<typeof experienceSchema>;
