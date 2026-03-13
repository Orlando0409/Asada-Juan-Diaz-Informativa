
import { useForm } from "@tanstack/react-form";
import { useEffect, useRef, useState } from "react";
import { MedidorExtraFisicoSchema, TipoIdentificacionValues, type TipoIdentificacion } from "../../../Schemas/Solicitudes/Fisica/MedidorExtra";
import { useAgregarMedidorFisica, useMedidores } from "../../../Hook/Solicitudes/HookFisicas";
import { useCedulaLookup } from "../../../Hook/Solicitudes/CedulaLookHook";
import { useAlerts } from "../../../context/AlertContext";
import PhoneInputComponent from "../PhoneInputComponent";

type Props = {
    onClose: () => void;
};

const normalizePhoneNumber = (phone: string): string => {
    if (!phone.startsWith('+')) {
        throw new Error('El número debe incluir el código de país y comenzar con "+". Ejemplo: +50688887777');
    }
    return phone;
};

const STORAGE_KEY = 'medidor_extra_fisica_temp';

const MedidorExtraFisico = ({ onClose }: Props) => {
    const sanitizeNameInput = (value: string) => value.replace(/\d/g, "");
    const [archivoSeleccionado, setArchivoSeleccionado] = useState<{ [key: string]: File | null }>({});
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [identificacionValidada, setIdentificacionValidada] = useState<string>('');
    const [mostrarFormulario, _setMostrarFormulario] = useState(true);
    const [alertShown, setAlertShown] = useState<string>('');
    const planosInputRef = useRef<HTMLInputElement>(null);
    const escrituraInputRef = useRef<HTMLInputElement>(null);

    const mutation = useAgregarMedidorFisica();
    const { lookup, isLoading: loadingCedula } = useCedulaLookup();
    const { showSuccess, showError } = useAlerts();

    // Hook para obtener medidores existentes
    const { medidores, isLoading: loadingMedidores } = useMedidores(identificacionValidada);

    // Validación en tiempo real usando el schema
    const validateField = (fieldName: string, value: any, allValues?: any) => {
        try {
            const dummy: any = {
                Nombre: "Test",
                Apellido1: "Test",
                Apellido2: "",
                Tipo_Identificacion: "Cedula Nacional",
                Identificacion: "123456789",
                Direccion_Exacta: "1234567890",
                Numero_Telefono: "+50688887777",
                Correo: "test@test.com",
                Planos_Terreno: new File([''], 'test.jpg', { type: 'image/jpeg' }),
                Escritura_Terreno: new File([''], 'test.jpg', { type: 'image/jpeg' }),
            };

            if (fieldName === "Identificacion" && allValues?.Tipo_Identificacion) {
                dummy.Tipo_Identificacion = allValues.Tipo_Identificacion;
                dummy.Identificacion = value;
            } else if (fieldName === "Tipo_Identificacion" && allValues?.Identificacion) {
                dummy.Tipo_Identificacion = value;
                dummy.Identificacion = allValues.Identificacion;
            } else {
                dummy[fieldName] = value;
            }

            MedidorExtraFisicoSchema.parse(dummy);

            setFieldErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[fieldName];
                return newErrors;
            });
        } catch (error: any) {
            let errorMessage = '';
            if (error.errors && Array.isArray(error.errors)) {
                const fieldError = error.errors.find((err: any) => err.path.includes(fieldName));
                errorMessage = fieldError?.message || error.errors[0]?.message;
            } else if (error.message) {
                errorMessage = error.message;
            }
            setFieldErrors(prev => ({
                ...prev,
                [fieldName]: errorMessage,
            }));
        }
    };

    const handleIdentificacionInput = (value: string, tipoId: string): string => {
        switch (tipoId) {
            case "Cedula Nacional":
                return value.replace(/[^0-9]/g, '').slice(0, 9);
            case "Dimex":
                return value.replace(/[^0-9]/g, '').slice(0, 12);
            case "Pasaporte":
                return value.replace(/[^a-zA-Z0-9]/g, '').slice(0, 9).toUpperCase();
            default:
                return value;
        }
    };

    const handleCedulaChange = async (cedula: string) => {
        const tipoId = form.state.values.Tipo_Identificacion;
        const identificacion = handleIdentificacionInput(cedula, tipoId);

        form.setFieldValue('Identificacion', identificacion);
        validateField('Identificacion', identificacion, form.state.values);

        setFormErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors['Identificacion'];
            return newErrors;
        });

        // Buscar datos y validar si ya es afiliado
        if (tipoId === 'Cedula Nacional' && /^\d{9}$/.test(identificacion)) {
            setIdentificacionValidada(identificacion);

            const resultado = await lookup(identificacion);
            if (resultado) {
                form.setFieldValue('Nombre', resultado.firstname || '');
                form.setFieldValue('Apellido1', resultado.lastname1 || '');
                form.setFieldValue('Apellido2', resultado.lastname2 || '');
            }
        } else if ((tipoId === 'Dimex' && identificacion.length >= 9) ||
            (tipoId === 'Pasaporte' && identificacion.length >= 6)) {
            setIdentificacionValidada(identificacion);
        }
    };

    const getPlaceholder = (fieldName: string, tipoIdentificacion?: TipoIdentificacion) => {
        const placeholders: Record<string, string> = {
            Nombre: 'Juan Carlos',
            Apellido1: 'Pérez',
            Apellido2: 'González',
            Correo: 'ejemplo@gmail.com',
            Numero_Telefono: '+50688887777',
            Direccion_Exacta: 'San José, del Banco Nacional 200m sur',
        };
        if (fieldName === 'Identificacion') {
            switch (tipoIdentificacion) {
                case "Cedula Nacional": return '123456789';
                case "Dimex": return '123456789012';
                case "Pasaporte": return 'A1234567';
                default: return 'Seleccione tipo de identificación primero';
            }
        }
        return placeholders[fieldName] || '';
    };

    const saveToSessionStorage = (values: any) => {
        try {
            const dataToSave = {
                Nombre: values.Nombre,
                Apellido1: values.Apellido1,
                Apellido2: values.Apellido2,
                Tipo_Identificacion: values.Tipo_Identificacion,
                Identificacion: values.Identificacion,
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
            Nombre: '',
            Apellido1: '',
            Apellido2: '',
            Tipo_Identificacion: "Cedula Nacional",
            Identificacion: '',
            Correo: '',
            Direccion_Exacta: '',
            Numero_Telefono: '',
            Planos_Terreno: undefined as File | undefined,
            Escritura_Terreno: undefined as File | undefined,
        },

        onSubmit: async ({ value }) => {
            setFormErrors({});
            setFieldErrors({});

            // Verificar que sea afiliado (tenga medidores)
            if (!identificacionValidada || medidores.length === 0) {
                setFormErrors({ general: 'Debe ser un afiliado con al menos un medidor activo para solicitar un medidor adicional.' });
                return;
            }

            // Limpiar y trimear todos los campos de texto
            const cleanedValue = {
                ...value,
                Nombre: (value.Nombre || '').trim(),
                Apellido1: (value.Apellido1 || '').trim(),
                Apellido2: (value.Apellido2 || '').trim(),
                Correo: (value.Correo || '').trim(),
                Numero_Telefono: (value.Numero_Telefono || '').trim().replace(/\s/g, ''),
                Direccion_Exacta: (value.Direccion_Exacta || '').trim(),
                Planos_Terreno: value.Planos_Terreno,
                Escritura_Terreno: value.Escritura_Terreno,
            };

            try {
                cleanedValue.Numero_Telefono = normalizePhoneNumber(cleanedValue.Numero_Telefono);
            } catch (error: any) {
                setFormErrors({ Numero_Telefono: error.message });
                return;
            }

            const validation = MedidorExtraFisicoSchema.safeParse(cleanedValue);
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

            // Usar mutate en lugar de mutateAsync para que React Query maneje el estado automáticamente
            return new Promise<void>((resolve) => {
                mutation.mutate(formData, {
                    onSuccess: () => resolve(),
                    onError: () => resolve(),
                });
            });
        },
    });

    useEffect(() => {
        const savedData = sessionStorage.getItem(STORAGE_KEY);
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                const allowedKeys = [
                    'Nombre',
                    'Apellido1',
                    'Apellido2',
                    'Tipo_Identificacion',
                    'Identificacion',
                    'Correo',
                    'Numero_Telefono',
                    'Direccion_Exacta',
                ];

                Object.entries(parsed).forEach(([key, value]) => {
                    if (allowedKeys.includes(key)) {
                        form.setFieldValue(key as any, value as any);
                    }
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
        if (identificacionValidada && !loadingMedidores && !alertShown.includes(identificacionValidada)) {
            if (medidores.length > 0) {
                showSuccess(
                    " Eres un afiliado puedes seguir con la solicitud ",
                    `. Medidores actuales: ${medidores.length}`
                );
                setAlertShown(identificacionValidada);
            } else {
                showError(
                    " No Eres Afiliado",
                    "No puedes solicitar un medidor extra porque no eres un afiliado con medidores activos. Completa tu afiliación primero."
                );
                setAlertShown(identificacionValidada);
            }
        }
    }, [identificacionValidada, medidores.length, loadingMedidores, alertShown, showSuccess, showError]);

    if (!mostrarFormulario) return null;

    const commonClasses = 'w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring focus:ring-blue-300';

    return (
        <div className="flex justify-center text-gray-800 p-3 sm:p-4 w-full">
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    form.handleSubmit();
                }}
            >
                <h2 className="text-center text-xl font-bold mb-5 text-blue-700">Solicitud de Medidor Extra - Persona Física</h2>

                {formErrors.general && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                        {formErrors.general}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
                    {/* Tipo de Identificación */}
                    <div className="mb-3">
                        <form.Field name="Tipo_Identificacion">
                            {(field) => (
                                <div>
                                    <label className="block mb-1 font-medium">
                                        Tipo de Identificación <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={field.state.value}
                                        onChange={(e) => {
                                            field.handleChange(e.target.value);
                                            validateField('Tipo_Identificacion', e.target.value, form.state.values);
                                            form.setFieldValue('Identificacion', '');
                                            setIdentificacionValidada('');
                                            setFieldErrors(prev => {
                                                const newErrors = { ...prev };
                                                delete newErrors['Identificacion'];
                                                return newErrors;
                                            });
                                        }}
                                        className={commonClasses}
                                    >
                                        <option value="">Seleccione tipo de identificación</option>
                                        {TipoIdentificacionValues.map((tipo) => (
                                            <option key={tipo} value={tipo}>{tipo}</option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </form.Field>
                    </div>

                    {/* Número de Identificación */}
                    <div className="mb-3">
                        <form.Field name="Identificacion">
                            {(field) => (
                                <div>
                                    <label className="block mb-1 font-medium">
                                        Número de Identificación <span className="text-red-500">*</span>
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={field.state.value}
                                            onChange={(e) => handleCedulaChange(e.target.value)}
                                            placeholder={getPlaceholder('Identificacion', form.state.values.Tipo_Identificacion as TipoIdentificacion)}
                                            disabled={!form.state.values.Tipo_Identificacion || loadingCedula}
                                            className={`${commonClasses} ${(fieldErrors['Identificacion'] || formErrors['Identificacion']) ? 'border-red-500 focus:ring-red-300' : ''} ${!form.state.values.Tipo_Identificacion ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                                            maxLength={
                                                form.state.values.Tipo_Identificacion === 'Cedula Nacional' ? 9 :
                                                    form.state.values.Tipo_Identificacion === 'Dimex' ? 12 :
                                                        form.state.values.Tipo_Identificacion === 'Pasaporte' ? 9 : 20
                                            }
                                        />
                                        {loadingCedula && (
                                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                                <svg className="animate-spin h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                    {fieldErrors['Identificacion'] && (
                                        <span className="text-red-500 text-sm block mt-1">{fieldErrors['Identificacion']}</span>
                                    )}
                                    {formErrors['Identificacion'] && !fieldErrors['Identificacion'] && (
                                        <span className="text-red-500 text-sm block mt-1">{formErrors['Identificacion']}</span>
                                    )}
                                </div>
                            )}
                        </form.Field>
                    </div>

                    {/* Nombre */}
                    <form.Field name="Nombre">
                        {(field) => (
                            <div className="mb-3">
                                <label className="block mb-1 font-medium">Nombre <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    value={field.state.value}
                                    onChange={(e) => {
                                        const cleanValue = sanitizeNameInput(e.target.value);
                                        field.handleChange(cleanValue);
                                        validateField("Nombre", cleanValue, form.state.values);
                                        saveToSessionStorage({ ...form.state.values, Nombre: cleanValue });
                                    }}
                                    placeholder={getPlaceholder("Nombre")}
                                    maxLength={50}
                                    className={commonClasses}
                                />
                                {fieldErrors["Nombre"] && (
                                    <span className="text-red-500 text-sm block mt-1">{fieldErrors["Nombre"]}</span>
                                )}
                            </div>
                        )}
                    </form.Field>

                    {/* Primer Apellido */}
                    <form.Field name="Apellido1">
                        {(field) => (
                            <div className="mb-3">
                                <label className="block mb-1 font-medium">Primer Apellido <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    value={field.state.value}
                                    onChange={(e) => {
                                        const cleanValue = sanitizeNameInput(e.target.value);
                                        field.handleChange(cleanValue);
                                        validateField("Apellido1", cleanValue, form.state.values);
                                        saveToSessionStorage({ ...form.state.values, Apellido1: cleanValue });
                                    }}
                                    placeholder={getPlaceholder("Apellido1")}
                                    maxLength={50}
                                    className={commonClasses}
                                />
                                {fieldErrors["Apellido1"] && (
                                    <span className="text-red-500 text-sm block mt-1">{fieldErrors["Apellido1"]}</span>
                                )}
                            </div>
                        )}
                    </form.Field>

                    {/* Segundo Apellido */}
                    <form.Field name="Apellido2">
                        {(field) => (
                            <div className="mb-3">
                                <label className="block mb-1 font-medium">Segundo Apellido</label>
                                <input
                                    type="text"
                                    value={field.state.value}
                                    onChange={(e) => {
                                        const cleanValue = sanitizeNameInput(e.target.value);
                                        field.handleChange(cleanValue);
                                        validateField("Apellido2", cleanValue, form.state.values);
                                        saveToSessionStorage({ ...form.state.values, Apellido2: cleanValue });
                                    }}
                                    placeholder={getPlaceholder("Apellido2")}
                                    maxLength={50}
                                    className={commonClasses}
                                />
                                {fieldErrors["Apellido2"] && (
                                    <span className="text-red-500 text-sm block mt-1">{fieldErrors["Apellido2"]}</span>
                                )}
                            </div>
                        )}
                    </form.Field>

                    {/* Correo */}
                    <form.Field name="Correo">
                        {(field) => (
                            <div className="mb-3">
                                <label className="block mb-1 font-medium">Correo Electrónico <span className="text-red-500">*</span></label>
                                <input
                                    type="email"
                                    value={field.state.value}
                                    onChange={(e) => {
                                        field.handleChange(e.target.value);
                                        validateField("Correo", e.target.value, form.state.values);
                                        saveToSessionStorage({ ...form.state.values, Correo: e.target.value });
                                    }}
                                    placeholder={getPlaceholder("Correo")}
                                    maxLength={100}
                                    className={commonClasses}
                                />
                                {fieldErrors["Correo"] && (
                                    <span className="text-red-500 text-sm block mt-1">{fieldErrors["Correo"]}</span>
                                )}
                            </div>
                        )}
                    </form.Field>

                    {/* Número de Teléfono */}
                    <form.Field name="Numero_Telefono">
                        {(field) => (
                            <div className="mb-3">
                                <label className="block mb-1 font-medium">Número de Teléfono <span className="text-red-500">*</span></label>
                                <PhoneInputComponent
                                    value={field.state.value}
                                    onChange={(value) => {
                                        field.handleChange(value);
                                        validateField("Numero_Telefono", value, form.state.values);
                                        saveToSessionStorage({ ...form.state.values, Numero_Telefono: value });
                                    }}
                                    hasError={!!fieldErrors["Numero_Telefono"] || !!formErrors["Numero_Telefono"]}
                                />
                                {fieldErrors["Numero_Telefono"] && (
                                    <span className="text-red-500 text-sm block mt-1">{fieldErrors["Numero_Telefono"]}</span>
                                )}
                            </div>
                        )}
                    </form.Field>

                    {/* Dirección Exacta */}
                    <form.Field name="Direccion_Exacta">
                        {(field) => (
                            <div className="mb-3">
                                <label className="block mb-1 font-medium">Dirección Exacta <span className="text-red-500">*</span></label>
                                <input
                                    type="text"
                                    value={field.state.value}
                                    onChange={(e) => {
                                        field.handleChange(e.target.value);
                                        validateField("Direccion_Exacta", e.target.value, form.state.values);
                                        saveToSessionStorage({ ...form.state.values, Direccion_Exacta: e.target.value });
                                    }}
                                    placeholder={getPlaceholder("Direccion_Exacta")}
                                    maxLength={255}
                                    className={commonClasses}
                                />
                                {fieldErrors["Direccion_Exacta"] && (
                                    <span className="text-red-500 text-sm block mt-1">{fieldErrors["Direccion_Exacta"]}</span>
                                )}
                            </div>
                        )}
                    </form.Field>

                    {/* Planos del Terreno */}
                    <form.Field name="Planos_Terreno">
                        {(field) => {
                            const archivoActual = archivoSeleccionado["Planos_Terreno"] ?? null;
                            return (
                                <div className="w-full mb-2">
                                    <label htmlFor="Planos_Terreno" className="block mb-1 font-medium">Planos del terreno <span className="text-red-500">*</span></label>
                                    <input
                                        type="file"
                                        accept=".png,.jpg,.jpeg,.heic,.pdf"
                                        disabled={!!archivoActual}
                                        onChange={(e) => {
                                            const file = e.target.files?.[0] ?? null;
                                            field.handleChange(file ?? undefined);
                                            setArchivoSeleccionado(prev => ({ ...prev, ["Planos_Terreno"]: file }));
                                            validateField("Planos_Terreno", file ?? undefined, form.state.values);

                                            setFormErrors(prev => {
                                                const newErrors = { ...prev };
                                                delete newErrors["Planos_Terreno"];
                                                return newErrors;
                                            });
                                        }}
                                        className="hidden"
                                        id="Planos_Terreno"
                                        ref={planosInputRef}
                                        key={archivoActual ? archivoActual.name : 'planos'}
                                    />
                                    <label
                                        htmlFor="Planos_Terreno"
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

                    {/* Escritura del Terreno */}
                    <form.Field name="Escritura_Terreno">
                        {(field) => {
                            const archivoActual = archivoSeleccionado["Escritura_Terreno"] ?? null;
                            return (
                                <div className="w-full mb-2">
                                    <label htmlFor="Escritura_Terreno" className="block mb-1 font-medium">Escritura del terreno <span className="text-red-500">*</span></label>
                                    <input
                                        type="file"
                                        accept=".png,.jpg,.jpeg,.heic,.pdf"
                                        disabled={!!archivoActual}
                                        onChange={(e) => {
                                            const file = e.target.files?.[0] ?? null;
                                            field.handleChange(file ?? undefined);
                                            setArchivoSeleccionado(prev => ({ ...prev, ["Escritura_Terreno"]: file }));
                                            validateField("Escritura_Terreno", file ?? undefined, form.state.values);

                                            setFormErrors(prev => {
                                                const newErrors = { ...prev };
                                                delete newErrors["Escritura_Terreno"];
                                                return newErrors;
                                            });
                                        }}
                                        className="hidden"
                                        id="Escritura_Terreno"
                                        ref={escrituraInputRef}
                                        key={archivoActual ? archivoActual.name : 'escritura'}
                                    />
                                    <label
                                        htmlFor="Escritura_Terreno"
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
                                                    setArchivoSeleccionado(prev => ({ ...prev, ["Escritura_Terreno"]: null }));
                                                    setFieldErrors(prev => ({
                                                        ...prev,
                                                        ["Escritura_Terreno"]: `Debe subir la escritura del terreno`,
                                                    }));
                                                    if (escrituraInputRef.current) escrituraInputRef.current.value = "";
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

                {/* Botones */}
                <div className="flex justify-center gap-4 mt-6">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={mutation.isPending}
                        className="px-6 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                        disabled={!identificacionValidada || loadingMedidores || mutation.isPending}
                    >
                        {mutation.isPending ? 'Enviando...' : 'Enviar Solicitud'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default MedidorExtraFisico;