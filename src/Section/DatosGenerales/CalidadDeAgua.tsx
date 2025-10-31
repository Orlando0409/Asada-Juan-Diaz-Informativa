import { useCalidadAguaVisiblesQuery } from '../../Hook/CalidadDeAgua/hookCalidadAgua';
const CalidadDeAgua = () => {

  const { data: archivos = [], isLoading } = useCalidadAguaVisiblesQuery();

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    if (archivos.length === 0) {
      return (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No hay documentos disponibles en este momento.</p>
        </div>
      );
    }

      return (
        <div className='grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'>
          {archivos.map((archivo, idx: number) => (
            <div
              key={archivo.Id_Calidad_Agua ?? idx}
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
      );
    };

    return (
      <section className="container mx-auto px-4 py-8">
        {renderContent()}
      </section>
    );
}

export default CalidadDeAgua