import { useState } from 'react'
import { Link, useNavigate, useRouterState } from '@tanstack/react-router'
import { FaBars, FaTimes, FaChevronDown } from 'react-icons/fa'
import type { MenuItem } from '../../types/header/MenuItem'


const MobileHeader = ({ menuItems }: { menuItems: MenuItem[] }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [expandedItem, setExpandedItem] = useState<number | null>(null)
  const navigate = useNavigate()
  const routerState = useRouterState()
  const currentPath = routerState.location.pathname

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
        aria-label={isOpen ? 'Cerrar menu de navegacion' : 'Abrir menu de navegacion'}
        aria-expanded={isOpen}
        aria-controls='mobile-navigation-menu'
      >
        {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>

      {/* Menú móvil desplegado */}
      {isOpen && (
        <div id='mobile-navigation-menu' className='absolute top-full left-0 w-full bg-white border-t border-gray-200 shadow-lg md:hidden z-40'>
          <div className='py-4 px-4 space-y-2'>
            {menuItems.map((item) => {
              // Primero verificar si es un ancla
              if (item.ruta?.startsWith('#')) {
                return (
                  <div key={item.id}>
                    <button
                      onClick={() => {
                     
                        if (currentPath === '/') {
                       
                          const element = document.querySelector(item.ruta!)
                          if (element) {
                            element.scrollIntoView({ behavior: 'smooth', block: 'start' })
                          }
                          setIsOpen(false)
                        } else {
                          navigate({ to: '/' })
                          setIsOpen(false)
                          
                          setTimeout(() => {
                            const element = document.querySelector(item.ruta!)
                            if (element) {
                              element.scrollIntoView({ behavior: 'smooth', block: 'start' })
                            }
                          }, 300)
                        }
                      }}
                      className='flex items-center gap-2 py-2 px-3 text-gray-700 hover:bg-gray-100 rounded-md transition-colors duration-200 cursor-pointer w-full text-left bg-transparent border-none'
                    >
                      {item.texto}
                    </button>
                  </div>
                )
              }

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
                      to={item.ruta || '/'}
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
