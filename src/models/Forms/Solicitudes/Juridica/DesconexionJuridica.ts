
export interface DesconexionJuridico {
  Razon_Social: string;
  Cedula_Juridica: string;
  Motivo_Solicitud: string;
}

export const DesconexionJuridicoInicialState: DesconexionJuridico = {
  Razon_Social: '',
  Cedula_Juridica: '',
 
  Motivo_Solicitud: '',
};

export interface DesconexionJuridicoFormData {
  Razon_Social: string;
  Cedula_Juridica: string;
  
  Motivo_Solicitud: string;
}