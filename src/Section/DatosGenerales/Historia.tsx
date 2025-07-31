
import Data from '../../data/Data.json'
const Historia = () => {
    const Historia= Data.historia
    const imagen=Data.imageHistoria
   
   
  return (
    <div className='bg-gray-200 text-black p-20 flex justify-between gap-2 items-start'>
      <div className='w-[300px] sm:w-[400px] md:w-[500px] lg:w-[600px] xl:w-5xl flex flex-col gap-4 mb-6'>
        <h3 className='font-bold mb-4 sm:text-sm md:text-lg lg:text-xl xl:text-2xl'>Historia de la ASADA de Juan Díaz</h3>
             <blockquote className='border-l-4 border-[#6FCAF1] pl-4 p-2'>{Historia}</blockquote>
      </div>
    
      <div className=' sm:w-[400px] md:w-[500px] lg:w-[600px] xl:w-3xl aspect-[4/4] flex justify-center items-center'>
        <img alt='Historia de la ASADA de Juan Díaz'
          src={imagen.src}
          className='max-w-md w-full h-auto object-contain rounded-lg shadow-md'
        />
      </div>
    </div>
   
  )
}

export default Historia