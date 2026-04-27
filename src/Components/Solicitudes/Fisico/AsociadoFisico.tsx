import { useForm } from "@tanstack/react-form";
import { useEffect, useState, useRef } from "react";
import { AsociadoSchema, TipoIdentificacionValues, type TipoIdentificacion } from "../../../Schemas/Solicitudes/Fisica/Asociado";
import { useAsociadoFisica } from "../../../Hook/Solicitudes/HookFisicas";
import { Loader2 } from "lucide-react";

type Props = {
  onClose: () => void;
};
const STORAGE_KEY = 'asociado_fisica_temp';



const FormularioAsociado = ({ onClose }: Props) => {
  const [archivoSeleccionado, setArchivoSeleccionado] = useState<{ [key: string]: File | null }>({});
  const planosInputRef = useRef<HTMLInputElement>(null);
  const escrituraInputRef = useRef<HTMLInputElement>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSending, setIsSending] = useState(false);
  const mutation = useAsociadoFisica();
  const [_mostrarFormulario, setMostrarFormulario] = useState(true);


  const validateField = (fieldName: string, value: any, allValues?: any) => {
    const valuesToValidate = {
      ...allValues,
      [fieldName]: value,
    };

    const validation = AsociadoSchema.safeParse(valuesToValidate);
    const fieldIssue = validation.success
      ? undefined
      : validation.error.errors.find((err) => err.path[0] === fieldName);

    setFieldErrors(prev => {
      const newErrors = { ...prev };
      if (fieldIssue) {
        newErrors[fieldName] = fieldIssue.message;
      } else {
        delete newErrors[fieldName];
      }
      return newErrors;
    });
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
          if (!errors[field]) {
            errors[field] = err.message;
          }
        });
      }
      setFieldErrors(errors);
    }
  };

  const handleIdentificacionInput = (value: string, tipoId: string): string => {
    switch (tipoId) {
      case "Cedula Nacional":
        return value.replaceAll(/\D/g, '').slice(0, 9);
      case "Dimex":
        return value.replaceAll(/\D/g, '').slice(0, 12);
      case "Pasaporte":
        return value.replaceAll(/[^a-zA-Z0-9]/g, '').slice(0, 9).toUpperCase();
      default:
        return value;
    }
  };

  const getIdentificacionMaxLength = (tipoIdentificacion: TipoIdentificacion): number => {
    switch (tipoIdentificacion) {
      case 'Cedula Nacional':
        return 9;
      case 'Dimex':
        return 12;
      case 'Pasaporte':
        return 9;
      default:
        return 20;
    }
  };

  // Función para cambio de Identificacion 
  const handleCedulaChange = (cedula: string) => {
    const tipoId = form.state.values.Tipo_Identificacion;
    const identificacion = handleIdentificacionInput(cedula, tipoId);

    form.setFieldValue('Identificacion', identificacion);
    validateField('Identificacion', identificacion, form.state.values);

    setFormErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors['Identificacion'];
      return newErrors;
    });
  };



  const getPlaceholder = (fieldName: string, tipoIdentificacion?: TipoIdentificacion) => {
    const placeholders: Record<string, string> = {
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
      Tipo_Identificacion: "Cedula Nacional" as TipoIdentificacion,
      Identificacion: "",
      Motivo_Solicitud: "",
    },

    onSubmit: async ({ value }) => {
      setFormErrors({});
      setFieldErrors({});
      try {
        const validation = AsociadoSchema.safeParse(value);
        if (!validation.success) {
          const validationErrors: Record<string, string> = {};
          validation.error.errors.forEach((err) => {
            const field = err.path[0] as string;
            if (!validationErrors[field]) {
              validationErrors[field] = err.message;
            }
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

        // Crear FormData y agregar campos del DTO como string
        const formData = new FormData();
        // Campos del DTO (no archivos)
        formData.append('Tipo_Identificacion', value.Tipo_Identificacion);
        formData.append('Identificacion', value.Identificacion);
        formData.append('Motivo_Solicitud', value.Motivo_Solicitud);
        // Agregar archivos (solo como file, no como string)
        if (archivoSeleccionado["Planos_Terreno"]) {
          formData.append('Planos_Terreno', archivoSeleccionado["Planos_Terreno"]);
        }
        if (archivoSeleccionado["Escrituras_Terreno"]) {
          formData.append('Escrituras_Terreno', archivoSeleccionado["Escrituras_Terreno"]);
        }

        setIsSending(true);
        await mutation.createAsociado(formData);
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
    fieldName: "Identificacion" | "Motivo_Solicitud" | "Tipo_Identificacion",
    value: any
  ) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));
    const newValues = { ...form.state.values, [fieldName]: value };
    validateAllFields(newValues);
    form.setFieldValue(fieldName, value);
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
        className="bg-white shadow-lg px-5 py-3 sm:px-6 sm:py-4 rounded-[24px] w-[95%] max-w-7xl mx-auto scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-blue-100"
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
                    maxLength={getIdentificacionMaxLength(form.state.values.Tipo_Identificacion)}
                  />
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
                  className={`${commonClasses} resize-none h-24 overflow-y-auto scrollbar-thumb-blue-600 scrollbar-thin scrollbar-track-blue-100`}
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            <div className="w-full mb-2">
              <label htmlFor="Planos_Terreno" className="block mb-1 font-medium">Planos del terreno <span className="text-red-500">*</span></label>
              <input
                type="file"
                accept=".png,.jpg,.jpeg,.heic,.pdf"
                disabled={!!archivoSeleccionado["Planos_Terreno"]}
                onChange={(e) => {
                  const file = e.target.files?.[0] ?? null;
                  setArchivoSeleccionado(prev => ({ ...prev, ["Planos_Terreno"]: file }));
                  setFieldErrors(prev => {
                    const next = { ...prev };
                    if (file) {
                      delete next["Planos_Terreno"];
                    }
                    return next;
                  });
                }}
                className="hidden"
                id="Planos_Terreno"
                ref={planosInputRef}
                key={archivoSeleccionado["Planos_Terreno"] ? archivoSeleccionado["Planos_Terreno"]?.name : 'planos'}
              />
              <label
                htmlFor="Planos_Terreno"
                className={`inline-block text-white bg-blue-600 px-3 py-1 rounded text-sm ${archivoSeleccionado["Planos_Terreno"] ? 'cursor-not-allowed opacity-50' : 'hover:bg-[#6FCAF1] cursor-pointer'}`}
              >
                {archivoSeleccionado["Planos_Terreno"] ? 'Archivo cargado' : 'Subir archivo'}
              </label>
              {archivoSeleccionado["Planos_Terreno"] && (
                <div className="border rounded-md p-3 bg-gray-50 pb-2 mb-2 flex justify-between items-center">
                  <span>{archivoSeleccionado["Planos_Terreno"]?.name}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setArchivoSeleccionado(prev => ({ ...prev, ["Planos_Terreno"]: null }));
                      setFieldErrors(prev => ({
                        ...prev,
                        ["Planos_Terreno"]: 'Debe subir el plano del terreno',
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
                <span className="text-red-500 text-sm block mt-1">
                  {fieldErrors["Planos_Terreno"]}
                </span>
              )}
            </div>
            <div className="w-full mb-2">
              <label htmlFor="Escrituras_Terreno" className="block mb-1 font-medium">Escrituras del terreno <span className="text-red-500">*</span></label>
              <input
                type="file"
                accept=".png,.jpg,.jpeg,.heic,.pdf"
                disabled={!!archivoSeleccionado["Escrituras_Terreno"]}
                onChange={(e) => {
                  const file = e.target.files?.[0] ?? null;
                  setArchivoSeleccionado(prev => ({ ...prev, ["Escrituras_Terreno"]: file }));
                  setFieldErrors(prev => {
                    const next = { ...prev };
                    if (file) {
                      delete next["Escrituras_Terreno"];
                    }
                    return next;
                  });
                }}
                className="hidden"
                id="Escrituras_Terreno"
                ref={escrituraInputRef}
                key={archivoSeleccionado["Escrituras_Terreno"] ? archivoSeleccionado["Escrituras_Terreno"]?.name : 'escritura'}
              />
              <label
                htmlFor="Escrituras_Terreno"
                className={`inline-block text-white bg-blue-600 px-3 py-1 rounded text-sm ${archivoSeleccionado["Escrituras_Terreno"] ? 'cursor-not-allowed opacity-50' : 'hover:bg-[#6FCAF1] cursor-pointer'}`}
              >
                {archivoSeleccionado["Escrituras_Terreno"] ? 'Archivo cargado' : 'Subir archivo'}
              </label>
              {archivoSeleccionado["Escrituras_Terreno"] && (
                <div className="border rounded-md p-3 bg-gray-50 pb-2 mb-2 flex justify-between items-center">
                  <span>{archivoSeleccionado["Escrituras_Terreno"]?.name}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setArchivoSeleccionado(prev => ({ ...prev, ["Escrituras_Terreno"]: null }));
                      setFieldErrors(prev => ({
                        ...prev,
                        ["Escrituras_Terreno"]: 'Debe subir la escritura del terreno',
                      }));
                      if (escrituraInputRef.current) escrituraInputRef.current.value = "";
                    }}
                    className="text-red-500 hover:underline text-xs"
                  >
                    Eliminar
                  </button>
                </div>
              )}
              {fieldErrors["Escrituras_Terreno"] && (
                <span className="text-red-500 text-sm block mt-1">
                  {fieldErrors["Escrituras_Terreno"]}
                </span>
              )}
            </div>
          </div>
        </div>


        <div className="flex justify-center gap-4 mt-6 ml-50">
          <button
            type="submit"
            className="w-[140px] py-2 rounded transition-colors bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-400 disabled:cursor-not-allowed text-sm font-medium"
            disabled={
              isSending ||
              Object.values(form.state.values).some(val => val === undefined || val === null || val === "") ||
              Object.values(fieldErrors).some(Boolean) ||
              Object.values(formErrors).some(Boolean) ||
              !archivoSeleccionado["Planos_Terreno"] ||
              !archivoSeleccionado["Escrituras_Terreno"]
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

export default FormularioAsociado;