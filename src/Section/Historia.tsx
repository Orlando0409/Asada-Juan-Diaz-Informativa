
import React from 'react'
import Data from '../data/Data.json'
const Historia = () => {
    const Historia= Data.historia
   
  return (
    <div className='bg-gray-200 text-black p-20 flex justify-between items-center'>
   {Historia}

    </div>
   
  )
}

export default Historia