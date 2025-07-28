import { Link } from '@tanstack/react-router'
import Data from '../../data/Data.json'

const Navbar = () => {
  const sobreNosotros = Data.header.navbar.SobreNosotros
  const contacto = Data.header.navbar.Contacto

  return (
    <nav className="bg-white shadow px-4 py-3">
      <ul className="flex gap-6 items-center justify-start text-sm font-medium text-gray-700 relative md:flex-row flex-col">
        
        {/* Menú: Sobre Nosotros */}
        <li className="relative group">
          <button className="hover:text-gray-700">{sobreNosotros.texto}</button>
          <div className="absolute left-0 hidden group-hover:block bg-white shadow-md rounded-md mt-2 z-100 w-48">
            <ul className="py-2 text-sm text-gray-700">
              <li><Link to={sobreNosotros.Opciones.DatosGenerales} className="block px-4 py-2 hover:bg-gray-100">Datos Generales</Link></li>
              <li><Link to={sobreNosotros.Opciones.Historia} className="block px-4 py-2 hover:bg-gray-100">Historia</Link></li>
              <li><Link to={sobreNosotros.Opciones.MisionVision} className="block px-4 py-2 hover:bg-gray-100">Misión y Visión</Link></li>
              <li><Link to={sobreNosotros.Opciones.CalidadAgua} className="block px-4 py-2 hover:bg-gray-100">Calidad del Agua</Link></li>
            </ul>
          </div>
        </li>

        {/* Enlace directo */}
        <li>
          <Link to={Data.header.navbar.Solicitudes.ruta} className="hover:text-gray-700">
            {Data.header.navbar.Solicitudes.texto}
          </Link>
        </li>

        <li>
          <Link to={Data.header.navbar.Consulta.ruta} className="hover:text-gray-700">
            {Data.header.navbar.Consulta.texto}
          </Link>
        </li>

        {/* Menú: Contacto */}
        <li className="relative group">
          <button className="hover:text-gray-700">{contacto.texto}</button>
          <div className="absolute left-0 hidden group-hover:block bg-white shadow-md rounded-md mt-2 z-100000 w-56">
            <ul className="py-2 text-sm text-gray-700">
              <li><Link to={contacto.SubOpciones.Quejas} className="block px-4 py-2 hover:bg-gray-100">Quejas</Link></li>
              <li><Link to={contacto.SubOpciones.Sugerencias} className="block px-4 py-2 hover:bg-gray-100">Sugerencias</Link></li>
              <li><Link to={contacto.SubOpciones.Reportes} className="block px-4 py-2 hover:bg-gray-100">Reportes</Link></li>
              <li><Link to={contacto.SubOpciones.PreguntasFrecuentes} className="block px-4 py-2 hover:bg-gray-100">Preguntas Frecuentes</Link></li>
            </ul>
          </div>
        </li>

      </ul>
    </nav>
  )
}

export default Navbar
