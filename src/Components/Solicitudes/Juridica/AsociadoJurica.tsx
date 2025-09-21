import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { AsociadoJuridicaSchema } from "../../../Schemas/Solicitudes/Juridica/AsociadoJuridica";
import { createAsociadoJuridica } from "../../../Services/Solicitudes/Juridica/AsociadoJuricaService";

type SolicitudTipo = "juridico";

type Props = {
    tipo: SolicitudTipo;
    onClose: () => void;
};

const FormularioAsociadoJuridico = ({ tipo, onClose }: Props) => {
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});

    const form = useForm({
        defaultValues: {
            Cedula_Juridica: "",
            Razon_Social: "",
            Correo: "",
            Numero_Telefono: "",
            Motivo_Solicitud: "",
        },
        onSubmit: async ({ value }) => {
            setFormErrors({});

            const validation = AsociadoJuridicaSchema.safeParse(value);
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
                await createAsociadoJuridica(value);
                form.reset();
                setFormErrors({ general: "¡Solicitud enviada con éxito!" });
            } catch (error) {
                console.error("Error al enviar formulario:", error);
                setFormErrors({
                    general:
                        "Hubo un error al enviar el formulario. Por favor intenta nuevamente.",
                });
            }
        },
    });

    const commonClasses =
        "w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300";

    return (
        <div className="flex justify-center items-center min-h-screen p-5 w-full text-gray-800">
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    form.handleSubmit(e);
                }}
                className="bg-white gap-2 shadow-lg p-6 rounded-lg w-full max-w-md overflow-y-auto"
            >
                <h2 className="text-center text-xl font-semibold mb-6">
                    Formulario para Cliente Jurídico
                </h2>

                {Object.keys(form.state.values).map((fieldName) => (
                    <form.Field
                        key={fieldName}
                        name={fieldName as keyof typeof form.state.values}
                    >
                        {(field) => (
                            <div className="mb-3">
                                <label className="block mb-1 font-medium">
                                    {fieldName.replace(/_/g, " ")}
                                    <span className="text-red-500">*</span>
                                </label>
                                {(fieldName === "Motivo_Solicitud" ||
                                    fieldName === "Direccion_Exacta") ? (
                                    <textarea
                                        value={field.state.value as string}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        placeholder={fieldName.replace(/_/g, " ")}
                                        className={`${commonClasses} resize-none h-24`}
                                    />
                                ) : (
                                    <input
                                        type={
                                            fieldName === "Correo"
                                                ? "email"
                                                : fieldName === "Numero_Telefono"
                                                    ? "tel"
                                                    : "text"
                                        }
                                        value={field.state.value as string}
                                        onBlur={field.handleBlur}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        placeholder={fieldName.replace(/_/g, " ")}
                                        className={commonClasses}
                                    />
                                )}
                                {formErrors[fieldName] && (
                                    <span className="text-red-500 text-sm mt-1 block">
                                        {formErrors[fieldName]}
                                    </span>
                                )}
                            </div>
                        )}
                    </form.Field>
                ))}

                {formErrors.general && (
                    <div
                        className={`text-center mt-4 ${formErrors.general.includes("éxito")
                            ? "text-green-600"
                            : "text-red-500"
                            }`}
                    >
                        {formErrors.general}
                    </div>
                )}

                <div className="flex justify-end gap-4 mt-4">
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-[120px] bg-gray-500 text-white py-2 rounded hover:bg-gray-400 transition"
                    >
                        Cerrar
                    </button>
                    <button
                        type="submit"
                        disabled={form.state.isSubmitting}
                        className={`w-[120px] py-2 rounded transition ${form.state.isSubmitting
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-500"
                            } text-white`}
                    >
                        {form.state.isSubmitting ? "Enviando..." : "Enviar"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default FormularioAsociadoJuridico;
