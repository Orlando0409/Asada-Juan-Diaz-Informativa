import { useForm } from '@tanstack/react-form'
import { motion } from 'framer-motion'
import data from '../data/Data.json'
import { type ContactoTipo, getRequisitosKey, type RequisitosContacto } from '../types/ContactoForms'
import { useMemo, useState } from 'react'
import { useCreateContacto } from '../Hook/Contacto/ContactoForms'
import { getDynamicContactoSchema, getFieldSchemas, validateSingleField } from '../Schemas/ContactoData';


type Props = {
  tipo: ContactoTipo
}

const FormularioContacto = ({ tipo }: Props) => {
  const [formkey, setFormKey] = useState<number>(0); // Estado para forzar el reinicio del formulario
  const [archivoSeleccionado, setArchivoSeleccionado] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false) // Control manual del estado de envío

  const mutation = useCreateContacto()

  const requisitos = data.RequisitosContacto as unknown as RequisitosContacto
  const clave = getRequisitosKey(tipo)
  const campos = requisitos[clave]
  const commonClasses = 'w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300'
  const DynamicContactoSchema = useMemo(() => getDynamicContactoSchema(campos), [campos]);
  const fieldSchemas = useMemo(() => getFieldSchemas(campos), [campos]);

  // Función para obtener el límite de caracteres según el tipo de campo
  const getMaxLength = (fieldName: string, fieldType: string): number => {
    if (fieldType === 'textarea') return 200
    if (fieldName === 'Correo') return 100
    if (fieldName === 'Ubicacion') return 100
    if (fieldName.includes('Nombre') || fieldName.includes('Apellido')) return 50
    return 10 // Límite por defecto
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

      // Validación final con Zod al hacer submit (red de seguridad)
      const validation = DynamicContactoSchema.safeParse(value)
      if (!validation.success) {
        setIsSubmitting(false)
        return
      }

      try {
         await mutation.mutateAsync({ data: value, tipo })
         setFormKey((prev) => prev + 1)
         setArchivoSeleccionado(null)
      } catch (error: any) {
        console.error('Error al enviar formulario:', error)
      } finally {
        setIsSubmitting(false)
      }
    },
  })

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 text-gray-800 p-7 pt-20">
      <motion.div
        className="w-[95%] max-w-md"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
      <form
        key={formkey}
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}
        className="bg-white gap-2 shadow-lg pl-8 pr-8 pt-12 pb-4 rounded-lg w-full max-h-auto overflow-y-auto"
      >
        <h2 className="text-center text-xl font-semibold mb-6">
          Escribe tu {tipo}
        </h2>

        {Object.entries(campos).map(([fieldName, fieldProps]) => (
          <form.Field
            key={fieldName}
            name={fieldName}
            validators={{
              onChange: ({ value }) => validateSingleField(fieldSchemas[fieldName], value),
              onBlur: ({ value }) => validateSingleField(fieldSchemas[fieldName], value),
            }}
          >
            {(field) => {
              const errorMsg =
                field.state.meta.isTouched && field.state.meta.errors.length > 0
                  ? String(field.state.meta.errors[0])
                  : undefined

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
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder={`${fieldProps.label}`}
                      maxLength={maxLength}
                      aria-invalid={!!errorMsg}
                      className={`${commonClasses} h-28 resize-none scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-blue-100 ${errorMsg ? 'border-red-500 focus:ring-red-300' : ''}`}
                    />
                    <div className="flex justify-between items-center mt-1">
                      <div>
                        {errorMsg && (
                          <span className="text-red-500 text-sm">{errorMsg}</span>
                        )}
                      </div>
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
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder={`${fieldProps.label}`}
                    maxLength={maxLength}
                    aria-invalid={!!errorMsg}
                    className={`${commonClasses} ${errorMsg ? 'border-red-500 focus:ring-red-300' : ''}`}
                  />
                  <div className="flex justify-between items-center mt-1">
                    <div>
                      {errorMsg && (
                        <span className="text-red-500 text-sm">{errorMsg}</span>
                      )}
                    </div>
                  </div>
                </div>
              )
            }}
          </form.Field>
        ))}

        <form.Subscribe selector={(state) => [state.canSubmit, state.isValidating]}>
          {([canSubmit, isValidating]) => {
            const disabled = isSubmitting || !canSubmit || isValidating
            return (
              <div className="flex justify-end items-end mt-6">
                <button
                  type="submit"
                  disabled={disabled}
                  className={`
                    w-[120px] py-2 rounded transition
                    ${disabled
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-blue-900 hover:bg-blue-800'
                    } text-white
                  `}
                >
                  {isSubmitting ? 'Enviando...' : 'Enviar'}
                </button>
              </div>
            )
          }}
        </form.Subscribe>
      </form>
      </motion.div>
    </div>
  )
}

export default FormularioContacto