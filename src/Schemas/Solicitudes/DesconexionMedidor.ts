import {z} from 'zod'

export const DesconexionMedidorSchema = z.object({
   Nombre: z.string().min(1, 'El nombre es obligatorio'),
    PrimerApellido: z.string().min(1, 'El primer apellido es obligatorio'),
    SegundoApellido: z.string().optional(),

   Cedula: z.string()
    .min(9, 'La cédula debe tener al menos 9 dígitos')
    .max(10, 'La cédula debe tener máximo 10 dígitos')
    .regex(/^\d+$/, 'La cédula solo debe contener números'),

   Edad: z.coerce.number()
    .min(18, 'Solo se permite personas mayores de edad')
    .max(120, 'Edad no válida'),

   DireccionExacta: z.string().min(10, 'La dirección debe tener al menos 10 caracteres'),
 
   NumeroTelefono: z.string()
    .length(8, 'El número de teléfono debe tener exactamente 8 dígitos')
    .regex(/^\d+$/, 'El teléfono solo debe contener números'),
  
   MotivoSolicitud: z.string().min(10,'El motivo debe de tener al menos 10 caracteres'),

    CorreoElectronico: z.string()
    .min(1, 'El correo electrónico es obligatorio')
    .email('El correo electrónico no es válido'),

    PlanosDelTerreno: z.instanceof(File, { message: "Debe subir el plano del terreno" }),
  EscrituraDelTerreno: z.instanceof(File, { message: "Debe subir la escritura del terreno" }),
})
//
export type DesconexionMedidor = z.infer<typeof DesconexionMedidorSchema>




