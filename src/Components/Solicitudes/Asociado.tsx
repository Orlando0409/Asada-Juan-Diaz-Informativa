import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import data from '../../data/Data.json'
import { AsociadoSchema } from "../../Schemas/Solicitudes/Asociado";

type SolicitudTipo = "asociado";
type Props = {
  tipo: SolicitudTipo;
  onClose: () => void;

}

const FormularioAsociado = ({ tipo, onClose }: Props) => {
  //const [archivoSeleccionado, setArchivoSeleccionado] = useState<{ [key: string]: File | null }>({});
  const [mostrarFormulario] = useState(true);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({}) // Agrega un arreglo para manejo de errores


  const form = useForm({

    defaultValues: {

      Nombre: "",
      PrimerApellido: "",
      SegundoApellido: "",
      Cedula: "",
      CorreoElectronico: "",
      NumeroTelefono: "",
      MotivoSolicitud: "",
    },

    onSubmit: async ({ value }) => {
      setFormErrors({});

      const validation = AsociadoSchema.safeParse(value);

      if (!validation.success) {
        const fieldErrors: Record<string, string> = {};
        validation.error.errors.forEach((err) => {
          const field = err.path[0] as string;
          fieldErrors[field] = err.message;
        });
        setFormErrors(fieldErrors);
        return; // No cerrar formulario si hay errores
      }

      // Si pasa validación
      try {
        console.log("Datos válidos enviados:", value);

        form.reset();

      } catch (error) {
        console.error("Error al enviar formulario:", error);
        setFormErrors({
          general:
            "Hubo un error al enviar el formulario. Por favor intenta nuevamente.",
        })
      }
    },
  });
  if (!mostrarFormulario) return null;


  const campos = data.requisitosSolicitudes[tipo];
  const commonClasses =
    "w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300";
  return (
    <div className="flex justify-center items-center min-h-screen text-gray-800  p-5 w-full">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit(e)
        }}

        className="bg-white gap-2 shadow-lg pl-8 pr-8 pt-4 pb-4 rounded-lg w-full max-w-9xl overflow-y-auto"
      >
        <h2 className="text-center text-xl font-semibold mb-6">Formulario para ser asociado</h2>

        {Object.entries(campos).map(([fieldName, fieldProps]) =>
          <form.Field key={fieldName} name={fieldName as keyof typeof form.state.values}>
            {(field) => (
              <div className="mb-3">
                <label className="block mb-1 font-medium">
                  {fieldProps.label}
                  {fieldProps.required && <span className="text-red-500">*</span>}
                </label>
                {fieldName === "MotivoSolicitud" ? (
                  <textarea
                    value={field.state.value as string}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder={fieldProps.label}
                    className={`${commonClasses} resize-none h-24 overflow-y-scroll`}
                    style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                  />
                ) : (
                  <input
                    type={fieldProps.type === "email" ? "email" : "text"}
                    value={field.state.value as string}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder={fieldProps.label}
                    className={commonClasses}
                  />


                )}

                {formErrors[fieldName] && (
                  <span className="text-red-500 text-sm mt-1 block">
                    {formErrors[fieldName]}
                  </span>
                )}



              </div>
            )

            }
          </form.Field>
        )}
        {/*probar*/}

        {formErrors.general && (
          <span className="text-red-500 text-sm mb-2 block">{formErrors.general}</span>
        )}


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
            disabled={form.state.isSubmitting}
            className={`w-[120px] py-2 rounded transition ${form.state.isSubmitting
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-900 hover:bg-blue-800"
              } text-white`}
          >
            {form.state.isSubmitting ? "Enviando..." : "Enviar"}
          </button>
        </div>
      </form>
    </div>
  );


}
export default FormularioAsociado
