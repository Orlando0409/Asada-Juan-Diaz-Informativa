
import { useState } from "react"
import data from '../../data/Data.json'
import FormularioDesconexionMedidor from "../../Components/Solicitudes/DesconexionMedidor"

const DesconexionMedidor=()=>{
     const [mostrarFormulario, setMostrarFormulario] = useState(false)
      
     const  requisitos = data.requisitosSolicitudes.desconexion;

     return (
        <section className = "min-h-screen flex items-center justify-center relative w-full">

             <img

             alt="Historia de la ASADA de Juan Díaz"
             src={"/ASADA_JUAN_D.png"}
             className="absolute inset-0 w-full h-full object-cover object-center"
             />

                <div className="bg-white absolute inset-0 max-h-[90vh] w-[90%] sm:w-[85%] lg:w-[70%] mx-auto mt-10 lg:mt-20 p-6 sm:p-10 lg:-20 flex flex-col lg:flex-row shadow-lg rounded-lg overflow-auto ">
                <div className="max-w-md w-full flex flex-col">
                     <h1 className="text-xl font-bold text-gray-800 mt-4">Solicitud de Desconexion de Medidor </h1>


                <p className="text-gray-600"> La desconexión del medidor es un trámite que pueden realizar los abonados 
                  cuando ya no necesitan el servicio de agua en una. 
                 <br />
                 A Continuación se muestran los requisitos que se deben cumplir para solicitar la desconexión del medidor 

                 </p>
                 </div>
                
                <div className="max-w-md w-full flex flex-col">
                    <h2 className = "text-lg font-semibold text-gray-800 mt-4">Requisistos Desconexión de Medidor </h2>

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

                        <FormularioDesconexionMedidor tipo="desconexion" onClose={()=>setMostrarFormulario(false)}/>
                    </div>
                </div>
                )}  
                </div>
            </div>
        </section> 
        /*primer div*/
     )
}
export default DesconexionMedidor