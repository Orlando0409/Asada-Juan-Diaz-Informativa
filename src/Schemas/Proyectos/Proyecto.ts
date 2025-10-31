import { z } from "zod";

// Esquema para creación de proyecto
export const ProyectoSchema = z.object({
  Titulo: z
    .string()
    .min(5, "El título debe tener al menos 5 caracteres.")
    .max(100, "El título no puede tener más de 100 caracteres.")
    .regex(
      /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s!?¿¡().,-]+$/,
      "El título contiene caracteres no permitidos."
    ),
  
  Descripcion: z
    .string()
    .min(10, "La descripción debe tener al menos 10 caracteres.")
    .max(1000, "La descripción no puede tener más de 1000 caracteres.")
    .regex(
      /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s!?¿¡().,:;-]+$/,
      "La descripción contiene caracteres no permitidos."
    ),
  
  Imagen_Url: z
    .instanceof(File)
    .optional()
    .refine((file) => {
      if (!file) return true; // Opcional para edición
      return ["image/jpeg", "image/png", "image/heic", "application/pdf"].includes(file.type);
    }, "Solo se permiten imágenes JPG, PNG, HEIC o archivos PDF"),
  
  Id_Usuario: z
    .number()
    .min(1, "El ID del usuario debe ser mayor a 0")
    .max(999999, "El ID del usuario no puede ser mayor a 999,999")
});

// Esquema para actualización (todos los campos opcionales excepto ID)
export const ProyectoUpdateSchema = z.object({
  Id_Proyecto: z.number(),

  Titulo: z
    .string()
    .min(5, "El título debe tener al menos 5 caracteres.")
    .max(100, "El título no puede tener más de 100 caracteres.")
    .regex(
      /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s!?¿¡().,-]+$/,
      "El título contiene caracteres no permitidos."
    )
    .optional(),

  Descripcion: z
    .string()
    .min(10, "La descripción debe tener al menos 10 caracteres.")
    .max(1000, "La descripción no puede tener más de 1000 caracteres.")
    .regex(
      /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s!?¿¡().,:;-]+$/,
      "La descripción contiene caracteres no permitidos."
    )
    .optional(),

  Imagen_Proyecto: z
    .instanceof(File)
    .optional()
    .refine((file) => {
      if (!file) return true;
      return ["image/jpeg", "image/png", "image/heic", "application/pdf"].includes(file.type);
    }, "Solo se permiten imágenes JPG, PNG, HEIC o archivos PDF")
});

// Tipos TypeScript inferidos de los esquemas
export type ProyectoFormType = z.infer<typeof ProyectoSchema>;
export type ProyectoUpdateType = z.infer<typeof ProyectoUpdateSchema>;