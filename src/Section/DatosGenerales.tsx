import React from 'react'
import Data from'../data/Data.json'
const DatosGenerales = () => {
    const DGenerales= Data.DatosGenerales
  return (
   <div className='bg-gray-200 text-black p-20 flex flex-col gap-5 justify-between items-start space-y-6'>
      <div className='flex flex-col sm:gap-3 lg:gap-5'>
       <p className='font-bold sm:text-sm md:text-md lg:text-lg'>Datos Generles</p>
        <blockquote className='border-l-4 border-[#6FCAF1] pl-4'>
            <p className='p-4 sm:text-md md:text-lg lg:text-xl italic'>{DGenerales}</p>
        </blockquote>
      </div>
 

  </div>
  )
}
export default DatosGenerales
