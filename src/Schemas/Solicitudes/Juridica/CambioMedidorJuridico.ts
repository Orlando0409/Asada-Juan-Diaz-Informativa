import { z } from 'zod'

export const CambioMedidorJuridicaSchema = z.object({
  Cedula_Juridica: z.string()
    .length(12, 'La cédula jurídica debe tener 12 caracteres')
    .regex(/^3-\d{3}-\d{6}$/, 'La cédula jurídica debe tener el formato 3-XXX-XXXXXX'),

  Razon_Social: z.string()
    .min(2, 'La razón social debe tener al menos 2 caracteres')
    .max(99, 'La razón social no puede tener más de 100 caracteres'),

  Correo: z.string()
    .min(1, 'El correo electrónico es obligatorio')
    .max(99, 'El correo no puede tener más de 100 caracteres')
    .email('El correo electrónico no es válido'),
  Numero_Telefono: z.string()
    .min(8, 'El número de teléfono debe tener al menos 8 dígitos')
    .regex(/^\+?[0-9]{8,15}$/, 'El número de teléfono debe estar en formato internacional, ej. +50688887777'),
  Direccion_Exacta: z.string()
    .min(10, 'La dirección debe tener al menos 10 caracteres')
    .max(254, 'La dirección no puede tener más de 255 caracteres'),

  Motivo_Solicitud: z.string()
    .min(10, 'El motivo de la solicitud debe tener al menos 10 caracteres')
    .max(499, 'El motivo de la solicitud no puede tener más de 500 caracteres'),

  Id_Medidor: z.coerce.number({
    invalid_type_error: 'El Id del medidor debe ser un número entero',
  })
    .int('El Id del medidor debe ser un número entero')
    .min(1, { message: 'El Id del medidor debe ser mayor a 0' })
    .max(9999999, { message: 'El Id del medidor no puede ser mayor a 9,999,999' })
    .positive('El Id del medidor debe ser positivo'),

  Planos_Terreno: z.instanceof(File, { message: 'Debe subir el plano del terreno' })
    .refine(
      (file) => ['image/jpeg', 'image/jpg', 'image/png', 'image/heic', 'application/pdf'].includes(file.type),
      'El plano debe ser una imagen (JPG, PNG, HEIC) o PDF'
    ),

  Certificacion_Literal: z.instanceof(File, { message: 'Debe subir la certificacion literal del terreno' })
    .refine(
      (file) => ['image/jpeg', 'image/jpg', 'image/png', 'image/heic', 'application/pdf'].includes(file.type),
      'La certificacion literal debe ser una imagen (JPG, PNG, HEIC) o PDF'
    ),
});

export type CambioMedidorJuridica = z.infer<typeof CambioMedidorJuridicaSchema>;