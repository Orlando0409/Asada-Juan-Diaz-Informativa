
import Data from '../data/Data.json'
const Historia = () => {
    const Historia= Data.historia
   
  return (
    <div className='bg-gray-200 text-black p-20 flex flex-col justify-between items-start'>
      <h1 className='text-3xl font-bold mb-4'>Historia de la ASADA de Juan Díaz</h1>
    <p className='p-2'>{Historia}</p>

    </div>
   
  )
}

export default Historia