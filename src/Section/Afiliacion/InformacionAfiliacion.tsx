import { useState } from "react"
import data from '../../data/Data.json'
import FormularioAfiliacion from "../../Components/Solicitudes/FormularioAfiliacion"

const InformacionAfiliacion=()=>{
     const [mostrarFormulario, setMostrarFormulario]=useState(false)
      
     const  requisitos = data.requisitosSolicitudes.abonado

     return (
     <section className = "min-h-screen flex items-center justify-center relative w-full">
       <img
        alt="Historia de la ASADA de Juan Díaz"
        src={"/ASADA_JUAN_D.png"}
        className="w-full h-full object-cover"
      />
      <div className="absolute inset-0 max-h-[90vh] max-w-[70vw] ml-60 mt-50 bg-white p-20 flex justify-around shadow-lg rounded-lg">
       <div className="max-w-md flex flex-col ">

           <h1 className="text-xl font-bold text-gray-800">Información de afiliación como abonado
          </h1>
            <p className="text-gray-600">Como abonado, tendras los siguientes beneficios</p>
            <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li>Servicio de Agua</li>
            <li>Obtener Constancias de Cualquier tipo </li>
            <li>Participar en asambleas </li>
          </ul>
        </div>

            {/*derecho*/}
           <div className="max-w-md flex flex-col">

             <h2 className = "text-lg font-semibold text-gray-800 mt-4">Requisistos para Afiliación</h2>
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
               <FormularioAfiliacion tipo="abonado" onClose={()=>setMostrarFormulario(false)}/>
            </div>
            </div>
           )}
          </div>
          </div>
         
        </section> 
        /*primer div*/

     )
     

     
}
export default InformacionAfiliacion