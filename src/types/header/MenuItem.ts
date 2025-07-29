export interface MenuItem {
  id: string
  texto: string
  tipo: 'dropdown' | 'link'
  ruta?: string
  subopciones?: Array<{
    texto: string
    ruta: string
  }>
}

export interface InicioSesion {
  texto: string
  ruta: string
}