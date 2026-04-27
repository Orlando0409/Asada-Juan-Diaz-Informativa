import { useForm } from "@tanstack/react-form";
import { useEffect, useRef, useState } from "react";
import { useAlerts } from '../../../context/AlertContext';
import { DesconexionMedidorSchema, MotivoDesconexionValues, TipoIdentificacionValues, type MotivoDesconexion, type TipoIdentificacion } from "../../../Schemas/Solicitudes/Fisica/DesconexionMedidor";
import { useDesconexionFisica, useMedidores } from "../../../Hook/Solicitudes/HookFisicas";
import { Loader2 } from "lucide-react";

type Props = {
  onClose: () => void;
};
const STORAGE_KEY = 'desconexion_fisica_temp';

const FormularioDesconexionMedidor = ({ onClose }: Props) => {
  const [archivoSeleccionado, setArchivoSeleccionado] = useState<{ [key: string]: File | null }>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSending, setIsSending] = useState(false);
  const [identificacion, setIdentificacion] = useState('');
  const { showError } = useAlerts();
  const mutation = useDesconexionFisica();
  const planosInputRef = useRef<HTMLInputElement>(null);
  const escrituraInputRef = useRef<HTMLInputElement>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(true);
  const { medidores, isLoading: isMedidoresLoading } = useMedidores(identificacion);

  // Validación en tiempo real usando el schema
  const validateField = (fieldName: string, value: any, allValues?: any) => {
    const valuesToValidate = {
      ...allValues,
      [fieldName]: value,
    };

    const validation = DesconexionMedidorSchema.safeParse(valuesToValidate);
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

  const handleCedulaChange = (cedula: string) => {
    const tipoId = form.state.values.Tipo_Identificacion;
    const identificacionProcesada = handleIdentificacionInput(cedula, tipoId);

    form.setFieldValue('Identificacion', identificacionProcesada);
    setIdentificacion(identificacionProcesada);
    validateField('Identificacion', identificacionProcesada, form.state.values);

    setFormErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors['Identificacion'];
      return newErrors;
    });
  };


  const getPlaceholder = (fieldName: string, tipoIdentificacion?: TipoIdentificacion) => {
    const placeholders: Record<string, string> = {
      Direccion_Exacta: 'San José, del Banco Nacional 200m sur',
      Motivo_Otro: 'Escribe la causa de desconexión',
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
  const saveToSessionStorage = (values: any) => {
    try {
      // Guardamos solo los campos que siguen en el formulario
      const dataToSave = {
        Tipo_Identificacion: values.Tipo_Identificacion,
        Identificacion: values.Identificacion,
        Direccion_Exacta: values.Direccion_Exacta,
        Id_Medidor: values.Id_Medidor,
      };
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (error) {
      console.error('Error al guardar en sessionStorage:', error);
    }
  };
  const form = useForm({
    defaultValues: {
      Tipo_Identificacion: "Cedula Nacional",
      Identificacion: "",
      Motivo_Desconexion: "" as MotivoDesconexion,
      Motivo_Otro: "",
      Direccion_Exacta: "",
      Id_Medidor: undefined as number | undefined,
      Planos_Terreno: undefined as File | undefined,
      Certificacion_Literal: undefined as File | undefined,
    },

    onSubmit: async ({ value }) => {
      setFormErrors({});
      // Validar que sea afiliado (tenga medidores activos)
      if (!identificacion || medidores.length === 0) {
        showError(
          "No Eres Afiliado",
          "No puedes solicitar la desconexión porque no eres un afiliado con medidores activos. Completa tu afiliación primero."
        );
        // No mostrar error en el formulario, solo alerta global
        return;
      }
      try {
        const motivoSolicitud = value.Motivo_Desconexion === 'Otro (especifique)'
          ? `${value.Motivo_Desconexion}: ${value.Motivo_Otro?.trim() || ''}`
          : value.Motivo_Desconexion;
        const payload = {
          ...value,
          Motivo_Solicitud: motivoSolicitud,
        };

        const validation = DesconexionMedidorSchema.safeParse(value);
        if (!validation.success) {
          const validationErrors: Record<string, string> = {};
          validation.error.errors.forEach((err) => {
            const field = err.path[0] as string;
            if (!validationErrors[field]) {
              validationErrors[field] = err.message;
            }
          });
          setFormErrors(validationErrors);
          return;
        }

        const formData = new FormData();
        Object.entries(payload).forEach(([key, val]) => {
          if (val !== undefined && val !== null && val !== "") {
            if (val instanceof File) {
              formData.append(key, val);
            } else {
              formData.append(key, val.toString());
            }
          }
        });

        setIsSending(true);
        await mutation.createDesconexion(formData);
        sessionStorage.removeItem(STORAGE_KEY);

        form.reset();
        setFieldErrors({});
        setArchivoSeleccionado({});
        setMostrarFormulario(false);
        onClose();
      } catch (error: any) {
        // Error handling
      } finally {
        setIsSending(false);
      }
    },
  });
  // Mostrar alert cuando se verifica afiliación (igual que MedidorExtraFisico)
  useEffect(() => {
    if (
      identificacion &&
      !isMedidoresLoading &&
      identificacion.length >= 9
    ) {
      if (medidores.length > 0) {
        // Si es afiliado, podrías mostrar un success opcional
        // showSuccess(
        //   "Eres un afiliado puedes seguir con la solicitud",
        //   `. Medidores actuales: ${medidores.length}`
        // );
      } else {
        showError(
          "No Eres Afiliado",
          "No puedes solicitar la desconexión porque no eres un afiliado con medidores activos. Completa tu afiliación primero."
        );
      }
    }
  }, [identificacion, medidores.length, isMedidoresLoading, showError]);


  useEffect(() => {
    const savedData = sessionStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        // Cargar los valores en el formulario
        Object.entries(parsed).forEach(([key, value]) => {
          if (key !== 'Planos_Terreno' && key !== 'Certificacion_Literal' && key !== 'Motivo_Desconexion' && key !== 'Motivo_Otro') {
            form.setFieldValue(key as any, value as any);
          }
        });
      } catch (error) {
        console.error('Error al cargar datos guardados:', error);
      }
    }
  }, []);


  // El mensaje ahora se muestra como alert global, no local

  if (!mostrarFormulario) return null;

  const commonClasses = 'w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring focus:ring-blue-300';

  return (
    <div className="flex justify-center text-gray-800 p-3 sm:p-4 w-full">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="bg-white shadow-lg px-5 py-3 sm:px-6 sm:py-4 rounded-[24px] w-[95%] max-w-7xl mx-auto scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-blue-100"
      >
        <h2 className="text-center text-xl font-semibold mb-6">Formulario de desconexión de medidor</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
          {/* Tipo de Identificación */}
          <div className="mb-3">
            <form.Field name="Tipo_Identificacion">
              {(field) => (
                <div>
                  <label htmlFor="Tipo_Identificacion" className="block mb-1 font-medium">
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
                    className={`${commonClasses} ${fieldErrors['Tipo_Identificacion'] ? 'border-blue-500 focus:ring-blue-300' : ''}`}
                  >
                    <option value="">Seleccione tipo de identificación</option>
                    {TipoIdentificacionValues.map((tipo) => (
                      <option key={tipo} value={tipo}>{tipo}</option>
                    ))}
                  </select>
                </div>
              )}
            </form.Field>
          </div>

          {/* Número de Identificación */}
          <div className="mb-3">
            <form.Field name="Identificacion">
              {(field) => (
                <div>
                  <label htmlFor="Identificacion" className="block mb-1 font-medium">
                    Número de Identificación <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={field.state.value}
                      onChange={(e) => {
                        handleCedulaChange(e.target.value);
                        saveToSessionStorage({ ...form.state.values, Identificacion: e.target.value });
                      }}
                      placeholder={getPlaceholder('Identificacion', form.state.values.Tipo_Identificacion as TipoIdentificacion)}
                      disabled={!form.state.values.Tipo_Identificacion}
                      className={`${commonClasses} ${fieldErrors['Identificacion'] ? 'border-red-500 focus:ring-red-300' : ''} ${!form.state.values.Tipo_Identificacion ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                      maxLength={
                        form.state.values.Tipo_Identificacion === 'Cedula Nacional' ? 9 :
                          form.state.values.Tipo_Identificacion === 'Dimex' ? 12 :
                            form.state.values.Tipo_Identificacion === 'Pasaporte' ? 9 : 20
                      }
                    />
                  </div>
                  {/* muestra errores de identificación */}
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
                  {/* mensaje si no es afiliado eliminado, solo alert global */}
                </div>
              )}
            </form.Field>
          </div>


          {/* Dirección Exacta */}
          <form.Field name="Direccion_Exacta">
            {(field) => (
              <div className="mb-3 w-full">
                <label htmlFor="Direccion_Exacta" className="block mb-1 font-medium">Dirección exacta <span className="text-red-500">*</span></label>
                <textarea
                  value={field.state.value}
                  onChange={(e) => {
                    field.handleChange(e.target.value);
                    validateField("Direccion_Exacta", e.target.value, form.state.values);
                    saveToSessionStorage({ ...form.state.values, Direccion_Exacta: e.target.value });
                  }}
                  placeholder={getPlaceholder("Direccion_Exacta")}
                  maxLength={100}
                  className={commonClasses}
                />
                {/* Solo muestra errores de dirección aquí */}
                {fieldErrors["Direccion_Exacta"] && (
                  <span className="text-red-500 text-sm block mt-1">{fieldErrors["Direccion_Exacta"]}</span>
                )}
                {formErrors["Direccion_Exacta"] && !fieldErrors["Direccion_Exacta"] && (
                  <span className="text-red-500 text-sm block mt-1">{formErrors["Direccion_Exacta"]}</span>
                )}
              </div>
            )}
          </form.Field>


          {/* Id del Medidor */}
          <div className="mb-3">
            <form.Field name="Id_Medidor">
              {(field) => (
                <div>
                  <label htmlFor="Id_Medidor" className="block mb-1 font-medium">
                    Medidor <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      value={field.state.value || ""}
                      onChange={(e) => {
                        const value = e.target.value ? Number(e.target.value) : undefined;
                        field.handleChange(value);
                        validateField("Id_Medidor", value, { ...form.state.values, Id_Medidor: value });
                      }}
                      disabled={!form.state.values.Identificacion || isMedidoresLoading}
                      className={`${commonClasses} ${fieldErrors['Id_Medidor'] ? 'border-red-500 focus:ring-red-300' : ''} ${!form.state.values.Identificacion ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                    >
                      <option value="">Selecciona un medidor</option>
                      {medidores && medidores.length > 0 ? (
                        medidores.map((medidor) => (
                          <option key={medidor.Id_Medidor} value={medidor.Id_Medidor || ""}>
                            {medidor.Numero_Medidor} {medidor.Estado ? `(${medidor.Estado})` : ""}
                          </option>
                        ))
                      ) : (
                        !isMedidoresLoading && form.state.values.Identificacion && (
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
                  {fieldErrors['Id_Medidor'] && (
                    <span className="text-red-500 text-sm block mt-1">
                      {fieldErrors['Id_Medidor']}
                    </span>
                  )}
                  {formErrors['Id_Medidor'] && !fieldErrors['Id_Medidor'] && (
                    <span className="text-red-500 text-sm block mt-1">
                      {formErrors['Id_Medidor']}
                    </span>
                  )}
                </div>
              )}
            </form.Field>
          </div>

          {/* Motivo de Solicitud */}
          <form.Field name="Motivo_Desconexion">
            {(field) => (
              <div className="mb-3 w-full md:col-span-2">
                <label htmlFor="Motivo_Desconexion" className="block mb-1 font-medium">Motivo de desconexión <span className="text-red-500">*</span></label>
                <select
                  value={field.state.value}
                  onChange={(e) => {
                    const motivoSeleccionado = e.target.value as MotivoDesconexion;
                    field.handleChange(motivoSeleccionado);
                    validateField("Motivo_Desconexion", motivoSeleccionado, form.state.values);
                    if (motivoSeleccionado !== 'Otro (especifique)') {
                      form.setFieldValue('Motivo_Otro', '');
                      setFieldErrors(prev => {
                        const newErrors = { ...prev };
                        delete newErrors['Motivo_Otro'];
                        return newErrors;
                      });
                    }
                    saveToSessionStorage({ ...form.state.values, Motivo_Desconexion: motivoSeleccionado });
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
          {form.state.values.Motivo_Desconexion === 'Otro (especifique)' && (
            <form.Field name="Motivo_Otro">
              {(field) => (
                <div className="mb-3 w-full md:col-span-2">
                  <label htmlFor="Motivo_Otro" className="block mb-1 font-medium">Especifique la causa <span className="text-red-500">*</span></label>
                  <textarea
                    value={field.state.value}
                    onChange={(e) => {
                      field.handleChange(e.target.value);
                      validateField("Motivo_Otro", e.target.value, form.state.values);
                      saveToSessionStorage({ ...form.state.values, Motivo_Otro: e.target.value });
                    }}
                    placeholder={getPlaceholder("Motivo_Otro")}
                    maxLength={250}
                    className={`${commonClasses} resize-none h-24 overflow-y-auto scrollbar-thumb-blue-600 scrollbar-thin scrollbar-track-blue-100`}
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
        </div>

        {/* Archivos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
          <form.Field name="Planos_Terreno">
            {(field) => {
              const archivoActual = archivoSeleccionado["Planos_Terreno"] ?? null;
              return (
                <div className="w-full mb-2">
                  <label htmlFor="Planos_Terreno" className="block mb-1 font-medium">Planos del terreno <span className="text-red-500">*</span></label>
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
                    className={`inline-block text-white bg-blue-600 px-3 py-1 rounded text-sm ${archivoActual ? 'cursor-not-allowed opacity-50' : 'hover:bg-[#6FCAF1] cursor-pointer'}`}
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
                  {/*muestra errores de planos*/}
                  {fieldErrors["Planos_Terreno"] && (
                    <span className="text-red-500 text-sm block mt-1">
                      {fieldErrors["Planos_Terreno"]}
                    </span>
                  )}
                  {formErrors["Planos_Terreno"] && !fieldErrors["Planos_Terreno"] && (
                    <span className="text-red-500 text-sm block mt-1">
                      {formErrors["Planos_Terreno"]}
                    </span>
                  )}
                </div>
              );
            }}
          </form.Field>
          <form.Field name="Certificacion_Literal">
            {(field) => {
              const archivoActual = archivoSeleccionado["Certificacion_Literal"] ?? null;
              return (
                <div className="w-full mb-2">
                  <label htmlFor="Certificacion_Literal" className="block mb-1 font-medium">Certificacion Literal del terreno <span className="text-red-500">*</span></label>
                  <input
                    type="file"
                    accept=".png,.jpg,.jpeg,.heic,.pdf"
                    disabled={!!archivoActual}
                    onChange={(e) => {
                      const file = e.target.files?.[0] ?? null;
                      field.handleChange(file ?? undefined);
                      setArchivoSeleccionado(prev => ({ ...prev, ["Certificacion_Literal"]: file }));
                      validateField("Certificacion_Literal", file);
                    }}
                    className="hidden"
                    id="Certificacion_Literal"
                    ref={escrituraInputRef}
                    key={archivoActual ? archivoActual.name : 'escritura'}
                  />
                  <label
                    htmlFor="Certificacion_Literal"
                    className={`inline-block text-white bg-blue-600 px-3 py-1 rounded text-sm ${archivoActual ? 'cursor-not-allowed opacity-50' : 'hover:bg-[#6FCAF1] cursor-pointer'}`}
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
                          setArchivoSeleccionado(prev => ({ ...prev, ["Certificacion_Literal"]: null }));
                          setFieldErrors(prev => ({
                            ...prev,
                            ["Certificacion_Literal"]: `Debe subir la certificacion literal del terreno`,
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
                  {/* muestra errores de certificacion literal*/}
                  {fieldErrors["Certificacion_Literal"] && (
                    <span className="text-red-500 text-sm block mt-1">
                      {fieldErrors["Certificacion_Literal"]}
                    </span>
                  )}
                  {formErrors["Certificacion_Literal"] && !fieldErrors["Certificacion_Literal"] && (
                    <span className="text-red-500 text-sm block mt-1">
                      {formErrors["Certificacion_Literal"]}
                    </span>
                  )}
                </div>
              );
            }}
          </form.Field>
        </div>

        <div className="flex justify-center gap-4 mt-6 ml-50">

          {/* Botones */}

          <div className="flex justify-end items-center gap-3 mt-8">
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

        </div>
      </form>
    </div>
  );
};

export default FormularioDesconexionMedidor;