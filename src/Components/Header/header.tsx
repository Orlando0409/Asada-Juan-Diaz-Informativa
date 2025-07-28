import Navbar from './Navbar'
import Data from '../../data/Data.json'
import { Link } from '@tanstack/react-router'

const header = () => {
  return (
    <header className="flex justify-between items-center p-4 bg-blue-500 text-white z-50 md:hiden">
      <Link to={Data.header.logo.ruta} className="flex items-center">
        <img src="/Logo_ASADA_Juan_Díaz.png" alt="Logo ASADA Juan Díaz" className="h-12" />
      </Link>
      <Navbar />
      <Link to={Data.header.IncioSesion.Ruta} className='bg-white text-gray-800 px-4 py-2 rounded-md hover:bg-gray-600 hover:text-white'>{Data.header.IncioSesion.Texto}</Link>
    </header>
  )
}

export default header