export interface Asociado {
  Nombre: string;
  Apellido1: string;
  Apellido2: string;
  Cedula: string;
  Correo: string;
  Motivo_Solicitud: string;
  Numero_Telefono:number
 
 
}

export const AsociadoInicialState= {
  Nombre: "",
  Apellido1: "",
  Apellido2: "",
  Cedula: "",
  Correo: "",
  Motivo_Solicitud: "",
  Numero_Telefono:0,
  
};

export interface AfiliacionFormData {
  Nombre: string;
  Apellido1: string;
  Apellido2: string;
  Cedula: string;
  Correo: string;
  Motivo_Solicitud: string;
  Numero_Telefono: number;
  
}