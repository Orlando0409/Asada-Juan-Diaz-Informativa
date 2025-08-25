
export interface Desconexion {
  Nombre: string;
  PrimerApellido: string;
  SegundoApellido: string;
  Cedula: string;
  CorreoElectronico: string;
  DireccionExacta: string;
  MotivoSolicitud: string;
  NumeroTelefono:number,
  Id_Estado_Solicitud: number;
  Edad: number;
  PlanosDelTerreno?: File | string;
  EscrituraDelTerreno?: File | string;
}
export const DesconexionInicialState= {
  Nombre: "",
  PrimerApellido: "",
  SegundoApellido: "",
  Cedula: "",
  CorreoElectronico: "",
  DireccionExacta: "",
  MotivoSolicitud: "",
  Edad: 0,
  NumeroTelefono:0,
  Id_Estado_Solicitud: 0,
  PlanosDelTerreno: undefined,
  EscrituraDelTerreno: undefined,
};
export interface DesconexionFormData {
  Nombre: string;
  PrimerApellido: string;
  SegundoApellido: string;
  Cedula: string;
  Edad: number;
  DireccionExacta: string;
  NumeroTelefono: string;
  CorreoElectronico: string;
  PlanosDelTerreno?: File | string;
  EscrituraDelTerreno?: File | string;
}
