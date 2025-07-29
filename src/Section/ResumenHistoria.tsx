import React from 'react'
import Data from'../data/Data.json'
const ResumenHistoria = () => {
    const resumen= Data.header.hero.ResumenHistoria
    const Boton= Data.header.Leermas.texto
  return (
        <div className='bg-gray-200 text-black p-20 flex flex-col gap-6 justify-between items-start'>
      <div className='flex flex-col gap-4'>
        <p className='font-bold sm:text-sm md:text-md lg:text-lg'>Historia</p>
        <blockquote className='border-l-4 border-[#6FCAF1] pl-4'>
          <p className='p-4 sm:text-md md:text-lg lg:text-xl italic'>{resumen}</p>
        </blockquote>
        <a
          href="/Historia"
          className="text-white bg-[#6FCAF1] hover:bg-[#57b0dd] px-4 py-2 rounded-md text-sm sm:text-base transition duration-200"
        >
          {Boton}
        </a>
      </div>
    </div>
  );

   
  
}

export default ResumenHistoria