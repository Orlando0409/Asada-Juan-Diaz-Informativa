import Mapa from './mapa';
import Redes from './Redes';
import { useModal } from '../../context/ModalContext';

const Footer = () => {
    const year = new Date().getFullYear();
    const { isAnyModalOpen } = useModal();

  return (
    <footer className="w-full flex flex-col items-center gap-6 pt-8 pb-4 bg-gray-800 text-white overflow-hidden">

      <div
        className="w-full flex flex-wrap justify-center items-start gap-6 px-4 lg:px-12"
        style={{ animation: 'fadeInUp 0.6s ease-out forwards' }}
      >
        <Redes />
        {!isAnyModalOpen && (
          <div
            className="w-full sm:w-auto flex-1 min-w-[280px] max-w-sm"
            style={{ animation: 'fadeInUp 0.6s ease-out 0.15s forwards', opacity: 0 }}
          >
            <Mapa />
          </div>
        )}
      </div>

      <div
        className="w-full border-t border-white/10 pt-4"
        style={{ animation: 'fadeIn 0.5s ease-out 0.3s forwards', opacity: 0 }}
      >
        <p className="text-xs sm:text-sm text-center text-gray-400">
          © 2025 - {year} ASADA Juan Díaz. Todos los derechos reservados.
        </p>
      </div>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </footer>
  )
}

export default Footer