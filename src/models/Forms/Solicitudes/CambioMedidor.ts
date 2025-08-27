
export interface CambioMedidor {
  Nombre: string;
  PrimerApellido: string;
  SegundoApellido: string;
  Cedula: string;
  CorreoElectronico: string;
  DireccionExacta: string;
   NumeroTelefono: string;
  MotivoSolicitud: string;
  Id_Estado_Solicitud: number;

}

export const CambioMedidorInicialState= {
  Nombre: "",
  PrimerApellido: "",
  SegundoApellido: "",
  Cedula: "",
  CorreoElectronico: "",
  DireccionExacta: "",
   NumeroTelefono: "",
  MotivoSolicitud: "",
  Id_Estado_Solicitud: 0,
 
};
export interface CambioMedidorFormData {
  Nombre: string;
  PrimerApellido: string;
  SegundoApellido: string;
  Cedula: string;
  DireccionExacta: string;
  NumeroTelefono: string;
  MotivoSolicitud: string;
  CorreoElectronico: string;
}




