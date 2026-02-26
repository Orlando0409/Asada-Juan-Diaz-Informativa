import { z } from "zod";

// Tipo para TipoIdentificacion - Debe coincidir con el backend
export const TipoIdentificacionValues = ["Cedula Nacional", "Dimex", "Pasaporte"] as const;
export type TipoIdentificacion = typeof TipoIdentificacionValues[number];

// Validaciones adaptadas del backend DTO
export const CambioMedidorSchema = z.object({
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

  // Validaciones específicas de CreateSolicitudCambioMedidorFisicaDto
  Direccion_Exacta: z.string()
    .min(1, 'La dirección no puede estar vacía')
    .min(10, 'La dirección debe tener al menos 10 caracteres')
    .max(254, 'La dirección no puede tener más de 255 caracteres')
    .regex(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s.,#-]+$/, { message: 'La dirección solo puede contener letras, números, espacios y los caracteres .,-#' })
    .refine(val => val.trim().length > 0, 'La dirección no puede estar vacía')
    .transform(val => val.trim()),

  Motivo_Solicitud: z.string()
    .min(1, 'El motivo de la solicitud no puede estar vacío')
    .min(10, 'El motivo de la solicitud debe tener al menos 10 caracteres')
    .max(500, 'El motivo de la solicitud no puede tener más de 500 caracteres')
    .regex(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s.,!?¿¡()-]+$/, { message: 'El motivo de la solicitud solo puede contener letras, números, espacios y los caracteres .,!?¿¡()-' })
    .refine(val => val.trim().length > 0, 'El motivo de la solicitud no puede estar vacío')
    .transform(val => val.trim()),

  Numero_Medidor_Anterior: z.coerce.number({
    invalid_type_error: 'El numero de medidor debe ser un numero entero',
  })
    .int('El numero de medidor anterior debe ser un numero entero')
    .min(1, { message: 'El número de medidor anterior debe ser mayor a 0' })
    .max(9999999, { message: 'El número de medidor anterior no puede ser mayor a 9,999,999' })
    .positive('El número de medidor anterior debe ser positivo'),
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

export type FormularioCambioMedidorData = z.infer<typeof CambioMedidorSchema>;
export type CambioMedidor = z.infer<typeof CambioMedidorSchema>;

