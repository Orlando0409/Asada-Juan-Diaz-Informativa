import {z} from 'zod'

export const ContactoSchema = z.object({
  nombre: z.string().min(1, 'El nombre es obligatorio'),
  primerApellido: z.string().min(1, 'El primer apellido es obligatorio'),
  segundoApellido: z.string().optional(),
  ubicacion: z.string().min(1, 'La ubicación es obligatoria'),
  mensaje: z.string().min(1, 'El mensaje no puede estar vacío'),
  adjunto: z.instanceof(File).optional(),
})

export type ContactoData = z.infer<typeof ContactoSchema>