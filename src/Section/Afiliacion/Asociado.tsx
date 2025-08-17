
import { useState } from "react"

import data from '../../data/Data.json'

import FormularioAsociado from "../../Components/Solicitudes/Asociado"

const Asociado=()=>{
     const [mostrarFormulario, setMostrarFormulario] = useState(false)
      
     const  requisitos = data.requisitosSolicitudes.asociado;

     return (
        <section className = "min-h-screen flex items-center justify-center relative w-full">
        <img
        alt="Historia de la ASADA de Juan Díaz"
        src={"/ASADA_JUAN_D.png"}
        className="w-full h-full object-cover"
      />
        <div className="absolute inset-0 max-h-[90vh] max-w-[70vw] ml-60 mt-50 bg-white p-20 flex justify-around shadow-lg rounded-lg">

          <div className="max-w-sm flex flex-col gap-10">
            <h1 className="text-xl font-bold text-gray-800">Solicitud Para Ser asociado  </h1>
            <p className="text-gray-600"> Ser Asociado en la ASADA es formar parte de la organización comunal
              <br />
              Al ser Asociado no solo recive el servicio de agua potable, si no que tambien tien derecho a toma de decisiones.
      
             </p>
             </div>
                  <div className="max-w-md flex flex-col gap-10">
                  <h2 className = "text-lg font-bold text-gray-800">Requisistos para Cambio de Medidor</h2>
                  <ul className ="list-disc pl-6 text-gray-700 space-y-1">
                  
                    {Object.entries(requisitos).map(([key, value])=>(
                            <li key={key}>
                                  {value.label} 
                            </li>
                    ))}
                    
                </ul>
                <button
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 transition"
                onClick={()=>setMostrarFormulario(!mostrarFormulario)}
              >
                
                {mostrarFormulario ? 'Ocultar Formulario' : 'Llenar Formulario'}

                
              </button>



            {/* fondo borroso */}
            {mostrarFormulario && (
            <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50">
              {/* fondo borroso */}
              <div
                className="absolute top-0 left-0 w-full h-full bg-black/10 backdrop-blur-[2px]"
                onClick={() => setMostrarFormulario(false)}
              ></div>

              {/* Formulario centrado */}
              <div className=" rounded shadow-lg relative w-[90%] max-w-sm max-h-[550px] overflow-y-scroll [scroll-whit:none] [-ms-overflow-style:none]"
                style={{ scrollbarWidth: "none" }}>
                <FormularioAsociado tipo="asociado" onClose={()=>setMostrarFormulario(false)}/>
              </div>
            </div>
            )}
         </div>
        </div>
         
      
      </section> 
      /*primer div*/

  )   

     
}
export default Asociado