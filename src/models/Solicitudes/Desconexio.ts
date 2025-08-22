
export interface Desconexion {
  Nombre: string;
  PrimerApellido: string;
  SegundoApellido: string;
  Cedula: string;
  CorreoElectronico: string;
  DireccionExacta: string;
  Motivo_Solicitud: string;
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
  Motivo_Solicitud: "",
  Edad: 0,
  NumeroTelefono:0,
  Id_Estado_Solicitud: 0,
  PlanosDelTerreno: undefined,
  EscrituraDelTerreno: undefined,
};
