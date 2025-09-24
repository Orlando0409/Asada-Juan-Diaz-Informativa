import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import data from "../../../data/Data.json";
import { CambioMedidorSchema, TipoIdentificacionValues, type TipoIdentificacion } from "../../../Schemas/Solicitudes/Fisica/CambioMedidor";
import { useCambioMedidor } from "../../../Hook/Solicitudes/Fisico/hookCambioMedidor";

type AxiosError = {
  response?: {
    data?: {
      message?: string;
    };
  };
  message: string;
};

type SolicitudTipo = "cambioMedidor";
type Props = {
  tipo: SolicitudTipo;
  onClose: () => void;
};

const FormularioCambioMedidor = ({ tipo, onClose }: Props) => {
  const [archivoSeleccionado, setArchivoSeleccionado] = useState<{ [key: string]: File | null }>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const mutation = useCambioMedidor();
  const [mostrarFormulario] = useState(true);

  // Validación en tiempo real usando el schema
  const validateField = (fieldName: string, value: any, allValues?: any) => {
    try {
      const dummy: any = {
        Nombre: "Test",
        Apellido1: "Test",
        Apellido2: "",
        Tipo_Identificacion: "Cedula Nacional",
        Identificacion: "123456789",
        Direccion_Exacta: "Dirección válida",
        Numero_Telefono: "12345678",
        Correo: "test@test.com",
        Motivo_Solicitud: "Motivo válido",
        Numero_Medidor_Anterior: 1234567,
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

      CambioMedidorSchema.parse(dummy);

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

  const getPlaceholder = (fieldName: string, tipoIdentificacion?: TipoIdentificacion) => {
    const placeholders: Record<string, string> = {
      Nombre: 'Juan Carlos',
      Apellido1: 'Pérez',
      Apellido2: 'González (opcional)',
      Correo: 'ejemplo@gmail.com',
      Numero_Telefono: '88887777',
      Direccion_Exacta: 'San José, del Banco Nacional 200m sur',
      Motivo_Solicitud: 'Escribe el motivo de tu solicitud',
      Numero_Medidor_Anterior: '1234567',
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

  const form = useForm({
    defaultValues: {
      Nombre: "",
      Apellido1: "",
      Apellido2: "",
      Tipo_Identificacion: "Cedula Nacional",
      Identificacion: "",
      Direccion_Exacta: "",
      Numero_Telefono: "",
      Correo: "",
      Motivo_Solicitud: "",
      Numero_Medidor_Anterior: 0,
    },

    onSubmit: async ({ value }) => {
      setFormErrors({});
      const validationErrors: Record<string, string> = {};
      const validation = CambioMedidorSchema.safeParse(value);
      if (!validation.success) {
        validation.error.errors.forEach((err) => {
          const field = err.path[0] as string;
          if (!validationErrors[field]) {
            validationErrors[field] = err.message; // Solo el primer error por campo
          }
        });
        setFormErrors(validationErrors);
        return;
      }

      try {
        const formData = new FormData();
        Object.entries(value).forEach(([key, val]) => {
          if (val !== undefined && val !== null && val !== "") {
            formData.append(key, val.toString());
          }
        });

        await mutation.createCambioMedidor(formData);

        form.reset();
        setFormErrors({ general: "¡Solicitud enviada con éxito!" });
        setFieldErrors({});
        setArchivoSeleccionado({});
      } catch (error: unknown) {
        let errorMsg = '';
        if (
          typeof error === "object" &&
          error !== null &&
          "response" in error &&
          "message" in error
        ) {
          errorMsg =
            (error as AxiosError).response?.data?.message ||
            (error as AxiosError).message;
        } else if (error instanceof Error) {
          errorMsg = error.message;
        } else {
          errorMsg = String(error);
        }
        setFormErrors({
          general: errorMsg,
        });
      }
    },
  });

  if (!mostrarFormulario) return null;

  const campos = data.requisitosSolicitudes[tipo];
  const commonClasses = 'w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300';

  return (
    <div className="flex justify-center items-center min-h-screen text-gray-800 p-5 w-full">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="bg-white gap-2 shadow-lg pl-8 pr-8 pt-4 pb-4 rounded-lg w-full max-w-9xl overflow-y-auto"
      >
        <h2 className="text-center text-xl font-semibold mb-6">Formulario de cambio de medidor</h2>

        {/* Campos dinámicos */}
        {Object.entries(campos).map(([fieldName, fieldProps]) => {
          // OMITIR "Tipo_Identificacion", "Identificacion" y archivos
          if (fieldName === "Tipo_Identificacion" || fieldName === "Identificacion" || fieldProps.type === 'file') return null;
          return (
            <form.Field key={fieldName} name={fieldName as keyof typeof form.state.values}>
              {(field) => (
                <div className="mb-3">
                  <label className="block mb-1 font-medium">
                    {fieldProps.label}
                    {fieldProps.required && <span className="text-red-500">*</span>}
                  </label>
                  {fieldName === "Motivo_Solicitud" ? (
                    <textarea
                      value={field.state.value as string}
                      onBlur={field.handleBlur}
                      onChange={(e) => {
                        field.handleChange(e.target.value);
                        validateField(fieldName, e.target.value, form.state.values);
                      }}
                      placeholder={getPlaceholder(fieldName)}
                      className={`${commonClasses} resize-none h-24 overflow-y-scroll`}
                    />
                  ) : (
                    <input
                      type={fieldProps.type === "email" ? "email" : fieldProps.type === "number" ? "number" : "text"}
                      value={(field.state.value as string | number) ?? ""}
                      onBlur={field.handleBlur}
                      onChange={(e) => {
                        const value = fieldProps.type === "number" ? Number(e.target.value) : e.target.value;
                        field.handleChange(value);
                        validateField(fieldName, value, form.state.values);
                      }}
                      placeholder={getPlaceholder(fieldName)}
                      className={`${commonClasses} ${fieldErrors[fieldName] ? 'border-red-500 focus:ring-red-300' : ''}`}
                    />
                  )}
                  {/* Solo muestra el primer error por campo */}
                  {fieldErrors[fieldName] && (
                    <span className="text-red-500 text-sm block mt-1">
                      {fieldErrors[fieldName]}
                    </span>
                  )}
                  {formErrors[fieldName] && !fieldErrors[fieldName] && (
                    <span className="text-red-500 text-sm block mt-1">
                      {formErrors[fieldName]}
                    </span>
                  )}
                </div>
              )}
            </form.Field>
          );
        })}

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
                    setFieldErrors(prev => {
                      const newErrors = { ...prev };
                      delete newErrors['Identificacion'];
                      return newErrors;
                    });
                  }}
                  className={`${commonClasses} ${fieldErrors['Tipo_Identificacion'] ? 'border-red-500 focus:ring-red-300' : ''}`}
                >
                  <option value="">Seleccione tipo de identificación</option>
                  {TipoIdentificacionValues.map((tipo) => (
                    <option key={tipo} value={tipo}>{tipo}</option>
                  ))}
                </select>
                {fieldErrors['Tipo_Identificacion'] && (
                  <span className="text-red-500 text-sm block mt-1">
                    {fieldErrors['Tipo_Identificacion']}
                  </span>
                )}
                {formErrors['Tipo_Identificacion'] && !fieldErrors['Tipo_Identificacion'] && (
                  <span className="text-red-500 text-sm block mt-1">
                    {formErrors['Tipo_Identificacion']}
                  </span>
                )}
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
                <input
                  type="text"
                  value={field.state.value}
                  onChange={(e) => {
                    field.handleChange(e.target.value);
                    validateField('Identificacion', e.target.value, form.state.values);
                  }}
                  placeholder={getPlaceholder('Identificacion', form.state.values.Tipo_Identificacion as TipoIdentificacion)}
                  disabled={!form.state.values.Tipo_Identificacion}
                  className={`${commonClasses} ${fieldErrors['Identificacion'] ? 'border-red-500 focus:ring-red-300' : ''} ${!form.state.values.Tipo_Identificacion ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                />
                {fieldErrors['Identificacion'] && (
                  <span className="text-red-500 text-sm block mt-1">
                    {fieldErrors['Identificacion']}
                  </span>
                )}
                {formErrors['Identificacion'] && !fieldErrors['Identificacion'] && (
                  <span className="text-red-500 text-sm block mt-1">
                    {formErrors['Identificacion']}
                  </span>
                )}
              </div>
            )}
          </form.Field>
        </div>

        {/* Mensaje general */}
        {formErrors.general && (
          <div className={`text-center mt-4 ${formErrors.general.includes("éxito") ? "text-green-600" : "text-red-500"}`}>
            {formErrors.general}
          </div>
        )}

        <div className="flex justify-end items-end gap-4">
          <button
            type="button"
            onClick={onClose}
            className="w-[120px] bg-blue-900 text-white py-2 rounded hover:bg-blue-800 transition"
          >
            Cerrar
          </button>
          <div className="flex justify-end items-end mt-6">
            <button
              type="submit"
              disabled={form.state.isSubmitting}
              className={`
              w-[120px] py-2 rounded transition
              ${form.state.isSubmitting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-900 hover:bg-blue-800'
                } text-white
            `}
            >
              {form.state.isSubmitting ? 'Enviando...' : 'Enviar'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default FormularioCambioMedidor;