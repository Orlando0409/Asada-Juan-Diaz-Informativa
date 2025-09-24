import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { AsociadoSchema, TipoIdentificacionValues } from "../../../Schemas/Solicitudes/Fisica/Asociado";
//import { useAsociados } from "../../../Hook/Solicitudes/Fisico/hookAsociado";

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

const FormularioAsociado = ({ tipo, onClose }: Props) => {
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const mutation = useAsociadoMedidor(); // Hook para manejar solicitudes de asociados
  const [mostrarFormulario] = useState(true);

  const form = useForm({
    defaultValues: {
      Nombre: "",
      Apellido1: "",
      Apellido2: "",
      Tipo_Identificacion: "Cedula Nacional",
      Identificacion: "",
      Correo: "",
      Numero_Telefono: "",
      Motivo_Solicitud: "",
    },

    onSubmit: async ({ value }) => {
      setFormErrors({});
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

      try {
        await mutation.createAsociado({
          ...value,
          Tipo_Identificacion: value.Tipo_Identificacion as "Cedula Nacional" | "Dimex" | "Pasaporte",
        });

        form.reset();
        setFormErrors({ general: "¡Solicitud enviada con éxito!" });
        setFieldErrors({});
      } catch (error: unknown) {
        let errorMsg = '';
        // Verifica si el error tiene la estructura de AxiosError
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

  const validateField = (fieldName: string, value: any, allValues?: any) => {
    try {
      const dummy: any = {
        Nombre: "Test",
        Apellido1: "Test",
        Apellido2: "",
        Tipo_Identificacion: "Cedula Nacional",
        Identificacion: "123456789",
        Correo: "test@test.com",
        Numero_Telefono: "12345678",
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

  const getPlaceholder = (fieldName: string, tipoIdentificacion?: string) => {
    const placeholders: Record<string, string> = {
      Nombre: "Juan Carlos",
      Apellido1: "Pérez",
      Apellido2: "González (opcional)",
      Correo: "ejemplo@gmail.com",
      Numero_Telefono: "88887777",
      Motivo_Solicitud: "Escribe el motivo de tu solicitud",
    };
    if (fieldName === "Identificacion") {
      switch (tipoIdentificacion) {
        case "Cedula Nacional":
          return "123456789";
        case "Dimex":
          return "123456789012";
        case "Pasaporte":
          return "A1234567";
        default:
          return "Seleccione tipo de identificación primero";
      }
    }
    return placeholders[fieldName] || "";
  };

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
        className="bg-white gap-2 shadow-lg pl-8 pr-8 pt-4 pb-4 rounded-lg w-full max-w-9xl overflow-y-auto"
      >
        <h2 className="text-center text-xl font-semibold mb-6">Formulario para ser asociado</h2>

        {Object.entries(campos).map(([fieldName, fieldProps]) => (
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
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder={getPlaceholder(fieldName)}
                    className={`${commonClasses} resize-none h-24 overflow-y-scroll`}
                  />
                ) : fieldName === "Tipo_Identificacion" ? (
                  <select
                    value={field.state.value as string}
                    onChange={(e) => {
                      field.handleChange(e.target.value);
                      validateField("Tipo_Identificacion", e.target.value, form.state.values);
                      form.setFieldValue("Identificacion", "");
                      setFieldErrors((prev) => {
                        const newErrors = { ...prev };
                        delete newErrors["Identificacion"];
                        return newErrors;
                      });
                    }}
                    className={`${commonClasses} ${fieldErrors["Tipo_Identificacion"] ? "border-red-500 focus:ring-red-300" : ""}`}
                  >
                    <option value="">Seleccione tipo de identificación</option>
                    {TipoIdentificacionValues.map((tipo) => (
                      <option key={tipo} value={tipo}>
                        {tipo}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={fieldProps.type === "email" ? "email" : "text"}
                    value={field.state.value as string}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    placeholder={getPlaceholder(fieldName)}
                    className={`${commonClasses} ${fieldErrors[fieldName] ? "border-red-500 focus:ring-red-300" : ""}`}
                  />
                )}
                {fieldErrors[fieldName] && (
                  <span className="text-red-500 text-sm mt-1 block">{fieldErrors[fieldName]}</span>
                )}
                {formErrors[fieldName] && !fieldErrors[fieldName] && (
                  <span className="text-red-500 text-sm mt-1 block">{formErrors[fieldName]}</span>
                )}
              </div>
            )}
          </form.Field>
        ))}

        {formErrors.general && (
          <div
            className={`text-center mt-4 ${formErrors.general.includes("éxito") ? "text-green-600" : "text-red-500"
              }`}
          >
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
          <button
            type="submit"
            disabled={form.state.isSubmitting}
            className={`w-[120px] py-2 rounded transition ${form.state.isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-blue-900 hover:bg-blue-800"
              } text-white`}
          >
            {form.state.isSubmitting ? "Enviando..." : "Enviar"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormularioAsociado;