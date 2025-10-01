import { useForm } from "@tanstack/react-form";
import { useRef, useState } from "react";
import data from "../../../data/Data.json";

import { useAfiliaciones } from "../../../Hook/Solicitudes/Fisico/hookAfiliacion";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { AfiliacionSchema, TipoIdentificacionValues, type TipoIdentificacion } from "../../../Schemas/Solicitudes/Fisica/Afiliacion";

type AxiosError = {
  response?: {
    data?: {
      message?: string;
    };
  };
  message: string;
};

type SolicitudTipo = 'abonado';

type Props = {
  tipo: SolicitudTipo;
  onClose: () => void;
};

const normalizePhoneNumber = (phone: string): string => {
  if (!phone.startsWith('+')) {
    throw new Error('El número debe incluir el código de país y comenzar con "+". Ejemplo: +5215512345678');
  }
  return phone;
};

const FormularioAfiliacion = ({ tipo, onClose }: Props) => {
  const [archivoSeleccionado, setArchivoSeleccionado] = useState<{ [key: string]: File | null }>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const planosInputRef = useRef<HTMLInputElement>(null);
  const escrituraInputRef = useRef<HTMLInputElement>(null);

  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(true);
  const mutation = useAfiliaciones();

  // Validación en tiempo real usando el schema
  const validateField = (fieldName: string, value: any, allValues?: any) => {
    try {
      const dummy: any = {
        Nombre: "Test",
        Apellido1: "Test",
        Apellido2: "",
        Tipo_Identificacion: "Cedula Nacional",
        Identificacion: "123456789",
        Edad: 18,
        Direccion_Exacta: "1234567890",
        Numero_Telefono: "+50688887777",
        Correo: "test@test.com",
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

      AfiliacionSchema.parse(dummy);

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
      Numero_Telefono: '+50688887777',
      Direccion_Exacta: 'San José, del Banco Nacional 200m sur',
      Edad: '25',
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
      Nombre: '',
      Apellido1: '',
      Apellido2: '',
      Tipo_Identificacion: "Cedula Nacional",
      Identificacion: '',
      Correo: '',
      Direccion_Exacta: '',
      Numero_Telefono: '',
      Edad: 0,
      Planos_Terreno: undefined as File | undefined,
      Escritura_Terreno: undefined as File | undefined,
      Motivo_Solicitud: '',
    },

    onSubmit: async ({ value }) => {
      setFormErrors({});
      try {
        value.Numero_Telefono = normalizePhoneNumber(value.Numero_Telefono);

        const validation = AfiliacionSchema.safeParse(value);
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

        await mutation.createAfiliacion(formData);

        form.reset();
        setFormErrors({});
        setFieldErrors({});
        setArchivoSeleccionado({});
        setMostrarFormulario(false);
        setShowSuccessAlert(true);
        setTimeout(() => setShowSuccessAlert(false), 3000);
        alert("¡Solicitud enviada con éxito!");
        if (onClose) onClose();
        // ...dentro de onSubmit...
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

  if (!mostrarFormulario) {
    return showSuccessAlert ? (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
        <div className="bg-white rounded-lg shadow-lg px-8 py-6 text-center">
          <h3 className="text-green-600 text-xl font-semibold mb-2">¡Solicitud enviada con éxito!</h3>
          <p className="text-gray-700">Gracias por enviar tu solicitud.</p>
        </div>
      </div>
    ) : null;
  }

  const campos = data.requisitosSolicitudes[tipo];
  const commonClasses = 'w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300';

  return (
    <div className="flex justify-center items-center min-h-screen text-gray-800 p-5 w-full">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          form.handleSubmit();
        }}
        className="bg-white shadow-lg pl-24 pr-24 pt-8 pb-8 rounded-lg w-full max-w-7xl mx-auto"
      >
        <h2 className="text-center text-2xl font-semibold mb-10">Formulario de afiliación</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
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
                    }}
                    placeholder={getPlaceholder('Identificacion', form.state.values.Tipo_Identificacion as TipoIdentificacion)}
                    disabled={!form.state.values.Tipo_Identificacion}
                    className={`${commonClasses} ${!form.state.values.Tipo_Identificacion ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                  />
                  {/* Mensajes de error para Identificacion */}
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
          {/* Dirección Exacta */}
          <form.Field name="Direccion_Exacta">
            {(field) => (
              <div className="mb-3 w-full">
                <label className="block mb-1 font-medium">Dirección exacta <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={field.state.value}
                  onChange={(e) => {
                    field.handleChange(e.target.value);
                    validateField("Direccion_Exacta", e.target.value, form.state.values);
                  }}
                  placeholder={getPlaceholder("Direccion_Exacta")}
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
          {/* Edad */}
          <form.Field name="Edad">
            {(field) => (
              <div className="mb-3 w-full">
                <label className="block mb-1 font-medium">Edad <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  min={18}
                  value={field.state.value}
                  onChange={(e) => {
                    field.handleChange(Number(e.target.value));
                    validateField("Edad", Number(e.target.value), form.state.values);
                  }}
                  placeholder={getPlaceholder("Edad")}
                  className={commonClasses}
                />
                {fieldErrors["Edad"] && (
                  <span className="text-red-500 text-sm block mt-1">{fieldErrors["Edad"]}</span>
                )}
                {formErrors["Edad"] && !fieldErrors["Edad"] && (
                  <span className="text-red-500 text-sm block mt-1">{formErrors["Edad"]}</span>
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
                  <label className="block mb-1 font-medium">Planos del terreno <span className="text-red-500">*</span></label>
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
                  <label className="block mb-1 font-medium">Escritura del terreno <span className="text-red-500">*</span></label>
                  <input
                    type="file"
                    accept=".png,.jpg,.jpeg,.heic"
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
                          if (escrituraInputRef.current) escrituraInputRef.current.value = "";
                        }}
                        className="text-red-500 hover:underline text-xs"
                      >
                        Eliminar
                      </button>
                    </div>
                  )}
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

        {/* Mensaje general */}
        {formErrors.general && (
          <div className={`text-center mt-4 ${formErrors.general.includes("éxito") ? "text-green-600" : "text-red-500"}`}>
            {formErrors.general}
          </div>
        )}

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

export default FormularioAfiliacion;