import { Link } from '@tanstack/react-router'
import Data from '../../data/Data.json'
import DesktopHeader from './DesktopHeader'
import MobileHeader from './MobileHeader'
import { mapIconsToMenuItems } from '../../utils/MapIcons'
import type { RawMenuItem } from '../../utils/MapIcons'

const Header = () => {
  const { logo, navbar } = Data.header

  // Covierte el texto de los íconos del json a componentes para que se puedan renderizar en el menú
  const parsedMenuItems = mapIconsToMenuItems(navbar.menuItems as RawMenuItem[]) 

  return (
    <nav className='fixed top-0 w-full z-50 bg-white border-b border-gray-200 px-4 md:px-8 py-3 flex items-center justify-between shadow-sm'>
      {/* Logo */}
      <Link to={logo.ruta} className='flex items-center gap-2'>
        <img src={logo.src} alt='logo' className='h-12 w-auto object-contain' />
      </Link>
      {/* Header Desktop */}
      <DesktopHeader 
        menuItems={parsedMenuItems}
      />

      {/* Header Móvil */}
      <MobileHeader 
        menuItems={parsedMenuItems}
      />
    </nav>
  )
}

export default Header