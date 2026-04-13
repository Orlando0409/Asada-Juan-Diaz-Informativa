import Data from '../../data/Data.json'

const IconPhone = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5 text-green-500" aria-hidden="true">
    <path
      fill="currentColor"
      d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.03-.24 11.1 11.1 0 0 0 3.5.56 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C10.3 21 3 13.7 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.2.2 2.38.56 3.5a1 1 0 0 1-.24 1.03l-2.2 2.26Z"
    />
  </svg>
)

const IconEnvelope = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" aria-hidden="true">
    <path
      fill="currentColor"
      d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2Zm0 2-8 5-8-5h16Zm0 12H4V8l8 5 8-5v10Z"
    />
  </svg>
)

const IconWhatsapp = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5 text-green-500" aria-hidden="true">
    <path
      fill="currentColor"
      d="M12.04 2A10 10 0 0 0 3.5 17.2L2 22l4.96-1.45A10 10 0 1 0 12.04 2Zm0 18.25a8.2 8.2 0 0 1-4.17-1.14l-.3-.18-2.95.86.89-2.87-.2-.3a8.24 8.24 0 1 1 6.73 3.63Zm4.52-6.15c-.25-.12-1.47-.72-1.7-.8-.23-.08-.4-.12-.56.12-.16.24-.64.8-.78.96-.14.16-.29.18-.53.06-.25-.12-1.03-.38-1.96-1.2a7.33 7.33 0 0 1-1.35-1.67c-.14-.25-.02-.38.11-.5.11-.1.25-.26.37-.39.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.56-1.34-.77-1.84-.2-.47-.4-.4-.56-.4h-.48c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2s.86 2.31.98 2.47c.12.16 1.69 2.58 4.1 3.61.57.25 1.02.4 1.37.51.58.18 1.11.15 1.53.09.47-.07 1.47-.6 1.67-1.18.2-.58.2-1.08.14-1.18-.06-.1-.22-.16-.47-.28Z"
    />
  </svg>
)

const Redes = () => {
  const { contacto, horarioAtencion, redesSociales } = Data.footer

  return (
    <>
      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 text-center sm:text-left p-4 animate-fadeInUp"
        style={{ animation: 'fadeInUp 0.5s ease-out forwards' }}
      >
      {/* Contacto */}
      <div
        className="flex flex-col gap-2 justify-center items-center sm:items-start"
      >
        <h2 className="font-semibold text-base sm:text-lg lg:text-xl">Contacto</h2>
        <p className="flex justify-start sm:justify-center items-center gap-2 text-sm sm:text-base lg:text-lg">
          <IconPhone /> {contacto.telefono}
        </p>
        <p className="flex justify-start sm:justify-center items-center gap-2 text-sm sm:text-base lg:text-lg">
          <IconEnvelope /> {contacto.correo}
        </p>
      </div>

      {/* Horario */}
      <div
        className="flex flex-col gap-2 justify-start items-center sm:items-start"
      >
        <h2 className="font-semibold text-base sm:text-lg lg:text-xl">
          Horario de Atención
        </h2>
        <p className="text-sm sm:text-base lg:text-lg">{horarioAtencion}</p>
      </div>

      {/* Redes Sociales */}
      <div
        className="flex flex-col gap-2 justify-start items-center sm:items-start"
      >
        <h2 className="font-semibold text-base sm:text-lg lg:text-xl">
          Redes Sociales
        </h2>
        <a
          href={redesSociales.WhatsApp}
          target="_blank"
          rel="noopener noreferrer"
          className="flex justify-center max-w-[120px] sm:justify-center items-center gap-2 text-green-500 hover:underline hover:text-green-400 transition-colors text-sm sm:text-base lg:text-lg"
        >
          <IconWhatsapp /> WhatsApp
        </a>
      </div>
    </div>

    <style>{`
      @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `}</style>
    </>
  )
}

export default Redes
