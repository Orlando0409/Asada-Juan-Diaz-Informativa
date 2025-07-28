import Mapa from './mapa'
import Redes from './Redes';

const Footer = () => {
    const year = new Date().getFullYear();
  return (
    <footer className="flex flex-col items-center justify-between gap-4 p-4 bg-gray-800 text-white">
    <div className="flex items-center justify-center">
        <Redes />
        <Mapa />
    </div>

    <p>  © 2025 - {year} ASADA Juan Díaz. Todos los derechos reservados.</p>
    </footer>
  )
}

export default Footer