export type TipoIdentificacion = 'Cedula Nacional' | 'Dimex' | 'Pasaporte';

export interface AsociadoFisico {
  Tipo_Identificacion: TipoIdentificacion;
  Identificacion: string;
 
  Motivo_Solicitud: string;
  Planos_Terreno?: File | string;
  Escrituras_Terreno?: File | string;
}

export const AsociadoInicialState : AsociadoFisico = {
  Tipo_Identificacion: 'Cedula Nacional',
  Identificacion: "",
 
  Motivo_Solicitud: "",
  Planos_Terreno: undefined,
  Escrituras_Terreno: undefined,
};
