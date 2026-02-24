import { z } from 'zod';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

export const AsociadoJuridicaSchema = z.object({
  Cedula_Juridica: z.string()
    .min(1, 'La cédula jurídica es obligatoria')
    .max(14, 'La cédula jurídica no puede tener más de 15 caracteres'),

  Razon_Social: z.string()
    .min(2, 'La razón social debe tener al menos 2 caracteres'),

  Correo: z.string()
    .min(1, 'El correo electrónico es obligatorio')
    .email('El correo electrónico no es válido'),

  Numero_Telefono: z.string()
    .min(1, 'El número de teléfono es obligatorio')
    .refine((phone) => {
      const phoneNumber = parsePhoneNumberFromString(phone || "");
      return !!phoneNumber && phoneNumber.isValid();
    }, {
      message: 'Debe ingresar un número de teléfono válido con código de país, ej. +50688887777'
    }),

  Motivo_Solicitud: z.string()
    .min(10, 'El motivo de la solicitud debe tener al menos 10 caracteres'),
});