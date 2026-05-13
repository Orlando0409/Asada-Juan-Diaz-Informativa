export interface MedidorExtraJuridica {
  Cedula_Juridica: string;
 
  Planos_Terreno?: File | string;
  Certificacion_Literal?: File | string;
}

export const MedidorExtraJuridicaInicialState: MedidorExtraJuridica = {
  Cedula_Juridica: '',
  
};