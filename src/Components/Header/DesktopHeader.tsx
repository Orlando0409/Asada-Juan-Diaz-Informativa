import { Link } from '@tanstack/react-router'
import Dropdown from './Dropdown'
import type { DesktopHeaderProps } from '../../types/header/MenuItem'

const DesktopHeader = ({ menuItems }: DesktopHeaderProps) => {
  return (
    <>
      {/* Menú principal */}
      <ul className=' hidden md:flex gap-6 items-center font-medium text-gray-700'>
    {menuItems.map((item) => {
        const Icon = item.icono

        if (item.tipo === 'dropdown') {
          return (
            <Dropdown 
              key={item.id}
              texto={item.texto}
              Subopcion={item.subopciones || []}
            />
          )
        }

        return (
          <li key={item.id}>
            <Link 
              to={item.ruta} 
              className='hover:text-[#6FCAF1] transition-colors duration-200 flex items-center gap-2'
            >
              {item.texto}
              {Icon && <Icon size={13} />}
            </Link>
          </li>
          )
        }
      )}
      </ul>
    </>
  )
}

export default DesktopHeader