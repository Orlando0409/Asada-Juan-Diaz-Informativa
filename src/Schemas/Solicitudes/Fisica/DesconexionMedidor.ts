import { z } from 'zod';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

// Enum para tipo de identificación
export const TipoIdentificacionValues = [
  'Cedula Nacional',
  'Dimex',
  'Pasaporte',
] as const;
export type TipoIdentificacion = typeof TipoIdentificacionValues[number];

// Patrones y mensajes de error para identificación
const IDENTITY_PATTERNS: Record<TipoIdentificacion, RegExp> = {
  'Cedula Nacional': /^\d{9}$/,
  'Dimex': /^\d{11,12}$/,
  'Pasaporte': /^[A-Za-z0-9]{6,9}$/,
};

const IDENTITY_ERROR_MESSAGES: Record<TipoIdentificacion, string> = {
  'Cedula Nacional': 'La cédula debe tener exactamente 9 dígitos',
  'Dimex': 'El DIMEX debe tener 11 o 12 dígitos',
  'Pasaporte': 'El pasaporte debe tener 6-9 caracteres alfanuméricos',
};

export const DesconexionMedidorSchema = z.object({
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
    .max(50, 'La dirección no puede tener más de 50 caracteres'),

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
    .max(50, 'El correo no puede tener más de 50 caracteres')
    .email('El correo electrónico no es válido'),

  Planos_Terreno: z.instanceof(File, { message: "Debe subir el plano del terreno" })
    .refine(file => file.size <= 5 * 1024 * 1024, 'El plano del terreno no debe superar los 5MB')
    .refine(
      file => ['image/jpeg', 'image/jpg', 'image/png', 'image/heic', 'application/pdf'].includes(file.type),
      'El plano del terreno debe ser JPG, JPEG, PNG, HEIC o PDF'
    ),

  Escritura_Terreno: z.instanceof(File, { message: "Debe subir la escritura del terreno" })
    .refine(file => file.size <= 5 * 1024 * 1024, 'La escritura del terreno no debe superar los 5MB')
    .refine(
      file => ['image/jpeg', 'image/jpg', 'image/png', 'image/heic', 'application/pdf'].includes(file.type),
      'La escritura del terreno debe ser JPG, JPEG, PNG, HEIC o PDF'
    ),
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

export type DesconexionMedidor = z.infer<typeof DesconexionMedidorSchema>;