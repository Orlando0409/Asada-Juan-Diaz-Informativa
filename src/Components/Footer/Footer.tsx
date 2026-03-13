import Mapa from './mapa';
import Redes from './Redes';
import { useModal } from '../../context/ModalContext';

const Footer = () => {
    const year = new Date().getFullYear();
    const { isAnyModalOpen } = useModal();

  return (
<footer className="w-full h-full flex flex-col items-center gap-4 p-4 bg-gray-800 text-white">
  <div className=" flex flex-wrap justify-center items-center gap-6 px-4 lg:px-12">
    <Redes />
    {!isAnyModalOpen && <Mapa />}
  
  </div>
  <p className="text-sm text-center mt-4">
    © 2025 - {year} ASADA Juan Díaz. Todos los derechos reservados.
  </p>
</footer>

  )
}

export default Footer