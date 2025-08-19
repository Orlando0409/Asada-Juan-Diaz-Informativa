import {z} from 'zod'

export const DesconexionMedidorSchema = z.object({
   Nombre: z.string().min(1, 'El nombre es obligatorio'),
  PrimerApellido: z.string().min(1, 'El primer apellido es obligatorio'),
  SegundoApellido: z.string().min(1, 'El primer apellido es obligatorio'),
  Cedula:z.string().min(1, 'La cédula es obligatoria'),
  Edad:z.string().min(1, 'La edad es obligatoria'),
  DireccionExacta:z.string().min(1, 'La dirección es obligatoria'),
  NumeroTelefono:z.string().min(1, 'el numero de teléfono es  obligatorio'),
  MotivoSolicitud: z.string().min(1,'El mensaje no puede estar vacio'),
  CorreoElectronico: z.instanceof(File).optional(),
  PlanosDelTerreno:z. instanceof(File). refine(file=>file instanceof File, {message:"Dede de subir el plano del terreno"}),
  EscrituraDelTerreno:z. instanceof(File). refine(file=>file instanceof File, {message:"Dede de subir la escritura del terreno"}),

})
//
export type DesconexionMedidor = z.infer<typeof DesconexionMedidorSchema>