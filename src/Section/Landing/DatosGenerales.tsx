import { FiMapPin, FiCalendar, FiHome } from 'react-icons/fi'
import Data from '../../data/Data.json'

const DatosGenerales = () => {
  const { ubicacion, nombre, añoFundacion, descripcion } = Data.DatosGenerales

  const datos = [
    { icon: FiHome, label: 'Nombre', value: nombre },
    { icon: FiMapPin, label: 'Ubicación', value: ubicacion },
    { icon: FiCalendar, label: 'Año de Fundación', value: String(añoFundacion) },
  ]

  return (
    <section className="bg-sky-50 px-6 py-12 sm:px-10 lg:px-20 lg:py-16 animate-rise-in">
      <div className="text-center mb-10 animate-rise-in" style={{ animationDelay: '40ms' }}>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-600">
          Datos Generales
        </h2>
        <div className="mx-auto mt-2 h-1 w-16 rounded-full bg-blue-600" />
      </div>

      <div className="mx-auto max-w-5xl grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {datos.map(({ icon: Icon, label, value }, index) => (
          <div
            key={label}
            className="bg-white rounded-xl border border-sky-200 shadow-md p-6 flex items-start gap-4
                       animate-rise-in transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-blue-400"
            style={{ animationDelay: `${80 + index * 50}ms` }}
          >
            <div className="h-10 w-10 shrink-0 rounded-full bg-blue-100 flex items-center justify-center">
              <Icon className="text-blue-600 h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-blue-600 mb-1">{label}</p>
              <p className="text-gray-800 font-medium text-sm sm:text-base leading-relaxed">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {descripcion && (
        <p
          className="mx-auto mt-8 max-w-3xl text-center text-gray-600 text-sm sm:text-base leading-relaxed animate-rise-in"
          style={{ animationDelay: '220ms' }}
        >
          {descripcion}
        </p>
      )}
    </section>
  )
}

export default DatosGenerales
