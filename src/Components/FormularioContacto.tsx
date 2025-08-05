import { useForm } from '@tanstack/react-form'
import data from '../data/Data.json'
import {
  type ContactoTipo,
  getRequisitosKey,
  type RequisitosContacto,
} from '../types/ContactoForms'
import { ContactoSchema } from '../Schemas/ContactoData'
import { useState } from 'react'

type Props = {
  tipo: ContactoTipo
}

const FormularioContacto = ({ tipo }: Props) => {

  const [archivoSeleccionado, setArchivoSeleccionado] = useState<File | null>(null)

  const form = useForm({
    defaultValues: {
      nombre: '',
      primerApellido: '',
      segundoApellido: '',
      mensaje: '',
      adjunto: undefined as File | undefined,
    },
    validators: {
      onChange: ({ value }) => {
        const result = ContactoSchema.safeParse(value)
        return result.success ? undefined : result.error.format()
      },
    },
    onSubmit: async ({ value }) => {
      console.log('Datos enviados:', value)
    },
  })

  const requisitos: RequisitosContacto = data.RequisitosContacto as unknown as RequisitosContacto

  const clave = getRequisitosKey(tipo)
  const campos = requisitos[clave]
  const commonClasses = 'w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300'

  return (
    <div className="flex justify-center items-center max-h-screen bg-gray-100 text-gray-800 p-7">
      <form
        onSubmit={(e) => form.handleSubmit(e)}
        className="bg-white gap-2 shadow-lg pl-8 pr-8 pt-4 pb-4 rounded-lg w-[95%] max-w-md max-h-auto overflow-y-auto"
      >
        <h2 className="text-center text-xl font-semibold mb-6">
          Escribe tu {tipo}
        </h2>

       {Object.entries(campos).map(([fieldName, fieldProps]) => (
        <form.Field key={fieldName} name={fieldName as keyof typeof form.state.values}>
       {(field) => {

      if (fieldProps.type === 'textarea') {
        return (
          <div >
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
            {field.state.meta.errors?.[0] && (
              <span className="text-red-500 text-sm">
                {field.state.meta.errors[0]}
              </span>
            )}
          </div>
        )
      }

      if (fieldProps.type === 'file') {
        return (
          <div className="w-full mb-2" key={field.name}>
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
                <div className="flex justify-between items-center text-sm">
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
      <div >
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
        {field.state.meta.errors?.[0] && (
          <span className="text-red-500 text-sm">
            {field.state.meta.errors[0]}
          </span>
        )}
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

export default FormularioContacto
