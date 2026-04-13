import { Link, useNavigate, useRouterState } from '@tanstack/react-router'
import type { DesktopHeaderProps } from '../../types/header/MenuItem'
import { useRef, useState } from 'react'

function ChevronDownIcon({ isOpen }: { isOpen: boolean }) {
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

const DesktopHeader = ({ menuItems }: DesktopHeaderProps) => {
  const [expandedItem, setExpandedItem] = useState<number | null>(null)
  const dropdownRef = useRef<number | null>(null)
  const navigate = useNavigate()
  const routerState = useRouterState()
  const currentPath = routerState.location.pathname

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
    <nav className='hidden md:block bg-white px-3 py-2 rounded-lg shadow-md'>
      {/* Menú principal */}
      <ul className='hidden md:flex gap-6 items-center font-medium text-gray-700'>
        {menuItems.map((item) => {
          // Primero verificar si es un enlace a ancla (comienza con #)
          if (item.ruta?.startsWith('#')) {
            return (
              <li key={item.id}>
                <button 
                  onClick={() => {
                    
                    if (currentPath === '/') {
                      smoothScrollToAnchor(item.ruta!)
                    } else {
                      navigate({ to: '/', hash: item.ruta!.replace('#', '') })
              
                      setTimeout(() => {
                        smoothScrollToAnchor(item.ruta!)
                      }, 120)
                    }
                  }}
                  className='hover:text-[#6FCAF1] transition-colors duration-200 flex items-center gap-2 cursor-pointer bg-transparent border-none font-medium'
                  type='button'
                >
                  {item.texto}
                </button>
              </li>
            )
          }

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
                  <ChevronDownIcon isOpen={expandedItem === item.id} />
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
                to={item.ruta || '/'} 
                className='hover:text-[#6FCAF1] transition-colors duration-200 flex items-center gap-2'
              >
                {item.texto}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export default DesktopHeader