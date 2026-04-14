import Data from '../../data/Data.json'

const Servicio = () => {
  const { imagen, descripcion } = Data.DatosGenerales.servicios
  const añoFundacion = Data.DatosGenerales.añoFundacion

  return (
    <div className="relative w-full h-[50vh] sm:h-[60vh] lg:h-[70vh]">
      <video
        src={imagen}
        className="w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        preload="none"
      >
        <track kind="captions" src="/captions/es.vtt" srcLang="es" label="Español" />
      </video>

      <div className="absolute inset-0 bg-black/40"></div>

      <div
        className="absolute inset-0 flex flex-col justify-center items-center text-center px-6 animate-rise-in"
        style={{ animationDelay: '80ms' }}
      >
        <h1 className="text-white text-3xl sm:text-4xl lg:text-5xl font-extrabold drop-shadow-lg">
          Desde {añoFundacion}
        </h1>
        <p className="text-white text-lg sm:text-xl lg:text-2xl mt-4 max-w-2xl drop-shadow-md">
          {descripcion}
        </p>
      </div>
    </div>
  )
}

export default Servicio
