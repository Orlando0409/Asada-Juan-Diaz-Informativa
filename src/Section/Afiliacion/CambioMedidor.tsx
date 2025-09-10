import { useState } from "react"
import data from '../../data/Data.json'
import FormularioCambioMedidor from "../../Components/Solicitudes/FormularioCambioMedidor"
import CambioMedidorJuridica from "../../Components/Solicitudes/Juridica/CambioMedidorJuridica"

const CambioMedidor = () => {
  const [mostrarFormularioFisico, setMostrarFormularioFisico] = useState(false)
  const [mostrarFormularioJuridico, setMostrarFormularioJuridico] = useState(false)

  const requisitosFisico = data.requisitosSolicitudes.cambioMedidor
  const requisitosJuridico = data.requisitosSolicitudes.juridica?.cambioMedidor

  return (
    <section className="min-h-screen w-full bg-white flex flex-col items-center py-6 sm:py-8 md:py-10 px-2 sm:px-4 md:px-6 lg:px-8">

      {/* Información general */}
      <div className="w-full max-w-xs sm:max-w-sm md:max-w-2xl lg:max-w-3xl xl:max-w-4xl bg-white shadow-lg rounded-lg p-4 sm:p-6 md:p-8 mb-8 sm:mb-10 md:mb-12">
        <div className="text-center mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-blue-600 mb-2 sm:mb-3 md:mb-4">
            Solicitud de Cambio de Medidor
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed">
            Si necesita realizar un cambio de medidor, ya sea por daño o mal funcionamiento, puede hacerlo completando el formulario.
            <br className="hidden sm:block" />
            <span className="block sm:inline"> Este proceso nos permite atender su solicitud de manera más rápida.</span>
          </p>
        </div>

        {/* Línea divisoria */}
        <hr className="border-gray-200 my-4 sm:my-5 md:my-6" />

        {/* Información adicional */}
        <div className="text-center">
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4">
            Información Importante
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3 md:gap-4 text-gray-700">
            <div className="flex items-center justify-center p-2 rounded-lg hover:bg-gray-50 transition-colors">
              <span className="text-xs sm:text-sm md:text-base">• Proceso rápido y eficiente</span>
            </div>
            <div className="flex items-center justify-center p-2 rounded-lg hover:bg-gray-50 transition-colors">
              <span className="text-xs sm:text-sm md:text-base">• Atención personalizada</span>
            </div>
            <div className="flex items-center justify-center p-2 rounded-lg hover:bg-gray-50 transition-colors">
              <span className="text-xs sm:text-sm md:text-base">• Seguimiento de solicitud</span>
            </div>
          </div>
        </div>
      </div>

      {/* Cards con requisitos */}
      <div className="flex flex-col xl:flex-row gap-4 sm:gap-6 md:gap-8 w-full max-w-xs sm:max-w-sm md:max-w-4xl lg:max-w-5xl xl:max-w-6xl px-2 sm:px-0">

        {/* Card Jurídico */}
        <div className="flex-1 bg-gray-50 shadow-lg rounded-lg p-4 sm:p-5 md:p-6 flex flex-col min-h-[320px] sm:min-h-[350px] md:min-h-[400px]">
          <h2 className="text-lg sm:text-xl md:text-xl font-semibold text-gray-800 mb-3 sm:mb-4 text-center">
            Cliente Jurídico
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 text-center italic leading-relaxed">
            Para empresas, organizaciones o entidades legales
          </p>
          <ul className="list-disc pl-4 sm:pl-5 md:pl-6 space-y-1 sm:space-y-2 text-gray-700 flex-1 overflow-auto max-h-48 sm:max-h-56 md:max-h-64">
            {requisitosJuridico && Object.entries(requisitosJuridico).map(([key, value]) => (
              <li key={key} className="text-xs sm:text-sm md:text-base leading-relaxed">{value.label}</li>
            ))}
          </ul>
          <button
            className="mt-3 sm:mt-4 bg-blue-600 text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded text-sm sm:text-base hover:bg-blue-500 transition-colors duration-200 w-full"
            onClick={() => setMostrarFormularioJuridico(true)}
          >
            Llenar Formulario Jurídico
          </button>
        </div>

        {/* Card Físico */}
        <div className="flex-1 bg-gray-50 shadow-lg rounded-lg p-4 sm:p-5 md:p-6 flex flex-col min-h-[320px] sm:min-h-[350px] md:min-h-[400px]">
          <h2 className="text-lg sm:text-xl md:text-xl font-semibold text-gray-800 mb-3 sm:mb-4 text-center">
            Cliente Físico
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 text-center italic leading-relaxed">
            Para personas individuales
          </p>
          <ul className="list-disc pl-4 sm:pl-5 md:pl-6 space-y-1 sm:space-y-2 text-gray-700 flex-1 overflow-auto max-h-48 sm:max-h-56 md:max-h-64">
            {Object.entries(requisitosFisico).map(([key, value]) => (
              <li key={key} className="text-xs sm:text-sm md:text-base leading-relaxed">{value.label}</li>
            ))}
          </ul>
          <button
            className="mt-3 sm:mt-4 bg-blue-600 text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded text-sm sm:text-base hover:bg-blue-500 transition-colors duration-200 w-full"
            onClick={() => setMostrarFormularioFisico(true)}
          >
            Llenar Formulario Físico
          </button>
        </div>

      </div>

      {/* Modal Formulario Jurídico */}
      {mostrarFormularioJuridico && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
          {/* Fondo borroso */}
          <div
            className="absolute inset-0 bg-black/10 backdrop-blur-sm"
            onClick={() => setMostrarFormularioJuridico(false)}
          ></div>
          {/* Contenedor del formulario */}
          <div className="rounded relative w-[95%] sm:w-[90%] md:w-[80%] lg:w-[70%] xl:w-[60%] max-w-md max-h-[80vh] sm:max-h-[85vh] md:max-h-[550px] overflow-y-scroll scrollbar-hide"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
            <CambioMedidorJuridica tipo="cambioMedidor" onClose={() => setMostrarFormularioJuridico(false)} />
          </div>
        </div>
      )}

      {/* Modal Formulario Físico */}
      {mostrarFormularioFisico && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4">
          {/* Fondo borroso */}
          <div
            className="absolute inset-0 bg-black/10 backdrop-blur-sm"
            onClick={() => setMostrarFormularioFisico(false)}
          ></div>
          {/* Contenedor del formulario */}
          <div className="rounded relative w-[95%] sm:w-[90%] md:w-[80%] lg:w-[70%] xl:w-[60%] max-w-md max-h-[80vh] sm:max-h-[85vh] md:max-h-[550px] overflow-y-scroll scrollbar-hide"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
            <FormularioCambioMedidor tipo="cambioMedidor" onClose={() => setMostrarFormularioFisico(false)} />
          </div>
        </div>
      )}

    </section>
  )
}
export default CambioMedidor