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
  const [isSubmitting, setIsSubmitting] = useState(false) // Control manual del estado de envío

  const mutation = useCreateContacto()

  const requisitos = data.RequisitosContacto as unknown as RequisitosContacto
  const clave = getRequisitosKey(tipo)
  const campos = requisitos[clave]
  const commonClasses = 'w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300'
  const DynamicContactoSchema = getDynamicContactoSchema(campos);

  // Función para obtener el límite de caracteres según el tipo de campo
  const getMaxLength = (fieldName: string, fieldType: string): number => {
    if (fieldType === 'textarea') return 50
    if (fieldName === 'Correo') return 50
    if (fieldName === 'Ubicacion') return 50
    if (fieldName.includes('Nombre') || fieldName.includes('Apellido')) return 20
    return 10 // Límite por defecto
  }

  // Función para validar un campo individual en tiempo real
  const validateField = (fieldName: string, value: any) => {
    try {
      // Validar el campo específico usando safeParse en el schema completo
      const partialData = Object.entries(campos).reduce((acc, [key]) => {
        acc[key] = key === fieldName ? value : ''
        return acc
      }, {} as Record<string, any>)
      
      const validation = DynamicContactoSchema.safeParse(partialData)
      
      if (validation.success) {
        // Si pasa la validación, limpia el error de ese campo
        setFormErrors(prev => {
          const newErrors = { ...prev }
          delete newErrors[fieldName]
          return newErrors
        })
      } else {
        // Si falla la validación, establece el error para este campo
        const fieldError = validation.error.errors.find(err => err.path[0] === fieldName)
        if (fieldError) {
          setFormErrors(prev => ({
            ...prev,
            [fieldName]: fieldError.message
          }))
        }
      }
    } catch (error: any) {
      console.error('Validation error:', error)
    }
  }


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
      setIsSubmitting(true)
      setFormErrors({}) // Limpia errores previos

      // Valida con Zod al hacer submit
      const validation = DynamicContactoSchema.safeParse(value)
      if (!validation.success) {
        const fieldErrors: Record<string, string> = {}
        validation.error.errors.forEach((err) => {
          const field = err.path[0] as string
          fieldErrors[field] = err.message
        })
        setFormErrors(fieldErrors)
        setIsSubmitting(false) // Resetear el estado manualmente
        return
      }

      // Si llegamos aquí, la validación pasó
      try {
         await mutation.mutateAsync({ data: value, tipo })
         setFormKey((prev) => prev + 1) // Reinicia el formulario
         setArchivoSeleccionado(null)
         setFormErrors({}) // Limpia errores después de envío exitoso
      } catch (error: any) {
        console.error('Error al enviar formulario:', error)
      } finally {
        setIsSubmitting(false) // Siempre resetear al final
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
        className="bg-white gap-2 shadow-lg pl-8 pr-8 pt-12 pb-4 rounded-lg w-[95%] max-w-md max-h-auto overflow-y-auto"
      >
        <h2 className="text-center text-xl font-semibold mb-6">
          Escribe tu {tipo}
        </h2>

        {Object.entries(campos).map(([fieldName, fieldProps]) => (
          <form.Field key={fieldName} name={fieldName}>
            {(field) => {
              if (fieldProps.type === 'textarea') {
                const maxLength = getMaxLength(fieldName, 'textarea')
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
                      onChange={(e) => {
                        const newValue = e.target.value
                        field.handleChange(newValue)
                        validateField(fieldName, newValue)
                      }}
                      placeholder={`${fieldProps.label}`}
                      maxLength={maxLength}
                      className={`${commonClasses} h-28 resize-none`}
                    />
                    <div className="flex justify-between items-center mt-1">
                      <div>
                        {/* Mostrar errores de validación */}
                        {formErrors[fieldName] && (
                          <span className="text-red-500 text-sm">
                            {formErrors[fieldName]}
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">
                        {(field.state.value as string)?.length || 0}/{maxLength}
                      </span>
                    </div>
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
              const maxLength = getMaxLength(fieldName, fieldProps.type)
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
                    onChange={(e) => {
                      const newValue = e.target.value
                      field.handleChange(newValue)
                      validateField(fieldName, newValue)
                    }}
                    placeholder={`${fieldProps.label}`}
                    maxLength={maxLength}
                    className={commonClasses}
                  />
                  <div className="flex justify-between items-center mt-1">
                    <div>
                      {/* Mostrar errores de validación */}
                      {formErrors[fieldName] && (
                        <span className="text-red-500 text-sm">
                          {formErrors[fieldName]}
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">
                      {(field.state.value as string)?.length || 0}/{maxLength}
                    </span>
                  </div>
                </div>
              )
            }}
          </form.Field>
        ))}

        <div className="flex justify-end items-end mt-6">
          <button
            type="submit"
            disabled={isSubmitting} // Deshabilitar durante envío
            className={`
              w-[120px] py-2 rounded transition
              ${isSubmitting 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-900 hover:bg-blue-800'
              } text-white
            `}
          >
            {isSubmitting ? 'Enviando...' : 'Enviar'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default FormularioContacto