import Data from'../../data/Data.json'
const DatosGenerales = () => {
    const  {ubicacion, nombre, añoFundacion }= Data.DatosGenerales
  return (
   <div className='bg-gray-200 text-black p-20 flex flex-col gap-5 justify-between items-start space-y-6'>
      <div className='flex flex-col sm:gap-3 lg:gap-5'>
       <h1 className='font-bold mb-4 sm:text-sm md:text-md lg:text-2xl'>Datos Generales</h1>
        <blockquote className='border-l-4 border-[#6FCAF1] pl-4'>
            <p className='p-4 sm:text-md md:text-lg lg:text-xl flex gap-2'><span className='font-semibold'>Nombre:</span> {nombre}</p>
            <p className='p-4 sm:text-md md:text-lg lg:text-xl flex gap-2'><span className='font-semibold'>Ubicación:</span> {ubicacion}</p>
            <p className='p-4 sm:text-md md:text-lg lg:text-xl flex gap-2'><span className='font-semibold'>Año de Fundación:</span> {añoFundacion}</p>
        </blockquote>
      </div>
 

  </div>
  )
}
export default DatosGenerales
