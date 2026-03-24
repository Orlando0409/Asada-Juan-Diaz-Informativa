export interface MedidorExtraJuridica {
  Cedula_Juridica: string;
  Razon_Social: string;
  Correo: string;
  Numero_Telefono: string;
  Direccion_Exacta: string;
  Planos_Terreno?: File | string;
  Certificacion_Literal?: File | string;
}

export const MedidorExtraJuridicaInicialState: MedidorExtraJuridica = {
  Cedula_Juridica: '',
  Razon_Social: '',
  Correo: '',
  Numero_Telefono: '',
  Direccion_Exacta: '',
};