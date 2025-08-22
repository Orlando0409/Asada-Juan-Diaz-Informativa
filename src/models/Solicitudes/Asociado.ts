export interface Asociado {
  Nombre: string;
  PrimerApellido: string;
  SegundoApellido: string;
  Cedula: string;
  CorreoElectronico: string;
  DireccionExacta: string;
  MotivoSolicitud: string;
  NumeroTelefono:number
  Id_Estado_Solicitud: number;
 
}

export const AsociadoInicialState= {
  Nombre: "",
  PrimerApellido: "",
  SegundoApellido: "",
  Cedula: "",
  CorreoElectronico: "",
  DireccionExacta: "",
  MotivoSolicitud: "",
  NumeroTelefono:0,
  Id_Estado_Solicitud: 0,
  
};

export interface AfiliacionFormData {
  Nombre: string;
  PrimerApellido: string;
  SegundoApellido: string;
  Cedula: string;
  DireccionExacta: string;
  NumeroTelefono: string;
  CorreoElectronico: string;
  MotivoSolicitud:string;
  
}