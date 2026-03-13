
import { z } from 'zod';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

export const MedidorExtraJuridicaSchema = z.object({
  Cedula_Juridica: z.string()
    .length(12, 'La cédula jurídica debe tener 12 caracteres')
    .regex(/^3-\d{3}-\d{6}$/, 'La cédula jurídica debe tener el formato 3-XXX-XXXXXX'),

  Razon_Social: z.string()
    .min(2, 'La razón social debe tener al menos 2 caracteres')
    .max(99, 'La razón social no puede tener más de 100 caracteres')
    .refine(val => val.trim().length > 0, 'La razón social no puede estar vacía')
    .transform(val => val.trim()),

  Correo: z.string()
    .min(1, 'El correo electrónico es obligatorio')
    .max(99, 'El correo no puede tener más de 100 caracteres')
    .email('El correo electrónico no es válido')
    .transform(val => val.trim().toLowerCase()),

  Numero_Telefono: z.string()
    .min(1, 'El número de teléfono es obligatorio')
    .refine((phone) => {
      const phoneNumber = parsePhoneNumberFromString(phone || "");
      return !!phoneNumber && phoneNumber.isValid();
    }, {
      message: 'Debe ingresar un número de teléfono válido con código de país, ej. +50688887777'
    }),

  Direccion_Exacta: z.string()
    .min(10, 'La dirección debe tener al menos 10 caracteres')
    .max(254, 'La dirección no puede tener más de 255 caracteres')
    .refine(val => val.trim().length > 0, 'La dirección no puede estar vacía')
    .transform(val => val.trim()),

  Motivo_Solicitud: z.string()
    .min(1, 'El motivo de la solicitud no puede estar vacío')
    .min(10, 'El motivo debe tener al menos 10 caracteres')
    .max(499, 'El motivo no puede tener más de 500 caracteres')
    .refine(val => val.trim().length > 0, 'El motivo de la solicitud no puede estar vacío')
    .transform(val => val.trim()),

  Id_Nuevo_Medidor: z.string()
    .optional()
    .or(z.literal(''))
    .transform(val => val === '' ? undefined : val),
});

export type MedidorExtraJuridica = z.infer<typeof MedidorExtraJuridicaSchema>;