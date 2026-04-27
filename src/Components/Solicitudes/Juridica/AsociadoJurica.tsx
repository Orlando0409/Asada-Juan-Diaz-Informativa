import { useForm } from "@tanstack/react-form";
import { useEffect, useState, useRef } from "react";
import { AsociadoJuridicaSchema } from "../../../Schemas/Solicitudes/Juridica/AsociadoJuridica";
import { useAsociadoJuridica } from "../../../Hook/Solicitudes/HookJuridicas";
import { useCedulaLookup } from "../../../Hook/Solicitudes/CedulaLookHook";

type Props = {
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
const STORAGE_KEY = 'asociado_juridica_temp';

const FormularioAsociadoJuridico = ({ onClose }: Props) => {
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [isSending, setIsSending] = useState(false);
    const mutation = useAsociadoJuridica();
    const { lookupJuridica, isLoading: loadingCedula } = useCedulaLookup();
    const [_mostrarFormulario, setMostrarFormulario] = useState(true);
    // Estados y referencias para archivos
    const [archivoSeleccionado, setArchivoSeleccionado] = useState<{ [key: string]: File | null }>({});
    const planosInputRef = useRef<HTMLInputElement>(null);
    const escrituraInputRef = useRef<HTMLInputElement>(null);

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

            Motivo_Solicitud: "",
        },
        onSubmit: async ({ value }) => {
            setFormErrors({});
            setFieldErrors({});
            try {


                // Validar campos de texto (sin archivos)
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

                // Crear FormData y agregar campos
                const formData = new FormData();
                Object.entries(value).forEach(([key, val]) => {
                    if (val !== undefined && val !== null) {
                        formData.append(key, val as string);
                    }
                });
                if (archivoSeleccionado.Planos_Terreno) {
                    formData.append('Planos_Terreno', archivoSeleccionado.Planos_Terreno);
                }
                if (archivoSeleccionado.Escrituras_Terreno) {
                    formData.append('Escrituras_Terreno', archivoSeleccionado.Escrituras_Terreno);
                }

                setIsSending(true);
                await mutation.createAsociado(formData);
                sessionStorage.removeItem(STORAGE_KEY);
                form.reset();
                setArchivoSeleccionado({ Planos_Terreno: null, Escrituras_Terreno: null });
                setMostrarFormulario(false);
                onClose();
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
        form.setFieldValue(fieldName as any, value);
    };

    useEffect(() => {
        const savedData = sessionStorage.getItem(STORAGE_KEY);
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                // Cargar los valores en el formulario
                Object.entries(parsed).forEach(([key, value]) => {
                    if (key !== 'Planos_Terreno' && key !== 'Certificacion_Literal') {
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
                                                lookupJuridica(formatted).then(() => {

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

                    {/* Correo */}

                    {/* Teléfono internacional */}

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

                    {/* Archivos */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8 mt-4">
                        {/* Planos del terreno */}
                        <div className="mb-3">
                            <label className="block mb-1 font-semibold text-gray-700">Planos del terreno <span className="text-red-500">*</span></label>
                            <input
                                type="file"
                                accept=".png,.jpg,.jpeg,.heic,.pdf"
                                disabled={!!archivoSeleccionado.Planos_Terreno}
                                onChange={(e) => {
                                    const file = e.target.files?.[0] ?? null;
                                    setArchivoSeleccionado(prev => ({ ...prev, ["Planos_Terreno"]: file }));
                                    setFieldErrors(prev => {
                                        const next = { ...prev };
                                        if (file) {
                                            delete next["Planos_Terreno"];
                                        }
                                        return next;
                                    });
                                }}
                                className="hidden"
                                id="Planos_Terreno"
                                ref={planosInputRef}
                                key={archivoSeleccionado.Planos_Terreno ? archivoSeleccionado.Planos_Terreno.name : 'planos'}
                            />
                            <label
                                htmlFor="Planos_Terreno"
                                className={`inline-block text-white bg-blue-600 px-3 py-1 rounded text-sm ${archivoSeleccionado.Planos_Terreno ? 'cursor-not-allowed opacity-50' : 'hover:bg-blue-700 cursor-pointer'}`}
                            >
                                {archivoSeleccionado.Planos_Terreno ? 'Archivo cargado' : 'Subir archivo'}
                            </label>
                            {archivoSeleccionado.Planos_Terreno && (
                                <div className="border rounded-md p-3 bg-gray-50 pb-2 mb-2 flex justify-between items-center">
                                    <span className="text-sm text-gray-700">{archivoSeleccionado.Planos_Terreno.name}</span>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setArchivoSeleccionado(prev => ({ ...prev, Planos_Terreno: null }));
                                            setFieldErrors(prev => ({
                                                ...prev,
                                                ["Planos_Terreno"]: `Debe subir el plano del terreno`,
                                            }));
                                            if (planosInputRef.current) {
                                                planosInputRef.current.value = '';
                                            }
                                        }}
                                        className="text-red-500 hover:underline text-xs"
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            )}
                            {fieldErrors["Planos_Terreno"] && (
                                <span className="text-red-500 text-sm block mt-1">{fieldErrors["Planos_Terreno"]}</span>
                            )}
                            {formErrors["Planos_Terreno"] && !fieldErrors["Planos_Terreno"] && (
                                <span className="text-red-500 text-sm block mt-1">{formErrors["Planos_Terreno"]}</span>
                            )}
                        </div>
                        {/* Escrituras del terreno */}
                        <div className="mb-3">
                            <label className="block mb-1 font-semibold text-gray-700">Escrituras del terreno <span className="text-red-500">*</span></label>
                            <input
                                type="file"
                                accept=".png,.jpg,.jpeg,.heic,.pdf"
                                disabled={!!archivoSeleccionado.Escrituras_Terreno}
                                onChange={(e) => {
                                    const file = e.target.files?.[0] ?? null;
                                    setArchivoSeleccionado(prev => ({ ...prev, ["Escrituras_Terreno"]: file }));
                                    setFieldErrors(prev => {
                                        const next = { ...prev };
                                        if (file) {
                                            delete next["Escrituras_Terreno"];
                                        }
                                        return next;
                                    });
                                }}
                                className="hidden"
                                id="Escrituras_Terreno"
                                ref={escrituraInputRef}
                                key={archivoSeleccionado.Escrituras_Terreno ? archivoSeleccionado.Escrituras_Terreno.name : 'escritura'}
                            />
                            <label
                                htmlFor="Escrituras_Terreno"
                                className={`inline-block text-white bg-blue-600 px-3 py-1 rounded text-sm ${archivoSeleccionado.Escrituras_Terreno ? 'cursor-not-allowed opacity-50' : 'hover:bg-blue-700 cursor-pointer'}`}
                            >
                                {archivoSeleccionado.Escrituras_Terreno ? 'Archivo cargado' : 'Subir archivo'}
                            </label>
                            {archivoSeleccionado.Escrituras_Terreno && (
                                <div className="border rounded-md p-3 bg-gray-50 pb-2 mb-2 flex justify-between items-center">
                                    <span className="text-sm text-gray-700">{archivoSeleccionado.Escrituras_Terreno.name}</span>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setArchivoSeleccionado(prev => ({ ...prev, Escrituras_Terreno: null }));
                                            setFieldErrors(prev => ({
                                                ...prev,
                                                ["Escrituras_Terreno"]: `Debe subir la escritura del terreno`,
                                            }));
                                            if (escrituraInputRef.current) {
                                                escrituraInputRef.current.value = '';
                                            }
                                        }}
                                        className="text-red-500 hover:underline text-xs"
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            )}
                            {fieldErrors["Escrituras_Terreno"] && (
                                <span className="text-red-500 text-sm block mt-1">{fieldErrors["Escrituras_Terreno"]}</span>
                            )}
                            {formErrors["Escrituras_Terreno"] && !fieldErrors["Escrituras_Terreno"] && (
                                <span className="text-red-500 text-sm block mt-1">{formErrors["Escrituras_Terreno"]}</span>
                            )}
                        </div>
                    </div>

                </div>


                <div className="flex justify-center gap-4 mt-6 ml-50">

                    <button
                        type="submit"
                        className="w-[140px] py-2 rounded transition-colors bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-400 disabled:cursor-not-allowed text-sm font-medium"
                        disabled={
                            isSending ||
                            Object.values(form.state.values).some(val => val === undefined || val === null || val === "") ||
                            Object.values(fieldErrors).some(Boolean) ||
                            Object.values(formErrors).some(Boolean) ||
                            !archivoSeleccionado["Planos_Terreno"] ||
                            !archivoSeleccionado["Escrituras_Terreno"]
                        }
                    >
                        {isSending ? 'Enviando...' : 'Enviar Solicitud'}
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={isSending}
                        className="px-6 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        Cancelar
                    </button>

                </div>
            </form>
        </div>
    );
};

export default FormularioAsociadoJuridico;