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
}

export const AsociadoInicialState : AsociadoFisico = {
  Tipo_Identificacion: 'Cedula Nacional',
  Identificacion: "",
  Nombre: "",
  Apellido1: "",
  Apellido2: "",
  Correo: "",
  Numero_Telefono: "",
  Motivo_Solicitud: ""
};

export interface AsociadoFisico {
  Tipo_Identificacion: 'Cedula Nacional' | 'Dimex' | 'Pasaporte';
  Identificacion: string;
  Nombre: string;
  Apellido1: string;
  Apellido2: string;
  Correo: string;
  Numero_Telefono: string;
  Motivo_Solicitud: string;
}
