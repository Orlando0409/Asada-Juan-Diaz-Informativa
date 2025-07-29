import Mapa from './mapa'
import Redes from './Redes';

const Footer = () => {
    const year = new Date().getFullYear();
  return (
    <footer className="w-100wv flex flex-col items-center justify-between gap-4 p-4 bg-gray-800 text-white">
    <div className=" w-90wv flex flex  items-center justify-center gap-4">
        <Redes />
        <Mapa />
    </div>

    <p className='text-base sm:text-sm md:text-md lg:text-lg'>  © 2025 - {year} ASADA Juan Díaz. Todos los derechos reservados.</p>
    </footer>
  )
}

export default Footer