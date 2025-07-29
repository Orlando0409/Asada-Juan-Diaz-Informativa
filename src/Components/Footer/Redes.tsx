import { FaPhone, FaWhatsapp, FaEnvelope} from 'react-icons/fa'
import Data from '../../data/Data.json'

const Redes = () => {
    const { contacto, horarioAtencion, redesSociales } = Data.footer

  return (
  <div className="max-w-25xl mx-auto grid gap-10 sm:grid-cols-1 md:grid-cols-1 px-4 lg:grid-cols-3 px-8 lg:px-12">
        {/* Contacto */}
        <div>
          <h4 className="font-semibold text-base mb-2">Contacto</h4>
          <p className="flex items-center gap-2 text-base sm:text-sm md:text-md lg:text-lg">
            <FaPhone className="text-green-600" />
            {contacto.telefono}
          </p>
          <p className="flex items-center gap-2 mt-2 text-base sm:text-sm md:text-md lg:text-lg">
            <FaEnvelope className="text-white-600 " />
            {contacto.correo}
          </p>
        </div>

        {/* Horario */}
        <div>
          <h4 className="font-semibold text-base mb-2 text-base sm:text-sm md:text-md lg:text-lg">Horario de Atención</h4>
          <p>{horarioAtencion}</p>
        </div>

        {/* Redes Sociales */}
        <div>
          <h4 className="font-semibold text-base mb-2 text-base sm:text-sm md:text-md lg:text-lg">Redes Sociales</h4>
          <a href={redesSociales.WhatsApp} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-green-600 hover:underline text-base sm:text-sm md:text-md lg:text-lg">
            <FaWhatsapp /> WhatsApp
          </a>
        </div>
      </div>
  )
}

export default Redes