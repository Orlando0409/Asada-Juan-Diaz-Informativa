export type TipoIdentificacion = 'Cedula Nacional' | 'Dimex' | 'Pasaporte';

export interface MedidorExtraFisico {
  Tipo_Identificacion: TipoIdentificacion;
  Identificacion: string;
  Nombre: string;
  Apellido1: string;
  Apellido2?: string;
  Correo: string;
  Numero_Telefono: string;
  Direccion_Exacta: string;
  Motivo_Solicitud: string;
  Id_Nuevo_Medidor?: string;
}

export const MedidorExtraFisicoInicialState: MedidorExtraFisico = {
  Tipo_Identificacion: 'Cedula Nacional',
  Identificacion: '',
  Nombre: '',
  Apellido1: '',
  Apellido2: '',
  Correo: '',
  Numero_Telefono: '',
  Direccion_Exacta: '',
  Motivo_Solicitud: '',
  Id_Nuevo_Medidor: '',
};