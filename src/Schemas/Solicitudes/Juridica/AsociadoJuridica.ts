

import { z } from 'zod'; // <-- FALTABA ESTA IMPORTACIÓN



export const AsociadoJuridicaSchema = z.object({
  Cedula_Juridica: z.string()
    .min(1, 'La cédula jurídica es obligatoria')
    .max(15, 'La cédula jurídica no puede tener más de 15 caracteres'),

  Razon_Social: z.string()
    .min(1, 'La razón social es obligatoria'),
   
  Correo: z.string()
    .min(1, 'El correo electrónico es obligatorio')
    .email('El correo electrónico no es válido'),

  Numero_Telefono: z.string()
    .min(1, 'El número de teléfono es obligatorio'),

  Motivo_Solicitud: z.string()
    .min(1, 'El motivo de la solicitud es obligatorio'),
});