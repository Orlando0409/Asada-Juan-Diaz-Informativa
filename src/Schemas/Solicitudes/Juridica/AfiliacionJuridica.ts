import { z } from 'zod'

export const AfiliacionJuridicaSchema = z.object({
  Cedula_Juridica: z.string()
    .length(12, 'La cédula jurídica debe tener 12 caracteres')
    .regex(/^3-\d{3}-\d{6}$/, 'La cédula jurídica debe tener el formato 3-XXX-XXXXXX'),

  Razon_Social: z.string()
    .min(2, 'La razón social debe tener al menos 2 caracteres')
    .max(100, 'La razón social no puede tener más de 100 caracteres'),
   
  Correo: z.string()
    .min(1, 'El correo electrónico es obligatorio')
    .max(100, 'El correo no puede tener más de 100 caracteres')
    .email('El correo electrónico no es válido'),

  Numero_Telefono: z.string()
    .min(8, 'El número de teléfono debe tener al menos 8 dígitos')
     .regex(/^\d+$/, 'El teléfono solo debe contener números'),

  Direccion_Exacta: z.string()
    .min(10, 'La dirección debe tener al menos 10 caracteres')
    .max(255, 'La dirección no puede tener más de 255 caracteres'),
    
  Planos_Terreno: z.instanceof(File, { message: "Debe subir el plano del terreno" }),
  Escritura_Terreno: z.instanceof(File, { message: "Debe subir la escritura del terreno" }),
});