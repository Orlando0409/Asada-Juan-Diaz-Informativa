import { z } from 'zod';

// Tipo para TipoIdentificacion
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
  'Dimex': 'El Dimex debe tener 11 o 12 dígitos',
  'Pasaporte': 'El pasaporte debe tener 6-9 caracteres alfanuméricos',
} as const;

// Regex para validar el formato E.164
const E164_REGEX = /^\+?[1-9]\d{1,14}$/;

export const AfiliacionSchema = z.object({
  Nombre: z.string()
    .min(2, 'El nombre es obligatorio, debe tener al menos 2 caracteres')
    .refine(val => val.trim().length > 0, 'El nombre no puede estar vacío'),

  Apellido1: z.string()
    .min(2, 'El primer apellido es obligatorio debe tener al menos 2 caracteres')
    .refine(val => val.trim().length > 0, 'El primer apellido no puede estar vacío'),

  Apellido2: z.string().optional(),

  Tipo_Identificacion: z.enum(TipoIdentificacionValues, {
    errorMap: () => ({ message: 'Debe seleccionar un tipo de identificación válido' }),
  }),
Identificacion: z.string()
  .min(1, 'El número de identificación es obligatorio')
  .transform(val => val.trim()),
  Edad: z.coerce.number()
    .min(18, 'Solo se permite personas mayores de edad (mínimo 18 años)')
    .max(120, 'La edad no puede ser mayor a 120 años'),

  Direccion_Exacta: z.string()
    .min(10, 'La dirección debe tener al menos 10 caracteres')
    .max(50, 'La dirección no puede tener más de 50 caracteres'),


Numero_Telefono: z.string()
  .min(1, 'El número de teléfono es obligatorio')
  .regex(E164_REGEX, 'El número de teléfono debe estar en formato E.164 (ejemplo: +50688887777)'),
  
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

export type Afiliacion = z.infer<typeof AfiliacionSchema>;