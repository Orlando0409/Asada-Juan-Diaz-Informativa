export interface CambioMedidorJuridico {
  Cedula_Juridica: string;
  Razon_Social: string;
  Correo: string;
  Numero_Telefono: string;
  Direccion_Exacta: string;
  Motivo_Solicitud: string;
  Numero_Medidor_Anterior: number;
  Planos_Terreno?: File | string;
  Escritura_Terreno?: File | string;
}

export const CambioMedidorJuridicoInicialState: CambioMedidorJuridico = {
  Cedula_Juridica: '',
  Razon_Social: '',
  Correo: '',
  Numero_Telefono: '',
  Direccion_Exacta: '',
  Motivo_Solicitud: '',
  Numero_Medidor_Anterior: 0,
};