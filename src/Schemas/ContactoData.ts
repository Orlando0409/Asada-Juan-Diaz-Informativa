import { z } from 'zod';

export function getDynamicContactoSchema(campos: Record<string, any>) {
  const dynamicSchemaShape: Record<string, any> = {};
  Object.entries(campos).forEach(([fieldName, fieldProps]) => {
    if (fieldProps.type === 'file') {
      dynamicSchemaShape[fieldName] = z.instanceof(File).optional();
    } else if (fieldProps.required) {
      dynamicSchemaShape[fieldName] = z.string().min(1, `${fieldProps.label} es requerido`);
    } else {
      dynamicSchemaShape[fieldName] = z.string().optional();
    }
  });
  return z.object(dynamicSchemaShape);
}