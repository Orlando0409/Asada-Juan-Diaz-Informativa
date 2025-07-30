
import { Link } from '@tanstack/react-router'
import Data from '../data/Data.json'
const Historia = () => {
    const Historia= Data.historia
    const imagen=Data.imageHistoria
   
   
  return (
    <div className='bg-gray-200 text-black p-20 flex flex-col justify-between items-start'>
      <h1 className='text-3xl font-bold mb-4'>Historia de la ASADA de Juan Díaz</h1>
    <p className='p-2'>{Historia}</p>
    
      <Link to={imagen.ruta} className='flex-1 flex justify-center'>
        <img
          src={imagen.src}
          
          className='max-w-md w-full h-auto object-contain rounded-lg shadow-md'
        />
      </Link>
    </div>
   
  )
}

export default Historia