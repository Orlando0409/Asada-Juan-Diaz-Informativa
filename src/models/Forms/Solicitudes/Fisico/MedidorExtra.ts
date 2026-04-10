export type TipoIdentificacion = 'Cedula Nacional' | 'Dimex' | 'Pasaporte';

export interface MedidorExtraFisico {
  Tipo_Identificacion: TipoIdentificacion;
  Identificacion: string;
  Nombre: string;
  Apellido1: string;
  Apellido2?: string;
  Correo: string;
  Numero_Telefono: string;
  Direccion_Exacta: string;
  Planos_Terreno?: File | string;
  Certificacion_Literal?: File | string;
}

export const MedidorExtraFisicoInicialState: MedidorExtraFisico = {
  Tipo_Identificacion: 'Cedula Nacional',
  Identificacion: '',
  Nombre: '',
  Apellido1: '',
  Apellido2: '',
  Correo: '',
  Numero_Telefono: '',
  Direccion_Exacta: '',
  Planos_Terreno: undefined,
  Certificacion_Literal: undefined,
};
