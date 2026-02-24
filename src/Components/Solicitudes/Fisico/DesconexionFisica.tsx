import { useForm } from "@tanstack/react-form";
import { useEffect, useRef, useState } from "react";
import { DesconexionMedidorSchema, TipoIdentificacionValues, type TipoIdentificacion } from "../../../Schemas/Solicitudes/Fisica/DesconexionMedidor";
import { useDesconexionFisica } from "../../../Hook/Solicitudes/HookFisicas";
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
const STORAGE_KEY = 'desconexion_fisica_temp';

const FormularioDesconexionMedidor = ({ onClose }: Props) => {
  const [archivoSeleccionado, setArchivoSeleccionado] = useState<{ [key: string]: File | null }>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const mutation = useDesconexionFisica();
  const planosInputRef = useRef<HTMLInputElement>(null);
  const escrituraInputRef = useRef<HTMLInputElement>(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(true);
  const { lookup, isLoading } = useCedulaLookup();

  // Función para manejar el cambio de cédula con búsqueda automática
  const handleCedulaChange = async (cedula: string) => {
    form.setFieldValue('Identificacion', cedula);
    validateField('Identificacion', cedula, form.state.values);

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
        Numero_Telefono: "+50688887777",
        Correo: "test@test.com",
        Motivo_Solicitud: "Motivo válido",
        Planos_Terreno: new File([''], 'test.jpg', { type: 'image/jpeg' }),
        Escritura_Terreno: new File([''], 'test.jpg', { type: 'image/jpeg' }),
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

      DesconexionMedidorSchema.parse(dummy);

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
      Apellido2: 'González',
      Correo: 'ejemplo@gmail.com',
      Numero_Telefono: '+50688887777',
      Direccion_Exacta: 'San José, del Banco Nacional 200m sur',
      Motivo_Solicitud: 'Escribe el motivo de tu solicitud',
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
            // Guardamos todo excepto los archivos
            const dataToSave = {
                Nombre: values.Nombre,
                Apellido1: values.Apellido1,
                Apellido2: values.Apellido2,
                Tipo_Identificacion: values.Tipo_Identificacion,
                Identificacion: values.Identificacion,
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
      Tipo_Identificacion: "Cedula Nacional",
      Identificacion: "",
      Direccion_Exacta: "",
      Numero_Telefono: "",
      Correo: "",
      Motivo_Solicitud: "",
      Planos_Terreno: undefined as File | undefined,
      Escritura_Terreno: undefined as File | undefined,
    },

    onSubmit: async ({ value }) => {
      setFormErrors({});
      try {
        value.Numero_Telefono = normalizePhoneNumber(value.Numero_Telefono);

        const validation = DesconexionMedidorSchema.safeParse(value);
        if (!validation.success) {
          const validationErrors: Record<string, string> = {};
          validation.error.errors.forEach((err) => {
            const field = err.path[0] as string;
            validationErrors[field] = err.message;
          });
          setFormErrors(validationErrors);
          return;
        }

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

        await mutation.createDesconexion(formData);
        sessionStorage.removeItem(STORAGE_KEY);

        form.reset();
        setFieldErrors({});
        setArchivoSeleccionado({});
        setMostrarFormulario(false);
        onClose();
      } catch (error: any) {
        console.log("ERROR EN SOLICITUD DE DESCONEXIÓN:", error);
      
      }
    },
  });


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
  if (!mostrarFormulario) return null;

  const commonClasses = 'w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300';

  return (
    <div className="flex justify-center items-center min-h-screen text-gray-800 p-7 w-full">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
         className="bg-white shadow-lg  pl-8 pr-8 pt-4 pb-4 rounded-lg w-[95%] max-w-7xl mx-auto max-h-auto overflow-y-auto scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-blue-100"
      >
        <h2 className="text-center text-2xl font-semibold mb-10">Formulario de desconexión de medidor</h2>

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
                    />
                    {isLoading && (
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                      </div>
                    )}
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
                </div>
              )}
            </form.Field>
          </div>

          {/* Nombre */}
          <form.Field name="Nombre">
            {(field) => (
              <div className="mb-3 w-full">
                <label htmlFor="Nombre" className="block mb-1 font-medium">Nombre <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={field.state.value}
                  onChange={(e) => {
                    field.handleChange(e.target.value);
                    validateField("Nombre", e.target.value, form.state.values);
                    saveToSessionStorage({ ...form.state.values, Nombre: e.target.value });
                  }}
                  placeholder={getPlaceholder("Nombre")}
                  maxLength={50}
                  className={commonClasses}
                />
                {/*  muestra errores de nombre  */}
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
                <label htmlFor="Apellido1" className="block mb-1 font-medium">Primer Apellido <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={field.state.value}
                  onChange={(e) => {
                    field.handleChange(e.target.value);
                    validateField("Apellido1", e.target.value, form.state.values);
                    saveToSessionStorage({ ...form.state.values, Apellido1: e.target.value });
                  }}
                  placeholder={getPlaceholder("Apellido1")}
                  maxLength={50}
                  className={commonClasses}
                />
                {/* Solo muestra errores de primer apellido aquí */}
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
                <label htmlFor="Apellido2" className="block mb-1 font-medium">Segundo Apellido <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={field.state.value}
                  onChange={(e) => {
                    field.handleChange(e.target.value);
                    validateField("Apellido2", e.target.value, form.state.values);
                    saveToSessionStorage({ ...form.state.values, Apellido2: e.target.value });
                  }}
                  placeholder={getPlaceholder("Apellido2")}
                  maxLength={50}
                  className={commonClasses}
                />
                {/* Solo muestra errores de segundo apellido aquí */}
                {fieldErrors["Apellido2"] && (
                  <span className="text-red-500 text-sm block mt-1">{fieldErrors["Apellido2"]}</span>
                )}
                {formErrors["Apellido2"] && !fieldErrors["Apellido2"] && (
                  <span className="text-red-500 text-sm block mt-1">{formErrors["Apellido2"]}</span>
                )}
              </div>
            )}
          </form.Field>
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
          {/* Correo */}
          <form.Field name="Correo">
            {(field) => (
              <div className="mb-3 w-full">
                <label htmlFor="Correo" className="block mb-1 font-medium">Correo electrónico <span className="text-red-500">*</span></label>
                <input
                  type="email"
                  value={field.state.value}
                  onChange={(e) => {
                    field.handleChange(e.target.value);
                    validateField("Correo", e.target.value, form.state.values);
                    saveToSessionStorage({ ...form.state.values, Correo: e.target.value });
                  }}
                  placeholder={getPlaceholder("Correo")}
                  maxLength={100}
                  className={commonClasses}
                />
                {/* Solo muestra errores de correo aquí */}
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
                <label htmlFor="Numero_Telefono" className="block mb-1 font-medium">Número de teléfono <span className="text-red-500">*</span></label>
                <PhoneInputComponent
                  value={field.state.value}
                  onChange={(value) => {
                    field.handleChange(value || "");
                    validateField("Numero_Telefono", value || "", form.state.values);
                    saveToSessionStorage({ ...form.state.values, Numero_Telefono: value || "" });
                  }}
                  className={`${fieldErrors["Numero_Telefono"] ? 'border-red-500' : ''}`}
                />
                {/*  muestra errores de teléfono*/}
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
                <label htmlFor="Motivo_Solicitud" className="block mb-1 font-medium">Motivo de solicitud <span className="text-red-500">*</span></label>
                <textarea
                  value={field.state.value}
                  onChange={(e) => {
                    field.handleChange(e.target.value);
                    validateField("Motivo_Solicitud", e.target.value, form.state.values);
                    saveToSessionStorage({ ...form.state.values, Motivo_Solicitud: e.target.value });
                  }}
                  placeholder={getPlaceholder("Motivo_Solicitud")}
                  maxLength={250}
                  className={`${commonClasses} resize-none h-24 overflow-y-scroll`}
                />
                {/* muestra errores de motivo*/}
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
          <form.Field name="Escritura_Terreno">
            {(field) => {
              const archivoActual = archivoSeleccionado["Escritura_Terreno"] ?? null;
              return (
                <div className="w-full mb-2">
                  <label htmlFor="Escritura_Terreno" className="block mb-1 font-medium">Escritura del terreno <span className="text-red-500">*</span></label>
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
                  {/* muestra errores de escritura*/}
                  {fieldErrors["Escritura_Terreno"] && (
                    <span className="text-red-500 text-sm block mt-1">
                      {fieldErrors["Escritura_Terreno"]}
                    </span>
                  )}
                  {formErrors["Escritura_Terreno"] && !fieldErrors["Escritura_Terreno"] && (
                    <span className="text-red-500 text-sm block mt-1">
                      {formErrors["Escritura_Terreno"]}
                    </span>
                  )}
                </div>
              );
            }}
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

export default FormularioDesconexionMedidor;