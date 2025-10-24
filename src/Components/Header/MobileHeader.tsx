import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { FaBars, FaTimes, FaChevronDown } from 'react-icons/fa'
import type { MenuItem } from '../../types/header/MenuItem'


const MobileHeader = ({ menuItems }: { menuItems: MenuItem[] }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [expandedItem, setExpandedItem] = useState<number | null>(null)

  const toggleMenu = () => {
    setIsOpen((prev) => !prev)
    if (isOpen) {
      setExpandedItem(null) // Cierra submenús al cerrar menú principal
    }
  }

  const toggleExpanded = (itemId: number) => {
    setExpandedItem((prev) => (prev === itemId ? null : itemId))
  }

  return (
    <>
      {/* Botón 3 Rayitas */}
      <button 
        className='md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100'
        onClick={toggleMenu}
      >
        {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>

      {/* Menú móvil desplegado */}
      {isOpen && (
        <div className='absolute top-full left-0 w-full bg-white border-t border-gray-200 shadow-lg md:hidden z-40'>
          <div className='py-4 px-4 space-y-2'>
            {menuItems.map((item) => {
              return (
                <div key={item.id}>
                  {item.tipo === 'dropdown' ? (
                    <>
                      <button
                        className='flex items-center justify-between w-full py-2 px-3 text-gray-700 hover:bg-gray-100 rounded-md transition-colors duration-200'
                        onClick={() => toggleExpanded(item.id)}
                      >
                        <span className='flex items-center gap-2'>
                          {item.texto}
                        </span>
                        <FaChevronDown 
                          className={`transform transition-transform duration-200 ${
                            expandedItem === item.id ? 'rotate-180' : ''
                          }`}
                          size={14}
                        />
                      </button>
                      {expandedItem === item.id && (
                        <div className='pl-4 space-y-1'>
                          {item.subopciones?.map((subitem) => (
                            <Link
                              key={subitem.id}
                              to={subitem.ruta}
                              className='block py-2 px-3 text-sm text-gray-600 hover:bg-[#6FCAF1]/10 hover:text-[#6FCAF1] rounded-md transition-all duration-200 hover:pl-4'
                              onClick={() => setIsOpen(false)}
                            >
                              {subitem.texto}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      to={item.ruta}
                      className='flex items-center gap-2 py-2 px-3 text-gray-700 hover:bg-gray-100 rounded-md transition-colors duration-200'
                      onClick={() => setIsOpen(false)}
                    >
                      {item.texto}
                    </Link>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}
    </>
  )
}

export default MobileHeader
