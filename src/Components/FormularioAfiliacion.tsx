import { useForm } from "@tanstack/react-form"
import { useState } from "react"
import data from "../data/Data.json"

type SolicitudTipo = 'abonado' 

type Props = {
  tipo: SolicitudTipo
}

const FormularioAfiliacion = ({ tipo }: Props) => {
  const [archivoSeleccionado, setArchivoSeleccionado] = useState<File | null>(null)

  const form = useForm({
    defaultValues: {
      NombreCompleto: '',
      Cédula: '',
      Edad: '',
      DirecciónExacta: '',
      NúmeroTeléfono: '',
      CorreoElectrónico: '',
      PlanosDelTerreno: undefined as File | undefined,
      EscrituraDelTerreno: undefined as File | undefined,
    },
    onSubmit: async ({ value }) => {
      
      if (parseInt(value.Edad) < 18) {
        alert('Solo se permite personas mayores de edad');
        return;
      }

      console.log('Datos enviados:', value)
    },
  })

  const campos = data.requisitosSolicitudes[tipo] 
  const commonClasses = 'w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300'

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 text-gray-800 p-7">
      <form
        onSubmit={(e) => form.handleSubmit(e)}
        className="bg-white gap-2 shadow-lg pl-8 pr-8 pt-4 pb-4 rounded-lg w-[95%] max-w-md max-h-auto overflow-y-auto"
      >
        <h2 className="text-center text-xl font-semibold mb-6">Formulario de Afiliación</h2>

        {Object.entries(campos).map(([fieldName, fieldProps]) => (
          <form.Field key={fieldName} name={fieldName as keyof typeof form.state.values}>
            {(field) => {
              if (fieldProps.type === 'file') {
                return (
                  <div className="w-full mb-2">
                    <label className="block mb-1 font-medium">{fieldProps.label}</label>
                    <input
                      type="file"
                      accept=".png,.jpg,.jpeg,.heic"
                      disabled={!!archivoSeleccionado}
                      onChange={(e) => {
                        const file = e.target.files?.[0] ?? undefined
                        field.handleChange(file)
                        setArchivoSeleccionado(file ?? null)
                      }}
                      className="hidden"
                    />
                    <label
                      className={`inline-block text-white bg-blue-600 px-3 py-1 rounded text-sm ${
                        archivoSeleccionado ? 'cursor-not-allowed opacity-50' : 'hover:bg-[#6FCAF1] cursor-pointer'
                      }`}
                    >
                      {archivoSeleccionado ? 'Archivo cargado' : 'Subir archivo'}
                    </label>
                    {archivoSeleccionado && (
                      <div className="border rounded-md p-3 bg-gray-50 pb-2 mb-2 flex justify-between items-center">
                        <span>{archivoSeleccionado.name}</span>
                        <button
                          type="button"
                          onClick={() => {
                            field.handleChange(undefined)
                            setArchivoSeleccionado(null)
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

              // Input tipo número para Edad
              if (fieldName === 'Edad') {
                const valorNumerico = Number(field.state.value)
                const errorEdad = valorNumerico < 0 ? 'No se permiten números negativos' : ''

                return (
                  <div className="mb-3">
                    <label className="block mb-1 font-medium">
                      {fieldProps.label} {fieldProps.required && <span className="text-red-500">*</span>}
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={field.state.value as string}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder={fieldProps.label}
                      className={commonClasses}
                    />
                    {errorEdad && <span className="text-red-500 text-sm">{errorEdad}</span>}
                  </div>
                )
              }

            if (fieldName === 'NúmeroTeléfono') {
                 const valorNumerico = Number(field.state.value)
                const errorTelefono = valorNumerico < 0 ? 'No se permiten números negativos' : ''

             return (

                 <div className="mb-3">
                    <label className="block mb-1 font-medium">
                    {fieldProps.label} {fieldProps.required && <span className="text-red-500">*</span>}
                </label>
                 <input
                     type="number"
                     min={0}
                     value={field.state.value as string}
                     onBlur={field.handleBlur}
                     onChange={(e) => field.handleChange(e.target.value)}
                     placeholder={fieldProps.label}
                     className={commonClasses}
                 />
                   {errorTelefono && <span className="text-red-500 text-sm">{errorTelefono}</span>}
    </div>
  )
}

              // Input tipo texto por defecto
              return (
                <div className="mb-3">
                  <label className="block mb-1 font-medium">
                    {fieldProps.label} {fieldProps.required && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type={fieldProps.type === 'email' ? 'email' : 'text'}
                    value={field.state.value as string}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder={fieldProps.label}
                    className={commonClasses}
                  />
                </div>
              )
            }}
          </form.Field>
        ))}

        <div className="flex justify-end items-end">
          <button
            type="submit"
            className="w-[120px] bg-blue-900 text-white py-2 rounded hover:bg-blue-800 transition"
          >
            Enviar
          </button>
        </div>
      </form>
    </div>
  )
}

export default FormularioAfiliacion
