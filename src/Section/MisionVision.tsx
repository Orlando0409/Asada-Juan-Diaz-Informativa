import Data from '../data/Data.json'
const MisionVision = () => {
 
    const Mision= Data.mision
    const vision=Data.vision
   
  return (
  <div className='bg-gray-200 text-black p-20 flex flex-col gap-5 justify-between items-start space-y-6'>
      <div className='flex flex-col sm:gap-3 lg:gap-5'>
       <p className='font-bold sm:text-sm md:text-md lg:text-lg'>Mision</p>
        <blockquote className='border-l-4 border-[#6FCAF1] pl-4'>
            <p className='p-4 sm:text-md md:text-lg lg:text-xl italic'>{Mision}</p>
        </blockquote>
      </div>
    <div className='flex flex-col sm:gap-3 lg:gap-5'>
      <p className='font-bold sm:text-sm md:text-md lg:text-lg'>Vision</p>
      <blockquote className='border-l-4 border-[#6FCAF1] pl-4'>
          <p className='p-4 sm:text-md md:text-lg lg:text-xl italic'>{vision}</p>
      </blockquote>
    </div>

  </div>
   
  
)
}

export default MisionVision