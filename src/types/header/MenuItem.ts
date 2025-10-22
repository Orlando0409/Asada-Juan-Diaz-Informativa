
export type SubOpcion = {
  id: number
  texto: string
  ruta: string 
}

export type MenuItem = {
  id: number
  texto: string
  ruta?: string
  tipo: string
  subopciones?: SubOpcion[]
}
export interface DropdownProps {
  texto: string
  Subopcion: SubOpcion[]
}

export interface MobileHeaderProps {
  menuItems: MenuItem[]
}
export interface DesktopHeaderProps {
  menuItems: MenuItem[]
}


