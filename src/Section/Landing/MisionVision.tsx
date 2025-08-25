import { Link } from '@tanstack/react-router'
import Data from '../../data/Data.json'

const MisionVision = () => {
  const Mision = Data.mision
  const Vision = Data.vision
  const Resumen = Data.header.hero.ResumenHistoria
  const Boton = Data.header.Leermas.texto

  return (
    <div className="bg-gray-200 text-black px-6 py-10 sm:px-10 lg:px-20 lg:py-20 flex flex-col gap-10 lg:flex-row lg:gap-8">
 
        {/* Misión */}
        <div className="flex-1 flex flex-col gap-4">
          <p className="font-bold text-lg sm:text-xl lg:text-2xl">Misión</p>
          <blockquote className="border-l-4 border-[#6FCAF1] pl-4">
            <p className="p-4 text-base sm:text-lg lg:text-xl italic">{Mision}</p>
          </blockquote>
        </div>

        {/* Visión */}
        <div className="flex-1 flex flex-col gap-4">
          <p className="font-bold text-lg sm:text-xl lg:text-2xl">Visión</p>
          <blockquote className="border-l-4 border-[#6FCAF1] pl-4">
            <p className="p-4 text-base sm:text-lg lg:text-xl italic">{Vision}</p>
          </blockquote>
        </div>

        {/* Historia */}
        <div className="flex-1 flex flex-col gap-4">
          <p className="font-bold text-lg sm:text-xl lg:text-2xl">Historia</p>
          <blockquote className="border-l-4 border-[#6FCAF1] pl-4">
            <p className="p-4 text-base sm:text-lg lg:text-xl italic">{Resumen}</p>
          </blockquote>
          <div className="flex justify-end">
            <Link
              to="/Historia"
              className="w-[150px] flex justify-center text-white bg-[#6FCAF1] hover:bg-[#57b0dd] px-4 py-2 rounded-md text-sm sm:text-base transition duration-200"
            >
              {Boton}
            </Link>
          </div>
        </div>
    </div>
  )
}

export default MisionVision
