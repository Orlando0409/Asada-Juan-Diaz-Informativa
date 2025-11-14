export type TipoIdentificacion = 'Cedula Nacional' | 'Dimex' | 'Pasaporte';

export interface CambioMedidor {
  Tipo_Identificacion: TipoIdentificacion;
  Identificacion: string;
  Nombre: string;
  Apellido1: string;
  Apellido2: string;
  Correo: string;
  Numero_Telefono: string;
  Direccion_Exacta: string;
  Motivo_Solicitud: string;
  Numero_Medidor_Anterior: number;
}

export const CambioMedidorInicialState: CambioMedidorFisico = {
  Tipo_Identificacion: 'Cedula Nacional',
  Identificacion: "",
  Nombre: "",
  Apellido1: "",
  Apellido2: "",
  Correo: "",
  Direccion_Exacta: "",
  Numero_Telefono: "",
  Motivo_Solicitud: "",
  Numero_Medidor_Anterior: 0,
};

export interface CambioMedidorFisico {
  Tipo_Identificacion: 'Cedula Nacional' | 'Dimex' | 'Pasaporte';
  Identificacion: string;
  Nombre: string;
  Apellido1: string;
  Apellido2: string;
  Correo: string;
  Direccion_Exacta: string;
  Numero_Telefono: string;
  Motivo_Solicitud: string;
  Numero_Medidor_Anterior: number;
}
