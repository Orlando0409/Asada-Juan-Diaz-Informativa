import { motion, type Variants } from 'framer-motion'
import { FiMapPin, FiCalendar, FiHome } from 'react-icons/fi'
import Data from '../../data/Data.json'

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

const DatosGenerales = () => {
  const { ubicacion, nombre, añoFundacion, descripcion } = Data.DatosGenerales

  const datos = [
    { icon: FiHome, label: 'Nombre', value: nombre },
    { icon: FiMapPin, label: 'Ubicación', value: ubicacion },
    { icon: FiCalendar, label: 'Año de Fundación', value: String(añoFundacion) },
  ]

  return (
    <motion.section
      className="bg-sky-50 px-6 py-12 sm:px-10 lg:px-20 lg:py-16"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-80px' }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.12 } },
      }}
    >
      <motion.div
        className="text-center mb-10"
        variants={{ hidden: { opacity: 0, y: -20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
      >
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-600">
          Datos Generales
        </h2>
        <div className="mx-auto mt-2 h-1 w-16 rounded-full bg-blue-600" />
      </motion.div>

      <div className="mx-auto max-w-5xl grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {datos.map(({ icon: Icon, label, value }) => (
          <motion.div
            key={label}
            variants={itemVariants}
            className="bg-white rounded-xl border border-sky-200 shadow-md p-6 flex items-start gap-4
                       transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-blue-400"
          >
            <div className="h-10 w-10 shrink-0 rounded-full bg-blue-100 flex items-center justify-center">
              <Icon className="text-blue-600 h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-1">{label}</p>
              <p className="text-gray-800 font-medium text-sm sm:text-base leading-relaxed">{value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {descripcion && (
        <motion.p
          className="mx-auto mt-8 max-w-3xl text-center text-gray-600 text-sm sm:text-base leading-relaxed"
          variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
        >
          {descripcion}
        </motion.p>
      )}
    </motion.section>
  )
}

export default DatosGenerales
