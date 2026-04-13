import { Link } from '@tanstack/react-router'
import { motion, type Variants } from 'framer-motion'
import Data from '../../data/Data.json'

const cardVariants: Variants = {
  hidden: { opacity: 1, y: 0 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: 'easeOut', type: 'tween' },
  },
}

const MisionVision = () => {
  const Mision = Data.mision
  const Vision = Data.vision
  const Resumen = Data.header.hero.ResumenHistoria
  const Boton = Data.header.Leermas.texto

  return (
    <motion.section
      className="bg-white text-black px-6 py-12 sm:px-10 lg:px-20 lg:py-20 overflow-hidden"
      initial={{ opacity: 1 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-80px' }}
    >
      <div className="text-center mb-10">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-600">
          Quiénes somos
        </h2>
        <div className="mx-auto mt-2 h-1 w-16 rounded-full bg-blue-600" />
      </div>

      <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
        {/* Misión */}
        <motion.article
          className="flex-1 rounded-xl border border-sky-200 bg-white shadow-md flex flex-col gap-3 p-6
                     will-change-transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-blue-400"
          variants={cardVariants}
          aria-label="Misión de la organización"
        >
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-blue-600 font-bold text-sm">M</span>
            </div>
            <p className="font-bold text-lg sm:text-xl lg:text-2xl text-blue-600">
              Misión
            </p>
          </div>
          <div className="border-l-4 border-sky-300 pl-4">
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
              {Mision}
            </p>
          </div>
        </motion.article>

        {/* Visión */}
        <motion.article
          className="flex-1 rounded-xl border border-sky-200 bg-white shadow-md flex flex-col gap-3 p-6
                     will-change-transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-blue-400"
          variants={cardVariants}
          aria-label="Visión de la organización"
        >
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-blue-600 font-bold text-sm">V</span>
            </div>
            <p className="font-bold text-lg sm:text-xl lg:text-2xl text-blue-600">
              Visión
            </p>
          </div>
          <div className="border-l-4 border-sky-300 pl-4">
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
              {Vision}
            </p>
          </div>
        </motion.article>

        {/* Historia */}
        <motion.article
          className="flex-1 rounded-xl border border-sky-200 bg-white shadow-md flex flex-col gap-3 p-6
                     will-change-transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-xl hover:border-blue-400"
          variants={cardVariants}
          aria-label="Historia de la organización"
        >
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-blue-600 font-bold text-sm">H</span>
            </div>
            <p className="font-bold text-lg sm:text-xl lg:text-2xl text-blue-600">
              Historia
            </p>
          </div>
          <div className="border-l-4 border-sky-300 pl-4">
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
              {Resumen}
            </p>
          </div>
          <div className="flex justify-end mt-2">
            <Link
              to="/Historia"
              className="flex items-center gap-2 text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300"
              aria-label="Leer más sobre la historia de la organización"
            >
              {Boton}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </motion.article>
      </div>
    </motion.section>
  )
}

export default MisionVision
