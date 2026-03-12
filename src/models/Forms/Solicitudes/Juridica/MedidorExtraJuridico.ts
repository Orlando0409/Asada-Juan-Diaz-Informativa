export interface MedidorExtraJuridica {
  Cedula_Juridica: string;
  Razon_Social: string;
  Correo: string;
  Numero_Telefono: string;
  Direccion_Exacta: string;
  Motivo_Solicitud: string;
  Id_Nuevo_Medidor?: string;
}

export const MedidorExtraJuridicaInicialState: MedidorExtraJuridica = {
  Cedula_Juridica: '',
  Razon_Social: '',
  Correo: '',
  Numero_Telefono: '',
  Direccion_Exacta: '',
  Motivo_Solicitud: '',
  Id_Nuevo_Medidor: '',
};