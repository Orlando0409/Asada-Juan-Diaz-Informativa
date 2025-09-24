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
};

const IDENTITY_ERROR_MESSAGES: Record<TipoIdentificacion, string> = {
  'Cedula Nacional': 'La cédula debe tener exactamente 9 dígitos',
  'Dimex': 'El DIMEX debe tener 11 o 12 dígitos',
  'Pasaporte': 'El pasaporte debe tener 6-9 caracteres alfanuméricos',
};

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
    .max(50, 'La dirección no puede tener más de 50 caracteres'),

  Numero_Telefono: z.string()
    .min(1, 'El número de teléfono es obligatorio')
    .regex(/^\d{8}$/, 'El teléfono debe tener exactamente 8 dígitos'),

  Motivo_Solicitud: z.string()
    .min(10, 'El motivo debe de tener al menos 10 caracteres'),

  Correo: z.string()
    .min(1, 'El correo electrónico es obligatorio')
    .max(50, 'El correo no puede tener más de 50 caracteres')
    .email('El correo electrónico no es válido'),

  Numero_Medidor_Anterior: z.coerce.number()
    .min(1, 'El número de medidor anterior es obligatorio')
    .max(9999999, 'El número de medidor anterior no puede exceder 9999999'),
})
.refine(
  (data) => {
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