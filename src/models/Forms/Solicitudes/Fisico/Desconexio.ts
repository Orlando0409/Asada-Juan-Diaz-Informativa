
export interface Desconexion {
  Nombre: string;
  Apellido1: string;
  Apellido2: string;
 Identificacion: string;
  Tipo_Identificacion: 'Cedula Nacional' | 'DIMEX' | 'Pasaporte';
  Correo: string;
  Direccion_Exacta: string;
  Motivo_Solicitud: string;
  Numero_Telefono:number,
  Planos_Terreno?: File | string;
  Certificacion_Literal?: File | string;
}
export const DesconexionInicialState= {
  Nombre: "",
  Apellido1: "",
  Apellido2: "",
  Identificacion: "",
  Tipo_Identificacion: "Cedula Nacional",
  Correo: "",
  Direccion_Exacta: "",
  Motivo_Solicitud: "",
  Numero_Telefono:0,
  Planos_Terreno: undefined,
  Certificacion_Literal: undefined,
};
export interface DesconexionFormData {
   Nombre: string;
  Apellido1: string;
  Apellido2: string;
  Identificacion: string;
  Tipo_Identificacion: 'Cedula Nacional' | 'DIMEX' | 'Pasaporte';
  Correo: string;
  Direccion_Exacta: string;
  Motivo_Solicitud: string;
  Numero_Telefono:number,
  Planos_Terreno?: File | string;
  Certificacion_Literal?: File | string;
}
