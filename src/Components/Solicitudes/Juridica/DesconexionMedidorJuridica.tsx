import { useForm } from "@tanstack/react-form";
import { useRef, useState } from "react";
import data from "../../../data/Data.json";
import { DesconexionJuridicaSchema } from "../../../Schemas/Solicitudes/Juridica/DesconexionMedidorJuridica";
import { useDesconexionJuridica } from "../../../Hook/Solicitudes/Juridica/hookDesconexionJuridica";
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

type SolicitudTipo = 'desconexion';

type Props = {
    tipo: SolicitudTipo;
    onClose: () => void;
};

const normalizePhoneNumber = (phone: string): string => {
    const phoneNumber = parsePhoneNumberFromString(phone);
    if (!phoneNumber || !phoneNumber.isValid()) {
        throw new Error('Debe ingresar un número de teléfono válido con código de país, ej. +50688887777');
    }
    return phoneNumber.format('E.164');
};

// Función para formatear la cédula jurídica con guiones
function formatCedulaJuridica(value: string) {
  const digits = value.replace(/\D/g, "");
  let formatted = "";
  if (digits.length > 0) formatted += digits[0];
  if (digits.length > 1) formatted += "-" + digits.slice(1, 4);
  if (digits.length > 4) formatted += "-" + digits.slice(4, 10);
  return formatted;
}

const DesconexionMedidorJuridica = ({ tipo, onClose }: Props) => {
    const [archivoSeleccionado, setArchivoSeleccionado] = useState<{ [key: string]: File | null }>({});
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const mutation = useDesconexionJuridica();
    const planosInputRef = useRef<HTMLInputElement>(null);
    const escrituraInputRef = useRef<HTMLInputElement>(null);

    const [mostrarFormulario, setMostrarFormulario] = useState(true);

    // Validación en tiempo real usando el schema
    const validateField = (fieldName: string, value: any, allValues?: any) => {
        try {
            // Crea un objeto dummy con valores válidos para todos los campos
            const dummy: any = {
                Razon_Social: "Empresa S.A.",
                Cedula_Juridica: "3-123-123456",
                Direccion_Exacta: "San José, Costa Rica",
                Correo: "empresa@email.com",
                Numero_Telefono: "+50688887777",
                Motivo_Solicitud: "Motivo válido",
                Planos_Terreno: new File([''], 'test.jpg', { type: 'image/jpeg' }),
                Escritura_Terreno: new File([''], 'test.jpg', { type: 'image/jpeg' }),
            };
            dummy[fieldName] = value;

            DesconexionJuridicaSchema.parse(dummy);

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
            Direccion_Exacta: '',
            Correo: '',
            Numero_Telefono: '',
            Motivo_Solicitud: '',
            Planos_Terreno: undefined as File | undefined,
            Escritura_Terreno: undefined as File | undefined,
        },

        onSubmit: async ({ value }) => {
            setFormErrors({});

            try {
                value.Numero_Telefono = normalizePhoneNumber(value.Numero_Telefono);

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

                await mutation.createDesconexionJuridica(formData);

                form.reset();
                setFormErrors({ general: "¡Solicitud enviada con éxito!" });
                setArchivoSeleccionado({});
                setFieldErrors({});
                alert("¡Solicitud enviada exitosamente!");
                setMostrarFormulario(false);
                if (onClose) onClose();
            } catch (error: any) {
                let errorMessage = "Error al enviar solicitud";
                if (error?.response?.data?.message) {
                    errorMessage = error.response.data.message;
                } else if (error?.message) {
                    errorMessage = error.message;
                }
                setFormErrors({ general: errorMessage });
            }
        },
    });

    if (!mostrarFormulario) return null;

    const campos = data.juridica.desconexion;
    const commonClasses = 'w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300';

    // Labels para los campos jurídicos
    const fieldLabels: { [key: string]: string } = {
        Razon_Social: "Razón Social",
        Cedula_Juridica: "Cédula Jurídica",
        Direccion_Exacta: "Dirección Exacta",
        Correo: "Correo Electrónico",
        Numero_Telefono: "Número de Teléfono",
        Motivo_Solicitud: "Motivo de la Solicitud",
        Planos_Terreno: "Planos del Terreno",
        Escritura_Terreno: "Escritura del Terreno"
    };

    return (
        <div className="flex justify-center items-center min-h-screen text-gray-800 p-5 w-full">
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    form.handleSubmit();
                }}
                className="bg-white gap-2 shadow-lg pl-24 pr-24 pt-8 pb-8 rounded-lg w-full max-w-7xl mx-auto"
            >
                <h2 className="text-center text-2xl font-semibold mb-10">Formulario de desconexión de medidor - Jurídica</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                    {/* Campos dinámicos */}
                    {Object.entries(campos).map(([fieldName, fieldProps]) => (
                        <form.Field key={fieldName} name={fieldName as keyof typeof form.state.values}>
                            {(field) => {
                                // Teléfono internacional
                                if (fieldName === "Numero_Telefono") {
                                    return (
                                        <div className="mb-3 w-full">
                                            <label className="block mb-1 font-medium">
                                                {fieldLabels[fieldName]}
                                                {fieldProps.required && <span className="text-red-500">*</span>}
                                            </label>
                                            <PhoneInput
                                                international
                                                defaultCountry="CR"
                                                value={typeof field.state.value === "string" ? field.state.value : ""}
                                                onChange={(value) => {
                                                    field.handleChange(value || "");
                                                    validateField(fieldName, value || "", form.state.values);
                                                }}
                                                className={`${commonClasses} ${fieldErrors[fieldName] ? 'border-red-500 focus:ring-red-300' : ''}`}
                                            />
                                            {fieldErrors[fieldName] && (
                                                <span className="text-red-500 text-sm block mt-1">{fieldErrors[fieldName]}</span>
                                            )}
                                            {formErrors[fieldName] && !fieldErrors[fieldName] && (
                                                <span className="text-red-500 text-sm block mt-1">{formErrors[fieldName]}</span>
                                            )}
                                        </div>
                                    );
                                }

                                // Cédula Jurídica con guiones
                                if (fieldName === "Cedula_Juridica") {
                                  return (
                                    <div className="mb-3 w-full">
                                      <label className="block mb-1 font-medium">
                                        {fieldLabels[fieldName]}
                                        {fieldProps.required && <span className="text-red-500">*</span>}
                                      </label>
                                      <input
                                        type="text"
                                        value={typeof field.state.value === "string" ? field.state.value : ""}
                                        onChange={(e) => {
                                          const formatted = formatCedulaJuridica(e.target.value);
                                          field.handleChange(formatted);
                                          validateField(fieldName, formatted, form.state.values);
                                        }}
                                        placeholder="3-XXX-XXXXXX"
                                        className={commonClasses}
                                        maxLength={12}
                                      />
                                      {fieldErrors[fieldName] && (
                                        <span className="text-red-500 text-sm block mt-1">{fieldErrors[fieldName]}</span>
                                      )}
                                      {formErrors[fieldName] && !fieldErrors[fieldName] && (
                                        <span className="text-red-500 text-sm block mt-1">{formErrors[fieldName]}</span>
                                      )}
                                    </div>
                                  );
                                }

                                // Archivos
                                if (fieldName === "Planos_Terreno" || fieldName === "Escritura_Terreno") {
                                    const archivoActual = archivoSeleccionado[fieldName] ?? null;
                                    return (
                                        <div className="mb-3 w-full">
                                            <label className="block mb-1 font-medium">
                                                {fieldLabels[fieldName]}
                                                {fieldProps.required && <span className="text-red-500">*</span>}
                                            </label>
                                            <input
                                                type="file"
                                                accept=".png,.jpg,.jpeg,.heic"
                                                disabled={!!archivoActual}
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0] ?? undefined;
                                                    field.handleChange(file);
                                                    setArchivoSeleccionado(prev => ({ ...prev, [fieldName]: file ?? null }));
                                                    validateField(fieldName, file, form.state.values);
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
                                                            if (fieldName === "Escritura_Terreno" && escrituraInputRef.current) {
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
                                }

                                // Motivo de Solicitud (textarea)
                                if (fieldName === "Motivo_Solicitud") {
                                    return (
                                        <div className="mb-3 w-full">
                                            <label className="block mb-1 font-medium">
                                                {fieldLabels[fieldName]}
                                                {fieldProps.required && <span className="text-red-500">*</span>}
                                            </label>
                                            <textarea
                                                value={field.state.value as string}
                                                onChange={(e) => {
                                                    field.handleChange(e.target.value);
                                                    validateField(fieldName, e.target.value, form.state.values);
                                                }}
                                                placeholder={fieldLabels[fieldName]}
                                                className={`${commonClasses} resize-none h-24 overflow-y-scroll`}
                                                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                                            />
                                            {fieldErrors[fieldName] && (
                                                <span className="text-red-500 text-sm block mt-1">{fieldErrors[fieldName]}</span>
                                            )}
                                            {formErrors[fieldName] && !fieldErrors[fieldName] && (
                                                <span className="text-red-500 text-sm block mt-1">{formErrors[fieldName]}</span>
                                            )}
                                        </div>
                                    );
                                }

                                // Otros campos
                                return (
                                    <div className="mb-3 w-full">
                                        <label className="block mb-1 font-medium">
                                            {fieldLabels[fieldName]}
                                            {fieldProps.required && <span className="text-red-500">*</span>}
                                        </label>
                                        <input
                                            type={fieldName === "Correo" ? "email" : "text"}
                                            value={(field.state.value as string | number) ?? ""}
                                            onChange={(e) => {
                                                field.handleChange(e.target.value);
                                                validateField(fieldName, e.target.value, form.state.values);
                                            }}
                                            placeholder={fieldLabels[fieldName]}
                                            className={commonClasses}
                                        />
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

                {/* Mensaje general de éxito */}
                {formErrors.general && (
                    <div className={`text-center mt-4 ${formErrors.general.includes("éxito") ? "text-green-600" : "text-red-500"}`}>
                        {formErrors.general}
                    </div>
                )}

                <div className="flex justify-end items-end gap-4 mt-8">
                    <button
                        type="submit"
                        disabled={form.state.isSubmitting}
                        className={`w-[120px] py-2 rounded transition ${form.state.isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-900 hover:bg-blue-800'} text-white`}
                    >
                        {form.state.isSubmitting ? 'Enviando...' : 'Enviar'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default DesconexionMedidorJuridica;