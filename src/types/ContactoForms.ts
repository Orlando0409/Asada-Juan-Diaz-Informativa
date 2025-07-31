export type ContactoTipo = 'Reportes' | 'Quejas' | 'Sugerencias'

export interface Requisito {
  Nombre: string
  Apellido: string
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
    Reportes: 'requisitosReportes',
    Quejas: 'requisitosQuejas',
    Sugerencias: 'requisitosSugerencias'
  }
  return mapping[tipo]
}
