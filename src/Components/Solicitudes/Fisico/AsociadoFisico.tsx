import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { AsociadoSchema, TipoIdentificacionValues, type TipoIdentificacion } from "../../../Schemas/Solicitudes/Fisica/Asociado";
import { useAsociadoFisica } from "../../../Hook/Solicitudes/HookFisicas";
import { useCedulaLookup } from "../../../Hook/Solicitudes/CedulaLookHook";
import { Loader2 } from "lucide-react";
import PhoneInputComponent from "../PhoneInputComponent";

type Props = {
  onClose: () => void;
};


const normalizePhoneNumber = (phone: string): string => {
  if (!phone?.startsWith('+')) {
    throw new Error('El número debe incluir el código de país y comenzar con "+". Ejemplo: +50688887777');
  }
  return phone;
};

const FormularioAsociado = ({ onClose }: Props) => {
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const mutation = useAsociadoFisica();
  const [_mostrarFormulario, setMostrarFormulario] = useState(true);
  const { lookup, isLoading } = useCedulaLookup();

  // Función para manejar el cambio de cédula con búsqueda automática
  const handleCedulaChange = async (cedula: string) => {
    form.setFieldValue('Identificacion', cedula);

    // Buscar datos solo si es cédula nacional y tiene 9 dígitos
    if (form.state.values.Tipo_Identificacion === 'Cedula Nacional' && /^\d{9}$/.test(cedula)) {
      const resultado = await lookup(cedula);
      if (resultado) {
        // Autocompletar campos con los datos de la API
        form.setFieldValue('Nombre', resultado.firstname || '');
        form.setFieldValue('Apellido1', resultado.lastname1 || '');
        form.setFieldValue('Apellido2', resultado.lastname2 || '');
      }
    }
  };

  // Validación en tiempo real del formulario
  const validateAllFields = (values: any) => {
    try {
      AsociadoSchema.parse(values);
      setFieldErrors({});
    } catch (error: any) {
      const errors: Record<string, string> = {};
      if (error.errors && Array.isArray(error.errors)) {
        error.errors.forEach((err: any) => {
          const field = err.path[0] as string;
          errors[field] = err.message;
        });
      }
      setFieldErrors(errors);
    }
  };

  const getPlaceholder = (fieldName: string, tipoIdentificacion?: TipoIdentificacion) => {
    const placeholders: Record<string, string> = {
      Nombre: "Juan Carlos",
      Apellido1: "Pérez",
      Apellido2: "González",
      Correo: "ejemplo@gmail.com",
      Numero_Telefono: "+50688887777",
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
      setFieldErrors({});
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
          setFieldErrors(validationErrors);
          setTouched(prev => {
            // Marca todos los campos como tocados al enviar
            const allTouched: Record<string, boolean> = { ...prev };
            Object.keys(validationErrors).forEach(key => {
              allTouched[key] = true;
            });
            return allTouched;
          });
          return;
        }

        await mutation.createAsociado({
          ...value,
          Tipo_Identificacion: value.Tipo_Identificacion
        });

        form.reset();
        setMostrarFormulario(false);
        onClose();
      } catch (error: unknown) {
        console.log("🔍 ERROR EN SOLICITUD DE ASOCIADO:", error);
      }
    },
  });

  // Validar todos los campos al intentar enviar
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    validateAllFields(form.state.values);
    form.handleSubmit();
  };

  // Validar en tiempo real cada vez que cambia un campo y marcar como tocado
  const handleFieldChange = (
    fieldName: "Nombre" | "Apellido1" | "Apellido2" | "Identificacion" | "Correo" | "Numero_Telefono" | "Motivo_Solicitud" | "Tipo_Identificacion",
    value: any
  ) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));
    const newValues = { ...form.state.values, [fieldName]: value };
    validateAllFields(newValues);
    form.setFieldValue(fieldName, value);
  };


  const commonClasses =
    "w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300";

  return (
   <div className="flex justify-center items-center min-h-screen text-gray-800 p-7 w-full">
      <form
        onSubmit={handleSubmit}
         className="bg-white shadow-lg  pl-8 pr-8 pt-4 pb-4 rounded-lg w-[95%] max-w-7xl mx-auto max-h-auto overflow-y-auto scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-blue-100"
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
                    handleFieldChange('Tipo_Identificacion', e.target.value as TipoIdentificacion);
                    form.setFieldValue('Identificacion', '');
                  }}
                  onBlur={() => setTouched(prev => ({ ...prev, Tipo_Identificacion: true }))}
                  className={commonClasses}
                >
                  <option value="">Seleccione tipo de identificación</option>
                  {TipoIdentificacionValues.map((tipo) => (
                    <option key={tipo} value={tipo}>{tipo}</option>
                  ))}
                </select>
                {touched["Tipo_Identificacion"] && fieldErrors["Tipo_Identificacion"] && (
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
                <label htmlFor="Identificaion" className="block mb-1 font-medium">
                  Número de Identificación <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={field.state.value}
                    onChange={(e) => {
                      handleCedulaChange(e.target.value);
                    }}
                    onBlur={() => setTouched(prev => ({ ...prev, Identificacion: true }))}
                    placeholder={getPlaceholder('Identificacion', form.state.values.Tipo_Identificacion)}
                    disabled={!form.state.values.Tipo_Identificacion}
                    className={`${commonClasses} ${!form.state.values.Tipo_Identificacion ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                  />
                  {isLoading && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                    </div>
                  )}
                </div>
                {touched["Identificacion"] && fieldErrors["Identificacion"] && (
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
                <label htmlFor="Nombre" className="block mb-1 font-medium">Nombre <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={field.state.value}
                  onChange={(e) => {
                    handleFieldChange("Nombre", e.target.value);
                  }}
                  onBlur={() => setTouched(prev => ({ ...prev, Nombre: true }))}
                  placeholder={getPlaceholder("Nombre")}
                  maxLength={50}
                  className={commonClasses}
                />
                {touched["Nombre"] && fieldErrors["Nombre"] && (
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
                <label htmlFor="Apellido1" className="block mb-1 font-medium">Primer Apellido <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={field.state.value}
                  onChange={(e) => {
                    handleFieldChange("Apellido1", e.target.value);
                  }}
                  onBlur={() => setTouched(prev => ({ ...prev, Apellido1: true }))}
                  placeholder={getPlaceholder("Apellido1")}
                  maxLength={50}
                  className={commonClasses}
                />
                {touched["Apellido1"] && fieldErrors["Apellido1"] && (
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
                <label htmlFor="Apellido2" className="block mb-1 font-medium">Segundo Apellido <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={field.state.value}
                  onChange={(e) => {
                    handleFieldChange("Apellido2", e.target.value);
                  }}
                  onBlur={() => setTouched(prev => ({ ...prev, Apellido2: true }))}
                  placeholder={getPlaceholder("Apellido2")}
                  maxLength={50}
                  className={commonClasses}
                />
                {touched["Apellido2"] && fieldErrors["Apellido2"] && (
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
                <label htmlFor="Correo" className="block mb-1 font-medium">Correo electrónico <span className="text-red-500">*</span></label>
                <input
                  type="email"
                  value={field.state.value}
                  onChange={(e) => {
                    handleFieldChange("Correo", e.target.value);
                  }}
                  onBlur={() => setTouched(prev => ({ ...prev, Correo: true }))}
                  placeholder={getPlaceholder("Correo")}
                  maxLength={100}
                  className={commonClasses}
                />
                {touched["Correo"] && fieldErrors["Correo"] && (
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
                <label htmlFor="Numero_Telefono" className="block mb-1 font-medium">Número de teléfono <span className="text-red-500">*</span></label>
                <PhoneInputComponent
                  value={field.state.value}
                  onChange={(value) => {
                    handleFieldChange("Numero_Telefono", value || "");
                  }}
                  className={`${fieldErrors["Numero_Telefono"] ? 'border-red-500' : ''}`}
                />
                {touched["Numero_Telefono"] && fieldErrors["Numero_Telefono"] && (
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
                <label htmlFor="Motivo_Solicitud" className="block mb-1 font-medium">Motivo de solicitud <span className="text-red-500">*</span></label>
                <textarea
                  value={field.state.value}
                  onChange={(e) => {
                    handleFieldChange("Motivo_Solicitud", e.target.value);
                  }}
                  onBlur={() => setTouched(prev => ({ ...prev, Motivo_Solicitud: true }))}
                  placeholder={getPlaceholder("Motivo_Solicitud")}
                  maxLength={250}
                  className={`${commonClasses} resize-none h-24 overflow-y-scroll`}
                />
                {touched["Motivo_Solicitud"] && fieldErrors["Motivo_Solicitud"] && (
                  <span className="text-red-500 text-sm block mt-1">{fieldErrors["Motivo_Solicitud"]}</span>
                )}
                {formErrors["Motivo_Solicitud"] && !fieldErrors["Motivo_Solicitud"] && (
                  <span className="text-red-500 text-sm block mt-1">{formErrors["Motivo_Solicitud"]}</span>
                )}
              </div>
            )}
          </form.Field>
        </div>


        <div className="flex justify-end items-end gap-4 mt-8">

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