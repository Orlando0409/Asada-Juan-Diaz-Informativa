import Data from '../data/Data.json'
const Hero = () => {
const { imagen,titulo1, titulo2, subtitulo}= Data.header.hero;
  return (
   <div className='w-full h-[100vh] overflow-hidden'>
        <img alt='Historia de la ASADA de Juan Díaz'
          src={imagen}
          className='w-full h-full object-cover'
        />

<div className="absolute inset-0  flex  flex-col items-start justify-center text-center px-7">
  <h1 className="text-white text-9xl font-extrabold">{titulo1}</h1>
  <h1 className="text-white text-9xl font-extrabold">{titulo2}</h1>

  <p className="text-white text-2xl pt-8">{subtitulo} </p>
</div>

      </div>
   
  )
}

export default Hero
