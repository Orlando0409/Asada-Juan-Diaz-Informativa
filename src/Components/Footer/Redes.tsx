import { FaPhone, FaWhatsapp, FaEnvelope} from 'react-icons/fa'
import Data from '../../data/Data.json'

const Redes = () => {
    const { contacto, horarioAtencion, redesSociales } = Data.footer

  return (
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full lg:w-auto">
  {/* Contacto */}
  <div className="min-w-[220px]">
    <h4 className="font-semibold mb-2 sm:text-sm md:text-md xl:text-lg xxl:text-xl">Contacto</h4>
    <p className="flex items-center gap-2">
      <FaPhone className="text-green-500" /> {contacto.telefono}
    </p>
    <p className="flex items-center gap-2 text-sm md:text-md xl:text-lg xxl:text-xl">
      <FaEnvelope className="text-white" /> {contacto.correo}
    </p>
  </div>

  {/* Horario */}
  <div className="min-w-[220px]">
    <h4 className="font-semibold mb-2 text-sm md:text-md xl:text-lg xxl:text-xl">Horario de Atención</h4>
    <p>{horarioAtencion}</p>
  </div>

  {/* Redes Sociales */}
  <div className="min-w-[220px]">
    <h4 className="font-semibold mb-2 text-sm md:text-md xl:text-lg xxl:text-xl">Redes Sociales</h4>
    <a
      href={redesSociales.WhatsApp}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 text-green-500 hover:underline hover:text-green-400 transition-colors text-sm md:text-md xl:text-lg xxl:text-xl"
    >
      <FaWhatsapp /> WhatsApp
    </a>
  </div>
</div>

  )
}

export default Redes