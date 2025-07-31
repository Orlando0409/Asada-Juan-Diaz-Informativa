import { FaQuestionCircle } from 'react-icons/fa'
import type { MenuItem } from '../types/header/MenuItem'

// Diccionario de íconos permitidos
const iconMap = {
  FaQuestionCircle: FaQuestionCircle,
}


export type RawMenuItem = Omit<MenuItem, 'icono'> & {
  icono?: keyof typeof iconMap
}

// Función que convierte string a componente
export function mapIconsToMenuItems(rawItems: RawMenuItem[]): MenuItem[] {
  return rawItems.map((item) => {
    const { icono, ...rest } = item
    const iconComponent = icono ? iconMap[icono] : undefined

    return {
      ...rest,
      icono: iconComponent,
    }
  })
}