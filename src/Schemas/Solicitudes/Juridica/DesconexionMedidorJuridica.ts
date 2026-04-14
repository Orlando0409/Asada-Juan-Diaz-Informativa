import { z } from 'zod';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/heic", "application/pdf"];
const ACCEPTED_FILE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".heic", ".pdf"];

const isAcceptedUploadFile = (file: File) => {
  const fileName = file.name.toLowerCase();
  const hasValidExtension = ACCEPTED_FILE_EXTENSIONS.some((ext) => fileName.endsWith(ext));

  // Some browsers/devices can provide an empty MIME type for HEIC/PDF uploads.
  return ACCEPTED_FILE_TYPES.includes(file.type) || hasValidExtension;
};

export const DesconexionJuridicaSchema = z.object({
  Razon_Social: z.string()
    .min(2, 'La razón social debe tener al menos 2 caracteres')
    .max(255, 'La razón social no puede tener más de 255 caracteres'),

  Cedula_Juridica: z.string()
    .min(10, 'La cédula jurídica debe tener al menos 10 caracteres')
    .max(12, 'La cédula jurídica no puede tener más de 12 caracteres')
    .regex(/^3-\d{3}-\d{6}$|^\d{10}$/, 'La cédula jurídica debe tener el formato 3-XXX-XXXXXX o 10 dígitos'),

  Direccion_Exacta: z.string()
    .min(10, 'La dirección debe tener al menos 10 caracteres')
    .max(254, 'La dirección no puede tener más de 255 caracteres'),

  Correo: z.string()
    .min(1, 'El correo electrónico es obligatorio')
    .max(99, 'El correo no puede tener más de 100 caracteres')
    .email('El correo electrónico no es válido'),

  Numero_Telefono: z.string()
    .min(1, 'El número de teléfono es obligatorio')
    .refine((phone) => {
      const phoneNumber = parsePhoneNumberFromString(phone || "");
      return !!phoneNumber && phoneNumber.isValid();
    }, {
      message: 'Debe ingresar un número de teléfono válido'
    })
    .transform((phone) => {
      const phoneNumber = parsePhoneNumberFromString(phone || "");
      if (!phoneNumber || !phoneNumber.isValid()) {
        throw new Error('Debe ingresar un número de teléfono válido');
      }
      return phoneNumber.format('E.164');
    }),

  Motivo_Solicitud: z.string()
    .min(10, 'El motivo de la solicitud debe tener al menos 10 caracteres')
    .max(499, 'El motivo de la solicitud no puede tener más de 500 caracteres'),

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
});

export type DesconexionJuridica = z.infer<typeof DesconexionJuridicaSchema>;