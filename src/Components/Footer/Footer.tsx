import { motion } from 'framer-motion'
import Mapa from './mapa';
import Redes from './Redes';
import { useModal } from '../../context/ModalContext';

const Footer = () => {
    const year = new Date().getFullYear();
    const { isAnyModalOpen } = useModal();

  return (
    <footer className="w-full flex flex-col items-center gap-6 pt-8 pb-4 bg-gray-800 text-white overflow-hidden">

      <motion.div
        className="w-full flex flex-wrap justify-center items-start gap-6 px-4 lg:px-12"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <Redes />
        {!isAnyModalOpen && (
          <motion.div
            className="w-full sm:w-auto flex-1 min-w-[280px] max-w-sm"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.6, delay: 0.15, ease: 'easeOut' }}
          >
            <Mapa />
          </motion.div>
        )}
      </motion.div>

      <motion.div
        className="w-full border-t border-white/10 pt-4"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: '-20px' }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <p className="text-xs sm:text-sm text-center text-gray-400">
          © 2025 - {year} ASADA Juan Díaz. Todos los derechos reservados.
        </p>
      </motion.div>
    </footer>
  )
}

export default Footer