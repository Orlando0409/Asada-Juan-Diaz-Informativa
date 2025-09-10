export interface AfiliacionJuridica {
  Cedula_Juridica: string;
  Razon_Social: string;
  Correo: string;
  Numero_Telefono: string;
  Direccion_Exacta: string;
  Planos_Terreno?: File | string;
  Escritura_Terreno?: File | string;
}

export const AfiliacionJuridicaInicialState: AfiliacionJuridica = {
  Cedula_Juridica: '',
  Razon_Social: '',
  Correo: '',
  Numero_Telefono: '',
  Direccion_Exacta: '',
  Planos_Terreno: undefined,
  Escritura_Terreno: undefined,
};

export interface AfiliacionJuridicaFormData {
  Cedula_Juridica: string;
  Razon_Social: string;
  Correo: string;
  Numero_Telefono: string;
  Direccion_Exacta: string;
  Planos_Terreno?: File | string;
  Escritura_Terreno?: File | string;
}
