import { motion } from 'framer-motion'
import { FaPhone, FaWhatsapp, FaEnvelope } from 'react-icons/fa'
import Data from '../../data/Data.json'

const colVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: 'easeOut' as const },
  }),
}

const Redes = () => {
  const { contacto, horarioAtencion, redesSociales } = Data.footer

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 text-center sm:text-left p-4"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-40px' }}
    >
      {/* Contacto */}
      <motion.div
        custom={0}
        variants={colVariants}
        className="flex flex-col gap-2 justify-center items-center sm:items-start"
      >
        <h3 className="font-semibold text-base sm:text-lg lg:text-xl">Contacto</h3>
        <p className="flex justify-start sm:justify-center items-center gap-2 text-sm sm:text-base lg:text-lg">
          <FaPhone className="text-green-500" /> {contacto.telefono}
        </p>
        <p className="flex justify-start sm:justify-center items-center gap-2 text-sm sm:text-base lg:text-lg">
          <FaEnvelope className="text-white-400" /> {contacto.correo}
        </p>
      </motion.div>

      {/* Horario */}
      <motion.div
        custom={1}
        variants={colVariants}
        className="flex flex-col gap-2 justify-start items-center sm:items-start"
      >
        <h3 className="font-semibold text-base sm:text-lg lg:text-xl">
          Horario de Atención
        </h3>
        <p className="text-sm sm:text-base lg:text-lg">{horarioAtencion}</p>
      </motion.div>

      {/* Redes Sociales */}
      <motion.div
        custom={2}
        variants={colVariants}
        className="flex flex-col gap-2 justify-start items-center sm:items-start"
      >
        <h3 className="font-semibold text-base sm:text-lg lg:text-xl">
          Redes Sociales
        </h3>
        <a
          href={redesSociales.WhatsApp}
          target="_blank"
          rel="noopener noreferrer"
          className="flex justify-center max-w-[120px] sm:justify-center items-center gap-2 text-green-500 hover:underline hover:text-green-400 transition-colors text-sm sm:text-base lg:text-lg"
        >
          <FaWhatsapp size={20} /> WhatsApp
        </a>
      </motion.div>
    </motion.div>
  )
}

export default Redes
