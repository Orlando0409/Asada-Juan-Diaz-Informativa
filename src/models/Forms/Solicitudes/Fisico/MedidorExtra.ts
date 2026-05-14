export type TipoIdentificacion = 'Cedula Nacional' | 'Dimex' | 'Pasaporte';

export interface MedidorExtraFisico {
  Tipo_Identificacion: TipoIdentificacion;
  Identificacion: string;
  Direccion_Exacta: string;
  Planos_Terreno?: File | string;
  Certificacion_Literal?: File | string;
}

export const MedidorExtraFisicoInicialState: MedidorExtraFisico = {
  Tipo_Identificacion: 'Cedula Nacional',
  Identificacion: '',
  Direccion_Exacta: '',
  Planos_Terreno: undefined,
  Certificacion_Literal: undefined,
};
