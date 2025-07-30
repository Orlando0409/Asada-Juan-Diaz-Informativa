import { Link } from '@tanstack/react-router'
import Dropdown from './Dropdown'
import type { MenuItem } from '../../types/header/MenuItem'

interface DesktopHeaderProps {
  menuItems: MenuItem[]
}

const DesktopHeader = ({ menuItems }: DesktopHeaderProps) => {
  return (
    <>
      {/* Menú principal */}
      <ul className='pr-20 hidden md:flex gap-6 items-center font-medium text-gray-700'>
        {menuItems.map((item) => (
          item.tipo === 'dropdown' ? (
            <Dropdown 
              key={item.id}
              texto={item.texto}
              subopciones={item.subopciones || []}
            />
          ) : (
            <li key={item.id}>
              <Link 
                to={item.ruta || '#'} 
                className='hover:text-[#6FCAF1] transition-colors duration-200'
              >
                {item.texto}
              </Link>
            </li>
          )
        ))}
      </ul>


    </>
  )
}

export default DesktopHeader