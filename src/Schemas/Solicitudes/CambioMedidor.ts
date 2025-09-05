import {z} from 'zod'

export const CambioMedidorSchema = z.object({
  Nombre: z.string().min(1, 'El nombre es obligatorio'),
  Apellido1: z.string().min(1, 'El primer apellido es obligatorio'),
  Apellido2: z.string().optional(),
  Cedula:z.string()
  .min(9, 'La cédula es obligatoria')
  .max(10, 'La cédula debe tener 10 dígitos en caso de extranjeros y 9 en caso de nacionales')
  .regex(/^\d+$/, 'La cédula solo debe contener números'),

  Direccion_Exacta: z.string().min(10, 'La dirección debe tener al menos 10 caracteres'),

  Numero_Telefono:z.string()
   .length(8, 'El número de teléfono debe tener exactamente 8 dígitos')
   .regex(/^\d+$/, 'El teléfono solo debe contener números'),

  Motivo_Solicitud: z.string().min(10,'El motivo debe de tener al menos 10 caracteres'),

  Correo: z.string()
  .min(1, 'El correo electrónico es obligatorio')
  .email('El correo electrónico no es válido'),
 
  Numero_Medidor_Anterior: z.number()
    .positive('El número de medidor anterior debe ser positivo')
    .gt(0, 'El número de medidor anterior debe ser mayor a 0 ')
    .max(9999999, 'El número de medidor anterior no puede exceder 9999999'),
})
//
export type CambioMedidor = z.infer<typeof CambioMedidorSchema>

