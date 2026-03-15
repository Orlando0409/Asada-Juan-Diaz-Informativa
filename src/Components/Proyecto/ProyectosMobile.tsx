import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { motion } from "framer-motion";
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
    if (estadoNombre === 'En planeamiento') return 'bg-green-500';
    if (estadoNombre === 'En progreso') return 'bg-yellow-500';
    if (estadoNombre === 'Terminado') return 'bg-blue-500';
    return 'bg-gray-500';
  };

  return (
    <section className="py-8 md:py-12 bg-white lg:hidden">
      <div className="container mx-auto px-4">
        
        {/* Título móvil */}
        <motion.div 
          className="text-center space-y-4 mb-8"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">
            {titulo}
          </h2>
          <div className="h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full w-24 mx-auto"></div>
          <p className="text-gray-700 text-md leading-relaxed max-w-md mx-auto px-4">
            {descripcion}
          </p>
        </motion.div>

        {/* Carrusel móvil */}
        <motion.div 
          className="w-full max-w-md mx-auto relative"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          
          {/* Contenedor slides móvil */}
          <div className="relative overflow-hidden rounded-2xl shadow-xl bg-white/5 backdrop-blur-sm p-1">
            <div 
              className="flex transition-transform duration-700 ease-out"
              style={{ transform: `translateX(-${slideActual * 100}%)` }}
            >
              {proyectos.map((proyecto, index) => {
                const nombreEstado = proyecto.Estado?.Nombre_Estado ?? '';
                return (
                  <div key={`${proyecto.Id_Proyecto}-${index}`} className="w-full flex-shrink-0">
                    
                    {/* Tarjeta móvil */}
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
                      
                      {/* Imagen móvil */}
                      <div className="relative overflow-hidden">
                        <img
                          alt={proyecto.Titulo}
                          src={proyecto.Imagen_Url}
                          className="w-full h-48 md:h-52 object-cover transition-transform duration-700 hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                        
                        {/* Badge estado móvil */}
                        {nombreEstado ? (
                          <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium border ${getBadgeClasses(nombreEstado)}`}>
                              {nombreEstado}
                          </span>
                        ) : (
                          <span className="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium border bg-gray-100 text-gray-800 border-gray-200">Sin estado</span>
                        )}
                      </div>

                      {/* Contenido tarjeta móvil */}
                      <div className="p-4 space-y-3">
                        <h3 className="text-lg md:text-xl font-bold text-blue-600 line-clamp-2 break-words">
                          {proyecto.Titulo}
                        </h3>
                        
                        <div className="flex items-center space-x-2 text-sm text-gray-700">
                          <span className={`w-2 h-2 rounded-full ${getDotColor(nombreEstado)}`}></span>
                          <span className="text-xs text-gray-700">
                            {new Date(proyecto.Fecha_Actualizacion).toLocaleDateString('es-ES')}
                          </span>
                        </div>

                        <BotonLeerMas
                          descripcion={proyecto.Descripcion ?? ''}
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

          {/* Botones navegación móvil - Solo mostrar si hay más de un proyecto */}
          {proyectos.length > 1 && (
            <>
              <motion.button
                onClick={irAAnterior}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-md transition-all duration-200 border border-gray-200"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <IoChevronBack className="w-4 h-4 text-gray-700" />
              </motion.button>
              
              <motion.button
                onClick={irASiguiente}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-md transition-all duration-200 border border-gray-200"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <IoChevronForward className="w-4 h-4 text-gray-700" />
              </motion.button>
            </>
          )}

          {/* Indicadores móvil - Solo mostrar si hay más de un proyecto */}
          {proyectos.length > 1 && (
            <div className="flex justify-center mt-4 space-x-2">
              {proyectos.map((proyecto, index) => (
                <motion.button
                  key={`${proyecto.Id_Proyecto}-dot-${index}`}
                  onClick={() => irASlide(index)}
                  className={`transition-all duration-300 rounded-full ${
                    index === slideActual 
                      ? 'w-6 h-2 bg-gradient-to-r from-blue-500 to-indigo-500' 
                      : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
                  }`}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                />
              ))}
            </div>
          )}

          {/* Barra progreso móvil - Solo mostrar si hay más de un proyecto */}
          {proyectos.length > 1 && (
            <div className="mt-3 w-full bg-gray-200 rounded-full h-1">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-300"
                style={{ width: `${porcentajeProgreso}%` }}
              />
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}

export default ProyectosMobile;