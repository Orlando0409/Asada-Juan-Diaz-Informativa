export const TipoIdentificacion = {
  CEDULA: 'Cedula Nacional',
  DIMEX: 'Dimex',
  PASAPORTE: 'Pasaporte',
  CEDULA_JURIDICA: 'Cedula Juridica',
} as const;

export type TipoIdentificacion =
  (typeof TipoIdentificacion)[keyof typeof TipoIdentificacion];

export type EstadoRecibo = 'Pagado' | 'Pendiente' | 'Vencido';

export interface ConsultaFisicaDTO {
  Tipo_Identificacion?: TipoIdentificacion;
  Identificacion?: string;
  Numero_Medidor?: number;
}

export interface ConsultaJuridicaDTO {
  Cedula_Juridica?: string;
  Numero_Medidor?: number;
}

export interface GenerarFacturaConsultaDTO {
  Numero_Medidor?: number;
  Tipo_Identificacion?: TipoIdentificacion;
  Identificacion?: string;
  Cedula_Juridica?: string;
}

export interface ReciboConsulta {
  numeroRecibo: string;
  fechaEmision: string;
  fechaVencimiento: string;
  monto: number;
  estado: EstadoRecibo;
  periodo: string;
}

export interface TipoTarifaLectura {
  Id_Tipo_Tarifa_Lectura: number;
  Nombre_Tipo_Tarifa: string;
}

export interface EstadoMedidor {
  Id_Estado: number;
  Nombre_Estado: string;
}

export interface MedidorLectura {
  Id_Medidor: number;
  Numero_Medidor: number;
  Estado: EstadoMedidor;
}

export interface AfiliadoFisicoLectura {
  Id_Afiliado: number;
  Tipo_Entidad: number;
  Correo: string;
  Numero: string;
  Tipo_Identificacion: TipoIdentificacion;
  Identificacion: string;
  Nombre: string;
  Primer_Apellido: string;
  Segundo_Apellido: string;
}

export interface AfiliadoJuridicoLectura {
  Id_Afiliado: number;
  Tipo_Entidad: number;
  Correo: string;
  Numero: string;
  Cedula_Juridica: string;
  Razon_Social: string;
}

export type AfiliadoLectura = AfiliadoFisicoLectura | AfiliadoJuridicoLectura;

export interface LecturaConsulta {
  Id_Lectura: number;
  Tipo_Tarifa: TipoTarifaLectura;
  Consumo_Calculado_M3: number;
  Fecha_Lectura: string;
  Medidor: MedidorLectura;
  Afiliado: AfiliadoLectura;
}

export interface DetalleCalculoConsulta {
  Consumo_M3: number;
  Costo_Por_M3: number;
  Cargo_Fijo: number;
}

export interface CalculoFinalConsulta {
  Total_A_Pagar: number;
  Detalles: DetalleCalculoConsulta;
}

export interface MedidorConsultaResultado {
  Numero_Medidor: number;
  BadRequestException?: string;
  'Calculo final'?: CalculoFinalConsulta;
  'Historial de lecturas'?: LecturaConsulta[];
}

export interface AfiliadoFisicoConsulta {
  Nombre: string;
  Identificacion: string;
}

export interface AfiliadoJuridicoConsulta {
  Razon_Social: string;
  Cedula_Juridica: string;
}

export interface ConsultaFisicaResponse {
  Afiliado: AfiliadoFisicoConsulta;
  Total_Medidores: number;
  Medidores: MedidorConsultaResultado[];
}

export interface ConsultaJuridicaResponse {
  Afiliado: AfiliadoJuridicoConsulta;
  Total_Medidores: number;
  Medidores: MedidorConsultaResultado[];
}
export type ConsultaMedidorResponse = MedidorConsultaResultado;

export type ConsultaResultado =
  | { tipo: 'fisica'; data: ConsultaFisicaResponse }
  | { tipo: 'juridica'; data: ConsultaJuridicaResponse }
  | { tipo: 'medidor'; data: ConsultaMedidorResponse };
