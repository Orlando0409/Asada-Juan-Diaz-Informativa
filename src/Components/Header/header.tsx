import { Link } from '@tanstack/react-router'
import Data from '../../data/Data.json'
import DesktopHeader from './DesktopHeader'
import MobileHeader from './MobileHeader'
import type { MenuItem } from '../../types/header/MenuItem'

const Header = () => {
  const { logo, navbar, inicioSesion } = Data.header

  return (
    <nav className='fixed top-0 w-full z-50 bg-white border-b border-gray-200 px-4 md:px-8 py-3 flex items-center justify-between shadow-sm'>
      {/* Logo */}
      <Link to={logo.ruta} className='flex items-center gap-2'>
        <img src={logo.src} alt='logo' className='h-12 w-auto object-contain' />
      </Link>

      {/* Header Desktop */}
      <DesktopHeader 
        menuItems={navbar.menuItems as MenuItem[]}
        inicioSesion={inicioSesion}
      />

      {/* Header Móvil */}
      <MobileHeader 
        menuItems={navbar.menuItems as MenuItem[]}
        inicioSesion={inicioSesion}
      />
    </nav>
  )
}

export default Header