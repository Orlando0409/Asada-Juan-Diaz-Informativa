import { z } from 'zod';

// Tipo para TipoIdentificacion - Debe coincidir con el backend
export const TipoIdentificacionValues = [
  'Cedula Nacional',
  'Dimex',
  'Pasaporte',
] as const;
export type TipoIdentificacion = typeof TipoIdentificacionValues[number];

// Validaciones adaptadas del backend DTO
export const AfiliacionSchema = z.object({
  // Validaciones de CreateSolicitudFisicaDto - COMUNES
  Tipo_Identificacion: z.enum(TipoIdentificacionValues, {
    errorMap: () => ({ message: 'El tipo de identificación debe ser uno de los siguientes: Cedula Nacional, Dimex, Pasaporte' }),
  }),

  Identificacion: z.string()
    .min(1, 'La identificación no puede estar vacía')
    .refine(val => val.trim().length > 0, 'La identificación no puede estar vacía')
    .transform(val => val.trim()),

  Nombre: z.string()
    .min(1, 'El nombre no puede estar vacío')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(49, 'El nombre no puede tener más de 50 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, { message: 'El nombre solo puede contener letras y espacios' })
    .refine(val => val.trim().length > 0, 'El nombre no puede estar vacío')
    .transform(val => val.trim()),

  Apellido1: z.string()
    .min(1, 'El primer apellido no puede estar vacío')
    .min(2, 'El primer apellido debe tener al menos 2 caracteres')
    .max(49, 'El primer apellido no puede tener más de 50 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, { message: 'El primer apellido solo puede contener letras y espacios' })
    .refine(val => val.trim().length > 0, 'El primer apellido no puede estar vacío')
    .transform(val => val.trim()),

  Apellido2: z.string()
    .max(49, 'El segundo apellido no puede tener más de 50 caracteres')
    .optional()
    .or(z.literal(''))
    .transform(val => val === '' ? undefined : val),

  Correo: z.string()
    .min(1, 'El correo no puede estar vacío')
    .max(99, 'El correo no puede tener más de 100 caracteres')
    .email('El correo electrónico debe tener un formato válido')
    .regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, { message: 'El formato del correo electrónico no es válido' })
    .transform(val => val.trim().toLowerCase()),

  Numero_Telefono: z.string()
    .min(1, 'El número de teléfono no puede estar vacío')
    .refine(val => val.trim().length > 0, 'El número de teléfono no puede estar vacío')
    .transform(val => val.trim()),

  // Validaciones específicas de CreateSolicitudAfiliacionFisicaDto
  Direccion_Exacta: z.string()
    .min(1, 'La dirección no puede estar vacía')
    .min(10, 'La dirección debe tener al menos 10 caracteres')
    .max(254, 'La dirección no puede tener más de 255 caracteres')
    .regex(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s.,#-]+$/, { message: 'La dirección solo puede contener letras, números, espacios y los caracteres .,-#' })
    .refine(val => val.trim().length > 0, 'La dirección no puede estar vacía')
    .transform(val => val.trim()),

  Edad: z.coerce.number({
    invalid_type_error: 'La edad debe ser un número entero',
  })
    .int('La edad debe ser un numero entero')
    .min(18, 'La edad mínima para realizar la solicitud es 18 años')
    .max(119, 'La edad máxima permitida es 120 años')
    .positive('La edad debe ser un número positivo'),

  // Validaciones de archivos (específicas del frontend)
  Planos_Terreno: z.instanceof(File, { message: "Debe subir el plano del terreno" })
    .refine(
      file => ['image/jpeg', 'image/jpg', 'image/png', 'image/heic', 'application/pdf'].includes(file.type),
      'El plano del terreno debe ser JPG, JPEG, PNG, HEIC o PDF'
    ),

  Escritura_Terreno: z.instanceof(File, { message: "Debe subir la escritura del terreno" })
    .refine(
      file => ['image/jpeg', 'image/jpg', 'image/png', 'image/heic', 'application/pdf'].includes(file.type),
      'La escritura del terreno debe ser JPG, JPEG, PNG, HEIC o PDF'
    ),
});

export type FormularioAfiliacionData = z.infer<typeof AfiliacionSchema>;
export type Afiliacion = z.infer<typeof AfiliacionSchema>;