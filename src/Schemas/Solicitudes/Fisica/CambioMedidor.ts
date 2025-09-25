import { z } from 'zod';

// Enum para tipo de identificación
export const TipoIdentificacionValues = [
  'Cedula Nacional',
  'Dimex',
  'Pasaporte',
] as const;
export type TipoIdentificacion = typeof TipoIdentificacionValues[number];

const IDENTITY_PATTERNS: Record<TipoIdentificacion, RegExp> = {
  'Cedula Nacional': /^\d{9}$/,
  'Dimex': /^\d{11,12}$/,
  'Pasaporte': /^[A-Za-z0-9]{6,9}$/,
} as const;

const IDENTITY_ERROR_MESSAGES: Record<TipoIdentificacion, string> = {
  'Cedula Nacional': 'La cédula debe tener exactamente 9 dígitos',
  'Dimex': 'El DIMEX debe tener 11 o 12 dígitos',
  'Pasaporte': 'El pasaporte debe tener 6-9 caracteres alfanuméricos',
} as const;

// Regex para validar el formato E.164
const E164_REGEX = /^\+?[1-9]\d{1,14}$/;

export const CambioMedidorSchema = z.object({
  Nombre: z.string()
    .min(1, 'El nombre es obligatorio')
    .refine(val => val.trim().length > 0, 'El nombre no puede estar vacío'),

  Apellido1: z.string()
    .min(1, 'El primer apellido es obligatorio')
    .refine(val => val.trim().length > 0, 'El primer apellido no puede estar vacío'),

  Apellido2: z.string().optional(),

  Tipo_Identificacion: z.enum(TipoIdentificacionValues, {
    errorMap: () => ({ message: 'Debe seleccionar un tipo de identificación válido' }),
  }),

  Identificacion: z.string()
    .min(1, 'El número de identificación es obligatorio'),

  Direccion_Exacta: z.string()
    .min(10, 'La dirección debe tener al menos 10 caracteres')
    .max(255, 'La dirección no puede tener más de 255 caracteres'),

  Numero_Telefono: z.string()
    .min(1, 'El número de teléfono es obligatorio')
    .regex(E164_REGEX, 'El número de teléfono debe estar en formato E.164 (ejemplo: +50688887777)'),

  Correo: z.string()
    .min(1, 'El correo electrónico es obligatorio')
    .max(100, 'El correo no puede tener más de 100 caracteres')
    .email('El correo electrónico no es válido'),

  Motivo_Solicitud: z.string()
    .min(10, 'El motivo debe tener al menos 10 caracteres')
    .max(500, 'El motivo no puede tener más de 500 caracteres'),

  Numero_Medidor_Anterior: z.coerce.number()
    .int('El número de medidor anterior debe ser un número entero')
    .positive('El número de medidor anterior debe ser positivo')
    .max(9999999, 'El número de medidor anterior no puede exceder 9,999,999'),
}).refine(
  (data) => {
    // Validación de identidad usando patrones
    const { Tipo_Identificacion, Identificacion } = data;
    const pattern = IDENTITY_PATTERNS[Tipo_Identificacion];
    return pattern ? pattern.test(Identificacion) : false;
  },
  {
    message: 'El número de identificación no es válido para el tipo seleccionado',
    path: ["Identificacion"],
  }
);

export type CambioMedidor = z.infer<typeof CambioMedidorSchema>;