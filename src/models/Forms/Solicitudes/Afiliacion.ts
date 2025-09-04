export interface Afiliacion {
  Nombre: string;
  Apellido1: string;
  Apellido2: string;
  Cedula: string;
  Correo: string;
  Direccion_Exacta: string;
  Numero_Telefono: string;
  Edad: number;
  Planos_Terreno?: File | string;
  Escritura_Terreno?: File | string;
}

export const AfiliacionInicialState: Afiliacion = {
  Nombre: '',
  Apellido1: '',
  Apellido2: '',
  Cedula: '',
  Correo: '',
  Direccion_Exacta: '',
  Numero_Telefono: '',
  Edad: 0,
  Planos_Terreno: undefined,
  Escritura_Terreno: undefined,
};

export interface AfiliacionFormData {
  Nombre: string;
  Apellido1: string;
  Apellido2: string;
  Cedula: string;
  Correo: string;
  Direccion_Exacta: string;
  Numero_Telefono: string;
  Edad: number;
  Planos_Terreno?: File | string;
  Escritura_Terreno?: File | string;
}
