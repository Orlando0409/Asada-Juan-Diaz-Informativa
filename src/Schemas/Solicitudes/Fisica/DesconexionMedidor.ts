import { z } from 'zod';

// Enum para tipo de identificación
export const TipoIdentificacionValues = [
  'Cedula Nacional',
  'Dimex',
  'Pasaporte',
] as const;
export type TipoIdentificacion = typeof TipoIdentificacionValues[number];

export const MotivoDesconexionValues = [
  'Morosidad',
  'Infracción al reglamento de prestación del servicio',
  'Conexión ilegal a terceros',
  'Solicitud expresa de retiro del servicio por parte del usuario (traslado fuera de Juan Díaz)',
  'Otro (especifique)',
] as const;

export type MotivoDesconexion = typeof MotivoDesconexionValues[number];

export const DesconexionMedidorSchema = z.object({
  // Campos comunes de CreateSolicitudFisicaDto
  Tipo_Identificacion: z.enum(TipoIdentificacionValues, {
    errorMap: () => ({ message: 'El tipo de identificación debe ser uno de los siguientes: Cedula Nacional, Dimex, Pasaporte' }),
  }),

  Identificacion: z.string()
    .min(1, 'La identificación no puede estar vacía')
    .refine(val => val.trim().length > 0, 'La identificación no puede estar vacía'),

  Motivo_Desconexion: z.enum(MotivoDesconexionValues, {
    errorMap: () => ({ message: 'Debe seleccionar una causa de desconexión válida' }),
  }),

  Motivo_Otro: z.string().trim().max(250, 'La causa adicional no puede tener más de 250 caracteres').optional(),

  // Campos específicos de CreateSolicitudDesconexionFisicaDto
  Direccion_Exacta: z.string()
    .min(10, 'La dirección debe tener al menos 10 caracteres')
    .max(254, 'La dirección no puede tener más de 255 caracteres')
    .refine(val => val.trim().length > 0, 'La dirección no puede estar vacía')
    .refine(val => /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s.,#-]+$/.test(val), 'La dirección solo puede contener letras, números, espacios y los caracteres .,-#'),

  Motivo_Solicitud: z.string()
    .min(10, 'El motivo de la solicitud debe tener al menos 10 caracteres')
    .max(499, 'El motivo de la solicitud no puede tener más de 500 caracteres')
    .refine(val => val.trim().length > 0, 'El motivo de la solicitud no puede estar vacío')
    .refine(val => /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s.,!?¿¡()-]+$/.test(val), 'El motivo de la solicitud solo puede contener letras, números, espacios y los caracteres .,!?¿¡()-'),

  // Archivos (no están en el DTO del backend, pero se mantienen para el frontend)
  Planos_Terreno: z.instanceof(File, { message: "Debe subir el plano del terreno" })
    .refine(file => file.size <= 5 * 1024 * 1024, 'El plano del terreno no debe superar los 5MB')
    .refine(
      file => ['image/jpeg', 'image/jpg', 'image/png', 'image/heic', 'application/pdf'].includes(file.type),
      'El plano del terreno debe ser JPG, JPEG, PNG, HEIC o PDF'
    ),

  Certificacion_Literal: z.instanceof(File, { message: "Debe subir la certificacion literal del terreno" })
    .refine(
      file => ['image/jpeg', 'image/jpg', 'image/png', 'image/heic', 'application/pdf'].includes(file.type),
      'La certificacion literal del terreno debe ser JPG, JPEG, PNG, HEIC o PDF'
    ),

  Id_Medidor: z.number()
    .min(1, 'El Id del medidor no puede estar vacío')
    .gt(0, 'El Id del medidor debe ser mayor a 0')
    .positive('El Id del medidor debe ser positivo')
    .int('El Id del medidor debe ser un número entero'),
}).superRefine((data, context) => {
  if (data.Motivo_Desconexion === 'Otro (especifique)' && !data.Motivo_Otro?.trim()) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['Motivo_Otro'],
      message: 'Debe especificar la causa de desconexión',
    });
  }
}).refine(
  (data) => {
    const identificacion = data.Identificacion.trim();

    switch (data.Tipo_Identificacion) {
      case "Cedula Nacional":
        return /^\d{9}$/.test(identificacion);
      case "Dimex":
        return /^\d{1,12}$/.test(identificacion);
      case "Pasaporte":
        return /^[A-Z0-9]{1,9}$/i.test(identificacion);
      default:
        return false;
    }
  },
  (data) => {
    let message = 'Formato de identificación inválido';

    switch (data.Tipo_Identificacion) {
      case "Cedula Nacional":
        message = 'La cédula debe tener exactamente 9 dígitos numéricos';
        break;
      case "Dimex":
        message = 'El DIMEX debe tener entre 1 y 12 dígitos numéricos';
        break;
      case "Pasaporte":
        message = 'El pasaporte debe tener entre 1 y 9 caracteres alfanuméricos';
        break;
    }

    return {
      message,
      path: ["Identificacion"],
    };
  }
);

export type DesconexionMedidor = z.infer<typeof DesconexionMedidorSchema>;