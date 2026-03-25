import type { Medidor } from "../../../Medidor";

export type TipoIdentificacion = 'Cedula Nacional' | 'Dimex' | 'Pasaporte';

export interface MedidoresResponse {
  Nombre?: string;
  Identificación?: string;
  Medidores?: Medidor[];
  medidores?: Medidor[];
  data?: Medidor[];
}

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
  Id_Medidor: number;
  Planos_Terreno?: File | string;
  Certificacion_Literal?: File | string;
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
  Id_Medidor: 0,
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
  Id_Medidor: number;
  Planos_Terreno?: File | string;
  Certificacion_Literal?: File | string;
}
