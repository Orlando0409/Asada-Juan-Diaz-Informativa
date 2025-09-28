import { z } from 'zod';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

// Tipo para TipoIdentificacion
export const TipoIdentificacionValues = [
  'Cedula Nacional',
  'DIMEX',
  'Pasaporte',
] as const;
export type TipoIdentificacion = typeof TipoIdentificacionValues[number];

// Patrones de validación para tipos de identificación
const IDENTITY_PATTERNS: Record<TipoIdentificacion, RegExp> = {
  'Cedula Nacional': /^\d{9}$/,
  'DIMEX': /^\d{11,12}$/,
  'Pasaporte': /^[A-Za-z0-9]{6,9}$/,
} as const;

// Mensajes de error específicos por tipo de identificación
const IDENTITY_ERROR_MESSAGES: Record<TipoIdentificacion, string> = {
  'Cedula Nacional': 'La cédula debe tener exactamente 9 dígitos',
  'DIMEX': 'El DIMEX debe tener 11 o 12 dígitos',
  'Pasaporte': 'El pasaporte debe tener 6-9 caracteres alfanuméricos',
} as const;

export const AsociadoSchema = z.object({
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

  Numero_Telefono: z.string()
    .min(1, 'El número de teléfono es obligatorio')
    .refine((phone) => {
      const phoneNumber = parsePhoneNumberFromString(phone || "");
      return !!phoneNumber && phoneNumber.isValid();
    }, {
      message: 'Debe ingresar un número de teléfono válido con código de país, ej. +50688887777'
    }),

  Motivo_Solicitud: z.string()
    .min(10, 'El motivo debe de tener al menos 10 caracteres'),

  Correo: z.string()
    .min(1, 'El correo electrónico es obligatorio')
    .email('El correo electrónico no es válido'),
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

export type Asociado = z.infer<typeof AsociadoSchema>;