
import { z } from 'zod';

// Tipo para TipoIdentificacion - Debe coincidir con el backend
export const TipoIdentificacionValues = [
  'Cedula Nacional',
  'Dimex',
  'Pasaporte',
] as const;
export type TipoIdentificacion = typeof TipoIdentificacionValues[number];

// Validaciones adaptadas del backend DTO
export const AsociadoSchema = z.object({
  // Validaciones de CreateSolicitudFisicaDto - COMUNES
  Tipo_Identificacion: z.enum(TipoIdentificacionValues, {
    errorMap: () => ({ message: 'El tipo de identificación debe ser uno de los siguientes: Cedula Nacional, Dimex, Pasaporte' }),
  }),

  Identificacion: z.string()
    .min(1, 'La identificación no puede estar vacía')
    .refine(val => val.trim().length > 0, 'La identificación no puede estar vacía')
    .transform(val => val.trim()),

 



  // Validaciones específicas de CreateSolicitudAsociadoFisicaDto
  Motivo_Solicitud: z.string()
    .min(1, 'El motivo de la solicitud no puede estar vacío')
    .min(10, 'El motivo de la solicitud debe tener al menos 10 caracteres')
    .max(499, 'El motivo de la solicitud no puede tener más de 500 caracteres')
    .regex(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s.,!?¿¡()-]+$/, { message: 'El motivo de la solicitud solo puede contener letras, números, espacios y los caracteres .,!?¿¡()-' })
    .refine(val => val.trim().length > 0, 'El motivo de la solicitud no puede estar vacío')
    .transform(val => val.trim()),
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

export type FormularioAsociadoData = z.infer<typeof AsociadoSchema>;
export type AsociadoFisico = z.infer<typeof AsociadoSchema>;