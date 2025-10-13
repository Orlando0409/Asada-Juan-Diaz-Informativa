import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { z } from "zod";
import { CambioMedidorJuridicaSchema } from "../../../Schemas/Solicitudes/Juridica/CambioMedidorJuridico";
import { useCambioMedidorJuridica } from "../../../Hook/Solicitudes/Juridica/hookCambioMedidorJuridica";
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

type SolicitudTipo = "cambioMedidor";
type Props = {
    tipo: SolicitudTipo;
    onClose: () => void;
};

function formatCedulaJuridica(value: string) {
    const digits = value.replace(/\D/g, "");
    let formatted = "";
    if (digits.length > 0) formatted += digits[0];
    if (digits.length > 1) formatted += "-" + digits.slice(1, 4);
    if (digits.length > 4) formatted += "-" + digits.slice(4, 10);
    return formatted;
}

const fieldSchemas: Record<string, z.ZodTypeAny> = CambioMedidorJuridicaSchema.shape;

const CambioMedidorJuridica = ({ onClose }: Props) => {
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const mutation = useCambioMedidorJuridica();
    const [mostrarFormulario, setMostrarFormulario] = useState(true);

    // Validación en tiempo real SOLO del campo editado
    const handleFieldChange = (fieldName: string, value: any) => {
        if (fieldSchemas[fieldName]) {
            try {
                fieldSchemas[fieldName].parse(value);
                setFieldErrors(prev => {
                    const newErrors = { ...prev };
                    delete newErrors[fieldName];
                    return newErrors;
                });
            } catch (error: any) {
                let errorMessage = '';
                if (error.errors && Array.isArray(error.errors)) {
                    errorMessage = error.errors[0]?.message || 'Error de validación';
                } else if (error.message) {
                    errorMessage = error.message;
                } else {
                    errorMessage = 'Error de validación';
                }
                setFieldErrors(prev => ({ ...prev, [fieldName]: errorMessage }));
            }
        }
    };

    const getPlaceholder = (fieldName: string) => {
        const placeholders: Record<string, string> = {
            Razon_Social: 'Ejemplo S.A.',
            Cedula_Juridica: '3-XXX-XXXXXX',
            Correo: 'empresa@email.com',
            Numero_Telefono: '+50688887777',
            Direccion_Exacta: 'San José, del Banco Nacional 200m sur',
            Motivo_Solicitud: 'Cambio por daño',
            Numero_Medidor_Anterior: '1234567',
        };
        return placeholders[fieldName] || '';
    };

    const form = useForm({
        defaultValues: {
            Razon_Social: "",
            Cedula_Juridica: "",
            Correo: "",
            Numero_Telefono: "",
            Direccion_Exacta: "",
            Motivo_Solicitud: "",
            Numero_Medidor_Anterior: 0,
        },

        onSubmit: async ({ value }) => {
            setFormErrors({});
            try {
                // Validar y normalizar el teléfono internacional
                const phoneNumber = parsePhoneNumberFromString(value.Numero_Telefono || "");
                if (!phoneNumber?.isValid()) {
                    setFormErrors({ Numero_Telefono: "Número de teléfono inválido" });
                    return;
                }
                // Guarda el número en formato E.164 (+50688887777)
                value.Numero_Telefono = phoneNumber.format("E.164");

                const validation = CambioMedidorJuridicaSchema.safeParse(value);
                if (!validation.success) {
                    const validationErrors: Record<string, string> = {};
                    validation.error.errors.forEach((err) => {
                        const field = err.path[0] as string;
                        validationErrors[field] = err.message;
                    });
                    setFormErrors(validationErrors);
                    return;
                }
                await mutation.createCambioMedidorJuridica(value);
                form.reset();
                setFormErrors({ general: "¡Solicitud enviada con éxito!" });
                setFieldErrors({});
                alert("¡Solicitud enviada exitosamente!");
                setMostrarFormulario(false);
                if (onClose) onClose();
            } catch (error: any) {
                if (error?.response?.data?.message) {
                    setFormErrors({ general: error.response.data.message });
                } else if (error?.message) {
                    setFormErrors({ general: error.message });
                } else {
                    setFormErrors({ general: "Error al enviar la solicitud" });
                }
            }
        },
    });

    if (!mostrarFormulario) return null;

    
    const commonClasses = 'w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300';

    return (
        <div className="flex justify-center items-center min-h-screen text-gray-800 p-5 w-full">
            <form
                onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }}
                className="bg-white shadow-lg pl-24 pr-24 pt-8 pb-8 rounded-lg w-full max-w-7xl mx-auto"
            >
                <h2 className="text-center text-2xl font-semibold mb-10">Formulario de cambio de medidor - Jurídica</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                    {/* Razón Social */}
                    <form.Field name="Razon_Social">
                        {(field) => (
                            <div className="mb-3 w-full">
                                <label htmlFor="RazonSocial" className="block mb-1 font-medium">Razón Social <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    value={field.state.value}
                                    onChange={(e) => {
                                        field.handleChange(e.target.value);
                                        handleFieldChange("Razon_Social", e.target.value);
                                    }}
                                    placeholder={getPlaceholder("Razon_Social")}
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
                    {/* Cédula Jurídica */}
                    <form.Field name="Cedula_Juridica">
                        {(field) => (
                            <div className="mb-3 w-full">
                                <label htmlFor="CedulaJuridica" className="block mb-1 font-medium">Cédula Jurídica <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    value={field.state.value}
                                    onChange={(e) => {
                                        const formatted = formatCedulaJuridica(e.target.value);
                                        field.handleChange(formatted);
                                        handleFieldChange("Cedula_Juridica", formatted);
                                    }}
                                    placeholder={getPlaceholder("Cedula_Juridica")}
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
                    {/* Correo */}
                    <form.Field name="Correo">
                        {(field) => (
                            <div className="mb-3 w-full">
                                <label htmlFor="Correo" className="block mb-1 font-medium">Correo electrónico <span className="text-red-500">*</span></label>
                                <input
                                    type="email"
                                    value={field.state.value}
                                    onChange={(e) => {
                                        field.handleChange(e.target.value);
                                        handleFieldChange("Correo", e.target.value);
                                    }}
                                    placeholder={getPlaceholder("Correo")}
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
                                <label htmlFor="Numero_Telefono" className="block mb-1 font-medium">Número de teléfono <span className="text-red-500">*</span></label>
                                <PhoneInput
                                    international
                                    defaultCountry="CR"
                                    value={field.state.value}
                                    onChange={(value) => {
                                        field.handleChange(value || "");
                                        handleFieldChange("Numero_Telefono", value || "");
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
                    {/* Dirección Exacta */}
                    <form.Field name="Direccion_Exacta">
                        {(field) => (
                            <div className="mb-3 w-full">
                                <label htmlFor="Direccion_Exacta" className="block mb-1 font-medium">Dirección exacta <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    value={field.state.value}
                                    onChange={(e) => {
                                        field.handleChange(e.target.value);
                                        handleFieldChange("Direccion_Exacta", e.target.value);
                                    }}
                                    placeholder={getPlaceholder("Direccion_Exacta")}
                                    className={commonClasses}
                                />
                                {fieldErrors["Direccion_Exacta"] && (
                                    <span className="text-red-500 text-sm block mt-1">{fieldErrors["Direccion_Exacta"]}</span>
                                )}
                                {formErrors["Direccion_Exacta"] && !fieldErrors["Direccion_Exacta"] && (
                                    <span className="text-red-500 text-sm block mt-1">{formErrors["Direccion_Exacta"]}</span>
                                )}
                            </div>
                        )}
                    </form.Field>
                    {/* Motivo de Solicitud */}
                    <form.Field name="Motivo_Solicitud">
                        {(field) => (
                            <div className="mb-3 w-full">
                                <label htmlFor="Motivo_Solicitud" className="block mb-1 font-medium">Motivo de solicitud <span className="text-red-500">*</span></label>
                                <textarea
                                    value={field.state.value}
                                    onChange={(e) => {
                                        field.handleChange(e.target.value);
                                        handleFieldChange("Motivo_Solicitud", e.target.value);
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
                    {/* Número de Medidor Anterior */}
                    <form.Field name="Numero_Medidor_Anterior">
                        {(field) => (
                            <div className="mb-3 w-full">
                                <label htmlFor="Numero_Medidor_Anterior" className="block mb-1 font-medium">Número de Medidor <span className="text-red-500">*</span></label>
                                <input
                                    type="number"
                                    min={0}
                                    value={field.state.value}
                                    onChange={(e) => {
                                        field.handleChange(Number(e.target.value));
                                        handleFieldChange("Numero_Medidor_Anterior", Number(e.target.value));
                                    }}
                                    placeholder={getPlaceholder("Numero_Medidor_Anterior")}
                                    className={commonClasses}
                                />
                                {fieldErrors["Numero_Medidor_Anterior"] && (
                                    <span className="text-red-500 text-sm block mt-1">{fieldErrors["Numero_Medidor_Anterior"]}</span>
                                )}
                                {formErrors["Numero_Medidor_Anterior"] && !fieldErrors["Numero_Medidor_Anterior"] && (
                                    <span className="text-red-500 text-sm block mt-1">{formErrors["Numero_Medidor_Anterior"]}</span>
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

export default CambioMedidorJuridica;