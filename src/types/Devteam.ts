export interface Contacto {
  correo?: string
  linkedin?: string
  github?: string
}

export interface Miembro {
  nombre: string
  apellido1: string
  apellido2: string
  rol: string
  imagen: string
  contacto: Contacto
}
