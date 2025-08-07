import Data from '../../data/Data.json'

const Servicio = () => {
  const { imagen, descripcion } = Data.DatosGenerales.servicios
  const añoFundacion = Data.DatosGenerales.añoFundacion

  return (
    <div className="relative w-full h-[50vh] sm:h-[60vh] lg:h-[70vh]">
   
      <img
        alt="Servicio de la ASADA de Juan Díaz"
        src={imagen}
        className="w-full h-full object-cover"
      />

   
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-6">
        <h1 className="text-white text-3xl sm:text-4xl lg:text-5xl font-extrabold">
          Desde {añoFundacion}
        </h1>
        <p className="text-white text-lg sm:text-xl lg:text-2xl mt-4 max-w-2xl">
          {descripcion}
        </p>
      </div>
    </div>
  )
}

export default Servicio
