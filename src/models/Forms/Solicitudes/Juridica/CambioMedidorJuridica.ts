export interface CambioMedidorJuridico {
  Cedula_Juridica: string;
  

  Motivo_Solicitud: string;
  Numero_Medidor_Anterior: number;
  Planos_Terreno?: File | string;
  Certificacion_Literal?: File | string;
}

export const CambioMedidorJuridicoInicialState: CambioMedidorJuridico = {
  Cedula_Juridica: '',
  
  Motivo_Solicitud: '',
  Numero_Medidor_Anterior: 0,
};