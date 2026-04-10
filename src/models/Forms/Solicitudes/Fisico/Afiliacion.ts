export interface Afiliacion {
  Nombre: string;
  Apellido1: string;
  Apellido2: string;
  Identificacion: string;
  Correo: string;
  Direccion_Exacta: string;
  Numero_Telefono: string;
  Edad: number;
  Tipo_Identificacion: 'Cedula Nacional' | 'Dimex' | 'Pasaporte';
  Planos_Terreno?: File | string;
  Certificacion_Literal?: File | string;
}

export const AfiliacionInicialState: Afiliacion = {
  Nombre: '',
  Apellido1: '',
  Apellido2: '',
  Identificacion: '',
  Correo: '',
  Direccion_Exacta: '',
  Numero_Telefono: '',
  Edad: 0,
  Tipo_Identificacion: 'Cedula Nacional',
  Planos_Terreno: undefined,
  Certificacion_Literal: undefined,
};

export interface AfiliacionFormData {
  Nombre: string;
  Apellido1: string;
  Apellido2: string;
  Tipo_Identidad: 'Cedula Nacional' | 'Dimex' | 'Pasaporte';
  Numero_Identidad: string;
  Correo: string;
  Direccion_Exacta: string;
  Numero_Telefono: string;
  Edad: number;
  Planos_Terreno?: File | string;
  Certificacion_Literal?: File | string;
}
