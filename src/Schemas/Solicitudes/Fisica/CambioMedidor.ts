import parsePhoneNumberFromString from "libphonenumber-js";
import { z } from "zod";

// Valores permitidos para el tipo de identificación
export const TipoIdentificacionValues = ["Cedula Nacional", "DIMEX", "Pasaporte"] as const;
export type TipoIdentificacion = typeof TipoIdentificacionValues[number];
const validarTelefono = (phone: string) => {
  const phoneNumber = parsePhoneNumberFromString(phone);
  if (!phoneNumber || !phoneNumber.isValid()) {
    return false;
  }
  return true;
};
// Schema de validación para el formulario de cambio de medidor
export const CambioMedidorSchema = z.object({
  Nombre: z.string()
    .min(2, { message: "El nombre debe tener al menos 2 caracteres" }),

  Apellido1: z.string()
    .min(2, { message: "El primer apellido debe tener al menos 2 caracteres" }),

  Apellido2: z.string()
    .optional()
    .or(z.string().min(2, { message: "El segundo apellido debe tener al menos 2 caracteres" })),

  Direccion_Exacta: z.string()
    .min(5, { message: "La dirección debe tener al menos 5 caracteres" }),

  Correo: z.string()
    .email({ message: "Debe ser un correo electrónico válido" }),
  Numero_Telefono: z.string()
    .refine(validarTelefono, { message: "Debe ser un número de teléfono válido con código de país, ej. +5215512345678" }),

  //Numero_Telefono: z.string()
    //.regex(/^\+506\d{8}$/, { message: "Debe ser un número válido con formato +506XXXXXXXX" }),

  Tipo_Identificacion: z.enum(TipoIdentificacionValues, { 
    required_error: "Debe seleccionar un tipo de identificación" 
  }),

  Identificacion: z.string()
    .min(9, { message: "El número de identificación debe tener al menos 9 caracteres" }),

  Motivo_Solicitud: z.string()
    .min(3, { message: "Debe ingresar un motivo válido" }),

    Numero_Medidor_Anterior: z.coerce.number({
    invalid_type_error: "El número de medidor debe ser un número válido",
  })
    .min(1, { message: "Debe ingresar un número de medidor válido" })
    .max(9999999, { message: "El número de medidor no puede ser mayor a 9,999,999" }),
});

