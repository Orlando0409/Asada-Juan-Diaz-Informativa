import { Link } from '@tanstack/react-router'
import Data from '../../data/Data.json'
import { useState } from 'react'

const MisionVision = () => {
  const Mision = Data.mision
  const Vision = Data.vision
  const Resumen = Data.header.hero.ResumenHistoria
  const Boton = Data.header.Leermas.texto

  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  return (
    <div className="bg-white text-black px-6 py-10 sm:px-10 lg:px-20 lg:py-20 flex flex-col gap-10 lg:flex-row lg:gap-8 overflow-hidden">
 
        {/* Misión */}
        <article 
          className="flex-1 shadow-lg rounded-xl flex flex-col items-center gap-4 p-6 
                     bg-gradient-to-br from-blue-50/70 via-white/80 to-cyan-50/50 backdrop-blur-sm
                     transform transition-all duration-500 ease-out
                     hover:shadow-2xl hover:scale-105 hover:-translate-y-2
                     border border-gray-200 hover:border-blue-300
                     group relative overflow-hidden"
          onMouseEnter={() => setHoveredCard('mision')}
          onMouseLeave={() => setHoveredCard(null)}
          aria-label="Misión de la organización"
        >
          {/* Efecto de brillo animado */}
          <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-blue-100/30 to-transparent 
                          transform transition-transform duration-1000
                          ${hoveredCard === 'mision' ? 'translate-x-full' : '-translate-x-full'}`}
          />
          
          <div className="relative z-10 w-full flex flex-col items-center gap-4">
            <div className="flex items-center gap-3">
              <p className="font-bold text-lg sm:text-xl lg:text-2xl text-blue-600
                           transform transition-all duration-300 group-hover:scale-110">
                Misión
              </p>
            </div>
            <blockquote className="w-full">
              <p className="p-4 text-base sm:text-lg lg:text-xl text-gray-700 leading-relaxed
                           transform transition-all duration-300 group-hover:text-gray-900">
                {Mision}
              </p>
            </blockquote>
          </div>
        </article>

        {/* Visión */}
        <article 
          className="flex-1 shadow-lg rounded-xl flex flex-col items-center gap-4 p-6 
                     bg-gradient-to-br from-blue-50/70 via-white/80 to-cyan-50/50 backdrop-blur-sm
                     transform transition-all duration-500 ease-out
                     hover:shadow-2xl hover:scale-105 hover:-translate-y-2
                     border border-gray-200 hover:border-blue-300
                     group relative overflow-hidden"
          onMouseEnter={() => setHoveredCard('vision')}
          onMouseLeave={() => setHoveredCard(null)}
          aria-label="Visión de la organización"
        >
          {/* Efecto de brillo animado */}
          <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-blue-100/30 to-transparent 
                          transform transition-transform duration-1000
                          ${hoveredCard === 'vision' ? 'translate-x-full' : '-translate-x-full'}`}
          />
          
          <div className="relative z-10 w-full flex flex-col items-center gap-4">
            <div className="flex items-center gap-3">
              <p className="font-bold text-lg sm:text-xl lg:text-2xl text-blue-600
                           transform transition-all duration-300 group-hover:scale-110">
                Visión
              </p>
            </div>
            <blockquote className="w-full">
              <p className="p-4 text-base sm:text-lg lg:text-xl text-gray-700 leading-relaxed
                           transform transition-all duration-300 group-hover:text-gray-900">
                {Vision}
              </p>
            </blockquote>
          </div>
        </article>

        {/* Historia */}
        <article 
          className="flex-1 shadow-lg rounded-xl flex flex-col items-center gap-4 p-6 
                     bg-gradient-to-br from-blue-50/70 via-white/80 to-cyan-50/50 backdrop-blur-sm
                     transform transition-all duration-500 ease-out
                     hover:shadow-2xl hover:scale-105 hover:-translate-y-2
                     border border-gray-200 hover:border-blue-300
                     group relative overflow-hidden"
          onMouseEnter={() => setHoveredCard('historia')}
          onMouseLeave={() => setHoveredCard(null)}
          aria-label="Historia de la organización"
        >
          {/* Efecto de brillo animado */}
          <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-blue-100/30 to-transparent 
                          transform transition-transform duration-1000
                          ${hoveredCard === 'historia' ? 'translate-x-full' : '-translate-x-full'}`}
          />
          
          <div className="relative z-10 w-full flex flex-col items-center gap-4">
            <div className="flex items-center gap-3">
              <p className="font-bold text-lg sm:text-xl lg:text-2xl text-blue-600
                           transform transition-all duration-300 group-hover:scale-110">
                Historia
              </p>
            </div>
            <blockquote className="w-full">
              <p className="p-4 text-base sm:text-lg lg:text-xl text-gray-700 leading-relaxed
                           transform transition-all duration-300 group-hover:text-gray-900">
                {Resumen}
              </p>
            </blockquote>
            <div className="flex justify-end w-full">
              <Link
                to="/Historia"
                className="w-[150px] flex justify-center items-center gap-2 text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-medium
                           transform transition-all duration-300 group-hover:scale-105"
                aria-label="Leer más sobre la historia de la organización"
              >
                {Boton}
                <svg className="w-4 h-4 transform transition-transform duration-300 group-hover:translate-x-1" 
                     fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </article>
    </div>
  )
}

export default MisionVision
