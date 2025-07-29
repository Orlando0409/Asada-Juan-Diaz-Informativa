import React from 'react'
import Data from '../data/Data.json'
const MisionVision = () => {
 
     const Mision= Data.mision
    const vision=Data.vision
   
  return (
    <div className='bg-gray-200 text-black p-20 flex flex-col gap-5 justify-between items-center'>
   <div>
    <p>Mision</p>
    {Mision}
    </div>
   <div>
    <p>Vision</p>
    {vision}
    </div>
   

    </div>
   
  
)
}

export default MisionVision