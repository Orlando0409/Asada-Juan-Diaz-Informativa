import Data from '../../data/Data.json'

const Historia = () => {
  const historia = Data.historia
  const imagen = Data.imageHistoria

  return (
    <section className="w-screen bg-gray-200 text-black px-6 py-10 sm:px-10 lg:px-20 lg:py-10 flex flex-col lg:flex-row items-center lg:items-start gap-8">
      <div className="flex-1 flex flex-col gap-4">
        <h3 className="font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl">
          Historia de la ASADA de Juan Díaz
        </h3>
        <blockquote className="border-l-4 border-[#6FCAF1] pl-4 p-4 text-base sm:text-lg lg:text-xl italic">
          {historia}
        </blockquote>
      </div>

      {/* Imagen */}
      <div className="flex-1 justify-center items-start">
        <img
          alt="Historia de la ASADA de Juan Díaz"
          src={imagen.src}
          className="rounded-lg shadow-md object-contain  w-full  max-w-sm  sm:max-w-md md:max-w-lg lg:max-w-xl"

        />
      </div>
    </section>
  )
}

export default Historia
