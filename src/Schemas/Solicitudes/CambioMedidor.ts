import {z} from 'zod'

export const CambioMedidorSchema = z.object({
  Nombre: z.string().min(1, 'El nombre es obligatorio'),
  PrimerApellido: z.string().min(1, 'El primer apellido es obligatorio'),
  SegundoApellido: z.string().min(1, 'El primer apellido es obligatorio'),
  Cedula:z.string().min(1, 'La cédula es obligatoria'),
  DireccionExacta:z.string().min(1, 'La dirección es obligatoria'),
  NumeroTelefono:z.string().min(1, 'el numero de teléfono es  obligatorio'),
  MotivoSolicitud: z.string().min(1,'El mensaje no puede estar vacio'),
  CorreoElectronico: z.instanceof(File).optional(),
  

})
//
export type CambioMedidor = z.infer<typeof CambioMedidorSchema>