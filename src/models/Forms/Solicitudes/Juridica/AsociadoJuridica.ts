export interface AsociadoJuridico {
  Cedula_Juridica: string;
  Razon_Social: string;
  Correo: string;
  Numero_Telefono: string;
  Motivo_Solicitud: string;
  Planos_Terreno?: File | string;
  Escrituras_Terreno?: File | string;
}

export const AsociadoJuridicoInicialState: AsociadoJuridico = {
  Cedula_Juridica: '',
  Razon_Social: '',
  Correo: '',
  Numero_Telefono: '',
  Motivo_Solicitud: '',
  Escrituras_Terreno: undefined,
  Planos_Terreno: undefined,
};

export interface AsociadoJuridicoFormData {
  Cedula_Juridica: string;
  Razon_Social: string;
  Correo: string;
  Numero_Telefono: string;
  Motivo_Solicitud: string;
  Planos_Terreno?: File | string;
   Escrituras_Terreno?: File | string;

}
