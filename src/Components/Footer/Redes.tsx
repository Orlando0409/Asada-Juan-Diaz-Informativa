import { FaPhone, FaWhatsapp, FaEnvelope } from 'react-icons/fa'
import Data from '../../data/Data.json'

const Redes = () => {
  const { contacto, horarioAtencion, redesSociales } = Data.footer

  return (
    <div
      className="max-h-[600px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 text-center sm:text-left p-4"
    >
      {/* Contacto */}
      <div className="h-full flex flex-col gap-2 justify-center items-center sm:items-start">
        <h4 className="font-semibold text-base sm:text-lg lg:text-xl">Contacto</h4>
        <p className="flex justify-start sm:justify-center items-center gap-2 text-sm sm:text-base lg:text-lg">
          <FaPhone className="text-green-500" /> {contacto.telefono}
        </p>
        <p className="flex justify-start sm:justify-center items-center gap-2 text-sm sm:text-base lg:text-lg">
          <FaEnvelope className="text-white-400" /> {contacto.correo}
        </p>
      </div>

      {/* Horario */}
      <div className="h-full flex flex-col gap-2 justify-start items-center sm:items-start">
        <h4 className="font-semibold text-base sm:text-lg lg:text-xl">
          Horario de Atención
        </h4>
        <p className="text-sm sm:text-base lg:text-lg">{horarioAtencion}</p>
      </div>

      {/* Redes Sociales */}
      <div className="h-full flex flex-col gap-2 justify-start items-center sm:items-start">
        <h4 className="font-semibold text-base sm:text-lg lg:text-xl">
          Redes Sociales
        </h4>
        <a
          href={redesSociales.WhatsApp}
          target="_blank"
          rel="noopener noreferrer"
          className="flex justify-center max-w-[120px] sm:justify-center items-center gap-2 text-green-500 hover:underline hover:text-green-400 transition-colors text-sm sm:text-base lg:text-lg"
        >
          <FaWhatsapp size={20} /> WhatsApp
        </a>
      </div>
    </div>
  )
}

export default Redes
