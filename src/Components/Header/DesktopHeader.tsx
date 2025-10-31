import { Link } from '@tanstack/react-router'
import { MdExpandMore } from 'react-icons/md'
import type { DesktopHeaderProps } from '../../types/header/MenuItem'
import { useRef, useState } from 'react'

const DesktopHeader = ({ menuItems }: DesktopHeaderProps) => {
  const [expandedItem, setExpandedItem] = useState<number | null>(null)
  const dropdownRef = useRef<number | null>(null)

  const handleMouseEnter = (itemId: number) => {
    setExpandedItem(itemId)
    if (dropdownRef.current) {
      clearTimeout(dropdownRef.current)
    }
  }

  const handleMouseLeave = () => {
    dropdownRef.current = window.setTimeout(() => {
      setExpandedItem(null)
    }, 150)
  }


  return (
    <>
      {/* Menú principal */}
      <ul className='hidden md:flex gap-6 items-center font-medium text-gray-700'>
        {menuItems.map((item) => {

          if (item.tipo === 'dropdown') {
            return (
              <li 
              
                key={item.id}
                className='relative'
                onMouseEnter={() => handleMouseEnter(item.id)}
                onMouseLeave={handleMouseLeave}
              >
                <button className='flex items-center gap-1 hover:text-[#6FCAF1] transition-colors duration-10'>
                  {item.texto}
                  <MdExpandMore 
                    size={13} 
                    className={` ${
                      expandedItem === item.id 
                    }`}
                  />
                </button>
                
                {/* Dropdown desplegado */}
                {expandedItem === item.id && (
                  <div className='absolute left-0 bg-white shadow-lg rounded-md mt-2 z-50 w-48 border border-gray-100'>
                    <ul className='py-2 text-sm text-gray-700'>
                      {item.subopciones?.map((opcion) => (
                        <li key={opcion.ruta}>
                          <Link
                            to={opcion.ruta}
                            className='block px-4 py-2 hover:bg-[#6FCAF1]/10 hover:text-[#6FCAF1] transition-all duration-200 hover:scale-105 hover:px-5 hover:font-medium'
                          >
                            {opcion.texto}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            )
          }

          return (
            <li key={item.id}>
              <Link 
                to={item.ruta} 
                className='hover:text-[#6FCAF1] transition-colors duration-200 flex items-center gap-2'
              >
                {item.texto}
              </Link>
            </li>
          )
        })}
      </ul>
    </>
  )
}

export default DesktopHeader