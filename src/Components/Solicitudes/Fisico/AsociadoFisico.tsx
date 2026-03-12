import { useForm } from "@tanstack/react-form";
import { useEffect, useState } from "react";
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

const STORAGE_KEY = 'asociado_fisica_temp';



const FormularioAsociado = ({ onClose }: Props) => {
  const sanitizeNameInput = (value: string) => value.replace(/\d/g, "");
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSending, setIsSending] = useState(false);
  const mutation = useAsociadoFisica();
  const [_mostrarFormulario, setMostrarFormulario] = useState(true);
  const { lookup, isLoading } = useCedulaLookup();

  // Validación en tiempo real usando el schema
  const validateField = (fieldName: string, value: any, allValues?: any) => {
    try {
      const dummy: any = {
        Nombre: "Test",
        Apellido1: "Test",
        Apellido2: "",
        Tipo_Identificacion: "Cedula Nacional",
        Identificacion: "123456789",
        Numero_Telefono: "+50688887777",
        Correo: "test@test.com",
        Motivo_Solicitud: "1234567890",
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

  // Función para cambio de Identificacion 
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

    if (tipoId === 'Cedula Nacional' && /^\d{9}$/.test(identificacion)) {
      const resultado = await lookup(identificacion);
      if (resultado) {
        form.setFieldValue('Nombre', resultado.firstname || '');
        form.setFieldValue('Apellido1', resultado.lastname1 || '');
        form.setFieldValue('Apellido2', resultado.lastname2 || '');
      }
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

  const saveToSessionStorage = (values: any) => {
    try {
      // Guardamos todo excepto los archivos
      const dataToSave = {
        Nombre: values.Nombre,
        Apellido1: values.Apellido1,
        Apellido2: values.Apellido2,
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

        setIsSending(true);
        await mutation.createAsociado({
          ...value,
          Tipo_Identificacion: value.Tipo_Identificacion
        });
        sessionStorage.removeItem(STORAGE_KEY);
        form.reset();
        setMostrarFormulario(false);
        onClose();
      } catch (error: unknown) {
        console.log("🔍 ERROR EN SOLICITUD DE ASOCIADO:", error);
      } finally {
        setIsSending(false);
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
    // Sanitizar campos de nombre
    const cleanValue = ["Nombre", "Apellido1", "Apellido2"].includes(fieldName)
      ? sanitizeNameInput(value)
      : value;
    setTouched(prev => ({ ...prev, [fieldName]: true }));
    const newValues = { ...form.state.values, [fieldName]: cleanValue };
    validateAllFields(newValues);
    form.setFieldValue(fieldName, cleanValue);
  };
  useEffect(() => {
    const savedData = sessionStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        // Cargar los valores en el formulario
        Object.entries(parsed).forEach(([key, value]) => {
          if (key !== 'Planos_Terreno' && key !== 'Escritura_Terreno') {
            form.setFieldValue(key as any, value as any);
          }
        });
      } catch (error) {
        console.error('Error al cargar datos guardados:', error);
      }
    }
  }, []);

  const commonClasses =
    "w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring focus:ring-blue-300";

  return (
    <div className="flex justify-center text-gray-800 p-3 sm:p-4 w-full">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg px-5 py-3 sm:px-6 sm:py-4 rounded-[24px] w-[95%] max-w-7xl mx-auto max-h-auto overflow-y-auto scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-blue-100"
      >
        <h2 className="text-center text-xl font-semibold mb-6">Formulario para ser asociado</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
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
                    maxLength={
                      form.state.values.Tipo_Identificacion === 'Cedula Nacional' ? 9 :
                        form.state.values.Tipo_Identificacion === 'Dimex' ? 12 :
                          form.state.values.Tipo_Identificacion === 'Pasaporte' ? 9 : 20
                    }
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
                    saveToSessionStorage({ ...form.state.values, Nombre: e.target.value });
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
                    saveToSessionStorage({ ...form.state.values, Apellido1: e.target.value }); // ← NUEVO
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
                    saveToSessionStorage({ ...form.state.values, Apellido2: e.target.value }); // ← NUEVO
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
                    saveToSessionStorage({ ...form.state.values, Correo: e.target.value }); // ← NUEVO
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
                    saveToSessionStorage({ ...form.state.values, Numero_Telefono: value || "" }); // ← NUEVO
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
                    saveToSessionStorage({ ...form.state.values, Motivo_Solicitud: e.target.value }); // ← NUEVO
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
              disabled={isSending}
              className={`w-[120px] py-2 rounded transition ${isSending ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-900 hover:bg-blue-800'} text-white`}
            >
              {isSending ? 'Enviando...' : 'Enviar'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default FormularioAsociado;