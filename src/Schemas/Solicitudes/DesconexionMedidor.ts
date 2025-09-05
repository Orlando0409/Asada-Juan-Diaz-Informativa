import {z} from 'zod'

export const DesconexionMedidorSchema = z.object({
   Nombre: z.string().min(1, 'El nombre es obligatorio'),
    Apellido1: z.string().min(1, 'El primer apellido es obligatorio'),
    Apellido2: z.string().optional(),

   Cedula: z.string()
    .min(9, 'La cédula debe tener al menos 9 dígitos')
    .max(10, 'La cédula debe tener máximo 10 dígitos')
    .regex(/^\d+$/, 'La cédula solo debe contener números'),

   Direccion_Exacta: z.string().min(10, 'La dirección debe tener al menos 10 caracteres'),
 
   Numero_Telefono: z.string()
    .length(8, 'El número de teléfono debe tener exactamente 8 dígitos')
    .regex(/^\d+$/, 'El teléfono solo debe contener números'),
  
   Motivo_Solicitud: z.string().min(10,'El motivo debe de tener al menos 10 caracteres'),

    Correo: z.string()
    .min(1, 'El correo electrónico es obligatorio')
    .email('El correo electrónico no es válido'),

    Planos_Terreno: z.instanceof(File, { message: "Debe subir el plano del terreno" }),
  Escritura_Terreno: z.instanceof(File, { message: "Debe subir la escritura del terreno" }),
})
//
export type DesconexionMedidor = z.infer<typeof DesconexionMedidorSchema>




