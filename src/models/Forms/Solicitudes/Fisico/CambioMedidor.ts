

// models/Solicitudes/CambioMedidor.ts
export type TipoIdentificacion = 'Cedula Nacional' | 'Dimex' | 'Pasaporte';

export interface CambioMedidor {
  // campos desde SolicitudFisica + propios de CambioMedidor
  Nombre: string;
  Apellido1: string;
  Apellido2?: string | null;
  Tipo_Identificacion: TipoIdentificacion;
  Identificacion: string;
  Correo: string;
  Numero_Telefono: string; // E.164
  Direccion_Exacta: string;
  Motivo_Solicitud: string;
  Numero_Medidor_Anterior: number;
}
export const CambioMedidorInicialState: CambioMedidor = {
  Nombre: "",
  Apellido1: "",
  Apellido2: "",
  Identificacion: "",
  Tipo_Identificacion: 'Cedula Nacional',
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
  Identificacion: string;
  Tipo_Identificacion: 'Cedula Nacional' | 'DIMEX' | 'Pasaporte';
  Correo: string;
  Direccion_Exacta: string;
  Numero_Telefono: string;
  Motivo_Solicitud: string;
 Numero_Medidor_Anterior: number;
}

/*
export interface CambioMedidor {
  Nombre: string;
  Apellido1: string;
  Apellido2: string;
 Identificacion: string;
 Tipo_Identificacion: 'Cedula Nacional' | 'DIMEX' | 'Pasaporte';
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
  Identificacion: "",
  Tipo_Identificacion: 'Cedula Nacional',
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
  Identificacion: string;
  Tipo_Identificacion: 'Cedula Nacional' | 'DIMEX' | 'Pasaporte';
  Correo: string;
  Direccion_Exacta: string;
  Numero_Telefono: string;
  Motivo_Solicitud: string;
 Numero_Medidor_Anterior: number;
}
*/


