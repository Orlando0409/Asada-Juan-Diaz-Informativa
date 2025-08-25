import { useForm } from "@tanstack/react-form"
import { useState } from "react"
import data from "../../data/Data.json"
import { AfiliacionSchema } from "../../Schemas/Solicitudes/Afiliacion"
import { useAfiliaciones } from "../../Hook/Solicitudes/hookAfiliacion"

type SolicitudTipo = 'abonado'

type Props = {
  tipo: SolicitudTipo
  onClose: () => void
}

const FormularioAfiliacion = ({ tipo, onClose }: Props) => {
  //const [archivoSeleccionado, setArchivoSeleccionado] = useState<File | null>(null)
  const [archivoSeleccionado, setArchivoSeleccionado] = useState<{ [key: string]: File | null }>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const mutation = useAfiliaciones();

  const [mostrarFormulario] = useState(true);
  const form = useForm({
    defaultValues: {
      Nombre: '',
      PrimerApellido: '',
      SegundoApellido: '',
      Cedula: '',
      Edad: 0,
      DireccionExacta: '',
      NumeroTelefono: '',
      CorreoElectronico: '',
      PlanosDelTerreno: undefined as File | undefined,
      EscrituraDelTerreno: undefined as File | undefined,
    },
    onSubmit: async ({ value }) => {
      setFormErrors({}); // limpiar errores previos

      // Validar con Zod
      const validation = AfiliacionSchema.safeParse(value);
      if (!validation.success) {
        const fieldErrors: Record<string, string> = {};
        validation.error.errors.forEach((err) => {
          const field = err.path[0] as string;
          fieldErrors[field] = err.message;
        });
        setFormErrors(fieldErrors);
        return;
      }

      try {
        console.log("Datos válidos enviados:", value);
        await mutation.createAfiliacion(value);
        form.reset();
        setArchivoSeleccionado({});
      } catch (error) {
        console.error("Error al enviar formulario:", error);
        setFormErrors({
          general: "Hubo un error al enviar el formulario. Intenta nuevamente."

        })

      }
    },
  });

  if (!mostrarFormulario) return null
  const campos = data.requisitosSolicitudes[tipo]
  const commonClasses = 'w-full border border-gray-300 rounded  px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300'

  return (
    <div className="flex justify-center items-center min-h-screen text-gray-800  p-5 w-full">
      <form
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}
        className="bg-white gap-2 shadow-lg pl-8 pr-8 pt-4 pb-4 rounded-lg w-full max-w-9xl overflow-y-auto"
      >
        <h2 className="text-center text-xl font-semibold mb-6">Formulario de afiliación</h2>


        {Object.entries(campos).map(([fieldName, fieldProps]) => (
          <form.Field key={fieldName} name={fieldName as keyof typeof form.state.values}>
            {(field) => {
              if (fieldProps.type === 'file') {
                const archivoActual = archivoSeleccionado[fieldName] ?? null
                return (
                  <div className="w-full mb-2">
                    <label className="block mb-1 font-medium">{fieldProps.label}</label>
                    <input
                      type="file"
                      accept=".png,.jpg,.jpeg,.heic"
                      disabled={!!archivoActual}
                      onChange={(e) => {
                        const file = e.target.files?.[0] ?? null
                        field.handleChange(file ?? undefined)
                        setArchivoSeleccionado(prev => ({ ...prev, [fieldName]: file }))
                      }}
                      className="hidden"
                      id={fieldName}
                    />
                    <label
                      htmlFor={fieldName}
                      className={`inline-block text-white bg-blue-600 px-3 py-1 rounded text-sm ${archivoActual ? 'cursor-not-allowed opacity-50' : 'hover:bg-[#6FCAF1] cursor-pointer'
                        }`}
                    >
                      {archivoActual ? 'Archivo cargado' : 'Subir archivo'}
                    </label>
                    {archivoActual && (
                      <div className="border rounded-md p-3 bg-gray-50 pb-2 mb-2 flex justify-between items-center">
                        <span>{archivoActual.name}</span>
                        <button
                          type="button"
                          onClick={() => {
                            field.handleChange(undefined)
                            setArchivoSeleccionado(prev => ({ ...prev, [fieldName]: null }))
                          }}
                          className="text-red-500 hover:underline text-xs"
                        >
                          Eliminar
                        </button>
                      </div>
                    )}
                  </div>
                )
              }

              return (
                <div className="mb-3">
                  <label className="block mb-1 font-medium">
                    {fieldProps.label}{""}
                    {fieldProps.required && (
                      <span className="text-red-500">*

                      </span>
                    )}
                  </label>
                  <input
                    type={fieldProps.type === "email" ? "email" : "text"}
                    value={field.state.value as string}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder={fieldProps.label}
                    className={commonClasses}
                  />
                  {/* Mostrar errores de validación */}
                  {formErrors[fieldName] && (
                    <span className="text-red-500 text-sm">
                      {formErrors[fieldName]}
                    </span>
                  )}

                </div>
              );

            }}
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

          <div className="flex justify-end items-end mt-6">
            <button
              type="submit"
              disabled={form.state.isSubmitting} // Deshabilitar durante envío
              className={`
              w-[120px] py-2 rounded transition
              ${form.state.isSubmitting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-900 hover:bg-blue-800'
                } text-white
            `}
            >
              {form.state.isSubmitting ? 'Enviando...' : 'Enviar'}
            </button>
          </div>
        </div>
      </form>


    </div>
  )
}

export default FormularioAfiliacion
