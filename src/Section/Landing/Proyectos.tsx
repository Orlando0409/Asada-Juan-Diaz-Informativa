import { useState, useEffect } from "react";
import ProyectosMobile from "../../Components/Proyecto/ProyectosMobile";
import ProyectosDesktop from "../../Components/Proyecto/ProyectosDesktop";
import Data from "../../data/Data.json";
import { useProyectos } from "../../Hook/Proyecto/hookProyecto";

function Proyectos() {
  const [slideActual, setSlideActual] = useState(0);
  const [estaPausado, setEstaPausado] = useState(false);
  const [proyectoExpandido, setProyectoExpandido] = useState<number | null>(null);
  const {titulo, descripcion } = Data.ProyectoSeccion;
  const { data: proyectos, isLoading } = useProyectos();

  // Auto-cambio cada 2 segundos
  useEffect(() => {
    if (estaPausado || !proyectos) return;

    const intervalo = setInterval(() => {
      setSlideActual(prevSlide =>
        prevSlide === proyectos.length - 1 ? 0 : prevSlide + 1
      );
    }, 3000);

    return () => clearInterval(intervalo);
  }, [estaPausado, proyectos]);

  // Funciones de navegación
  const irASiguiente = () => {
    if (!proyectos) return;
    setSlideActual(slideActual === proyectos.length - 1 ? 0 : slideActual + 1);
    setProyectoExpandido(null);
    setEstaPausado(false);
  };

  const irAAnterior = () => {
    if (!proyectos) return;
    setSlideActual(slideActual === 0 ? proyectos.length - 1 : slideActual - 1);
    setProyectoExpandido(null);
    setEstaPausado(false);
  };

  const irASlide = (index: number) => {
    setSlideActual(index);
    setProyectoExpandido(null);
    setEstaPausado(false);
  };

  const toggleDescripcion = (idProyecto: number) => {
    if (proyectoExpandido === idProyecto) {
      setProyectoExpandido(null);
      setEstaPausado(false);
    } else {
      setProyectoExpandido(idProyecto);
      setEstaPausado(true);
    }
  };

  // Loading
  if (isLoading) {
    return (
      <section className="py-8 md:py-16 bg-sky-50 text-center">
        <div className="container mx-auto px-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Cargando proyectos...</p>
        </div>
      </section>
    );
  }

  if (!proyectos) {
    return (
      <section className="py-8 md:py-16 bg-sky-50 text-center">
        <div className="container mx-auto px-4">
          <p className="text-gray-600 text-lg">No hay proyectos disponibles.</p>
        </div>
      </section>
    );
  }

  const porcentajeProgreso = ((slideActual + 1) / proyectos.length) * 100;

  // Props compartidas para ambos componentes
  const carruselProps = {
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
  };

  return (
    <>
      <ProyectosMobile {...carruselProps} />
      <ProyectosDesktop {...carruselProps} />
    </>
  );
}

export default Proyectos;