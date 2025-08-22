import {z} from 'zod'

export const AsociadoSchema = z.object({
  Nombre: z.string().min(1, 'El nombre es obligatorio'),
  PrimerApellido: z.string().min(1, 'El primer apellido es obligatorio'),
  SegundoApellido: z.string().optional(),
  Cedula:z.number().min(9, 'La cédula es obligatoria').max(10, 'La cédula debe tener 10 dígitos en caso de extranjeros y 9 en caso de nacionales'),
  DireccionExacta:z.string().min(1, 'La dirección es obligatoria'),
  NumeroTelefono:z.string().min(1, 'el numero de teléfono es  obligatorio'),
  MotivoSolicitud: z.string().min(1,'El mensaje no puede estar vacio'),
  CorreoElectronico: z.string().min(1, 'El correo electrónico es obligatorio').email('El correo electrónico no es válido'),

})
//
export type Asociado = z.infer<typeof AsociadoSchema>
