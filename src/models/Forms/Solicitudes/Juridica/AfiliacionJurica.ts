export interface AfiliacionJuridica {
  Cedula_Juridica: string;
  Razon_Social: string;
  Correo: string;
  Numero_Telefono: string;
  Direccion_Exacta: string;
  Planos_Terreno?: File | string;
  Certificacion_Literal?: File | string;
}

export const AfiliacionJuridicaInicialState: AfiliacionJuridica = {
  Cedula_Juridica: '',
  Razon_Social: '',
  Correo: '',
  Numero_Telefono: '',
  Direccion_Exacta: '',
  Planos_Terreno: undefined,
  Certificacion_Literal: undefined,
};

export interface AfiliacionJuridicaFormData {
  Cedula_Juridica: string;
  Razon_Social: string;
  Correo: string;
  Numero_Telefono: string;
  Direccion_Exacta: string;
  Planos_Terreno?: File | string;
  Certificacion_Literal?: File | string;
}
