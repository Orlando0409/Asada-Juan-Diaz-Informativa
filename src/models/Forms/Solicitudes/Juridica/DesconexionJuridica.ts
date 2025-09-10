
export interface DesconexionJuridico {
  Razon_Social: string;
  Cedula_Juridica: string;
  Direccion_Exacta: string;
  Correo: string;
  Numero_Telefono: string;
  Motivo_Solicitud: string;
}

export const DesconexionJuridicoInicialState: DesconexionJuridico = {
  Razon_Social: '',
  Cedula_Juridica: '',
  Direccion_Exacta: '',
  Correo: '',
  Numero_Telefono: '',
  Motivo_Solicitud: '',
};

export interface DesconexionJuridicoFormData {
  Razon_Social: string;
  Cedula_Juridica: string;
  Direccion_Exacta: string;
  Correo: string;
  Numero_Telefono: string;
  Motivo_Solicitud: string;
}