import { z } from 'zod';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/heic", "application/pdf"];
const ACCEPTED_FILE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".heic", ".pdf"];

export const MotivoDesconexionValues = [
  'Morosidad',
  'Infracción al reglamento de prestación del servicio',
  'Conexión ilegal a terceros',
  'Solicitud expresa de retiro del servicio por parte del usuario (traslado fuera de Juan Díaz)',
  'Otro (especifique)',
] as const;

export type MotivoDesconexion = typeof MotivoDesconexionValues[number];

const isAcceptedUploadFile = (file: File) => {
  const fileName = file.name.toLowerCase();
  const hasValidExtension = ACCEPTED_FILE_EXTENSIONS.some((ext) => fileName.endsWith(ext));

  // Some browsers/devices can provide an empty MIME type for HEIC/PDF uploads.
  return ACCEPTED_FILE_TYPES.includes(file.type) || hasValidExtension;
};

export const DesconexionJuridicaSchema = z.object({
  Cedula_Juridica: z.string()
    .min(10, 'La cédula jurídica debe tener al menos 10 caracteres')
    .max(12, 'La cédula jurídica no puede tener más de 12 caracteres')
    .regex(/^3-\d{3}-\d{6}$|^\d{10}$/, 'La cédula jurídica debe tener el formato 3-XXX-XXXXXX o 10 dígitos'),

  Motivo_Desconexion: z.enum(MotivoDesconexionValues, {
    errorMap: () => ({ message: 'Debe seleccionar una causa de desconexión válida' }),
  }),

  Motivo_Otro: z.string().trim().max(250, 'La causa adicional no puede tener más de 250 caracteres').optional(),

  Planos_Terreno: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, 'El archivo no debe exceder 5MB')

    .refine((file) => isAcceptedUploadFile(file), 'Solo se aceptan archivos .jpg, .jpeg, .png, .heic, .pdf')
    .optional(),

  Certificacion_Literal: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, 'El archivo no debe exceder 5MB')

    .refine((file) => isAcceptedUploadFile(file), 'Solo se aceptan archivos .jpg, .jpeg, .png, .heic, .pdf')
    .optional(),

  Id_Medidor: z.number()
    .min(1, 'El Id del medidor no puede estar vacío')
    .gt(0, 'El Id del medidor debe ser mayor a 0')
    .positive('El Id del medidor debe ser positivo')
    .int('El Id del medidor debe ser un número entero'),
})
  .superRefine(({ Motivo_Otro, Motivo_Desconexion }, ctx) => {
    if (Motivo_Desconexion === 'Otro (especifique)' && (!Motivo_Otro || Motivo_Otro.trim().length === 0)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['Motivo_Otro'],
        message: 'Debe especificar el motivo cuando selecciona "Otro (especifique)"',
      });
    }
  });

export type DesconexionJuridica = z.infer<typeof DesconexionJuridicaSchema>;