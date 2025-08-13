import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import BotonLeerMas from "../Proyecto/BotonLeermas";
import type { Proyecto } from "../../types/Proyecto/Proyecto";

interface ProyectosMobileProps {
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

function ProyectosMobile({
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
}: Readonly<ProyectosMobileProps>) {
  return (
    <section className="py-8 md:py-12 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 lg:hidden">
      <div className="container mx-auto px-4">
        
        {/* Título móvil */}
        <div className="text-center space-y-4 mb-8">
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            {titulo}
          </h2>
          <div className="h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full w-24 mx-auto"></div>
          <p className="text-gray-500 text-md leading-relaxed max-w-md mx-auto px-4">
            {descripcion}
          </p>
        </div>

        {/* Carrusel móvil */}
        <div className="w-full max-w-md mx-auto relative">
          
          {/* Contenedor slides móvil */}
          <div className="relative overflow-hidden rounded-2xl shadow-xl bg-white/5 backdrop-blur-sm p-1">
            <div 
              className="flex transition-transform duration-700 ease-out"
              style={{ transform: `translateX(-${slideActual * 100}%)` }}
            >
              {proyectos.map((proyecto) => (
                <div key={proyecto.id_Proyecto} className="w-full flex-shrink-0">
                  
                  {/* Tarjeta móvil */}
                  <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                    
                    {/* Imagen móvil */}
                    <div className="relative overflow-hidden">
                      <img
                        alt={proyecto.Titulo}
                        src={proyecto.imagenUrl}
                        className="w-full h-48 md:h-52 object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                      
                      {/* Badge estado móvil */}
                      <span className="absolute top-3 right-3 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                        {proyecto.estado?.Nombre_Estado || 'En progreso'}
                      </span>
                    </div>

                    {/* Contenido tarjeta móvil */}
                    <div className="p-4 space-y-3">
                      <h3 className="text-lg md:text-xl font-bold text-gray-900">
                        {proyecto.Titulo}
                      </h3>
                      
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        <span className="text-xs">
                          {new Date(proyecto.fecha_Actualizacion).toLocaleDateString('es-ES')}
                        </span>
                      </div>

                      <BotonLeerMas
                        descripcion={proyecto.descripcion}
                        mostrarTodo={proyectoExpandido === proyecto.id_Proyecto}
                        onToggle={() => toggleDescripcion(proyecto.id_Proyecto)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Botones navegación móvil */}
          <button
            onClick={irAAnterior}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-md transition-all duration-200 border border-gray-200"
          >
            <IoChevronBack className="w-4 h-4 text-gray-700" />
          </button>
          
          <button
            onClick={irASiguiente}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-md transition-all duration-200 border border-gray-200"
          >
            <IoChevronForward className="w-4 h-4 text-gray-700" />
          </button>

          {/* Indicadores móvil */}
          <div className="flex justify-center mt-4 space-x-2">
            {proyectos.map((proyecto, index) => (
              <button
                key={proyecto.id_Proyecto}
                onClick={() => irASlide(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === slideActual 
                    ? 'w-6 h-2 bg-gradient-to-r from-blue-500 to-indigo-500' 
                    : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>

          {/* Barra progreso móvil */}
          <div className="mt-3 w-full bg-gray-200 rounded-full h-1">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-300"
              style={{ width: `${porcentajeProgreso}%` }}
            ></div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProyectosMobile;