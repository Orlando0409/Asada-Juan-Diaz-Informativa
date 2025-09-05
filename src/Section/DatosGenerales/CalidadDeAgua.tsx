import Data from '../../data/Data.json';
import { useCalidadAguaQuery } from '../../Hook/CalidadDeAgua/hookCalidadAgua';
const CalidadDeAgua = () => {

  const { data: archivos = [], isLoading } = useCalidadAguaQuery();

  return (

    <section className='bg-white text-gray-800 p-6 sm:p-10 md:-16 flex flex-col gap-12'>

      <div className="max-w-4xl mx-auto text-center">
        <h1 className='font-bold text-2xl sm:text-3xl md:text-4xl text-blue-900 mb-4'>Calidad de Agua</h1>
        <blockquote className='border-l-4 border-blue-400 pl-4 sm:pl-6'>
          <p className='text- base sm:text-lg md-text-xl leading-relaxed'>

            <span className='font-semibold text-blue-700'>
              Con el fin de dar transparencia y confianza a la comunidad, les brindamos estos documentos para que puedan ver la pureza del agua.
            </span>
          </p>

        </blockquote>
      </div>

      {/*grid */}
      <div className="max-w-6xl mx-auto w-full">
        <h2 className=' font-bold text-blue-900 mb-8 text-center text-xl sm:text-2xl md:text-3xl '>
          Documentos disponibles
        </h2>
        <div className='grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
          {archivos.map((archivo: any, idx: number) => (
            <div
              key={archivo.id ?? idx}
              className='bg-white rounded-3xl shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 p-5 flex flex-col items-center text-center'
            >
              {/*icono */}
              <div className='bg-blue-100 p-4 sm:p-5 rounded-full mb-4 flex items-center justify-center'>
                <img
                  src='\file_16425457.png'
                  alt=' PDF Icon'
                  className='w-10 sm:w-12 md:w-14 lg:w-16 h-auto max-w-full hover:scale-110 transition-transform duration-200'
                />
              </div>
              {/*titulos */}
              <h3 className='font-semibold text-base sm:text-lg md:text-xl text-gray-700 mb-4 line-clamp-2'>
                {archivo.Titulo}
              </h3>
              {/*boton */}
              <a
                href={archivo.Url_Archivo}
                target='_blank'
                rel='noopener noreferrer'
                className='mt-auto inline-block bg-blue-600 text-white px-4 py-2 sm:px-5 sm:py-2 rounded-2xl hover:bg-blue-700 shadow-sm hover:shadow-md transition text-sm sm:text-base'
              >
                Ver PDF
              </a>
            </div>

          ))}
        </div>


      </div>


    </section>

  )
}

export default CalidadDeAgua