import {z} from 'zod'

export const ContactoSchema = z.object({
  nombre: z.string().min(1, 'El nombre es obligatorio'),
  Apellido: z.string().min(1, 'El apellido es obligatorio'),
  mensaje: z.string().min(1, 'El mensaje no puede estar vacío'),
  adjunto: z.instanceof(File).optional()
})

export type ContactoData = z.infer<typeof ContactoSchema>