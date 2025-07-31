import { useForm } from '@tanstack/react-form'
import { BiSolidMessageAltEdit } from 'react-icons/bi'
import data from '../data/Data.json'
import {
  type ContactoTipo,
  getRequisitosKey,
  type RequisitosContacto,
} from '../types/ContactoForms'
import { ContactoSchema } from '../Schemas/ContactoData'

type Props = {
  tipo: ContactoTipo
}

const FormularioContacto = ({ tipo }: Props) => {
  const form = useForm({
    defaultValues: {
      nombre: '',
      Apellido: '',
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

  const requisitos: RequisitosContacto =
    data.RequisitosContacto as unknown as RequisitosContacto

  const clave = getRequisitosKey(tipo)
  const campos = requisitos[clave]

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 text-gray-800">
      <form
        onSubmit={(e) => form.handleSubmit(e)}
        className="bg-white shadow-lg p-8 rounded-lg w-[95%] max-w-md"
      >
        <h2 className="text-center text-xl font-semibold mb-6">
          Escribe tu {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
        </h2>

        <form.Field name="nombre">
          {(field) => (
            <div className="mb-4">
              <label className="block mb-1 font-medium">{campos.Nombre}</label>
              <input
                id={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder={campos.Nombre}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
              />
              {field.state.meta.errors?.[0] && (
                <span className="text-red-500 text-sm">
                  {field.state.meta.errors[0]}
                </span>
              )}
            </div>
          )}
        </form.Field>

        <form.Field name="Apellido">
          {(field) => (
            <div className="mb-4">
              <label className="block mb-1 font-medium">{campos.Apellido}</label>
              <input
                id={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder={campos.Apellido}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
              />
              {field.state.meta.errors?.[0] && (
                <span className="text-red-500 text-sm">
                  {field.state.meta.errors[0]}
                </span>
              )}
            </div>
          )}
        </form.Field>

        <form.Field name="mensaje">
          {(field) => (
            <div className="mb-4 relative">
              <label className="block mb-1 font-medium">{campos.texto}</label>
              <textarea
                id={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder={campos.texto}
                className="w-full border border-gray-300 rounded px-3 py-2 pr-10 h-32 resize-none focus:outline-none focus:ring focus:ring-blue-300"
              />
              <BiSolidMessageAltEdit className="absolute bottom-3 left-3 text-gray-400 text-xl" />
              {field.state.meta.errors?.[0] && (
                <span className="text-red-500 text-sm block mt-1">
                  {field.state.meta.errors[0]}
                </span>
              )}
            </div>
          )}
        </form.Field>

        <form.Field name="adjunto">
          {(field) => (
            <div className="w-full mb-6">
              <label htmlFor="adjunto" className="block mb-1 font-medium">
                Adjuntar imágen o archivo (opcional)
              </label>
                <input
                id={field.name}
                type="file"
                onChange={(e) =>
                    field.handleChange(e.target.files?.[0] ?? undefined)
                }
                className="block w-30 text-xs text-gray-500 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-blue-600 file:text-white hover:file:bg-[#6FCAF1]"
                />

            </div>
          )}
        </form.Field>

        <button
          type="submit"
          className="w-full bg-blue-900 text-white py-2 rounded hover:bg-blue-800 transition"
        >
          Enviar
        </button>
      </form>
    </div>
  )
}

export default FormularioContacto
