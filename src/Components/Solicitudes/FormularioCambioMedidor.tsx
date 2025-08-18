import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import data from '../../data/Data.json'
import { CambioMedidorSchema } from "../../Schemas/Solicitudes/CambioMedidor";

type SolicitudTipo="cambioMedidor";
type Props={
    tipo:SolicitudTipo;
    onClose?:()=>void;

}

const FormularioCambioMedidor=({tipo,onClose}:Props)=>{
  const [mostrarFormulario] = useState(true);
   //
 const form = useForm({
   
   defaultValues:{
    Cedula:"",
    NombreCompleto:"",
    DireccionExacta:"",
    CorreoElectronico:"",
    NumeroTelefono:"",
    MotivoSolicitud:"",
   },
     validators: {
      onChange: ({ value }) => {
        const result = CambioMedidorSchema.safeParse(value);
        return result.success ? undefined : result.error.format();
      },
    },

   onSubmit: async ({value})=>{
    console.log("Datos enviados:",value);
   },
 });

 if (!mostrarFormulario) return null;
 

  const campos = data.requisitosSolicitudes[tipo];
  const commonClasses =
    "w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300";
 return (
    <div className="flex justify-center items-center min-h-screen  text-gray-800 p-7">
      <form
        onSubmit={(e) => form.handleSubmit(e)}
        className="bg-white gap-2 shadow-lg pl-8 pr-8 pt-4 pb-4 rounded-lg w-[95%] max-w-md overflow-y-auto"
      >
        <h2 className="text-center text-xl font-semibold mb-6">Formulario de Cambio de Medidor</h2>

        {Object.entries(campos).map(([fieldName, fieldProps]) => (
          <form.Field key={fieldName} name={fieldName as keyof typeof form.state.values}>
            {(field) => (
              <div className="mb-3">
                <label className="block mb-1 font-medium">
                  {fieldProps.label}
                  {fieldProps.required && <span className="text-red-500">*</span>}
                </label>
                <input
                  type={fieldProps.type === "email" ? "email" : "text"}
                  value={field.state.value as string}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder={fieldProps.label}
                  className={commonClasses}
                />
              </div>
            )}
          </form.Field>
        ))}
        <div className="flex justify-end items-end gap-4">
          <button
            type="button"
            onClick={onClose}
            className="w-[120px] bg-blue-900 text-white py-2 rounded hover:bg-blue-800 transition"
          >
            Cerrar
          </button>

          <button
            type="submit"
            className="w-[120px] bg-blue-900 text-white py-2 rounded hover:bg-blue-800 transition"
          >
            Enviar
          </button>
        </div>
      </form>
    </div>
  );


}
export default FormularioCambioMedidor