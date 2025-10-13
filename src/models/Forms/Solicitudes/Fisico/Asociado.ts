export interface Asociado {
  Nombre: string;
  Apellido1: string;
  Apellido2: string;
 Identificacion: string;
 Tipo_Identificacion: 'Cedula Nacional' | 'DIMEX' | 'Pasaporte';
  Correo: string;
  Motivo_Solicitud: string;
  Numero_Telefono:number
 
 
}

export const AsociadoInicialState= {
  Nombre: "",
  Apellido1: "",
  Apellido2: "",
  Identificacion: "",
  Tipo_Identificacion: "Cedula Nacional",
  Correo: "",
  Motivo_Solicitud: "",
  Numero_Telefono:0,
  
};

export interface AfiliacionFormData {
  Nombre: string;
  Apellido1: string;
  Apellido2: string;
  Identificacion: string;
  Tipo_Identificacion: 'Cedula Nacional' | 'DIMEX' | 'Pasaporte';
  Correo: string;
  Motivo_Solicitud: string;
  Numero_Telefono: number;
  
}