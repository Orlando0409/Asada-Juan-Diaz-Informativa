import { FiMapPin, FiCalendar, FiHome, FiUser } from 'react-icons/fi'
import Data from '../../data/Data.json'

const DatosGenerales = () => {
  const { ubicacion, nombre, añoFundacion, descripcion, juntaDirectiva } = Data.DatosGenerales

  const datos = [
    { icon: FiHome, label: 'Nombre', value: nombre },
    { icon: FiMapPin, label: 'Ubicación', value: ubicacion },
    { icon: FiCalendar, label: 'Año de Fundación', value: String(añoFundacion) },
  ]

  // "Cargo: Nombre" -> { cargo, nombre }
  const miembros = (juntaDirectiva ?? []).map((m) => {
    const i = m.indexOf(':')
    return i >= 0
      ? { cargo: m.slice(0, i).trim(), nombre: m.slice(i + 1).trim() }
      : { cargo: '', nombre: m.trim() }
  })

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
            <div className="size-10 shrink-0 rounded-full bg-blue-100 flex items-center justify-center">
              <Icon className="text-blue-600 size-5" />
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

      {miembros.length > 0 && (
        <div
          className="mx-auto mt-12 max-w-6xl animate-rise-in"
          style={{ animationDelay: '280ms' }}
        >
          <div className="text-center mb-8">
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-600">
              Junta Directiva
            </h3>
            <div className="mx-auto mt-2 h-1 w-14 rounded-full bg-blue-600" />
          </div>

          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {miembros.map(({ cargo, nombre }, index) => (
              <article
                key={index}
                className="group relative bg-white rounded-2xl border border-sky-200 shadow-md p-6
                           flex flex-col items-center text-center overflow-hidden
                           animate-rise-in transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:border-blue-400"
                style={{ animationDelay: `${320 + index * 60}ms` }}
              >

                {/* Avatar con icono de persona */}
                <div className="mt-2 size-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600
                                flex items-center justify-center shadow-lg ring-4 ring-blue-50
                                transition-transform duration-300 group-hover:scale-105">
                  <FiUser className="text-white size-7" />
                </div>

                {cargo && (
                  <span className="mt-4 inline-block rounded-full bg-blue-100 px-3 py-1
                                   text-[11px] font-semibold uppercase tracking-wider text-blue-700">
                    {cargo}
                  </span>
                )}
                <p className="mt-2 font-bold text-gray-800 text-sm sm:text-base leading-snug">
                  {nombre}
                </p>
              </article>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}

export default DatosGenerales
