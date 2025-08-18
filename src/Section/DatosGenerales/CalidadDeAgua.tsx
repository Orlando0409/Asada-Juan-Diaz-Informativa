import Data from '../../data/Data.json';
const CalidadDeAgua = () => {
    const descripcion = Data.DatosGenerales.descripcion;
  return (

    <section className='bg-gray-200 text-black p-20 flex flex-col gap-5 justify-between items-start space-y-6'> 

        <h1 className='font-bold mb-4 sm:text-sm md:text-md lg:text-2xl'>Calidad de Agua</h1>
        <blockquote className='border-l-4 border-[#6FCAF1] pl-4'>
            <p className='p-4 sm:text-md md:text-lg lg:text-xl flex gap-2'>{descripcion}<span className='font-semibold'></span></p>
        </blockquote>
    </section>

  )
}

export default CalidadDeAgua