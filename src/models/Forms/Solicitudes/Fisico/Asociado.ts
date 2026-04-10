export type TipoIdentificacion = 'Cedula Nacional' | 'Dimex' | 'Pasaporte';

export interface AsociadoFisico {
  Tipo_Identificacion: TipoIdentificacion;
  Identificacion: string;
  Nombre: string;
  Apellido1: string;
  Apellido2: string;
  Correo: string;
  Numero_Telefono: string;
  Motivo_Solicitud: string;
  Planos_Terreno?: File | string;
  Escrituras_Terreno?: File | string;
}

export const AsociadoInicialState : AsociadoFisico = {
  Tipo_Identificacion: 'Cedula Nacional',
  Identificacion: "",
  Nombre: "",
  Apellido1: "",
  Apellido2: "",
  Correo: "",
  Numero_Telefono: "",
  Motivo_Solicitud: "",
  Planos_Terreno: undefined,
  Escrituras_Terreno: undefined,
};
