export interface Afiliacion {
  Nombre: string;
  Apellido1: string;
  Apellido2: string;
  Identificacion: string;
  Correo: string;
  Direccion_Exacta: string;
  Numero_Telefono: string;
  Edad: number;
  Tipo_Identificacion: 'Cedula Nacional' | 'DIMEX' | 'Pasaporte';
  Planos_Terreno?: File | string;
  Escritura_Terreno?: File | string;
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
  Escritura_Terreno: undefined,
};

export interface AfiliacionFormData {
  Nombre: string;
  Apellido1: string;
  Apellido2: string;
  Tipo_Identidad: 'Cedula Nacional' | 'DIMEX' | 'Pasaporte';
  Numero_Identidad: string;
  Correo: string;
  Direccion_Exacta: string;
  Numero_Telefono: string;
  Edad: number;
  Planos_Terreno?: File | string;
  Escritura_Terreno?: File | string;
}
