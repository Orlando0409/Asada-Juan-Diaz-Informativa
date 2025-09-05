
export interface CambioMedidor {
  Nombre: string;
  Apellido1: string;
  Apellido2: string;
  Cedula: string;
  Correo: string;
  Direccion_Exacta: string;
  Numero_Telefono: string;
  Motivo_Solicitud: string;
  Numero_Medidor_Anterior: number;
}


export const CambioMedidorInicialState: CambioMedidor = {
  Nombre: "",
  Apellido1: "",
  Apellido2: "",
  Cedula: "",
  Correo: "",
  Direccion_Exacta: "",
  Numero_Telefono: "",
  Motivo_Solicitud: "",
  Numero_Medidor_Anterior: 0,
};
export interface CambioMedidorFormData {
  Nombre: string;
  Apellido1: string;
  Apellido2: string;
  Cedula: string;
  Correo: string;
  Direccion_Exacta: string;
  Numero_Telefono: string;
  Motivo_Solicitud: string;
 Numero_Medidor_Anterior: number;
}



