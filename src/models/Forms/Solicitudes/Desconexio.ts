
export interface Desconexion {
  Nombre: string;
  Apellido1: string;
  Apellido2: string;
  Cedula: string;
  Correo: string;
  Direccion_Exacta: string;
  Motivo_Solicitud: string;
  Numero_Telefono:number,
  Planos_Terreno?: File | string;
  Escritura_Terreno?: File | string;
}
export const DesconexionInicialState= {
  Nombre: "",
  Apellido1: "",
  Apellido2: "",
  Cedula: "",
  Correo: "",
  Direccion_Exacta: "",
  Motivo_Solicitud: "",
  Numero_Telefono:0,
  Planos_Terreno: undefined,
  Escritura_Terreno: undefined,
};
export interface DesconexionFormData {
   Nombre: string;
  Apellido1: string;
  Apellido2: string;
  Cedula: string;
  Correo: string;
  Direccion_Exacta: string;
  Motivo_Solicitud: string;
  Numero_Telefono:number,
  Planos_Terreno?: File | string;
  Escritura_Terreno?: File | string;
}
