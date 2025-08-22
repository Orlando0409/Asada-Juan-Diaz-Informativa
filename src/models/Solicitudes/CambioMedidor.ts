
export interface CambioMedidor {
  Nombre: string;
  PrimerApellido: string;
  SegundoApellido: string;
  Cedula: string;
  CorreoElectronico: string;
  DireccionExacta: string;
  Motivo_Solicitud: string;
  Id_Estado_Solicitud: number;
 

}

export const CambioMedidorInicialState= {
  Nombre: "",
  PrimerApellido: "",
  SegundoApellido: "",
  Cedula: "",
  CorreoElectronico: "",
  DireccionExacta: "",
  Motivo_Solicitud: "",
  Id_Estado_Solicitud: 0,
 
};



