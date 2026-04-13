import { z } from 'zod';


function getMaxLength(fieldName: string, fieldType: string): number {
  if (fieldType === 'textarea') return 199
  if (fieldName === 'Correo') return 99
  if (fieldName === 'Ubicacion') return 99
  if (fieldName.includes('Nombre') || fieldName.includes('Apellido')) return 49
  return 10 // Límite por defecto
}

export function getDynamicContactoSchema(campos: Record<string, any>) {
  const dynamicSchemaShape: Record<string, any> = {};
  Object.entries(campos).forEach(([fieldName, fieldProps]) => {
    if (fieldProps.type === 'file') {
      dynamicSchemaShape[fieldName] = z.instanceof(File).optional();
    } else if (fieldProps.required) {
      const maxLength = getMaxLength(fieldName, fieldProps.type)
      dynamicSchemaShape[fieldName] = z
        .string()
        .min(1, `${fieldProps.label} es requerido`)
        .max(maxLength, `${fieldProps.label} no puede exceder ${maxLength+1} caracteres`)
        if (fieldName === 'Correo') {
          dynamicSchemaShape[fieldName] = dynamicSchemaShape[fieldName].email('El correo debe ser un email válido');
        }
    } else {
      const maxLength = getMaxLength(fieldName, fieldProps.type)
      dynamicSchemaShape[fieldName] = z
        .string()
        .max(maxLength, `${fieldProps.label} no puede exceder ${maxLength+1} caracteres`)
        .optional();
    }
  });
  return z.object(dynamicSchemaShape);
}