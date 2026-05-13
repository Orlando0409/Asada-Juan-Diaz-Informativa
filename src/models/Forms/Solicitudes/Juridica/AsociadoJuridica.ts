export interface AsociadoJuridico {
  Cedula_Juridica: string;
 
  Motivo_Solicitud: string;
  Planos_Terreno?: File | string;
  Escrituras_Terreno?: File | string;
}

export const AsociadoJuridicoInicialState: AsociadoJuridico = {
  Cedula_Juridica: '',
 
  Motivo_Solicitud: '',
  Escrituras_Terreno: undefined,
  Planos_Terreno: undefined,
};

export interface AsociadoJuridicoFormData {
  Cedula_Juridica: string;
 
  Motivo_Solicitud: string;
  Planos_Terreno?: File | string;
   Escrituras_Terreno?: File | string;

}
