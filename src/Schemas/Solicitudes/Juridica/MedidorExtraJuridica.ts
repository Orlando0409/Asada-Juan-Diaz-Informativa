
import { z } from 'zod';


export const MedidorExtraJuridicaSchema = z.object({
  Cedula_Juridica: z.string()
    .length(12, 'La cédula jurídica debe tener 12 caracteres')
    .regex(/^3-\d{3}-\d{6}$/, 'La cédula jurídica debe tener el formato 3-XXX-XXXXXX'),

  Planos_Terreno: z.instanceof(File)
    .refine(
      file => ['image/jpeg', 'image/jpg', 'image/png', 'image/heic', 'application/pdf'].includes(file.type),
      'El plano del terreno debe ser JPG, JPEG, PNG, HEIC o PDF'
    )
    .optional(),

  Certificacion_Literal: z.instanceof(File)
    .refine(
      file => ['image/jpeg', 'image/jpg', 'image/png', 'image/heic', 'application/pdf'].includes(file.type),
      'La certificacion literal del terreno debe ser JPG, JPEG, PNG, HEIC o PDF'
    )
    .optional(),
});

export type MedidorExtraJuridica = z.infer<typeof MedidorExtraJuridicaSchema>;