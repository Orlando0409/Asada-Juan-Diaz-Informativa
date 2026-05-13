import type { Medidor } from "../../../Medidor";

export type TipoIdentificacion = 'Cedula Nacional' | 'Dimex' | 'Pasaporte';

export interface MedidoresResponse {
 
  Identificación?: string;
  Medidores?: Medidor[];
  medidores?: Medidor[];
  data?: Medidor[];
}

export interface CambioMedidor {
  Tipo_Identificacion: TipoIdentificacion;
  Identificacion: string;

  Motivo_Solicitud: string;
  Id_Medidor: number;
  Planos_Terreno?: File | string;
  Certificacion_Literal?: File | string;
}

export const CambioMedidorInicialState: CambioMedidorFisico = {
  Tipo_Identificacion: 'Cedula Nacional',
  Identificacion: "",
 
  Motivo_Solicitud: "",
  Id_Medidor: 0,
};

export interface CambioMedidorFisico {
  Tipo_Identificacion: 'Cedula Nacional' | 'Dimex' | 'Pasaporte';
  Identificacion: string;

  Motivo_Solicitud: string;
  Id_Medidor: number;
  Planos_Terreno?: File | string;
  Certificacion_Literal?: File | string;
}
