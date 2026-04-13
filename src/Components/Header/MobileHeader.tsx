import { useState } from 'react'
import { Link, useNavigate, useRouterState } from '@tanstack/react-router'
import type { MenuItem } from '../../types/header/MenuItem'

function MenuIcon({ open }: { open: boolean }) {
  return open ? (
    <svg aria-hidden='true' viewBox='0 0 24 24' fill='none' className='h-5 w-5'>
      <path
        d='M6 6l12 12M18 6 6 18'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
      />
    </svg>
  ) : (
    <svg aria-hidden='true' viewBox='0 0 24 24' fill='none' className='h-5 w-5'>
      <path
        d='M4 7h16M4 12h16M4 17h16'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
      />
    </svg>
  )
}

function ChevronDownIcon({ isOpen }: Readonly<{ isOpen: boolean }>) {
    return (
    <svg
      aria-hidden='true'
      viewBox='0 0 20 20'
      fill='none'
      className={`h-3.5 w-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
    >
      <path
        d='M5 8l5 5 5-5'
        stroke='currentColor'
        strokeWidth='1.8'
        strokeLinecap='round'
        strokeLinejoin='round'
      />
    </svg>
  )
}


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

  const smoothScrollToAnchor = (anchor: string) => {
    const targetId = anchor.replace('#', '')
    const element = globalThis.window.document.getElementById(targetId)

    if (element) {
      const offset = 95
      const top = element.getBoundingClientRect().top + globalThis.window.scrollY - offset
      globalThis.window.scrollTo({ top, behavior: 'smooth' })
      return
    }

    globalThis.window.location.hash = anchor
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
        <MenuIcon open={isOpen} />
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
                          smoothScrollToAnchor(item.ruta!)
                          setIsOpen(false)
                        } else {
                          navigate({ to: '/', hash: item.ruta!.replace('#', '') })
                          setIsOpen(false)
                          
                          setTimeout(() => {
                            smoothScrollToAnchor(item.ruta!)
                          }, 120)
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
                        <ChevronDownIcon isOpen={expandedItem === item.id} />
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
