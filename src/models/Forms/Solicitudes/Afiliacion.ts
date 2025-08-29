export interface Afiliacion {
  Nombre: string;
  PrimerApellido: string;
  SegundoApellido: string;
  Cedula: string;
  CorreoElectronico: string;
  DireccionExacta: string;
  Edad: number;
  NumeroTelefono:string;
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
  Edad: 0,
   NumeroTelefono: "",
  PlanosDelTerreno: undefined,
  EscrituraDelTerreno: undefined,
};

export interface AfiliacionFormData {
 
  Nombre: string;
  PrimerApellido: string;
  SegundoApellido: string;
  Cedula: string;
  CorreoElectronico: string;
  DireccionExacta: string;
  Edad: number;
  NumeroTelefono: string;
  PlanosDelTerreno?: File | string;
  EscrituraDelTerreno?: File | string;
}


