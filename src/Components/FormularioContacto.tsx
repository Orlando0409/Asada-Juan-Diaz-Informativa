import { useForm } from '@tanstack/react-form'
import data from '../data/Data.json'
import {type ContactoTipo,getRequisitosKey,type RequisitosContacto} from '../types/ContactoForms'
import { useState } from 'react'
import { useCreateContacto } from '../Hook/Contacto/ContactoForms'
import { getDynamicContactoSchema } from '../Schemas/ContactoData';


type Props = {
  tipo: ContactoTipo
}

const FormularioContacto = ({ tipo }: Props) => {
  const [formkey, setFormKey] = useState<number>(0); // Estado para forzar el reinicio del formulario
  const [archivoSeleccionado, setArchivoSeleccionado] = useState<File | null>(null)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({}) // Agrega un arreglo para manejo de errores
  const [successMessage, setSuccessMessage] = useState<string>('') // Estado para mensaje de éxito
  const mutation = useCreateContacto()

  const requisitos = data.RequisitosContacto as unknown as RequisitosContacto
  const clave = getRequisitosKey(tipo)
  const campos = requisitos[clave]
  const commonClasses = 'w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300'
  const DynamicContactoSchema = getDynamicContactoSchema(campos);


const defaultValues = Object.entries(campos).reduce((acc, [fieldName, fieldProps]) => {
  if (fieldProps.type === 'file') {
    acc[fieldName] = undefined;
  } else {
    acc[fieldName] = '';
  }
  return acc;
}, {} as Record<string, any>);



  const form = useForm({
    defaultValues,
  
    onSubmit: async ({ value }) => {
      setFormErrors({}) // Limpia errores previos
      setSuccessMessage('') // Limpia mensajes de éxito previos

      // Valida con Zod al hacer submit
      const validation = DynamicContactoSchema.safeParse(value)
      if (!validation.success) {
        const fieldErrors: Record<string, string> = {}
        validation.error.errors.forEach((err) => {
          const field = err.path[0] as string
          fieldErrors[field] = err.message
        })
        setFormErrors(fieldErrors)
        return
      }

      // Si llegamos aquí, la validación pasó
      try {
         await mutation.mutateAsync({ data: value, tipo })
         setFormKey((prev) => prev + 1) // Reinicia el formulario
         setArchivoSeleccionado(null)
         setSuccessMessage(`¡Tu ${tipo} ha sido enviado exitosamente!`)
         // Limpiar el mensaje de éxito después de 5 segundos
         setTimeout(() => setSuccessMessage(''), 5000)
      } catch (error: any) {
        console.error('Error al enviar formulario:', error)
        
        // Extraer el mensaje de error del backend si está disponible
        let errorMessage = 'Hubo un error al enviar el formulario. Por favor intenta nuevamente.'
        
        if (error?.response?.data?.message) {
          // Si el backend retorna message como string
          if (typeof error.response.data.message === 'string') {
            errorMessage = error.response.data.message
          } else if (Array.isArray(error.response.data.message)) {
            // Si el backend retorna un array de mensajes
            errorMessage = error.response.data.message.join(', ')
          }
        } else if (error?.message) {
          errorMessage = error.message
        }
        
        setFormErrors({ general: errorMessage })
      }
    },
  })

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 text-gray-800 p-7">
      <form
        key={formkey}
        onSubmit={(e) => {
          e.preventDefault() 
          form.handleSubmit()
        }}
        className="bg-white gap-2 shadow-lg pl-8 pr-8 pt-4 pb-4 rounded-lg w-[95%] max-w-md max-h-auto overflow-y-auto"
      >
        <h2 className="text-center text-xl font-semibold mb-6">
          Escribe tu {tipo}
        </h2>

        {Object.entries(campos).map(([fieldName, fieldProps]) => (
          <form.Field key={fieldName} name={fieldName}>
            {(field) => {
              if (fieldProps.type === 'textarea') {
                return (
                  <div className="mb-4">
                    <div className='flex gap-2'>
                      <label className="block mb-1 font-medium">{fieldProps.label}</label>
                      {fieldProps.required && <p className="inline text-red-500">*</p>}
                    </div>
                    <textarea
                      id={field.name}
                      value={field.state.value as string}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder={`${fieldProps.label}`}
                      className={`${commonClasses} h-28 resize-none`}
                    />
                    {/* Mostrar errores de validación */}
                    {formErrors[fieldName] && (
                      <span className="text-red-500 text-sm">
                        {formErrors[fieldName]}
                      </span>
                    )}
                  </div>
                )
              }

              if (fieldProps.type === 'file') {
                return (
                  <div className="w-full mb-4" key={field.name}>
                    <label htmlFor="adjunto" className="block mb-1 font-medium">
                      {fieldProps.label} (Opcional)
                    </label>
                    <input
                      id="adjunto"
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
                      htmlFor="adjunto"
                      className={`
                        inline-block text-white bg-blue-600 px-3 py-1 rounded text-sm
                        ${archivoSeleccionado ? 'cursor-not-allowed opacity-50' : 'hover:bg-[#6FCAF1] cursor-pointer'}
                        mb-2
                      `}
                    >
                      {archivoSeleccionado ? 'Archivo cargado' : 'Subir archivo'}
                    </label>
                    {archivoSeleccionado && (
                      <div className="border rounded-md p-3 bg-gray-50 pb-2 mb-2">
                        <div className="flex flex-wrap text-[.55rem] justify-between items-center sm:text-sm md:text-md lg:text-lg">
                          <span>{archivoSeleccionado.name}</span>
                          <button
                            type="button"
                            onClick={() => {
                              form.setFieldValue('adjunto', undefined)
                              setArchivoSeleccionado(null)
                            }}
                            className="text-red-500 hover:underline text-xs"
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )
              }

              // Input tipo texto por defecto
              return (
                <div className="mb-4">
                  <div className='flex gap-2'>
                    <label className="block mb-1 font-medium">{fieldProps.label}</label>
                    {fieldProps.required && <p className="inline text-red-500">*</p>}
                  </div>
                  <input
                    id={field.name}
                    type="text"
                    value={field.state.value as string}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder={`${fieldProps.label}`}
                    className={commonClasses}
                  />
       
                  {/* Mostrar errores de validación */}
                  {formErrors[fieldName] && (
                    <span className="text-red-500 text-sm">
                      {formErrors[fieldName]}
                    </span>
                  )}
                </div>
              )
            }}
          </form.Field>
        ))}

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

        {/* Mensaje de éxito */}
        {successMessage && (
          <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md text-center">
            {successMessage}
          </div>
        )}

        {/* Mensaje de error general */}
        {formErrors.general && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-center">
            {formErrors.general}
          </div>
        )}
      </form>
    </div>
  )
}

export default FormularioContacto