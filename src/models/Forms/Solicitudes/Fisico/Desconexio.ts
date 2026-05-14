
export interface Desconexion {
 
 Identificacion: string;
  Tipo_Identificacion: 'Cedula Nacional' | 'DIMEX' | 'Pasaporte';
  
  
  Motivo_Solicitud: string;

  Planos_Terreno?: File | string;
  Certificacion_Literal?: File | string;
}
export const DesconexionInicialState= {
  
  Identificacion: "",
  Tipo_Identificacion: "Cedula Nacional",
 
  Motivo_Solicitud: "",
 
  Planos_Terreno: undefined,
  Certificacion_Literal: undefined,
};
export interface DesconexionFormData {
  
  Identificacion: string;
  Tipo_Identificacion: 'Cedula Nacional' | 'DIMEX' | 'Pasaporte';
 
  Motivo_Solicitud: string;

  Planos_Terreno?: File | string;
  Certificacion_Literal?: File | string;
}
