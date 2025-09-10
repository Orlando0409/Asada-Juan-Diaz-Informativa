import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import data from "../../../data/Data.json";
import { DesconexionJuridicaSchema } from "../../../Schemas/Solicitudes/Juridica/DesconexionMedidorJuridica";
import { useDesconexionJuridica } from "../../../Hook/Solicitudes/Juridica/hookDesconexionJuridica";

type SolicitudTipo = 'desconexion';

type Props = {
    tipo: SolicitudTipo;
    onClose: () => void;
};

const DesconexionMedidorJuridica = ({ tipo, onClose }: Props) => {
    const [archivoSeleccionado, setArchivoSeleccionado] = useState<{ [key: string]: File | null }>({});
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const mutation = useDesconexionJuridica();
    const [mostrarFormulario] = useState(true);

    const form = useForm({
        defaultValues: {
            Razon_Social: '',
            Cedula_Juridica: '',
            Direccion_Exacta: '',
            Correo: '',
            Numero_Telefono: '',
            Motivo_Solicitud: '',
            Planos_Terreno: undefined as File | undefined,
            Escritura_Terreno: undefined as File | undefined,
        },

        onSubmit: async ({ value }) => {
            setFormErrors({});

            const validation = DesconexionJuridicaSchema.safeParse(value);
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
                        if (val instanceof File) formData.append(key, val);
                        else formData.append(key, val.toString());
                    }
                });

                console.log("FormData final a enviar:", value);
                await mutation.createDesconexionJuridica(formData);

                form.reset();
                setFormErrors({ general: "¡Solicitud enviada con éxito!" });
                setArchivoSeleccionado({});
                console.log("Formulario enviado correctamente");
            } catch (error: any) {
                let errorMessage = "Error al enviar solicitud";

                if (error?.response?.status === 400) {
                    const responseData = error?.response?.data;
                    if (responseData?.message?.includes("Ya existe una solicitud activa")) {
                        errorMessage = "Ya existe una solicitud activa para esta cédula jurídica. No se pueden crear solicitudes duplicadas.";
                    } else if (responseData?.message) {
                        errorMessage = responseData.message;
                    }
                } else if (error?.response?.status === 404) {
                    errorMessage = "El servicio no está disponible. Verifica que el backend esté funcionando.";
                } else if (error?.response?.status === 500) {
                    errorMessage = "Error interno del servidor. Intenta más tarde.";
                }

                setFormErrors({
                    general: errorMessage,
                });
            }
        },
    });

    if (!mostrarFormulario) return null;

    const campos = data.requisitosSolicitudes.juridica[tipo];
    const commonClasses = 'w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300';

    // Labels para los campos jurídicos
    const fieldLabels: { [key: string]: string } = {
        Razon_Social: "Razón Social",
        Cedula_Juridica: "Cédula Jurídica",
        Direccion_Exacta: "Dirección Exacta",
        Correo: "Correo Electrónico",
        Numero_Telefono: "Número de Teléfono",
        Motivo_Solicitud: "Motivo de la Solicitud",
        Planos_Terreno: "Planos del Terreno",
        Escritura_Terreno: "Escritura del Terreno"
    };

    return (
        <div className="flex justify-center items-center min-h-screen text-gray-800 p-5 w-full">
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    form.handleSubmit();
                }}
                className="bg-white gap-2 shadow-lg pl-8 pr-8 pt-4 pb-4 rounded-lg w-full max-w-9xl overflow-y-auto"
            >
                <h2 className="text-center text-xl font-semibold mb-6">Formulario de desconexión de medidor - Jurídica</h2>

                {Object.entries(campos).map(([fieldName, fieldProps]) => (
                    <form.Field key={fieldName} name={fieldName as keyof typeof form.state.values}>
                        {(field) => {
                            // Manejo de archivos
                            if (fieldName === "Planos_Terreno" || fieldName === "Escritura_Terreno") {
                                const archivoActual = archivoSeleccionado[fieldName] ?? null;
                                return (
                                    <div className="w-full mb-2">
                                        <label className="block mb-1 font-medium">
                                            {fieldLabels[fieldName]}
                                            {fieldProps.required && <span className="text-red-500">*</span>}
                                        </label>
                                        <input
                                            type="file"
                                            accept=".png,.jpg,.jpeg,.heic"
                                            disabled={!!archivoActual}
                                            onChange={(e) => {
                                                const file = e.target.files?.[0] ?? undefined;
                                                field.handleChange(file);
                                                setArchivoSeleccionado(prev => ({ ...prev, [fieldName]: file ?? null }));
                                            }}
                                            className="hidden"
                                            id={fieldName}
                                        />
                                        <label
                                            htmlFor={fieldName}
                                            className={`inline-block text-white bg-blue-600 px-3 py-1 rounded text-sm ${archivoActual ? 'cursor-not-allowed opacity-50' : 'hover:bg-[#6FCAF1] cursor-pointer'}`}
                                        >
                                            {archivoActual ? 'Archivo cargado' : 'Subir archivo'}
                                        </label>
                                        {archivoActual && (
                                            <div className="border rounded-md p-3 bg-gray-50 pb-2 mb-2 flex justify-between items-center">
                                                <span>{archivoActual.name}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        field.handleChange(undefined);
                                                        setArchivoSeleccionado(prev => ({ ...prev, [fieldName]: null }));
                                                    }}
                                                    className="text-red-500 hover:underline text-xs"
                                                >
                                                    Eliminar
                                                </button>
                                            </div>
                                        )}
                                        {formErrors[fieldName] && (
                                            <span className="text-red-500 text-sm">{formErrors[fieldName]}</span>
                                        )}
                                    </div>
                                );
                            }

                            if (fieldName === "Motivo_Solicitud") {
                                return (
                                    <div className="mb-3">
                                        <label className="block mb-1 font-medium">
                                            {fieldLabels[fieldName]}
                                            {fieldProps.required && <span className="text-red-500">*</span>}
                                        </label>
                                        <textarea
                                            value={field.state.value as string}
                                            onBlur={field.handleBlur}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            placeholder={fieldLabels[fieldName]}
                                            className={`${commonClasses} resize-none h-24 overflow-y-scroll`}
                                            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                                        />
                                        {formErrors[fieldName] && (
                                            <span className="text-red-500 text-sm">{formErrors[fieldName]}</span>
                                        )}
                                    </div>
                                );
                            }

                            return (
                                <div className="mb-3">
                                    <label className="block mb-1 font-medium">
                                        {fieldLabels[fieldName]}
                                        {fieldProps.required && <span className="text-red-500">*</span>}
                                    </label>
                                    <input
                                        type={fieldName === "Correo" ? "email" : "text"}
                                        value={(field.state.value as string | number) ?? ""}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        placeholder={fieldLabels[fieldName]}
                                        className={commonClasses}
                                    />
                                    {formErrors[fieldName] && (
                                        <span className="text-red-500 text-sm">{formErrors[fieldName]}</span>
                                    )}
                                </div>
                            );
                        }}
                    </form.Field>
                ))}

                {/* Mensaje general de éxito */}
                {formErrors.general && (
                    <div className={`text-center mt-4 ${formErrors.general.includes("éxito") ? "text-green-600" : "text-red-500"}`}>
                        {formErrors.general}
                    </div>
                )}

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
                            disabled={form.state.isSubmitting}
                            className={`w-[120px] py-2 rounded transition ${form.state.isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-900 hover:bg-blue-800'} text-white`}
                        >
                            {form.state.isSubmitting ? 'Enviando...' : 'Enviar'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default DesconexionMedidorJuridica;