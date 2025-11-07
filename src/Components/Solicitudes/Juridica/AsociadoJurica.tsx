import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { AsociadoJuridicaSchema } from "../../../Schemas/Solicitudes/Juridica/AsociadoJuridica";
import { useAsociadoJuridica } from "../../../Hook/Solicitudes/HookJuridicas";
import PhoneInputComponent from "../PhoneInputComponent";

type Props = {
    onClose: () => void;
};

const normalizePhoneNumber = (phone: string): string => {
    if (!phone || !phone.startsWith('+')) {
        throw new Error('El número debe incluir el código de país y comenzar con "+". Ejemplo: +50688887777');
    }
    return phone;
};
function formatCedulaJuridica(value: string) {
    const digits = value.replace(/\D/g, "");
    let formatted = "";
    if (digits.length > 0) formatted += digits[0];
    if (digits.length > 1) formatted += "-" + digits.slice(1, 4);
    if (digits.length > 4) formatted += "-" + digits.slice(4, 10);
    return formatted;
}

const FormularioAsociadoJuridico = ({ onClose }: Props) => {
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const mutation = useAsociadoJuridica();
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [mostrarFormulario, setMostrarFormulario] = useState(true);

    // Validación en tiempo real de todo el formulario
    const validateAllFields = (values: any) => {
        try {
            AsociadoJuridicaSchema.parse(values);
            setFieldErrors({});
        } catch (error: any) {
            const errors: Record<string, string> = {};
            if (error.errors && Array.isArray(error.errors)) {
                error.errors.forEach((err: any) => {
                    const field = err.path[0] as string;
                    errors[field] = err.message;
                });
            }
            setFieldErrors(errors);
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
            setFieldErrors({});
            try {
                value.Numero_Telefono = normalizePhoneNumber(value.Numero_Telefono);

                const validation = AsociadoJuridicaSchema.safeParse(value);
                if (!validation.success) {
                    const validationErrors: Record<string, string> = {};
                    validation.error.errors.forEach((err) => {
                        const field = err.path[0] as string;
                        validationErrors[field] = err.message;
                    });
                    setFormErrors(validationErrors);
                    setFieldErrors(validationErrors);
                    setTouched(prev => {
                        // Marca todos los campos como tocados al enviar
                        const allTouched: Record<string, boolean> = { ...prev };
                        Object.keys(validationErrors).forEach(key => {
                            allTouched[key] = true;
                        });
                        return allTouched;
                    });
                    return;
                }

                await mutation.createAsociado(value);

                form.reset();
                setMostrarFormulario(false);
                setShowSuccessAlert(true);
                setTimeout(() => setShowSuccessAlert(false), 3000);
                if (onClose) onClose();
                alert("¡Formulario enviado con éxito!");
            } catch (error: any) {
                // --- CAMBIO SOLICITADO ---
                const backendMessage = error?.response?.data?.message;
                if (
                    backendMessage &&
                    backendMessage.includes("No existe un afiliado jurídico")
                ) {
                    setFormErrors({
                        general: "No existe un afiliado jurídico con esa cédula. Debe ser afiliado antes de realizar esta solicitud.",
                    });
                    return;
                }
                setFormErrors({
                    general:
                        error?.message ||
                        "Hubo un error al enviar el formulario. Por favor intenta nuevamente.",
                });
                // --- FIN CAMBIO SOLICITADO ---
            }
        },
    });

    // Validar todos los campos al intentar enviar
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        validateAllFields(form.state.values);
        form.handleSubmit();
    };

    // Validar en tiempo real cada vez que cambia un campo y marcar como tocado
    const handleFieldChange = (
        fieldName: "Cedula_Juridica" | "Razon_Social" | "Correo" | "Numero_Telefono" | "Motivo_Solicitud",
        value: any
    ) => {
        setTouched(prev => ({ ...prev, [fieldName]: true }));
        const newValues = { ...form.state.values, [fieldName]: value };
        validateAllFields(newValues);
        form.setFieldValue(fieldName, value);
    };

    if (!mostrarFormulario) {
        return showSuccessAlert ? (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
                <div className="bg-white rounded-lg shadow-lg px-8 py-6 text-center">
                    <h3 className="text-green-600 text-xl font-semibold mb-2">¡Formulario enviado con éxito!</h3>
                    <p className="text-gray-700">Gracias por enviar tu solicitud.</p>
                </div>
            </div>
        ) : null;
    }

    const commonClasses =
        "w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300";

    return (
        <div className="flex justify-center items-center min-h-screen p-5 w-full text-gray-800">
            <form
                onSubmit={handleSubmit}
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
                                        const formatted = formatCedulaJuridica(e.target.value);
                                        handleFieldChange("Cedula_Juridica", formatted);
                                    }}
                                    onBlur={() => setTouched(prev => ({ ...prev, Cedula_Juridica: true }))}
                                    placeholder="3-XXX-XXXXXX"
                                    className={commonClasses}
                                />
                                {touched["Cedula_Juridica"] && fieldErrors["Cedula_Juridica"] && (
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
                                        handleFieldChange("Razon_Social", e.target.value);
                                    }}
                                    onBlur={() => setTouched(prev => ({ ...prev, Razon_Social: true }))}
                                    placeholder="Ejemplo S.A."
                                    className={commonClasses}
                                />
                                {touched["Razon_Social"] && fieldErrors["Razon_Social"] && (
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
                                        handleFieldChange("Correo", e.target.value);
                                    }}
                                    onBlur={() => setTouched(prev => ({ ...prev, Correo: true }))}
                                    placeholder="empresa@email.com"
                                    className={commonClasses}
                                />
                                {touched["Correo"] && fieldErrors["Correo"] && (
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
                                <PhoneInputComponent
                                    value={field.state.value}
                                    onChange={(value) => {
                                        handleFieldChange("Numero_Telefono", value || "");
                                    }}
                                    className={`${fieldErrors["Numero_Telefono"] ? 'border-red-500' : ''}`}
                                />
                                {touched["Numero_Telefono"] && fieldErrors["Numero_Telefono"] && (
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
                                        handleFieldChange("Motivo_Solicitud", e.target.value);
                                    }}
                                    onBlur={() => setTouched(prev => ({ ...prev, Motivo_Solicitud: true }))}
                                    placeholder="Escribe el motivo de tu solicitud"
                                    className={`${commonClasses} resize-none h-24 overflow-y-scroll`}
                                />
                                {touched["Motivo_Solicitud"] && fieldErrors["Motivo_Solicitud"] && (
                                    <span className="text-red-500 text-sm block mt-1">{fieldErrors["Motivo_Solicitud"]}</span>
                                )}
                                {formErrors["Motivo_Solicitud"] && !fieldErrors["Motivo_Solicitud"] && (
                                    <span className="text-red-500 text-sm block mt-1">{formErrors["Motivo_Solicitud"]}</span>
                                )}
                            </div>
                        )}
                    </form.Field>
                </div>

                {/* Mensaje de afiliado jurídico no encontrado */}
                {formErrors.general && (
                    <div className="text-center mt-4 text-red-500">
                        {formErrors.general}
                    </div>
                )}

                <div className="flex justify-end items-end gap-4 mt-8">

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