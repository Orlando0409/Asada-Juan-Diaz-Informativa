import { useAlerts } from "../../../context/AlertContext";
import { useForm } from "@tanstack/react-form";
import { useEffect, useRef, useState } from "react";
import data from "../../../data/Data.json";
import { DesconexionJuridicaSchema, MotivoDesconexionValues } from "../../../Schemas/Solicitudes/Juridica/DesconexionMedidorJuridica";
import type { MotivoDesconexion } from "../../../Schemas/Solicitudes/Juridica/DesconexionMedidorJuridica";
import { useDesconexionJuridica, useMedidoresJuridica } from "../../../Hook/Solicitudes/HookJuridicas";
import { Loader2 } from "lucide-react";

type Props = {
    onClose: () => void;
};
const STORAGE_KEY = 'desconexionmedidor_juridica_temp';

// Función para formatear la cédula jurídica con guiones
function formatCedulaJuridica(value: string) {
    const digits = value.replace(/\D/g, "");
    let formatted = "";
    if (digits.length > 0) formatted += digits[0];
    if (digits.length > 1) formatted += "-" + digits.slice(1, 4);
    if (digits.length > 4) formatted += "-" + digits.slice(4, 10);
    return formatted;
}

const DesconexionMedidorJuridica = ({ onClose }: Props) => {
    const [archivoSeleccionado, setArchivoSeleccionado] = useState<{ [key: string]: File | null }>({});
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [isSending, setIsSending] = useState(false);
    const mutation = useDesconexionJuridica();
    const { showError } = useAlerts();
    const planosInputRef = useRef<HTMLInputElement>(null);
    const escrituraInputRef = useRef<HTMLInputElement>(null);

    const [mostrarFormulario, setMostrarFormulario] = useState(true);
    const [cedulaJuridica, setCedulaJuridica] = useState('');
    const { medidores, isLoading: isMedidoresLoading } = useMedidoresJuridica(cedulaJuridica);

    // Validación en tiempo real SOLO del campo editado
    const handleFieldChange = (fieldName: string, value: any) => {
        // Validación personalizada por campo
        switch (fieldName) {
            case 'Cedula_Juridica':
                if (!/^3-\d{3}-\d{6}$|^\d{10}$/.test(value)) {
                    setFieldErrors(prev => ({ ...prev, [fieldName]: 'La cédula jurídica debe tener el formato 3-XXX-XXXXXX o 10 dígitos' }));
                } else {
                    setFieldErrors(prev => { const newErrors = { ...prev }; delete newErrors[fieldName]; return newErrors; });
                }
                break;
            case 'Motivo_Desconexion':
                if (!value) {
                    setFieldErrors(prev => ({ ...prev, [fieldName]: 'Debe seleccionar una causa de desconexión válida' }));
                } else {
                    setFieldErrors(prev => { const newErrors = { ...prev }; delete newErrors[fieldName]; return newErrors; });
                }
                break;
            case 'Motivo_Otro':
                if (value && value.length > 250) {
                    setFieldErrors(prev => ({ ...prev, [fieldName]: 'La causa adicional no puede tener más de 250 caracteres' }));
                } else {
                    setFieldErrors(prev => { const newErrors = { ...prev }; delete newErrors[fieldName]; return newErrors; });
                }
                break;
        }
    };

    const saveToSessionStorage = (values: any) => {
        try {
            // Guardamos solo la cédula jurídica
            const dataToSave = {
                Cedula_Juridica: values.Cedula_Juridica,
            };
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
        } catch (error) {
            console.error('Error al guardar en sessionStorage:', error);
        }
    };

    const form = useForm({
        defaultValues: {
            Cedula_Juridica: '',
            Motivo_Desconexion: '' as MotivoDesconexion,
            Motivo_Otro: '',
            Id_Medidor: 0,
            Planos_Terreno: undefined as File | undefined,
            Certificacion_Literal: undefined as File | undefined,
        },

        onSubmit: async ({ value }) => {
            setFormErrors({});

            // Validar que sea afiliado (tenga medidores activos)
            if (!cedulaJuridica || medidores.length === 0) {
                showError(
                    "No Eres Afiliado",
                    "No puedes solicitar la desconexión porque no eres un afiliado con medidores activos. Completa tu afiliación primero."
                );
                return;
            }

            try {
                const validation = DesconexionJuridicaSchema.safeParse(value);
                if (!validation.success) {
                    const fieldErrors: Record<string, string> = {};
                    validation.error.errors.forEach((err) => {
                        const field = err.path[0] as string;
                        fieldErrors[field] = err.message;
                    });
                    setFormErrors(fieldErrors);
                    return;
                }

                const formData = new FormData();
                Object.entries(value).forEach(([key, val]) => {
                    if (val !== undefined && val !== null && val !== "") {
                        if (val instanceof File) formData.append(key, val);
                        else formData.append(key, val.toString());
                    }
                });

                setIsSending(true);
                await mutation.createDesconexion(formData);
                sessionStorage.removeItem(STORAGE_KEY);

                form.reset();
                setArchivoSeleccionado({});
                setFieldErrors({});
                setMostrarFormulario(false);
                onClose();
            } catch (error: any) {
                console.log("🔍 ERROR EN SOLICITUD DE DESCONEXIÓN JURÍDICA:", error);
            } finally {
                setIsSending(false);
            }
        },
    });

    const campos = data.juridica.desconexion;
    const commonClasses = 'w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring focus:ring-blue-300';

    // Labels para los campos jurídicos
    const fieldLabels: { [key: string]: string } = {
        Cedula_Juridica: "Cédula Jurídica",
        Motivo_Desconexion: "Motivo de la Desconexión",
        Motivo_Otro: "Por favor especifique",
        Planos_Terreno: "Planos del Terreno",
        Certificacion_Literal: "Certificacion Literal del Terreno"
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
                        // Si es la cédula jurídica, también actualizar el estado
                        if (key === 'Cedula_Juridica' && typeof value === 'string') {
                            setCedulaJuridica(value.replace(/-/g, ''));
                        }
                    }
                });
            } catch (error) {
                console.error('Error al cargar datos guardados:', error);
            }
        }
    }, []);

    //strar alert cuando se verifica afiliación (igual que DesconexionFisica)
    useEffect(() => {
        if (
            cedulaJuridica &&
            !isMedidoresLoading &&
            cedulaJuridica.length >= 10 // cédula jurídica CR tiene 10 dígitos
        ) {
            if (medidores.length === 0) {
                showError(
                    "No Eres Afiliado",
                    "No puedes solicitar la desconexión porque no eres un afiliado con medidores activos. Completa tu afiliación primero."
                );
            }
        }
    }, [cedulaJuridica, medidores.length, isMedidoresLoading, showError]);

    if (!mostrarFormulario) return null;

    return (
        <div className="flex justify-center text-gray-800 p-3 sm:p-4 w-full">
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    form.handleSubmit();
                }}
                className="bg-white gap-2 shadow-lg px-5 py-3 sm:px-6 sm:py-4 rounded-[24px] w-[95%] max-w-7xl mx-auto scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-blue-100"
            >
                <h2 className="text-center text-xl font-semibold mb-6">Formulario de desconexión de medidor - Jurídica</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                    {/* Campo Cédula Jurídica */}
                    <form.Field name="Cedula_Juridica">
                        {(field) => (
                            <div className="mb-3 w-full">
                                <label className="block mb-1 font-medium">
                                    {fieldLabels["Cedula_Juridica"]}
                                    <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={typeof field.state.value === "string" ? field.state.value : ""}
                                        onChange={(e) => {
                                            const formatted = formatCedulaJuridica(e.target.value);
                                            const cedula = formatted.replace(/-/g, '');
                                            field.handleChange(formatted);
                                            handleFieldChange("Cedula_Juridica", formatted);
                                            setCedulaJuridica(cedula);
                                            form.setFieldValue('Id_Medidor', 0);
                                            saveToSessionStorage({ ...form.state.values, Cedula_Juridica: formatted });
                                        }}
                                        placeholder="3-XXX-XXXXXX"
                                        className={commonClasses}
                                        maxLength={255}
                                    />
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

                    {/* Campo Motivo de Desconexión */}
                    <form.Field name="Motivo_Desconexion">
                        {(field) => (
                            <div className="mb-3 w-full">
                                <label className="block mb-1 font-medium">
                                    {fieldLabels["Motivo_Desconexion"]}
                                    <span className="text-red-500">*</span>
                                </label>
                                <select
                                    value={(field.state.value as string) || ""}
                                    onChange={(e) => {
                                        const value = e.target.value as MotivoDesconexion;
                                        field.handleChange(value);
                                        handleFieldChange("Motivo_Desconexion", value);
                                        if (value !== 'Otro (especifique)') {
                                            form.setFieldValue('Motivo_Otro', '');
                                        }
                                    }}
                                    className={commonClasses}
                                >
                                    <option value="" disabled selected>Elije una opcion</option>
                                    {MotivoDesconexionValues.map((motivo) => (
                                        <option key={motivo} value={motivo}>{motivo}</option>
                                    ))}
                                </select>
                                {fieldErrors["Motivo_Desconexion"] && (
                                    <span className="text-red-500 text-sm block mt-1">{fieldErrors["Motivo_Desconexion"]}</span>
                                )}
                                {formErrors["Motivo_Desconexion"] && !fieldErrors["Motivo_Desconexion"] && (
                                    <span className="text-red-500 text-sm block mt-1">{formErrors["Motivo_Desconexion"]}</span>
                                )}
                            </div>
                        )}
                    </form.Field>

                    {/* Campo Motivo Otro (textarea condicional) */}
                    {form.state.values.Motivo_Desconexion === 'Otro (especifique)' && (
                        <form.Field name="Motivo_Otro">
                            {(field) => (
                                <div className="mb-3 w-full md:col-span-2">
                                    <label className="block mb-1 font-medium">
                                        {fieldLabels["Motivo_Otro"]}
                                        <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        value={field.state.value as string}
                                        onChange={(e) => {
                                            field.handleChange(e.target.value);
                                            handleFieldChange("Motivo_Otro", e.target.value);
                                        }}
                                        placeholder={fieldLabels["Motivo_Otro"]}
                                        maxLength={250}
                                        className={`${commonClasses} resize-none h-24 overflow-y-auto scrollbar-thumb-blue-600 scrollbar-thin scrollbar-track-blue-100`}
                                        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                                    />
                                    {fieldErrors["Motivo_Otro"] && (
                                        <span className="text-red-500 text-sm block mt-1">{fieldErrors["Motivo_Otro"]}</span>
                                    )}
                                    {formErrors["Motivo_Otro"] && !fieldErrors["Motivo_Otro"] && (
                                        <span className="text-red-500 text-sm block mt-1">{formErrors["Motivo_Otro"]}</span>
                                    )}
                                </div>
                            )}
                        </form.Field>
                    )}

                    {/* Campo Id_Medidor */}
                    <form.Field name="Id_Medidor">
                        {(field) => (
                            <div className="mb-3 w-full">
                                <label className="block mb-1 font-medium">
                                    Medidor <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <select
                                        value={typeof field.state.value === "number" ? field.state.value || "" : ""}
                                        onChange={(e) => {
                                            const value = e.target.value ? Number(e.target.value) : 0;
                                            field.handleChange(value);
                                            handleFieldChange("Id_Medidor", value);
                                        }}
                                        disabled={!cedulaJuridica || isMedidoresLoading}
                                        className={`${commonClasses} ${fieldErrors["Id_Medidor"] ? 'border-red-500 focus:ring-red-300' : ''} ${!cedulaJuridica ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                                    >
                                        <option value="">Selecciona un medidor</option>
                                        {medidores && medidores.length > 0 ? (
                                            medidores.map((medidor) => (
                                                <option key={medidor.Id_Medidor} value={medidor.Id_Medidor || ""}>
                                                    {medidor.Numero_Medidor} {medidor.Estado ? `(${medidor.Estado})` : ""}
                                                </option>
                                            ))
                                        ) : (
                                            !isMedidoresLoading && cedulaJuridica && (
                                                <option disabled>No se encontraron medidores</option>
                                            )
                                        )}
                                    </select>
                                    {isMedidoresLoading && (
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                            <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                                        </div>
                                    )}
                                </div>
                                {fieldErrors["Id_Medidor"] && (
                                    <span className="text-red-500 text-sm block mt-1">{fieldErrors["Id_Medidor"]}</span>
                                )}
                                {formErrors["Id_Medidor"] && !fieldErrors["Id_Medidor"] && (
                                    <span className="text-red-500 text-sm block mt-1">{formErrors["Id_Medidor"]}</span>
                                )}
                            </div>
                        )}
                    </form.Field>

                    {/* Campos de archivos*/}
                    {Object.entries(campos)
                        .filter(([fieldName]) => fieldName === "Planos_Terreno" || fieldName === "Certificacion_Literal")
                        .map(([fieldName, fieldProps]) => (
                            <form.Field key={fieldName} name={fieldName as keyof typeof form.state.values}>
                                {(field) => {
                                    const archivoActual = archivoSeleccionado[fieldName] ?? null;
                                    return (
                                        <div className="mb-3 w-full">
                                            <label className="block mb-1 font-medium">
                                                {fieldLabels[fieldName]}
                                                {fieldProps.required && <span className="text-red-500">*</span>}
                                            </label>
                                            <input
                                                type="file"
                                                accept=".png,.jpg,.jpeg,.heic,.pdf"
                                                disabled={!!archivoActual}
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0] ?? undefined;
                                                    field.handleChange(file);
                                                    setArchivoSeleccionado(prev => ({ ...prev, [fieldName]: file ?? null }));
                                                    handleFieldChange(fieldName, file);
                                                }}
                                                className="hidden"
                                                id={fieldName}
                                                ref={fieldName === "Planos_Terreno" ? planosInputRef : escrituraInputRef}
                                                key={archivoActual ? archivoActual.name : fieldName}
                                            />
                                            <label
                                                htmlFor={fieldName}
                                                className={`inline-block text-white bg-blue-600 px-3 py-1 rounded text-sm ${archivoActual ? 'cursor-not-allowed opacity-50' : 'hover:bg-blue-700 cursor-pointer'}`}
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
                                                            setArchivoSeleccionado(prev => ({ ...prev, [fieldName]: null }));
                                                            setFieldErrors(prev => ({
                                                                ...prev,
                                                                [fieldName]: `Debe subir el archivo`,
                                                            }));
                                                            if (fieldName === "Planos_Terreno" && planosInputRef.current) {
                                                                planosInputRef.current.value = '';
                                                            }
                                                            if (fieldName === "Certificacion_Literal" && escrituraInputRef.current) {
                                                                escrituraInputRef.current.value = '';
                                                            }
                                                        }}
                                                        className="text-red-500 hover:underline text-xs"
                                                    >
                                                        Eliminar
                                                    </button>
                                                </div>
                                            )}
                                            {fieldErrors[fieldName] && (
                                                <span className="text-red-500 text-sm block mt-1">{fieldErrors[fieldName]}</span>
                                            )}
                                            {formErrors[fieldName] && !fieldErrors[fieldName] && (
                                                <span className="text-red-500 text-sm block mt-1">{formErrors[fieldName]}</span>
                                            )}
                                        </div>
                                    );
                                }}
                            </form.Field>
                        ))}
                </div>

                <div className="flex justify-center gap-4 mt-6 ml-50">

                    <button
                        type="submit"
                        className="w-[140px] py-2 rounded transition-colors bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-400 disabled:cursor-not-allowed text-sm font-medium"
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
                        className="px-6 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        Cancelar
                    </button>

                </div>
            </form>
        </div>
    );
};

export default DesconexionMedidorJuridica;