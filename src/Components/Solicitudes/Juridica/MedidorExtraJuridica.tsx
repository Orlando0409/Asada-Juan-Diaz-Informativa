
import { useForm } from "@tanstack/react-form";
import { useEffect, useRef, useState } from "react";
import { MedidorExtraJuridicaSchema } from "../../../Schemas/Solicitudes/Juridica/MedidorExtraJuridica";
import { useAgregarMedidorJuridica, useMedidoresJuridica } from "../../../Hook/Solicitudes/HookJuridicas";
import { useCedulaLookup } from "../../../Hook/Solicitudes/CedulaLookHook";
import { useAlerts } from "../../../context/AlertContext";
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

const STORAGE_KEY = 'medidor_extra_juridica_temp';

const MedidorExtraJuridica = ({ onClose }: Props) => {
    const [archivoSeleccionado, setArchivoSeleccionado] = useState<{ [key: string]: File | null }>({});
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [cedulaValidada, setCedulaValidada] = useState<string>('');
    const [mostrarFormulario, _setMostrarFormulario] = useState(true);
    const [alertShown, setAlertShown] = useState<string>('');
    const planosInputRef = useRef<HTMLInputElement>(null);
    const escrituraInputRef = useRef<HTMLInputElement>(null);

    const mutation = useAgregarMedidorJuridica();
    const { lookupJuridica, isLoading: loadingCedula } = useCedulaLookup();
    const { showSuccess, showError } = useAlerts();

    // Hook para obtener medidores existentes
    const { medidores, isLoading: loadingMedidores } = useMedidoresJuridica(cedulaValidada);

    // Validación en tiempo real usando el schema
    const validateField = (fieldName: string, value: any) => {
        try {
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

            MedidorExtraJuridicaSchema.parse(dummy);

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

    const handleCedulaJuridicaChange = (value: string) => {
        const formatted = formatCedulaJuridica(value);
        form.setFieldValue("Cedula_Juridica", formatted);
        validateField("Cedula_Juridica", formatted);

        // Validar formato completo y buscar medidores
        if (/^3-\d{3}-\d{6}$/.test(formatted)) {
            setCedulaValidada(formatted);
            lookupJuridica(formatted).then(razonSocial => {
                if (razonSocial) form.setFieldValue('Razon_Social', razonSocial);
            });
        } else {
            setCedulaValidada('');
        }
    };

    const saveToSessionStorage = (values: any) => {
        try {
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
            setFieldErrors({});

            // Verificar que sea afiliado (tenga medidores)
            if (!cedulaValidada || medidores.length === 0) {
                setFormErrors({ general: 'Debe ser una empresa afiliada con al menos un medidor activo para solicitar un medidor adicional.' });
                return;
            }

            // Limpiar y trimear todos los campos de texto
            const cleanedValue = {
                ...value,
                Razon_Social: (value.Razon_Social || '').trim(),
                Cedula_Juridica: (value.Cedula_Juridica || '').trim(),
                Correo: (value.Correo || '').trim(),
                Numero_Telefono: (value.Numero_Telefono || '').trim().replace(/\s/g, ''),
                Direccion_Exacta: (value.Direccion_Exacta || '').trim(),
            };

            // Ya no es necesario normalizar manualmente el teléfono, el schema lo hace
            // Validar con Zod
            const validation = MedidorExtraJuridicaSchema.safeParse(cleanedValue);
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
                        formData.append(key, val.toString());
                    }
                }
            });

            // Usar mutate en lugar de mutateAsync para que React Query maneje el estado automáticamente
            mutation.mutate(formData);
        },
    });

    useEffect(() => {
        const savedData = sessionStorage.getItem(STORAGE_KEY);
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                Object.entries(parsed).forEach(([key, value]) => {
                    form.setFieldValue(key as any, value as any);
                });
            } catch (error) {
                console.error('Error al cargar datos guardados:', error);
            }
        }
    }, []);

    // Usar un efecto para cerrar el formulario cuando se complete con éxito
    useEffect(() => {
        if (mutation.isSuccess) {
            sessionStorage.removeItem(STORAGE_KEY);
            form.reset();
            setFormErrors({});
            setFieldErrors({});
            setArchivoSeleccionado({});
            if (planosInputRef.current) planosInputRef.current.value = "";
            if (escrituraInputRef.current) escrituraInputRef.current.value = "";
            setTimeout(() => onClose(), 1500); // con retraso para que el usuario vea el mensaje de éxito
        }
    }, [mutation.isSuccess]);

    // Mostrar alert cuando se verifica afiliación
    useEffect(() => {
        if (cedulaValidada && !loadingMedidores && !alertShown.includes(cedulaValidada)) {
            if (medidores.length > 0) {
                showSuccess(
                    "Empresa Afiliada puedes seguir con la solicitud",
                    `Bienvenido. Medidores actuales: ${medidores.length}`
                );
                setAlertShown(cedulaValidada);
            } else {
                showError(
                    " Empresa No Afiliada",
                    "No puedes solicitar un medidor extra porque tu empresa no es afiliada o no tiene medidores activos. Completa tu afiliación primero."
                );
                setAlertShown(cedulaValidada);
            }
        }
    }, [cedulaValidada, medidores.length, loadingMedidores, alertShown, showSuccess, showError]);

    if (!mostrarFormulario) return null;

    const commonClasses = 'w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring focus:ring-blue-300 bg-white';

    return (
        <form
            className="w-full text-gray-800"
            onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
            }}
        >
            <h2 className="text-center text-xl font-semibold mb-4">Solicitud de Medidor Extra - Persona Jurídica</h2>

            {formErrors.general && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {formErrors.general}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-2">
                {/* Cédula Jurídica */}
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
                                        handleCedulaJuridicaChange(e.target.value);
                                        saveToSessionStorage({ ...form.state.values, Cedula_Juridica: formatCedulaJuridica(e.target.value) });
                                    }}
                                    placeholder="3-101-123456"
                                    maxLength={12}
                                    className={`${commonClasses} ${(fieldErrors["Cedula_Juridica"] || formErrors["Cedula_Juridica"]) ? 'border-red-500' : ''}`}
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
                            <p className="text-xs text-gray-500 mt-1">Formato: 3-XXX-XXXXXX</p>
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
                        <div className="mb-3">
                            <label className="block mb-1 font-semibold text-gray-700">
                                Razón Social <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={field.state.value}
                                onChange={(e) => {
                                    field.handleChange(e.target.value);
                                    validateField("Razon_Social", e.target.value);
                                    saveToSessionStorage({ ...form.state.values, Razon_Social: e.target.value });
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

                {/* Correo */}
                <form.Field name="Correo">
                    {(field) => (
                        <div className="mb-3">
                            <label className="block mb-1 font-semibold text-gray-700">
                                Correo Electrónico <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                value={field.state.value}
                                onChange={(e) => {
                                    field.handleChange(e.target.value);
                                    validateField("Correo", e.target.value);
                                    saveToSessionStorage({ ...form.state.values, Correo: e.target.value });
                                }}
                                placeholder="empresa@ejemplo.com"
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

                {/* Número de Teléfono */}
                <form.Field name="Numero_Telefono">
                    {(field) => (
                        <div className="mb-3">
                            <label className="block mb-1 font-semibold text-gray-700">
                                Número de Teléfono <span className="text-red-500">*</span>
                            </label>
                            <PhoneInputComponent
                                value={field.state.value}
                                onChange={(value) => {
                                    field.handleChange(value);
                                    validateField("Numero_Telefono", value);
                                    saveToSessionStorage({ ...form.state.values, Numero_Telefono: value });
                                }}
                                hasError={!!fieldErrors["Numero_Telefono"] || !!formErrors["Numero_Telefono"]}
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
                            <label className="block mb-1 font-semibold text-gray-700">
                                Dirección Exacta <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={field.state.value}
                                onChange={(e) => {
                                    field.handleChange(e.target.value);
                                    validateField("Direccion_Exacta", e.target.value);
                                    saveToSessionStorage({ ...form.state.values, Direccion_Exacta: e.target.value });
                                }}
                                placeholder="San José, del Banco Nacional 200m sur"
                                maxLength={255}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8 mt-2">
                <form.Field name="Planos_Terreno">
                    {(field) => {
                        const archivoActual = archivoSeleccionado["Planos_Terreno"] ?? null;
                        return (
                            <div className="w-full mb-2">
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
                                    id="planos_medidor_juridico"
                                    ref={planosInputRef}
                                    key={archivoActual ? archivoActual.name : 'planos'}
                                />
                                <label
                                    htmlFor="planos_medidor_juridico"
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
                                                setArchivoSeleccionado(prev => ({ ...prev, ["Planos_Terreno"]: null }));
                                                setFieldErrors(prev => ({
                                                    ...prev,
                                                    ["Planos_Terreno"]: `Debe subir el plano del terreno`,
                                                }));
                                                if (planosInputRef.current) planosInputRef.current.value = "";
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
                            <div className="w-full mb-2">
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
                                    id="escritura_medidor_juridico"
                                    ref={escrituraInputRef}
                                    key={archivoActual ? archivoActual.name : 'escritura'}
                                />
                                <label
                                    htmlFor="escritura_medidor_juridico"
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
                                                setArchivoSeleccionado(prev => ({ ...prev, ["Certificacion_Literal"]: null }));
                                                setFieldErrors(prev => ({
                                                    ...prev,
                                                    ["Certificacion_Literal"]: `Debe subir la certificacion literal del terreno`,
                                                }));
                                                if (escrituraInputRef.current) escrituraInputRef.current.value = "";
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

            {/* Botones */}
            <div className="flex justify-end items-center gap-3 mt-8">
                <button
                    type="submit"
                    className="w-[140px] py-2 rounded transition-colors bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-400 disabled:cursor-not-allowed text-sm font-medium"
                    disabled={
                        mutation.isPending ||
                        Object.values(form.state.values).some(val => val === undefined || val === null || val === "") ||
                        Object.values(fieldErrors).some(Boolean) ||
                        Object.values(formErrors).some(Boolean)
                    }
                >
                    {mutation.isPending ? 'Enviando...' : 'Enviar Solicitud'}
                </button>
                <button
                    type="button"
                    onClick={onClose}
                    disabled={mutation.isPending}
                    className="px-6 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    Cancelar
                </button>
            </div>
        </form>
    );
};

export default MedidorExtraJuridica;