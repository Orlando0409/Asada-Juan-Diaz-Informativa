import z from 'zod';


export const TipoIdentificacionValues = [
    'Cedula Nacional',
    'Dimex',
    'Pasaporte',
] as const;
export type TipoIdentificacion = typeof TipoIdentificacionValues[number];

export const MedidorExtraFisicoSchema = z.object({
    Tipo_Identificacion: z.enum(TipoIdentificacionValues, {
        errorMap: () => ({ message: 'El tipo de identificación debe ser uno de los siguientes: Cedula Nacional, Dimex, Pasaporte' }),
    }),

    Identificacion: z.string()
        .min(1, 'La identificación no puede estar vacía')
        .refine(val => val.trim().length > 0, 'La identificación no puede estar vacía')
        .transform(val => val.trim()),


    Direccion_Exacta: z.string()
        .min(1, 'La dirección no puede estar vacía')
        .min(10, 'La dirección debe tener al menos 10 caracteres')
        .max(254, 'La dirección no puede tener más de 255 caracteres')
        .regex(/^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s.,#-]+$/, { message: 'La dirección solo puede contener letras, números, espacios y los caracteres .,-#' })
        .refine(val => val.trim().length > 0, 'La dirección no puede estar vacía')
        .transform(val => val.trim()),

    Planos_Terreno: z.instanceof(File, { message: "Debe subir el plano del terreno" })
        .refine(
            file => ['image/jpeg', 'image/jpg', 'image/png', 'image/heic', 'application/pdf'].includes(file.type),
            'El plano del terreno debe ser JPG, JPEG, PNG, HEIC o PDF'
        ),

    Certificacion_Literal: z.instanceof(File, { message: "Debe subir la certificacion literal del terreno" })
        .refine(
            file => ['image/jpeg', 'image/jpg', 'image/png', 'image/heic', 'application/pdf'].includes(file.type),
            'La certificacion literal del terreno debe ser JPG, JPEG, PNG, HEIC o PDF'
        ),
});

export type MedidorExtraFisico = z.infer<typeof MedidorExtraFisicoSchema>;
