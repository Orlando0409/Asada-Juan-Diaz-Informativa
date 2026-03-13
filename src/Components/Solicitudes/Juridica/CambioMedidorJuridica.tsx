import { useForm } from "@tanstack/react-form";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import { CambioMedidorJuridicaSchema } from "../../../Schemas/Solicitudes/Juridica/CambioMedidorJuridico";
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { useCambioMedidorJuridica, useMedidoresJuridica } from "../../../Hook/Solicitudes/HookJuridicas";
import { Loader2 } from "lucide-react";
import PhoneInputComponent from "../PhoneInputComponent";

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

const fieldSchemas: Record<string, z.ZodTypeAny> = CambioMedidorJuridicaSchema.shape;
const STORAGE_KEY = 'afiliacion_juridica_temp';

const CambioMedidorJuridica = ({ onClose }: Props) => {
    const [archivoSeleccionado, setArchivoSeleccionado] = useState<{ [key: string]: File | null }>({});
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [isSending, setIsSending] = useState(false);
    const mutation = useCambioMedidorJuridica();
    const [mostrarFormulario, setMostrarFormulario] = useState(true);
    const [cedulaJuridica, setCedulaJuridica] = useState('');
    const planosInputRef = useRef<HTMLInputElement>(null);
    const escrituraInputRef = useRef<HTMLInputElement>(null);
    const { medidores, isLoading: isMedidoresLoading } = useMedidoresJuridica(cedulaJuridica);

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
        };
        return placeholders[fieldName] || '';
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
            Razon_Social: "",
            Cedula_Juridica: "",
            Correo: "",
            Numero_Telefono: "",
            Direccion_Exacta: "",
            Motivo_Solicitud: "",
            Id_Medidor: 0,
            Planos_Terreno: undefined as File | undefined,
            Escritura_Terreno: undefined as File | undefined,
        },

        onSubmit: async ({ value }) => {
            setFormErrors({});
            setFieldErrors({});
            try {
                // Validar y normalizar el teléfono internacional
                const phoneNumber = parsePhoneNumberFromString(value.Numero_Telefono || "");
                if (!phoneNumber?.isValid()) {
                    setFormErrors({ Numero_Telefono: "Número de teléfono inválido" });
                    return;
                }

                const cleanedValue = {
                    ...value,
                    Razon_Social: (value.Razon_Social || '').trim(),
                    Cedula_Juridica: (value.Cedula_Juridica || '').trim(),
                    Correo: (value.Correo || '').trim(),
                    Numero_Telefono: phoneNumber.format("E.164"),
                    Direccion_Exacta: (value.Direccion_Exacta || '').trim(),
                    Motivo_Solicitud: (value.Motivo_Solicitud || '').trim(),
                    Planos_Terreno: value.Planos_Terreno,
                    Escritura_Terreno: value.Escritura_Terreno,
                };

                const validation = CambioMedidorJuridicaSchema.safeParse(cleanedValue);
                if (!validation.success) {
                    const validationErrors: Record<string, string> = {};
                    validation.error.errors.forEach((err) => {
                        const field = err.path[0] as string;
                        validationErrors[field] = err.message;
                    });
                    setFormErrors(validationErrors);
                    return;
                }

                const formData = new FormData();
                Object.entries(validation.data).forEach(([key, val]) => {
                    if (val !== undefined && val !== null && val !== "") {
                        if (val instanceof File) {
                            formData.append(key, val);
                        } else {
                            formData.append(key, String(val));
                        }
                    }
                });

                setIsSending(true);
                await mutation.createCambioMedidor(formData);
                sessionStorage.removeItem(STORAGE_KEY);

                form.reset();
                setFieldErrors({});
                setArchivoSeleccionado({});
                if (planosInputRef.current) planosInputRef.current.value = '';
                if (escrituraInputRef.current) escrituraInputRef.current.value = '';
                setMostrarFormulario(false);
                onClose();
            } catch (error: any) {
                console.log(" ERROR EN SOLICITUD DE CAMBIO DE MEDIDOR JURÍDICA:", error);
            } finally {
                setIsSending(false);
            }
        },
    });

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



    if (!mostrarFormulario) return null;


    const commonClasses = 'w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring focus:ring-blue-300';

    return (
        <div className="w-full text-gray-800">
            <form
                onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }}
                className="scrollbar-hide w-full overflow-y-auto rounded-[24px] bg-white px-4 py-3 shadow-[0_30px_80px_-32px_rgba(15,23,42,0.55)] sm:px-6 sm:py-4"
                style={{ maxHeight: "calc(100dvh - 3rem)" }}
            >
                <h2 className="text-center text-xl font-semibold mb-6">Formulario de cambio de medidor - Jurídica</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
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
                                        saveToSessionStorage({ ...form.state.values, Razon_Social: e.target.value });
                                    }}
                                    placeholder={getPlaceholder("Razon_Social")}
                                    maxLength={50}
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
                                        // Actualizar el estado de cedulaJuridica y limpiar medidor
                                        setCedulaJuridica(formatted.replace(/-/g, ''));
                                        form.setFieldValue('Id_Medidor', 0);
                                        saveToSessionStorage({ ...form.state.values, Cedula_Juridica: formatted });
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
                                        saveToSessionStorage({ ...form.state.values, Correo: e.target.value });
                                    }}
                                    placeholder={getPlaceholder("Correo")}
                                    maxLength={100}
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
                                <PhoneInputComponent
                                    value={field.state.value}
                                    onChange={(value) => {
                                        field.handleChange(value || "");
                                        handleFieldChange("Numero_Telefono", value || "");
                                        saveToSessionStorage({ ...form.state.values, Numero_Telefono: value || "" });
                                    }}
                                    className={`${fieldErrors["Numero_Telefono"] ? 'border-red-500' : ''}`}
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
                                <textarea
                                    value={field.state.value}
                                    onChange={(e) => {
                                        field.handleChange(e.target.value);
                                        handleFieldChange("Direccion_Exacta", e.target.value);
                                        saveToSessionStorage({ ...form.state.values, Direccion_Exacta: e.target.value });
                                    }}
                                    placeholder={getPlaceholder("Direccion_Exacta")}
                                    maxLength={100}
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
                                        saveToSessionStorage({ ...form.state.values, Motivo_Solicitud: e.target.value });
                                    }}
                                    placeholder="Escribe el motivo de tu solicitud"
                                    maxLength={250}
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
                    <form.Field name="Id_Medidor">
                        {(field) => {
                            return (
                                <div className="mb-3 w-full">
                                    <label htmlFor="Id_Medidor" className="block mb-1 font-medium">Número de Medidor <span className="text-red-500">*</span></label>

                                    <div className="relative">
                                        <select
                                            id="Id_Medidor"
                                            value={field.state.value || ''}
                                            onChange={(e) => {
                                                const idMedidor = Number(e.target.value);
                                                field.handleChange(idMedidor);
                                            }}
                                            onBlur={field.handleBlur}
                                            className={commonClasses}
                                            disabled={!cedulaJuridica || isMedidoresLoading}
                                        >
                                            <option value="">Seleccione un medidor</option>
                                            {medidores.map((med) => (
                                                <option key={med.Id_Medidor} value={med.Id_Medidor}>
                                                    Medidor #{med.Numero_Medidor} {med.Estado ? `(${med.Estado})` : ''}
                                                </option>
                                            ))}
                                        </select>

                                        {isMedidoresLoading && (
                                            <div className="absolute right-10 top-1/2 -translate-y-1/2">
                                                <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                                            </div>
                                        )}
                                    </div>

                                    {fieldErrors["Id_Medidor"] && (
                                        <span className="text-red-500 text-sm block mt-1">
                                            {fieldErrors["Id_Medidor"]}
                                        </span>
                                    )}

                                    {medidores.length === 0 && cedulaJuridica && !isMedidoresLoading && (
                                        <span className="text-red-500 text-sm block mt-1">
                                            No se encontraron medidores para esta identificación
                                        </span>
                                    )}
                                </div>
                            );
                        }}
                    </form.Field>

                    {/* Planos del Terreno */}
                    <form.Field name="Planos_Terreno">
                        {(field) => {
                            const archivoActual = archivoSeleccionado["Planos_Terreno"] ?? null;
                            return (
                                <div className="mb-3 w-full">
                                    <label className="block mb-1 font-medium">Planos del terreno <span className="text-red-500">*</span></label>
                                    <input
                                        type="file"
                                        accept=".png,.jpg,.jpeg,.heic,.pdf"
                                        disabled={!!archivoActual}
                                        onChange={(e) => {
                                            const file = e.target.files?.[0] ?? null;
                                            field.handleChange(file ?? undefined);
                                            setArchivoSeleccionado(prev => ({ ...prev, ["Planos_Terreno"]: file }));
                                            handleFieldChange("Planos_Terreno", file);
                                        }}
                                        className="hidden"
                                        id="Planos_Terreno_CambioJuridica"
                                        ref={planosInputRef}
                                        key={archivoActual ? archivoActual.name : 'planos'}
                                    />
                                    <label
                                        htmlFor="Planos_Terreno_CambioJuridica"
                                        className={`inline-block text-white bg-blue-600 px-3 py-1 rounded text-sm ${archivoActual ? 'cursor-not-allowed opacity-50' : 'hover:bg-blue-700 cursor-pointer'}`}
                                    >
                                        {archivoActual ? 'Archivo cargado' : 'Subir archivo'}
                                    </label>
                                    {archivoActual && (
                                        <div className="border rounded-md p-3 bg-gray-50 pb-2 mb-2 flex justify-between items-center">
                                            <span className="text-sm text-gray-700">{archivoActual.name}</span>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    field.handleChange(undefined);
                                                    setArchivoSeleccionado(prev => ({ ...prev, ["Planos_Terreno"]: null }));
                                                    setFieldErrors(prev => ({ ...prev, ["Planos_Terreno"]: 'Debe subir el plano del terreno' }));
                                                    if (planosInputRef.current) planosInputRef.current.value = '';
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
                            );
                        }}
                    </form.Field>

                    {/* Escritura del Terreno */}
                    <form.Field name="Escritura_Terreno">
                        {(field) => {
                            const archivoActual = archivoSeleccionado["Escritura_Terreno"] ?? null;
                            return (
                                <div className="mb-3 w-full">
                                    <label className="block mb-1 font-medium">Escritura del terreno <span className="text-red-500">*</span></label>
                                    <input
                                        type="file"
                                        accept=".png,.jpg,.jpeg,.heic,.pdf"
                                        disabled={!!archivoActual}
                                        onChange={(e) => {
                                            const file = e.target.files?.[0] ?? null;
                                            field.handleChange(file ?? undefined);
                                            setArchivoSeleccionado(prev => ({ ...prev, ["Escritura_Terreno"]: file }));
                                            handleFieldChange("Escritura_Terreno", file);
                                        }}
                                        className="hidden"
                                        id="Escritura_Terreno_CambioJuridica"
                                        ref={escrituraInputRef}
                                        key={archivoActual ? archivoActual.name : 'escritura'}
                                    />
                                    <label
                                        htmlFor="Escritura_Terreno_CambioJuridica"
                                        className={`inline-block text-white bg-blue-600 px-3 py-1 rounded text-sm ${archivoActual ? 'cursor-not-allowed opacity-50' : 'hover:bg-blue-700 cursor-pointer'}`}
                                    >
                                        {archivoActual ? 'Archivo cargado' : 'Subir archivo'}
                                    </label>
                                    {archivoActual && (
                                        <div className="border rounded-md p-3 bg-gray-50 pb-2 mb-2 flex justify-between items-center">
                                            <span className="text-sm text-gray-700">{archivoActual.name}</span>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    field.handleChange(undefined);
                                                    setArchivoSeleccionado(prev => ({ ...prev, ["Escritura_Terreno"]: null }));
                                                    setFieldErrors(prev => ({ ...prev, ["Escritura_Terreno"]: 'Debe subir la escritura del terreno' }));
                                                    if (escrituraInputRef.current) escrituraInputRef.current.value = '';
                                                }}
                                                className="text-red-500 hover:underline text-xs"
                                            >
                                                Eliminar
                                            </button>
                                        </div>
                                    )}
                                    {fieldErrors["Escritura_Terreno"] && (
                                        <span className="text-red-500 text-sm block mt-1">{fieldErrors["Escritura_Terreno"]}</span>
                                    )}
                                    {formErrors["Escritura_Terreno"] && !fieldErrors["Escritura_Terreno"] && (
                                        <span className="text-red-500 text-sm block mt-1">{formErrors["Escritura_Terreno"]}</span>
                                    )}
                                </div>
                            );
                        }}
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

export default CambioMedidorJuridica;