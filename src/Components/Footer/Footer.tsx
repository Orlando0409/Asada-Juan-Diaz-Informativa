import Mapa from './mapa'
import Redes from './Redes';

const Footer = () => {
    const year = new Date().getFullYear();
  return (
<footer className="w-full flex flex-col items-center gap-4 p-4 bg-gray-800 text-white">
  <div className="w-[100vw] flex flex-wrap justify-between items-center gap-6 px-4 lg:px-12">
    <Redes />
    <Mapa />
  
  </div>
  <p className="text-sm text-center mt-4">
    © 2025 - {year} ASADA Juan Díaz. Todos los derechos reservados.
  </p>
</footer>

  )
}

export default Footer