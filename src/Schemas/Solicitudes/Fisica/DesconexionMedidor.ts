import { z } from 'zod';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

// Enum para tipo de identificación
export const TipoIdentificacionValues = [
  'Cedula Nacional',
  'Dimex',
  'Pasaporte',
] as const;
export type TipoIdentificacion = typeof TipoIdentificacionValues[number];

export const DesconexionMedidorSchema = z.object({
  // Campos comunes de CreateSolicitudFisicaDto
  Tipo_Identificacion: z.enum(TipoIdentificacionValues, {
    errorMap: () => ({ message: 'El tipo de identificación debe ser uno de los siguientes: Cedula Nacional, Dimex, Pasaporte' }),
  }),

  Identificacion: z.string()
    .min(1, 'La identificación no puede estar vacía')
    .refine(val => val.trim().length > 0, 'La identificación no puede estar vacía'),

  Nombre: z.string()
    .min(1, 'El nombre no puede estar vacío')
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(49, 'El nombre no puede tener más de 50 caracteres')
    .refine(val => val.trim().length > 0, 'El nombre no puede estar vacío')
    .refine(val => /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(val), 'El nombre solo puede contener letras y espacios'),

  Apellido1: z.string()
    .min(1, 'El primer apellido no puede estar vacío')
    .min(2, 'El primer apellido debe tener al menos 2 caracteres')
    .max(49, 'El primer apellido no puede tener más de 50 caracteres')
    .refine(val => val.trim().length > 0, 'El primer apellido no puede estar vacío')
    .refine(val => /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(val), 'El primer apellido solo puede contener letras y espacios'),

  Apellido2: z.string()
     .min(1, 'El segundo apellido no puede estar vacío')
    .min(2, 'El segundo apellido debe tener al menos 2 caracteres')
    .max(49, 'El segundo apellido no puede tener más de 50 caracteres')
    .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/, { message: 'El segundo apellido solo puede contener letras y espacios' })
    .transform(val => val.trim()),

  Correo: z.string()
    .min(1, 'El correo no puede estar vacío')
    .max(99, 'El correo no puede tener más de 100 caracteres')
    .email('El correo electrónico debe tener un formato válido')
    .refine(val => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(val), 'El formato del correo electrónico no es válido'),

  Numero_Telefono: z.string()
    .min(1, 'El número de teléfono no puede estar vacío')
    .refine((phone) => {
      const phoneNumber = parsePhoneNumberFromString(phone || "");
      return !!phoneNumber && phoneNumber.isValid();
    }, {
      message: 'número de teléfono válido".'
    }),

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