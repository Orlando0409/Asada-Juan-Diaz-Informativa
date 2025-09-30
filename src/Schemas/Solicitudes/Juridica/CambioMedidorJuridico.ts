import { z } from 'zod'

export const CambioMedidorJuridicaSchema = z.object({
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
    .min(8, 'El número de teléfono debe tener al menos 8 dígitos')
    .regex(/^\+?[0-9]{8,15}$/, 'El número de teléfono debe estar en formato internacional, ej. +50688887777'),
  Direccion_Exacta: z.string()
    .min(10, 'La dirección debe tener al menos 10 caracteres')
    .max(255, 'La dirección no puede tener más de 255 caracteres'),
   
  Motivo_Solicitud: z.string()
    .min(10, 'El motivo de la solicitud debe tener al menos 10 caracteres')
    .max(500, 'El motivo de la solicitud no puede tener más de 500 caracteres'),
   
  Numero_Medidor_Anterior: z.number()
    .min(1, 'El número de medidor anterior debe ser mayor a 0')
    .max(9999999, 'El número de medidor anterior no puede ser mayor a 9,999,999'),
});

export type CambioMedidorJuridica = z.infer<typeof CambioMedidorJuridicaSchema>;
