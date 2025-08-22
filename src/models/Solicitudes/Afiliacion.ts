export interface Afiliacion {
  Nombre: string;
  PrimerApellido: string;
  SegundoApellido: string;
  Cedula: string;
  CorreoElectronico: string;
  DireccionExacta: string;
  Motivo_Solicitud: string;
  Id_Estado_Solicitud: number;
  Edad: number;
  PlanosDelTerreno?: File | string;
  EscrituraDelTerreno?: File | string;
}

export const AfiliacionInicialState= {
  Nombre: "",
  PrimerApellido: "",
  SegundoApellido: "",
  Cedula: "",
  CorreoElectronico: "",
  DireccionExacta: "",
  Motivo_Solicitud: "",
  Edad: 0,
  Id_Estado_Solicitud: 0,
  PlanosDelTerreno: undefined,
  EscrituraDelTerreno: undefined,
};
