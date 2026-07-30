import { z } from "zod";

export const createCategorySchema = z.object({
  name: z
    .string({ required_error: "El nombre es requerido" })
    .trim()
    .min(1, "El nombre no puede estar vacío")
    .max(100, "El nombre no puede tener más de 100 caracteres"),

  slug: z
    .string({ required_error: "El slug es requerido" })
    .trim()
    .min(1, "El slug no puede estar vacío")
    .max(100, "El slug no puede tener más de 100 caracteres")
    .regex(
      /^[a-z0-9-]+$/,
      "El slug solo puede contener letras minúsculas, números y guiones"
    ),
});

export const updateCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "El nombre no puede estar vacío")
    .max(100, "El nombre no puede tener más de 100 caracteres")
    .optional(),

  slug: z
    .string()
    .trim()
    .min(1, "El slug no puede estar vacío")
    .max(100, "El slug no puede tener más de 100 caracteres")
    .regex(
      /^[a-z0-9-]+$/,
      "El slug solo puede contener letras minúsculas, números y guiones"
    )
    .optional(),
});
