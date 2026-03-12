
import { useForm } from "@tanstack/react-form";
import { useEffect, useState } from "react";
import { MedidorExtraJuridicaSchema } from "../../../Schemas/Solicitudes/Juridica/MedidorExtraJuridica";
import { useAgregarMedidorJuridica, useMedidoresJuridica } from "../../../Hook/Solicitudes/HookJuridicas";
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
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [cedulaValidada, setCedulaValidada] = useState<string>('');
    const [mostrarFormulario, _setMostrarFormulario] = useState(true);
    const [alertShown, setAlertShown] = useState<string>('');

    const mutation = useAgregarMedidorJuridica();
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
                Motivo_Solicitud: "Necesito un medidor extra para mi negocio",
                Id_Nuevo_Medidor: "",
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
                Motivo_Solicitud: values.Motivo_Solicitud,
                Id_Nuevo_Medidor: values.Id_Nuevo_Medidor,
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
            Motivo_Solicitud: '',
            Id_Nuevo_Medidor: '',
        },

        onSubmit: ({ value }) => {
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
                Motivo_Solicitud: (value.Motivo_Solicitud || '').trim(),
                Id_Nuevo_Medidor: (value.Id_Nuevo_Medidor || '').trim() || undefined,
            };

            // Validar con Zod
            const validation = MedidorExtraJuridicaSchema.safeParse(cleanedValue);
            if (!validation.success) {
                const fieldErrors: Record<string, string> = {};
                validation.error.errors.forEach((err) => {
                    const field = err.path[0] as string;
                    fieldErrors[field] = err.message;
                });
                setFormErrors(fieldErrors);
                return;
            }

            // Usar mutate en lugar de mutateAsync para que React Query maneje el estado automáticamente
            mutation.mutate(validation.data);
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
            onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit();
            }}
        >
            <h2 className="text-center text-xl font-bold mb-5 text-blue-700">Solicitud de Medidor Extra - Persona Jurídica</h2>

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
                                maxLength={100}
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

                {/* ID Nuevo Medidor (Opcional) */}
                <form.Field name="Id_Nuevo_Medidor">
                    {(field) => (
                        <div className="mb-3">
                            <label className="block mb-1 font-semibold text-gray-700">
                                ID Nuevo Medidor (Opcional)
                            </label>
                            <input
                                type="text"
                                value={field.state.value}
                                onChange={(e) => {
                                    field.handleChange(e.target.value);
                                    saveToSessionStorage({ ...form.state.values, Id_Nuevo_Medidor: e.target.value });
                                }}
                                placeholder="Opcional"
                                className={commonClasses}
                            />
                        </div>
                    )}
                </form.Field>

                {/* Motivo de Solicitud - Ocupa 2 columnas */}
                <div className="md:col-span-2">
                    <form.Field name="Motivo_Solicitud">
                        {(field) => (
                            <div className="mb-3">
                                <label className="block mb-1 font-semibold text-gray-700">
                                    Motivo de la Solicitud <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    value={field.state.value}
                                    onChange={(e) => {
                                        field.handleChange(e.target.value);
                                        validateField("Motivo_Solicitud", e.target.value);
                                        saveToSessionStorage({ ...form.state.values, Motivo_Solicitud: e.target.value });
                                    }}
                                    placeholder="Explique brevemente por qué su empresa necesita un medidor adicional"
                                    maxLength={500}
                                    rows={4}
                                    className={commonClasses}
                                />
                                <div className="flex justify-between items-center mt-1">
                                    <div>
                                        {fieldErrors["Motivo_Solicitud"] && (
                                            <span className="text-red-500 text-sm">{fieldErrors["Motivo_Solicitud"]}</span>
                                        )}
                                        {formErrors["Motivo_Solicitud"] && !fieldErrors["Motivo_Solicitud"] && (
                                            <span className="text-red-500 text-sm">{formErrors["Motivo_Solicitud"]}</span>
                                        )}
                                    </div>
                                    <span className="text-xs text-gray-500">
                                        {field.state.value.length}/500
                                    </span>
                                </div>
                            </div>
                        )}
                    </form.Field>
                </div>
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
                    disabled={!cedulaValidada || medidores.length === 0 || mutation.isPending}
                >
                    {mutation.isPending ? 'Enviando...' : 'Enviar Solicitud'}
                </button>
            </div>
        </form>
    );
};

export default MedidorExtraJuridica;