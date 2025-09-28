import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { AsociadoSchema, TipoIdentificacionValues, type TipoIdentificacion } from "../../../Schemas/Solicitudes/Fisica/Asociado";

import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import data from "../../../data/Data.json";

import { useAsociadoMedidor } from "../../../Hook/Solicitudes/Fisico/hookAsociado";

type AxiosError = {
  response?: {
    data?: {
      message?: string;
    };
  };
  message: string;
};

type SolicitudTipo = "asociado";

type Props = {
  tipo: SolicitudTipo;
  onClose: () => void;
};

const normalizePhoneNumber = (phone: string): string => {
  if (!phone || !phone.startsWith('+')) {
    throw new Error('El número debe incluir el código de país y comenzar con "+". Ejemplo: +50688887777');
  }
  return phone;
};

const FormularioAsociado = ({ tipo, onClose }: Props) => {
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const mutation = useAsociadoMedidor();
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
        Correo: "test@test.com",
        Numero_Telefono: "+50688887777",
        Motivo_Solicitud: "Motivo válido",
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

      AsociadoSchema.parse(dummy);

      setFieldErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    } catch (error: any) {
      let errorMessage = "";
      if (error.errors && Array.isArray(error.errors)) {
        const fieldError = error.errors.find((err: any) => err.path.includes(fieldName));
        errorMessage = fieldError?.message || error.errors[0]?.message || "Error de validación";
      } else if (error.message) {
        errorMessage = error.message;
      } else {
        errorMessage = "Error de validación";
      }
      setFieldErrors((prev) => ({
        ...prev,
        [fieldName]: errorMessage,
      }));
    }
  };

  const getPlaceholder = (fieldName: string, tipoIdentificacion?: TipoIdentificacion) => {
    const placeholders: Record<string, string> = {
      Nombre: "Juan Carlos",
      Apellido1: "Pérez",
      Apellido2: "González (opcional)",
      Correo: "ejemplo@gmail.com",
      Numero_Telefono: "+50688887777",
      Motivo_Solicitud: "Escribe el motivo de tu solicitud",
    };
    if (fieldName === "Identificacion") {
      switch (tipoIdentificacion) {
        case "Cedula Nacional":
          return "123456789";
        case "DIMEX":
          return "123456789012";
        case "Pasaporte":
          return "A1234567";
        default:
          return "Seleccione tipo de identificación primero";
      }
    }
    return placeholders[fieldName] || "";
  };

  const form = useForm({
    defaultValues: {
      Nombre: "",
      Apellido1: "",
      Apellido2: "",
      Tipo_Identificacion: "Cedula Nacional" as TipoIdentificacion,
      Identificacion: "",
      Correo: "",
      Numero_Telefono: "",
      Motivo_Solicitud: "",
    },

    onSubmit: async ({ value }) => {
      setFormErrors({});
      try {
        value.Numero_Telefono = normalizePhoneNumber(value.Numero_Telefono);

        const validation = AsociadoSchema.safeParse(value);
        if (!validation.success) {
          const validationErrors: Record<string, string> = {};
          validation.error.errors.forEach((err) => {
            const field = err.path[0] as string;
            validationErrors[field] = err.message;
          });
          setFormErrors(validationErrors);
          return;
        }

        await mutation.createAsociado({
          ...value,
          Tipo_Identificacion: value.Tipo_Identificacion as TipoIdentificacion
        });

        form.reset();
        setFormErrors({ general: "¡Solicitud enviada con éxito!" });
        setFieldErrors({});
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
  const commonClasses =
    "w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300";

  return (
    <div className="flex justify-center items-center min-h-screen text-gray-800 p-5 w-full">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="bg-white shadow-lg pl-24 pr-24 pt-8 pb-8 rounded-lg w-full max-w-7xl mx-auto"
      >
        <h2 className="text-center text-2xl font-semibold mb-10">Formulario para ser asociado</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
          {/* Tipo de Identificación */}
          <form.Field name="Tipo_Identificacion">
            {(field) => (
              <div className="mb-3 w-full">
                <label className="block mb-1 font-medium">
                  Tipo de Identificación <span className="text-red-500">*</span>
                </label>
                <select
                  value={field.state.value}
                  onChange={(e) => {
                    field.handleChange(e.target.value as TipoIdentificacion);
                    validateField('Tipo_Identificacion', e.target.value as TipoIdentificacion, form.state.values);
                    form.setFieldValue('Identificacion', '');
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
                {fieldErrors["Tipo_Identificacion"] && (
                  <span className="text-red-500 text-sm block mt-1">{fieldErrors["Tipo_Identificacion"]}</span>
                )}
                {formErrors["Tipo_Identificacion"] && !fieldErrors["Tipo_Identificacion"] && (
                  <span className="text-red-500 text-sm block mt-1">{formErrors["Tipo_Identificacion"]}</span>
                )}
              </div>
            )}
          </form.Field>
          {/* Número de Identificación */}
          <form.Field name="Identificacion">
            {(field) => (
              <div className="mb-3 w-full">
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
                  className={`${commonClasses} ${!form.state.values.Tipo_Identificacion ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                />
                {fieldErrors["Identificacion"] && (
                  <span className="text-red-500 text-sm block mt-1">{fieldErrors["Identificacion"]}</span>
                )}
                {formErrors["Identificacion"] && !fieldErrors["Identificacion"] && (
                  <span className="text-red-500 text-sm block mt-1">{formErrors["Identificacion"]}</span>
                )}
              </div>
            )}
          </form.Field>
          {/* Nombre */}
          <form.Field name="Nombre">
            {(field) => (
              <div className="mb-3 w-full">
                <label className="block mb-1 font-medium">Nombre <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={field.state.value}
                  onChange={(e) => {
                    field.handleChange(e.target.value);
                    validateField("Nombre", e.target.value, form.state.values);
                  }}
                  placeholder={getPlaceholder("Nombre")}
                  className={commonClasses}
                />
                {fieldErrors["Nombre"] && (
                  <span className="text-red-500 text-sm block mt-1">{fieldErrors["Nombre"]}</span>
                )}
                {formErrors["Nombre"] && !fieldErrors["Nombre"] && (
                  <span className="text-red-500 text-sm block mt-1">{formErrors["Nombre"]}</span>
                )}
              </div>
            )}
          </form.Field>
          {/* Primer Apellido */}
          <form.Field name="Apellido1">
            {(field) => (
              <div className="mb-3 w-full">
                <label className="block mb-1 font-medium">Primer Apellido <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={field.state.value}
                  onChange={(e) => {
                    field.handleChange(e.target.value);
                    validateField("Apellido1", e.target.value, form.state.values);
                  }}
                  placeholder={getPlaceholder("Apellido1")}
                  className={commonClasses}
                />
                {fieldErrors["Apellido1"] && (
                  <span className="text-red-500 text-sm block mt-1">{fieldErrors["Apellido1"]}</span>
                )}
                {formErrors["Apellido1"] && !fieldErrors["Apellido1"] && (
                  <span className="text-red-500 text-sm block mt-1">{formErrors["Apellido1"]}</span>
                )}
              </div>
            )}
          </form.Field>
          {/* Segundo Apellido */}
          <form.Field name="Apellido2">
            {(field) => (
              <div className="mb-3 w-full">
                <label className="block mb-1 font-medium">Segundo Apellido</label>
                <input
                  type="text"
                  value={field.state.value}
                  onChange={(e) => {
                    field.handleChange(e.target.value);
                    validateField("Apellido2", e.target.value, form.state.values);
                  }}
                  placeholder={getPlaceholder("Apellido2")}
                  className={commonClasses}
                />
                {fieldErrors["Apellido2"] && (
                  <span className="text-red-500 text-sm block mt-1">{fieldErrors["Apellido2"]}</span>
                )}
                {formErrors["Apellido2"] && !fieldErrors["Apellido2"] && (
                  <span className="text-red-500 text-sm block mt-1">{formErrors["Apellido2"]}</span>
                )}
              </div>
            )}
          </form.Field>
          {/* Correo */}
          <form.Field name="Correo">
            {(field) => (
              <div className="mb-3 w-full">
                <label className="block mb-1 font-medium">Correo electrónico <span className="text-red-500">*</span></label>
                <input
                  type="email"
                  value={field.state.value}
                  onChange={(e) => {
                    field.handleChange(e.target.value);
                    validateField("Correo", e.target.value, form.state.values);
                  }}
                  placeholder={getPlaceholder("Correo")}
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
                <label className="block mb-1 font-medium">Número de teléfono <span className="text-red-500">*</span></label>
                <PhoneInput
                  international
                  defaultCountry="CR"
                  value={field.state.value}
                  onChange={(value) => {
                    field.handleChange(value || "");
                    validateField("Numero_Telefono", value || "", form.state.values);
                  }}
                  className={`${commonClasses} ${fieldErrors["Numero_Telefono"] ? 'border-red-500 focus:ring-red-300' : ''}`}
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
          {/* Motivo de Solicitud */}
          <form.Field name="Motivo_Solicitud">
            {(field) => (
              <div className="mb-3 w-full">
                <label className="block mb-1 font-medium">Motivo de solicitud <span className="text-red-500">*</span></label>
                <textarea
                  value={field.state.value}
                  onChange={(e) => {
                    field.handleChange(e.target.value);
                    validateField("Motivo_Solicitud", e.target.value, form.state.values);
                  }}
                  placeholder={getPlaceholder("Motivo_Solicitud")}
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

        </div>

        {/* Mensaje general */}
        {formErrors.general && (
          <div className={`text-center mt-4 ${formErrors.general.includes("éxito") ? "text-green-600" : "text-red-500"}`}>
            {formErrors.general}
          </div>
        )}

        <div className="flex justify-end items-end gap-4 mt-8">
          <button
            type="button"
            onClick={onClose}
            className="w-[120px] bg-blue-900 text-white py-2 rounded hover:bg-blue-800 transition"
          >
            Cerrar
          </button>
          <div className="flex justify-end items-end">
            <button
              type="submit"
              disabled={form.state.isSubmitting}
              className={`w-[120px] py-2 rounded transition ${form.state.isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-900 hover:bg-blue-800'} text-white`}
            >
              {form.state.isSubmitting ? 'Enviando...' : 'Enviar'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default FormularioAsociado;