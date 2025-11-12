import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import BotonLeerMas from "../Proyecto/BotonLeermas";
import type { Proyecto } from "../../types/Proyecto/Proyecto";

interface ProyectosDesktopProps {
  proyectos: Proyecto[];
  slideActual: number;
  proyectoExpandido: number | null;
  porcentajeProgreso: number;
  irAAnterior: () => void;
  irASiguiente: () => void;
  irASlide: (index: number) => void;
  toggleDescripcion: (id: number) => void;
  titulo: string;
  descripcion: string;
}

function ProyectosDesktop({
  proyectos,
  slideActual,
  proyectoExpandido,
  porcentajeProgreso,
  irAAnterior,
  irASiguiente,
  irASlide,
  toggleDescripcion,
  titulo,
  descripcion
}: Readonly<ProyectosDesktopProps>) {
  
  const getBadgeClasses = (estadoNombre: string) => {
    if (estadoNombre === 'En planeamiento') {
      return 'bg-green-100 text-green-800 border-green-200';
    }
    if (estadoNombre === 'En progreso') {
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
    if (estadoNombre === 'Terminado') {
      return 'bg-blue-100 text-blue-800 border-blue-200';
    }
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getDotColor = (estadoNombre: string) => {
    if (estadoNombre === 'En planeamiento') {
      return 'bg-green-500';
    }
    if (estadoNombre === 'En progreso') {
      return 'bg-yellow-500';
    }
    if (estadoNombre === 'Terminado') {
      return 'bg-blue-500';
    }
    return 'bg-gray-500';
  };

  return (
    <section className="hidden lg:block py-16 bg-white relative">
      
      {/* Fondo decorativo desktop */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-blue-200/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-indigo-200/20 rounded-full blur-3xl"></div>
      
      {/* Contenido principal desktop */}
      <div className="container mx-auto px-4 flex justify-center items-center min-h-[500px] gap-16">

        {/* Título izquierda */}
        <div className="text-right space-y-4">
          <h2 className="text-4xl xl:text-5xl 2xl:text-6xl font-bold text-blue-600">
            {titulo}
          </h2>
          <div className="h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full w-24 ml-auto"></div>
          <p className="text-gray-700 text-md leading-relaxed max-w-sm">
            {descripcion}
          </p>
        </div>

        {/* Línea divisoria */}
        <div className="w-px h-96 bg-gradient-to-b from-transparent via-gray-300 to-transparent"></div>

        {/* Carrusel desktop */}
        <div className="w-full max-w-lg relative group">
          
          {/* Contenedor slides desktop */}
          <div className="relative overflow-hidden rounded-2xl shadow-2xl bg-white/10 backdrop-blur-sm p-1">
            <div 
              className="flex transition-transform duration-700 ease-out"
              style={{ transform: `translateX(-${slideActual * 100}%)` }}
            >
              {proyectos.map((proyecto, index) => {
                const nombreEstado = proyecto.Estado?.Nombre_Estado ?? '';
                return (
                  <div key={proyecto.Id_Proyecto} className="w-full flex-shrink-0">
                    {/* Card   */}
                    <div className={`bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-500 ${
                      index === slideActual ? 'scale-100' : 'scale-95'
                    }`}>
                      {/* IMAGEN */}
                      <div className="relative overflow-hidden">
                        <img
                          alt={proyecto.Titulo}
                          src={proyecto.Imagen_Url}
                          className="w-full h-56 object-cover transition-transform duration-700 hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                        {/* Badge estado desktop */}
                        {nombreEstado ? (
                          <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium border ${getBadgeClasses(nombreEstado)}`}>
                            {nombreEstado}
                          </span>
                        ) : (
                          <span className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium border bg-gray-100 text-gray-800 border-gray-200">Sin estado</span>
                        )}
                      </div>
                      {/* Contenido tarjeta desktop */}
                      <div className="p-6 space-y-4">
                        <h3 className="text-xl font-bold text-blue-600 mb-2">
                          {proyecto.Titulo}
                        </h3>
                        <div className="flex items-center space-x-2 text-sm text-gray-700 mb-4">
                          <span className={`w-2 h-2 rounded-full ${getDotColor(nombreEstado)}`}></span>
                          <span className="text-gray-700">
                            Actualizado: {new Date(proyecto.Fecha_Actualizacion).toLocaleDateString('es-ES')}
                          </span>
                        </div>
                        <BotonLeerMas
                          descripcion={proyecto.Descripcion}
                          mostrarTodo={proyectoExpandido === proyecto.Id_Proyecto}
                          onToggle={() => toggleDescripcion(proyecto.Id_Proyecto)}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Botones navegación desktop - Solo mostrar si hay más de un proyecto */}
          {proyectos.length > 1 && (
            <>
              <button
                onClick={irAAnterior}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 border border-gray-200"
              >
                <IoChevronBack className="w-5 h-5 text-gray-700" />
              </button>
              
              <button
                onClick={irASiguiente}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-3 shadow-lg transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110 border border-gray-200"
              >
                <IoChevronForward className="w-5 h-5 text-gray-700" />
              </button>
            </>
          )}

          {/* Indicadores desktop - Solo mostrar si hay más de un proyecto */}
          {proyectos.length > 1 && (
            <div className="flex justify-center mt-6 space-x-3">
              {proyectos.map((proyecto, index) => (
                <button
                  key={proyecto.Id_Proyecto}
                  onClick={() => irASlide(index)}
                  className={`transition-all duration-300 rounded-full ${
                    index === slideActual 
                      ? 'w-8 h-3 bg-gradient-to-r from-blue-500 to-indigo-500 shadow-lg' 
                      : 'w-3 h-3 bg-gray-300 hover:bg-gray-400 hover:scale-110'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Barra progreso desktop */}
          <div className="mt-4 w-full bg-gray-200 rounded-full h-1 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${porcentajeProgreso}%` }}
            ></div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProyectosDesktop;