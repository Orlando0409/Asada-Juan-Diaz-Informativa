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
  // Campos comunes de CreateSolicitudFisicaDto
  Tipo_Identificacion: z.enum(TipoIdentificacionValues, {
    errorMap: () => ({ message: 'El tipo de identificación debe ser uno de los siguientes: Cedula Nacional, Dimex, Pasaporte' }),
  }),

  Identificacion: z.string()
    .min(1, 'La identificación no puede estar vacía')
    .refine(val => val.trim().length > 0, 'La identificación no puede estar vacía'),

  Nombre: z.string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(50, 'El nombre no puede tener más de 50 caracteres')
    .refine(val => val.trim().length > 0, 'El nombre no puede estar vacío')
    .refine(val => /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(val), 'El nombre solo puede contener letras y espacios'),

  Apellido1: z.string()
    .min(2, 'El primer apellido debe tener al menos 2 caracteres')
    .max(50, 'El primer apellido no puede tener más de 50 caracteres')
    .refine(val => val.trim().length > 0, 'El primer apellido no puede estar vacío')
    .refine(val => /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(val), 'El primer apellido solo puede contener letras y espacios'),

  Apellido2: z.string()
    .max(50, 'El segundo apellido no puede tener más de 50 caracteres')
    .optional(),

  Correo: z.string()
    .min(1, 'El correo no puede estar vacío')
    .max(100, 'El correo no puede tener más de 100 caracteres')
    .email('El correo electrónico debe tener un formato válido')
    .refine(val => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(val), 'El formato del correo electrónico no es válido'),

  Numero_Telefono: z.string()
    .min(1, 'El número de teléfono no puede estar vacío')
    .refine((phone) => {
      const phoneNumber = parsePhoneNumberFromString(phone || "");
      return !!phoneNumber && phoneNumber.isValid();
    }, {
      message: 'Número de teléfono inválido'
    }),

  // Campos específicos de CreateSolicitudDesconexionFisicaDto
  Direccion_Exacta: z.string()
    .min(10, 'La dirección debe tener al menos 10 caracteres')
    .max(255, 'La dirección no puede tener más de 255 caracteres')
    .refine(val => val.trim().length > 0, 'La dirección no puede estar vacía')
    .refine(val => /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s.,#-]+$/.test(val), 'La dirección solo puede contener letras, números, espacios y los caracteres .,-#'),

  Motivo_Solicitud: z.string()
    .min(10, 'El motivo de la solicitud debe tener al menos 10 caracteres')
    .max(500, 'El motivo de la solicitud no puede tener más de 500 caracteres')
    .refine(val => val.trim().length > 0, 'El motivo de la solicitud no puede estar vacío')
    .refine(val => /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s.,!?¿¡()-]+$/.test(val), 'El motivo de la solicitud solo puede contener letras, números, espacios y los caracteres .,!?¿¡()-'),

  // Archivos (no están en el DTO del backend, pero se mantienen para el frontend)
  Planos_Terreno: z.instanceof(File, { message: "Debe subir el plano del terreno" })
    .refine(file => file.size <= 5 * 1024 * 1024, 'El plano del terreno no debe superar los 5MB')
    .refine(
      file => ['image/jpeg', 'image/jpg', 'image/png', 'image/heic', 'application/pdf'].includes(file.type),
      'El plano del terreno debe ser JPG, JPEG, PNG, HEIC o PDF'
    ),

  Escritura_Terreno: z.instanceof(File, { message: "Debe subir la escritura del terreno" })
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