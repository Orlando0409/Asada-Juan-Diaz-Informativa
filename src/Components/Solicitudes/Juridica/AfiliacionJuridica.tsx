import { useForm } from "@tanstack/react-form"
import { useState } from "react"
import data from "../../../data/Data.json"
import { AfiliacionJuridicaSchema } from "../../../Schemas/Solicitudes/Juridica/AfiliacionJuridica"
import { useAfiliacionJuridica } from "../../../Hook/Solicitudes/Juridica/hookAfiliacionJuridica"

type SolicitudTipo = 'afiliacion'

type Props = {
    tipo: SolicitudTipo
    onClose: () => void
}

const FormularioAfiliacionJuridico = ({ tipo, onClose }: Props) => {

    const [archivoSeleccionado, setArchivoSeleccionado] = useState<{ [key: string]: File | null }>({});
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const mutation = useAfiliacionJuridica();
    const [mostrarFormulario] = useState(true);

    const form = useForm({
        defaultValues: {
            Razon_Social: '',
            Cedula_Juridica: '',
            Correo: '',
            Numero_Telefono: '',
            Direccion_Exacta: '',
            Planos_Terreno: undefined as File | undefined,
            Escritura_Terreno: undefined as File | undefined,
        },

        onSubmit: async ({ value }) => {
            setFormErrors({}); // limpiar errores previos

            // Validar con Zod
            const validation = AfiliacionJuridicaSchema.safeParse(value);
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
                const formData = new FormData();
                Object.entries(value).forEach(([key, val]) => {
                    if (val !== undefined && val !== null && val !== "") {
                        // Solo subir archivos si son File y tienen nombre que coincida
                        if (val instanceof File) {
                            formData.append(key, val); // clave debe ser EXACTA: Planos_Terreno o Escritura_Terreno
                        } else {
                            formData.append(key, val.toString());
                        }
                    }
                });

                console.log("FormData final a enviar:", value);

                await mutation.createAfiliacionJuridica(formData);

                form.reset();
                setFormErrors({ general: "¡Solicitud enviada con éxito!" });
                setArchivoSeleccionado({});
            } catch (error) {
                console.error("Error al enviar formulario:", error);
                setFormErrors({
                    general: "Hubo un error al enviar el formulario. Intenta nuevamente."
                });
            }
        },
    });

    if (!mostrarFormulario) return null
    const campos = data.requisitosSolicitudes.juridica[tipo]
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
                <h2 className="text-center text-xl font-semibold mb-6">Formulario de Afiliación Jurídica</h2>

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
                                            accept=".png,.jpg,.jpeg,.heic,.pdf"
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
                                            className={`inline-block text-white bg-blue-600 px-3 py-1 rounded text-sm ${archivoActual ? 'cursor-not-allowed opacity-50' : 'hover:bg-blue-700 cursor-pointer'
                                                }`}
                                        >
                                            {archivoActual ? 'Archivo cargado' : 'Subir archivo'}
                                        </label>
                                        {archivoActual && (
                                            <div className="border rounded-md p-3 bg-gray-50 pb-2 mb-2 flex justify-between items-center">
                                                <span className="text-sm text-gray-700">{archivoActual.name}</span>
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
                                        {/* Mostrar errores de validación para archivos */}
                                        {formErrors[fieldName] && (
                                            <span className="text-red-500 text-sm block mt-1">
                                                {formErrors[fieldName]}
                                            </span>
                                        )}
                                    </div>
                                )
                            }

                            return (
                                <div className="mb-3">
                                    <label className="block mb-1 font-medium">
                                        {fieldProps.label}
                                        {fieldProps.required && (
                                            <span className="text-red-500"> *</span>
                                        )}
                                    </label>
                                    <input
                                        type={fieldProps.type === "email" ? "email" : "text"}
                                        value={(field.state.value as string | number) ?? ""}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        placeholder={fieldProps.label}
                                        className={`${commonClasses} ${formErrors[fieldName] ? 'border-red-500' : ''}`}
                                    />
                                    {/* Mostrar errores de validación */}
                                    {formErrors[fieldName] && (
                                        <span className="text-red-500 text-sm block mt-1">
                                            {formErrors[fieldName]}
                                        </span>
                                    )}
                                </div>
                            );
                        }}
                    </form.Field>
                ))}

                {/* Mensaje general de éxito o error */}
                {formErrors.general && (
                    <div className={`text-center mt-4 p-3 rounded ${formErrors.general.includes("éxito")
                        ? "text-green-600 bg-green-50 border border-green-200"
                        : "text-red-600 bg-red-50 border border-red-200"}`}>
                        {formErrors.general}
                    </div>
                )}

                <div className="flex justify-end items-end gap-4 mt-6">
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-[120px] bg-gray-600 text-white py-2 rounded hover:bg-gray-700 transition-colors"
                    >
                        Cerrar
                    </button>

                    <button
                        type="submit"
                        disabled={form.state.isSubmitting}
                        className={`
              w-[120px] py-2 rounded transition-colors
              ${form.state.isSubmitting
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-blue-600 hover:bg-blue-700'
                            } text-white
            `}
                    >
                        {form.state.isSubmitting ? 'Enviando...' : 'Enviar'}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default FormularioAfiliacionJuridico




