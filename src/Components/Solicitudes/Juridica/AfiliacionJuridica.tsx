import { useForm } from "@tanstack/react-form";
import { useEffect, useRef, useState } from "react";
import { AfiliacionJuridicaSchema } from "../../../Schemas/Solicitudes/Juridica/AfiliacionJuridica";
import { useAfiliacionJuridica } from "../../../Hook/Solicitudes/HookJuridicas";
import { useCedulaLookup } from "../../../Hook/Solicitudes/CedulaLookHook";
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
//prueba
const STORAGE_KEY = 'afiliacion_juridica_temp';

const FormularioAfiliacionJuridico = ({ onClose }: Props) => {
    const [archivoSeleccionado, setArchivoSeleccionado] = useState<{ [key: string]: File | null }>({});
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [isSending, setIsSending] = useState(false);
    const mutation = useAfiliacionJuridica();
    const { lookupJuridica, isLoading: loadingCedula } = useCedulaLookup();
    const planosInputRef = useRef<HTMLInputElement>(null);
    const escrituraInputRef = useRef<HTMLInputElement>(null);


    const [mostrarFormulario, setMostrarFormulario] = useState(true);

    // Validación en tiempo real usando el schema
    const validateField = (fieldName: string, value: any) => {
        try {
            // Crea un objeto dummy con valores válidos para todos los campos
            const dummy: any = {
                Razon_Social: "Empresa S.A.",
                Cedula_Juridica: "3-123-123456",
                Correo: "empresa@email.com",
                Numero_Telefono: "+50688887777",
                Direccion_Exacta: "San José, Costa Rica",
                Planos_Terreno: new File([''], 'test.jpg', { type: 'image/jpeg' }),
                Certificacion_Literal: new File([''], 'test.jpg', { type: 'image/jpeg' }),
            };
            dummy[fieldName] = value;

            AfiliacionJuridicaSchema.parse(dummy);

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
            Razon_Social: '',
            Cedula_Juridica: '',
            Correo: '',
            Numero_Telefono: '',
            Direccion_Exacta: '',
            Planos_Terreno: undefined as File | undefined,
            Certificacion_Literal: undefined as File | undefined,
        },

        onSubmit: async ({ value }) => {
            setFormErrors({});

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
                        if (val instanceof File) {
                            formData.append(key, val);
                        } else {
                            formData.append(key, val.toString());
                        }
                    }
                });

                setIsSending(true);
                await mutation.createAfiliacion(formData);

                sessionStorage.removeItem(STORAGE_KEY);

                form.reset();
                setArchivoSeleccionado({});
                setFieldErrors({});
                setArchivoSeleccionado({});
                setMostrarFormulario(false);
                onClose();
            } catch (error: any) {
                console.log("Error al enviar formulario de afiliación jurídica:", error);
            } finally {
                setIsSending(false);
            }
        },
    });


    ///prueba 
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

    if (!mostrarFormulario) return null;

    const commonClasses = 'w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring focus:ring-blue-300 bg-white';

    return (
        <div className="w-full text-gray-800">
            <div
                className="scrollbar-hide w-full rounded-[24px] bg-white px-4 py-3 sm:px-6 sm:py-4"
            >
                <h2 className="text-center text-xl font-semibold mb-4">Solicitud de Afiliación - Persona Jurídica</h2>

                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        form.handleSubmit();
                    }}

                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-2">
                        {/* Razon Social */}
                        <form.Field name="Razon_Social">
                            {(field) => (
                                <div className="mb-3">
                                    <label className="block mb-1 font-semibold text-gray-700">Razón Social <span className="text-red-500">*</span></label>
                                    <input
                                        type="text"
                                        value={field.state.value}
                                        onChange={(e) => {
                                            field.handleChange(e.target.value);
                                            validateField("Razon_Social", e.target.value);
                                            saveToSessionStorage({ ...form.state.values, Razon_Social: e.target.value }); // 
                                        }}
                                        placeholder="Ejemplo S.A."
                                        maxLength={255}
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
                        {/* Cedula Juridica */}
                        <form.Field name="Cedula_Juridica">
                            {(field) => (
                                <div className="mb-3">
                                    <label className="block mb-1 font-semibold text-gray-700">
                                        Cédula Jurídica <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={field.state.value}
                                            onChange={(e) => {
                                                const formatted = formatCedulaJuridica(e.target.value);
                                                field.handleChange(formatted);
                                                validateField("Cedula_Juridica", formatted);
                                                saveToSessionStorage({ ...form.state.values, Cedula_Juridica: formatted });
                                                if (/^\d-\d{3}-\d{6}$/.test(formatted)) {
                                                    lookupJuridica(formatted).then(razonSocial => {
                                                        if (razonSocial) form.setFieldValue('Razon_Social', razonSocial);
                                                    });
                                                }
                                            }}
                                            placeholder="3-XXX-XXXXXX"
                                            className={commonClasses}
                                            maxLength={12}
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
                                <div className="mb-3">
                                    <label className="block mb-1 font-semibold text-gray-700">Correo electrónico <span className="text-red-500">*</span></label>
                                    <input
                                        type="email"
                                        value={field.state.value}
                                        onChange={(e) => {
                                            field.handleChange(e.target.value);
                                            validateField("Correo", e.target.value);
                                            saveToSessionStorage({ ...form.state.values, Correo: e.target.value }); // ← NUEVO
                                        }}
                                        placeholder="empresa@email.com"
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
                                <div className="mb-3">
                                    <label className="block mb-1 font-semibold text-gray-700">Número de teléfono <span className="text-red-500">*</span></label>
                                    <PhoneInputComponent
                                        value={field.state.value}
                                        onChange={(value) => {
                                            field.handleChange(value || "");
                                            validateField("Numero_Telefono", value || "");
                                            saveToSessionStorage({ ...form.state.values, Numero_Telefono: value || "" }); // ← NUEVO
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
                                <div className="mb-3">
                                    <label className="block mb-1 font-semibold text-gray-700">Dirección exacta <span className="text-red-500">*</span></label>
                                    <textarea
                                        value={field.state.value}
                                        onChange={(e) => {
                                            field.handleChange(e.target.value);
                                            validateField("Direccion_Exacta", e.target.value);
                                            saveToSessionStorage({ ...form.state.values, Direccion_Exacta: e.target.value }); // ← NUEVO
                                        }}
                                        placeholder="San José, del Banco Nacional 200m sur"
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
                    </div>

                        {/* Archivos */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8 mt-4">
                            <form.Field name="Planos_Terreno">
                                {(field) => {
                                    const archivoActual = archivoSeleccionado["Planos_Terreno"] ?? null;
                                    return (
                                        <div className="mb-3">
                                            <label className="block mb-1 font-semibold text-gray-700">Planos del terreno <span className="text-red-500">*</span></label>
                                            <input
                                                type="file"
                                                accept=".png,.jpg,.jpeg,.heic,.pdf"
                                                disabled={!!archivoActual}
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0] ?? null;
                                                    field.handleChange(file ?? undefined);
                                                    setArchivoSeleccionado(prev => ({ ...prev, ["Planos_Terreno"]: file }));
                                                    validateField("Planos_Terreno", file);
                                                }}
                                                className="hidden"
                                                id="Planos_Terreno"
                                                ref={planosInputRef}
                                                key={archivoActual ? archivoActual.name : 'planos'}
                                            />
                                            <label
                                                htmlFor="Planos_Terreno"
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
                                    );
                                }}
                            </form.Field>
                            <form.Field name="Certificacion_Literal">
                                {(field) => {
                                    const archivoActual = archivoSeleccionado["Certificacion_Literal"] ?? null;
                                    return (
                                        <div className="mb-3">
                                            <label className="block mb-1 font-semibold text-gray-700">Certificacion Literal del terreno <span className="text-red-500">*</span></label>
                                            <input
                                                type="file"
                                                accept=".png,.jpg,.jpeg,.heic,.pdf"
                                                disabled={!!archivoActual}
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0] ?? null;
                                                    field.handleChange(file ?? undefined);
                                                    setArchivoSeleccionado(prev => ({ ...prev, ["Certificacion_Literal"]: file }));
                                                    validateField("Certificacion_Literal", file);
                                                }}
                                                className="hidden"
                                                id="Certificacion_Literal"
                                                ref={escrituraInputRef}
                                                key={archivoActual ? archivoActual.name : 'escritura'}
                                            />
                                            <label
                                                htmlFor="Certificacion_Literal"
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
                                                            setArchivoSeleccionado(prev => ({ ...prev, ["Certificacion_Literal"]: null }));
                                                            setFieldErrors(prev => ({
                                                                ...prev,
                                                                ["Certificacion_Literal"]: `Debe subir la certificacion literal del terreno`,
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
                                            {fieldErrors["Certificacion_Literal"] && (
                                                <span className="text-red-500 text-sm block mt-1">{fieldErrors["Certificacion_Literal"]}</span>
                                            )}
                                            {formErrors["Certificacion_Literal"] && !fieldErrors["Certificacion_Literal"] && (
                                                <span className="text-red-500 text-sm block mt-1">{formErrors["Certificacion_Literal"]}</span>
                                            )}
                                        </div>
                                    );
                                }}
                            </form.Field>
                        </div>

                <div className="flex justify-start md:justify-end items-center w-full md:w-auto gap-3 mt-6">
                    <button
                    type="submit"
                    className="w-sm md:w-auto px-1 py-1.5 md:px-6 md:py-4 bg-blue-600 hover:bg-blue-700 rounded text-white disabled:bg-gray-400 disabled:cursor-not-allowed text-sm md: text-lg font-medium"
                    disabled={
                                isSending ||
                                Object.values(form.state.values).some(val => val === undefined || val === null || val === "") ||
                                Object.values(fieldErrors).some(Boolean) ||
                                Object.values(formErrors).some(Boolean)
                            }
                        >
                            {isSending ? 'Enviando...' : 'Enviar Solicitud'}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSending}
                            className="w-xs md:w-auto px-1 py-1.5 md:px-6 md:py-4 bg-gray-400 text-white rounded hover:bg-gray-500 transition-colors disabled:opacity-60 text-sm md: text-lg disabled:cursor-not-allowed"
                        >
                            Cancelar
                        </button>

                    </div>
                </form>
            </div>
        </div>
    );
};

export default FormularioAfiliacionJuridico;


