import { Link } from '@tanstack/react-router'
import Data from '../../data/Data.json'
import DesktopHeader from './DesktopHeader'
import MobileHeader from './MobileHeader'

const Header = () => {
  const { logo, navbar } = Data.header

  return (
    <nav className='fixed top-0 w-screen z-50 bg-transparent backdrop-blur-md px-4 md:px-8 py-3 flex items-center justify-between shadow-sm'>
      {/* Logo */}
      <Link to={logo.ruta} className='flex items-center gap-2 h-13 w-13'>
        <img src={logo.src} alt='logo' className='h-full w-full' />
      </Link>
      {/* Header Desktop */}
      <DesktopHeader 
        menuItems={navbar.menuItems}
      />

      {/* Header Móvil */}
      <MobileHeader 
        menuItems={navbar.menuItems}
      />
    </nav>
  )
}

export default Header