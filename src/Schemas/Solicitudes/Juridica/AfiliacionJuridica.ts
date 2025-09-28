import { z } from 'zod';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

export const AfiliacionJuridicaSchema = z.object({
  Cedula_Juridica: z.string()
    .length(12, 'La cédula jurídica debe tener 12 caracteres')
    .regex(/^3-\d{3}-\d{6}$/, 'La cédula jurídica debe tener el formato 3-XXX-XXXXXX'),

  Razon_Social: z.string()
    .min(2, 'La razón social debe tener al menos 2 caracteres')
    .max(100, 'La razón social no puede tener más de 100 caracteres'),

  Correo: z.string()
    .min(1, 'El correo electrónico es obligatorio')
    .max(100, 'El correo no puede tener más de 100 caracteres')
    .email('El correo electrónico no es válido'),

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
    .max(255, 'La dirección no puede tener más de 255 caracteres'),

  Planos_Terreno: z.instanceof(File, { message: "Debe subir el plano del terreno" }),
  Escritura_Terreno: z.instanceof(File, { message: "Debe subir la escritura del terreno" }),
});