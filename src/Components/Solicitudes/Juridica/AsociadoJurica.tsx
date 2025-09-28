import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { AsociadoJuridicaSchema } from "../../../Schemas/Solicitudes/Juridica/AsociadoJuridica";
import { createAsociadoJuridica } from "../../../Services/Solicitudes/Juridica/AsociadoJuricaService";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

type SolicitudTipo = "juridico";

type Props = {
    tipo: SolicitudTipo;
    onClose: () => void;
};

const FormularioAsociadoJuridico = ({ tipo, onClose }: Props) => {
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    // Validación en tiempo real usando el schema
    const validateField = (fieldName: string, value: any, allValues?: any) => {
        try {
            // Crea un objeto dummy con valores válidos para todos los campos
            const dummy: any = {
                Cedula_Juridica: "3-123-123456",
                Razon_Social: "Empresa S.A.",
                Correo: "empresa@email.com",
                Numero_Telefono: "+50688887777",
                Motivo_Solicitud: "Motivo válido",
            };
            dummy[fieldName] = value;

            AsociadoJuridicaSchema.parse(dummy);

            setFieldErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[fieldName];
                return newErrors;
            });
        } catch (error: any) {
            let errorMessage = '';
            if (error.errors && Array.isArray(error.errors)) {
                const fieldError = error.errors.find((err: any) => err.path.includes(fieldName));
                errorMessage = fieldError?.message || error.errors[0]?.message || 'Error de validación';
            } else if (error.message) {
                errorMessage = error.message;
            } else {
                errorMessage = 'Error de validación';
            }
            setFieldErrors(prev => ({
                ...prev,
                [fieldName]: errorMessage,
            }));
        }
    };

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
                setFieldErrors({});
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
                    form.handleSubmit();
                }}
                className="bg-white shadow-lg pl-24 pr-24 pt-8 pb-8 rounded-lg w-full max-w-7xl mx-auto"
            >
                <h2 className="text-center text-2xl font-semibold mb-10">
                    Formulario para Cliente Jurídico
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                    {/* Cédula Jurídica */}
                    <form.Field name="Cedula_Juridica">
                        {(field) => (
                            <div className="mb-3 w-full">
                                <label className="block mb-1 font-medium">
                                    Cédula Jurídica <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={field.state.value}
                                    onChange={(e) => {
                                        field.handleChange(e.target.value);
                                        validateField("Cedula_Juridica", e.target.value, form.state.values);
                                    }}
                                    placeholder="3-XXX-XXXXXX"
                                    className={commonClasses}
                                />
                                {fieldErrors["Cedula_Juridica"] && (
                                    <span className="text-red-500 text-sm block mt-1">{fieldErrors["Cedula_Juridica"]}</span>
                                )}
                                {formErrors["Cedula_Juridica"] && !fieldErrors["Cedula_Juridica"] && (
                                    <span className="text-red-500 text-sm block mt-1">{formErrors["Cedula_Juridica"]}</span>
                                )}
                            </div>
                        )}
                    </form.Field>
                    {/* Razón Social */}
                    <form.Field name="Razon_Social">
                        {(field) => (
                            <div className="mb-3 w-full">
                                <label className="block mb-1 font-medium">
                                    Razón Social <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={field.state.value}
                                    onChange={(e) => {
                                        field.handleChange(e.target.value);
                                        validateField("Razon_Social", e.target.value, form.state.values);
                                    }}
                                    placeholder="Ejemplo S.A."
                                    className={commonClasses}
                                />
                                {fieldErrors["Razon_Social"] && (
                                    <span className="text-red-500 text-sm block mt-1">{fieldErrors["Razon_Social"]}</span>
                                )}
                                {formErrors["Razon_Social"] && !fieldErrors["Razon_Social"] && (
                                    <span className="text-red-500 text-sm block mt-1">{formErrors["Razon_Social"]}</span>
                                )}
                            </div>
                        )}
                    </form.Field>
                    {/* Correo */}
                    <form.Field name="Correo">
                        {(field) => (
                            <div className="mb-3 w-full">
                                <label className="block mb-1 font-medium">
                                    Correo electrónico <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="email"
                                    value={field.state.value}
                                    onChange={(e) => {
                                        field.handleChange(e.target.value);
                                        validateField("Correo", e.target.value, form.state.values);
                                    }}
                                    placeholder="empresa@email.com"
                                    className={commonClasses}
                                />
                                {fieldErrors["Correo"] && (
                                    <span className="text-red-500 text-sm block mt-1">{fieldErrors["Correo"]}</span>
                                )}
                                {formErrors["Correo"] && !fieldErrors["Correo"] && (
                                    <span className="text-red-500 text-sm block mt-1">{formErrors["Correo"]}</span>
                                )}
                            </div>
                        )}
                    </form.Field>
                    {/* Teléfono internacional */}
                    <form.Field name="Numero_Telefono">
                        {(field) => (
                            <div className="mb-3 w-full">
                                <label className="block mb-1 font-medium">
                                    Número de teléfono <span className="text-red-500">*</span>
                                </label>
                                <PhoneInput
                                    international
                                    defaultCountry="CR"
                                    value={field.state.value}
                                    onChange={(value) => {
                                        field.handleChange(value || "");
                                        validateField("Numero_Telefono", value || "", form.state.values);
                                    }}
                                    className={`${commonClasses} ${fieldErrors["Numero_Telefono"] ? 'border-red-500 focus:ring-red-300' : ''}`}
                                />
                                {fieldErrors["Numero_Telefono"] && (
                                    <span className="text-red-500 text-sm block mt-1">{fieldErrors["Numero_Telefono"]}</span>
                                )}
                                {formErrors["Numero_Telefono"] && !fieldErrors["Numero_Telefono"] && (
                                    <span className="text-red-500 text-sm block mt-1">{formErrors["Numero_Telefono"]}</span>
                                )}
                            </div>
                        )}
                    </form.Field>
                    {/* Motivo de Solicitud */}
                    <form.Field name="Motivo_Solicitud">
                        {(field) => (
                            <div className="mb-3 w-full">
                                <label className="block mb-1 font-medium">
                                    Motivo de solicitud <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    value={field.state.value}
                                    onChange={(e) => {
                                        field.handleChange(e.target.value);
                                        validateField("Motivo_Solicitud", e.target.value, form.state.values);
                                    }}
                                    placeholder="Escribe el motivo de tu solicitud"
                                    className={`${commonClasses} resize-none h-24 overflow-y-scroll`}
                                />
                                {fieldErrors["Motivo_Solicitud"] && (
                                    <span className="text-red-500 text-sm block mt-1">{fieldErrors["Motivo_Solicitud"]}</span>
                                )}
                                {formErrors["Motivo_Solicitud"] && !fieldErrors["Motivo_Solicitud"] && (
                                    <span className="text-red-500 text-sm block mt-1">{formErrors["Motivo_Solicitud"]}</span>
                                )}
                            </div>
                        )}
                    </form.Field>
                </div>

                {/* Mensaje general */}
                {formErrors.general && (
                    <div className={`text-center mt-4 ${formErrors.general.includes("éxito") ? "text-green-600" : "text-red-500"}`}>
                        {formErrors.general}
                    </div>
                )}

                <div className="flex justify-end items-end gap-4 mt-8">
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-[120px] bg-blue-900 text-white py-2 rounded hover:bg-blue-800 transition"
                    >
                        Cerrar
                    </button>
                    <div className="flex justify-end items-end">
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

export default FormularioAsociadoJuridico;