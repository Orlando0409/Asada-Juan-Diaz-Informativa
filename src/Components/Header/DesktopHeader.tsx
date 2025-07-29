import { Link } from '@tanstack/react-router'
import { FaUserCircle } from 'react-icons/fa'
import Dropdown from './Dropdown'
import type { InicioSesion, MenuItem } from '../../types/header/MenuItem'

interface DesktopHeaderProps {
  menuItems: MenuItem[]
  inicioSesion: InicioSesion
}

const DesktopHeader = ({ menuItems, inicioSesion }: DesktopHeaderProps) => {
  return (
    <>
      {/* Menú principal */}
      <ul className='hidden md:flex gap-6 items-center font-medium text-gray-700'>
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

      {/* Botón de Iniciar Sesión */}
      <div className='flex items-center gap-3'>
        <Link 
          to={inicioSesion.ruta} 
          className='flex items-center gap-2 bg-[#6FCAF1] text-white px-4 py-2 rounded-md hover:bg-[#5BB8E3] transition-colors duration-200'
        >
          <FaUserCircle size={18} />
          <span className='hidden sm:inline'>{inicioSesion.texto}</span>
        </Link>
      </div>
    </>
  )
}

export default DesktopHeader