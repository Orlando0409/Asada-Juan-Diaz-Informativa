export type ContactoTipo = 'Reporte' | 'Queja' | 'Sugerencia'

export interface Requisito {
  Nombre: string
  PrimerApellido: string
  SegundoApellido?: string
  ubicacion?: string
  texto: string
}

export interface RequisitosContacto {
  requisitosReportes: Requisito
  requisitosQuejas: Requisito
  requisitosSugerencias: Requisito
}

export interface ContactoFormData extends Requisito {
  adjunto?: File
}


export const getRequisitosKey = (tipo: ContactoTipo): keyof RequisitosContacto => {
  const mapping: Record<ContactoTipo, keyof RequisitosContacto> = {
    Reporte: 'requisitosReportes',
    Queja: 'requisitosQuejas',
    Sugerencia: 'requisitosSugerencias'
  }
  return mapping[tipo]
}
