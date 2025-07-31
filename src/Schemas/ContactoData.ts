import {z} from 'zod'

export const ContactoSchema = z.object({
  nombre: z.string().min(1, 'El nombre es obligatorio'),
  PrimerApellido: z.string().min(1, 'El primer apellido es obligatorio'),
  mensaje: z.string().min(1, 'El mensaje no puede estar vacío'),
  adjunto: z.instanceof(File).optional()
})

export type ContactoData = z.infer<typeof ContactoSchema>