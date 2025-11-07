import { useForm } from "@tanstack/react-form";
import { useRef, useState } from "react";
import { AfiliacionJuridicaSchema } from "../../../Schemas/Solicitudes/Juridica/AfiliacionJuridica";
import { useAfiliacionJuridica } from "../../../Hook/Solicitudes/HookJuridicas";
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

const FormularioAfiliacionJuridico = ({ onClose }: Props) => {
    const [archivoSeleccionado, setArchivoSeleccionado] = useState<{ [key: string]: File | null }>({});
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const mutation = useAfiliacionJuridica();
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
                Escritura_Terreno: new File([''], 'test.jpg', { type: 'image/jpeg' }),
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

    const form = useForm({
        defaultValues: {
            Razon_Social: '',
            Cedula_Juridica: '',
            Correo: '',
            Numero_Telefono: '',
            Direccion_Exacta: '',
            Planos_Terreno: undefined as File | undefined,
            Escritura_Terreno: undefined as File | undefined,
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

                await mutation.createAfiliacion(formData);

                form.reset();
                setFormErrors({ general: "¡Solicitud enviada con éxito!" });
                setArchivoSeleccionado({});
                setFieldErrors({});
                setArchivoSeleccionado({});
                alert("¡Solicitud enviada exitosamente!");
                setMostrarFormulario(false);
                if (onClose) onClose();
            } catch (error: any) {
                const backendMessage = error?.response?.data?.message;
                // Si el mensaje es "Ya existe un afiliado físico..." NO lo muestres
                if (
                    backendMessage &&
                    backendMessage.includes("Ya existe un afiliado físico con la identificación")
                ) {
                    // No mostrar nada, ni retornar
                } else if (
                    backendMessage &&
                    backendMessage.includes("Ya existe una solicitud activa de afiliación")
                ) {
                    setFormErrors({
                        general: "Ya existe una solicitud activa de afiliación con esa cédula",
                    });
                    return;
                } else {
                    setFormErrors({
                        general:
                            error?.message ||
                            "Hubo un error al enviar el formulario. Intenta nuevamente."
                    });
                }
            }
        },
    });

    if (!mostrarFormulario) return null;
    const commonClasses = 'w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300 bg-white';

    return (
        <div className="flex justify-center items-center min-h-screen text-gray-800 p-5 w-full">
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    form.handleSubmit();
                }}
                className="bg-white shadow-lg pl-24 pr-24 pt-8 pb-8 rounded-lg w-full max-w-7xl mx-auto"
            >
                <h2 className="text-center text-2xl font-bold mb-8 text-blue-700">Formulario de Afiliación Jurídica</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
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
                                    }}
                                    placeholder="Ejemplo S.A."
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
                                <input
                                    type="text"
                                    value={field.state.value}
                                    onChange={(e) => {
                                        const formatted = formatCedulaJuridica(e.target.value);
                                        field.handleChange(formatted);
                                        validateField("Cedula_Juridica", formatted);
                                    }}
                                    placeholder="3-XXX-XXXXXX"
                                    className={commonClasses}
                                    maxLength={12}
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
                            <div className="mb-3">
                                <label className="block mb-1 font-semibold text-gray-700">Correo electrónico <span className="text-red-500">*</span></label>
                                <input
                                    type="email"
                                    value={field.state.value}
                                    onChange={(e) => {
                                        field.handleChange(e.target.value);
                                        validateField("Correo", e.target.value);
                                    }}
                                    placeholder="empresa@email.com"
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
                                <input
                                    type="text"
                                    value={field.state.value}
                                    onChange={(e) => {
                                        field.handleChange(e.target.value);
                                        validateField("Direccion_Exacta", e.target.value);
                                    }}
                                    placeholder="San José, del Banco Nacional 200m sur"
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
                    <form.Field name="Escritura_Terreno">
                        {(field) => {
                            const archivoActual = archivoSeleccionado["Escritura_Terreno"] ?? null;
                            return (
                                <div className="mb-3">
                                    <label className="block mb-1 font-semibold text-gray-700">Escritura del terreno <span className="text-red-500">*</span></label>
                                    <input
                                        type="file"
                                        accept=".png,.jpg,.jpeg,.heic,.pdf"
                                        disabled={!!archivoActual}
                                        onChange={(e) => {
                                            const file = e.target.files?.[0] ?? null;
                                            field.handleChange(file ?? undefined);
                                            setArchivoSeleccionado(prev => ({ ...prev, ["Escritura_Terreno"]: file }));
                                            validateField("Escritura_Terreno", file);
                                        }}
                                        className="hidden"
                                        id="Escritura_Terreno"
                                        ref={escrituraInputRef}
                                        key={archivoActual ? archivoActual.name : 'escritura'}
                                    />
                                    <label
                                        htmlFor="Escritura_Terreno"
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
                                                    setFieldErrors(prev => ({
                                                        ...prev,
                                                        ["Escritura_Terreno"]: `Debe subir la escritura del terreno`,
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

                {/* Mensaje general */}
                {formErrors.general && (
                    <div className={`text-center mt-4 p-3 rounded ${formErrors.general.includes("éxito")
                        ? "text-green-600 bg-green-50 border border-green-200"
                        : "text-red-600 bg-red-50 border border-red-200"}`}>
                        {formErrors.general}
                    </div>
                )}

                <div className="flex justify-end items-end gap-4 mt-8">

                    <button
                        type="submit"
                        disabled={form.state.isSubmitting}
                        className={`w-[120px] py-2 rounded transition-colors ${form.state.isSubmitting
                            ? 'bg-gray-400 cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700'} text-white`}
                    >
                        {form.state.isSubmitting ? 'Enviando...' : 'Enviar'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default FormularioAfiliacionJuridico;