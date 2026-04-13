import Data from '../../data/Data.json'

const Hero = () => {
  const { imagen, titulo1, subtitulo } = Data.header.hero

  return (
    <div className="relative w-full h-[70vh] sm:h-[80vh] lg:h-[75vh]">
      <video
        src={imagen}
        className="w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
      >
        <track kind="captions" src="/captions/es.vtt" srcLang="es" label="Español" default />
      </video>

      <div className="absolute inset-0 bg-black/40"></div>

      <div
        className="absolute inset-0 flex flex-col justify-center items-center sm:items-start text-center sm:text-left px-6 sm:px-12 lg:px-20 animate-fadeIn"
        style={{ animation: 'fadeIn 0.8s ease-out forwards' }}
      >
        <h1 className="text-white text-4xl sm:text-5xl lg:text-6xl font-extrabold drop-shadow-lg">
          {titulo1}
        </h1>
        <p className="text-white text-lg sm:text-xl lg:text-2xl mt-4 max-w-xl sm:max-w-2xl drop-shadow-md">
          {subtitulo}
        </p>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}

export default Hero
