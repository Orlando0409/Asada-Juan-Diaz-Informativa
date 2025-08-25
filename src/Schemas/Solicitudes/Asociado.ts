import {z} from 'zod'

export const AsociadoSchema = z.object({
  Nombre: z.string().min(1, 'El nombre es obligatorio'),
  PrimerApellido: z.string().min(1, 'El primer apellido es obligatorio'),
  SegundoApellido: z.string().optional(),

  Cedula:z.string().min(9, 'La cédula es obligatoria')
  .max(10, 'La cédula debe tener 10 dígitos en caso de extranjeros y 9 en caso de nacionales')
  .regex(/^\d+$/, 'La cédula solo debe contener números'),

  DireccionExacta: z.string().min(10, 'La dirección debe tener al menos 10 caracteres'),

  NumeroTelefono:z.string()
  .length(8, 'El número de teléfono debe tener exactamente 8 dígitos')
  .regex(/^\d+$/, 'El teléfono solo debe contener números'),

  MotivoSolicitud: z.string().min(10,'El motivo debe de tener al menos 10 caracteres'),

  CorreoElectronico: z.string()
  .min(1, 'El correo electrónico es obligatorio')
  .email('El correo electrónico no es válido'),

})
//
export type Asociado = z.infer<typeof AsociadoSchema>

