import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

//import "swiper/swiper-bundle.css";
//import "swiper/swiper-bundle.css";
import { useProyectos } from "../../Hook/Proyecto/hookProyecto";
import BotonLeerMas from "../../Components/Proyecto/BotonLeermas";
import { useState } from "react";

function Proyectos (){
const{data: proyectos, isLoanding, isError}=useProyectos();
   const [proyectoEx, setProyectoEx] = useState<number | null>(null);

  //  Función que activa o desactiva la descripción
  const toggleDescripcion = (id: number) => {
    if (proyectoEx === id) {
      setProyectoEx(null); // si ya está abierto, lo cerramos
    } else {
      setProyectoEx(id); // si está cerrado, lo abrimos
    }
  };


if(isLoanding)return <p>Cargando proyectos...</p>
if (isError) return <p> No se lograron cargar los proyectos</p>

 

return (
<section className ="py-8 bg-gray-100
">
  
 <div className="flex items-start">   {/*contenedor*/}  
  <div className=" w-2/4 flex justify-center"> {/*columna izquierda*/}
  <div className="mt-20">
    <div>
  <h2 className="text-5xl font-bold text-blue-500 transform translate-y-6">
  Proyectos
</h2>
  </div>
  </div>

  </div>
 </div>

      {/* Línea vertical */}
   <div className="w-px bg-gray-500 h-74 -mt-30 ml-120"></div>

 <div className="w-4/9 max-w-md ml-150 -mt-73">
  <Swiper
        
    modules={[Pagination, Autoplay, Navigation]}
    spaceBetween={10}
    slidesPerView={1}
    pagination={{clickable:true}}
    navigation={false} /*habilita botones*/
    autoplay={{delay: 3000, disableOnInteraction:false}}

    >
  {proyectos?.map((proyecto) => (
              <SwiperSlide key={proyecto.id_Proyecto}>
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <img
                   alt={proyecto.Titulo}
                    src={proyecto.imagenUrl}
                   
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg text-blue-500 font-semibold mb-1">
                        {proyecto.Titulo}
                      </h3>
                     
                      
                     <BotonLeerMas
                    descripcion={proyecto.descripcion}
                    mostrarTodo={proyectoEx === proyecto.id_Proyecto}
                    onToggle={() => toggleDescripcion(proyecto.id_Proyecto)}
                  />
                  
                  </div>

                </div>
              </SwiperSlide>
            ))}
          </Swiper>

      </div>


</section>

)

}
export default Proyectos


