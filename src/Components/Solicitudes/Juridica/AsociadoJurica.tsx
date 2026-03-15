import { useForm } from "@tanstack/react-form";
import { useEffect, useState } from "react";
import { AsociadoJuridicaSchema } from "../../../Schemas/Solicitudes/Juridica/AsociadoJuridica";
import { useAsociadoJuridica } from "../../../Hook/Solicitudes/HookJuridicas";
import { useCedulaLookup } from "../../../Hook/Solicitudes/CedulaLookHook";
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
const STORAGE_KEY = 'asociado_juridica_temp';

const FormularioAsociadoJuridico = ({ onClose }: Props) => {
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [isSending, setIsSending] = useState(false);
    const mutation = useAsociadoJuridica();
    const { lookupJuridica, isLoading: loadingCedula } = useCedulaLookup();
    const [_mostrarFormulario, setMostrarFormulario] = useState(true);

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

    const saveToSessionStorage = (values: any) => {
        try {
            // Guardamos todo excepto los archivos
            const dataToSave = {
                Razon_Social: values.Razon_Social,
                Cedula_Juridica: values.Cedula_Juridica,
                Correo: values.Correo,
                Numero_Telefono: values.Numero_Telefono,
                Direccion_Exacta: values.Direccion_Exacta,
            };
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
        } catch (error) {
            console.error('Error al guardar en sessionStorage:', error);
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

                setIsSending(true);
                await mutation.createAsociado(value);
                sessionStorage.removeItem(STORAGE_KEY);

                form.reset();
                setMostrarFormulario(false);
                onClose();
                alert("¡Formulario enviado con éxito!");
            } catch (error: any) {
                console.log(" ERROR EN SOLICITUD DE ASOCIADO JURÍDICO:", error);
            } finally {
                setIsSending(false);
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

    useEffect(() => {
        const savedData = sessionStorage.getItem(STORAGE_KEY);
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                // Cargar los valores en el formulario
                Object.entries(parsed).forEach(([key, value]) => {
                    if (key !== 'Planos_Terreno' && key !== 'Escritura_Terreno') {
                        form.setFieldValue(key as any, value as any);
                    }
                });
            } catch (error) {
                console.error('Error al cargar datos guardados:', error);
            }
        }
    }, []); //prueba 

    const commonClasses =
        "w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring focus:ring-blue-300";

    return (
        <div className="flex justify-center text-gray-800 p-3 sm:p-4 w-full">
            <form
                onSubmit={handleSubmit}
                className="bg-white shadow-lg px-5 py-3 sm:px-6 sm:py-4 rounded-[24px] w-[95%] max-w-7xl mx-auto scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-blue-100"
            >
                <h2 className="text-center text-xl font-semibold mb-6">
                    Formulario para Cliente Jurídico
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
                    {/* Cédula Jurídica */}
                    <form.Field name="Cedula_Juridica">
                        {(field) => (
                            <div className="mb-3 w-full">
                                <label className="block mb-1 font-medium">
                                    Cédula Jurídica <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={field.state.value}
                                        onChange={(e) => {
                                            const formatted = formatCedulaJuridica(e.target.value);
                                            handleFieldChange("Cedula_Juridica", formatted);
                                            if (/^\d-\d{3}-\d{6}$/.test(formatted)) {
                                                lookupJuridica(formatted).then(razonSocial => {
                                                    if (razonSocial) form.setFieldValue('Razon_Social', razonSocial);
                                                });
                                            }
                                        }}
                                        onBlur={() => setTouched(prev => ({ ...prev, Cedula_Juridica: true }))}
                                        placeholder="3-XXX-XXXXXX"
                                        className={commonClasses}
                                    />
                                    {loadingCedula && (
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                            <svg className="animate-spin h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                        </div>
                                    )}
                                </div>
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
                                        saveToSessionStorage({ ...form.state.values, Razon_Social: e.target.value }); // ← NUEVO
                                    }}
                                    onBlur={() => setTouched(prev => ({ ...prev, Razon_Social: true }))}
                                    placeholder="Ejemplo S.A."
                                    maxLength={50}
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
                                        saveToSessionStorage({ ...form.state.values, Correo: e.target.value }); // ← NUEVO  
                                    }}
                                    onBlur={() => setTouched(prev => ({ ...prev, Correo: true }))}
                                    placeholder="empresa@email.com"
                                    maxLength={100}
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
                                        saveToSessionStorage({ ...form.state.values, Numero_Telefono: value || "" }); // ← NUEVO  
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
                                        saveToSessionStorage({ ...form.state.values, Motivo_Solicitud: e.target.value }); // ← NUEVO    
                                    }}
                                    onBlur={() => setTouched(prev => ({ ...prev, Motivo_Solicitud: true }))}
                                    placeholder="Escribe el motivo de tu solicitud"
                                    maxLength={250}
                                    className={`${commonClasses} resize-none h-24 overflow-y-auto scrollbar-thumb-blue-600 scrollbar-thin scrollbar-track-blue-100`}
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


                <div className="flex justify-end items-end gap-4 mt-8">

                    <div className="flex justify-end items-end">
                        <button
                            type="submit"
                            disabled={isSending}
                            className={`w-[120px] py-2 rounded transition ${isSending ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-900 hover:bg-blue-800'} text-white`}
                        >
                            {isSending ? 'Enviando...' : 'Enviar'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default FormularioAsociadoJuridico;