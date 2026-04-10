
import { useForm } from "@tanstack/react-form";
import { useEffect, useRef, useState } from "react";
import { CambioMedidorSchema, TipoIdentificacionValues, type TipoIdentificacion } from "../../../Schemas/Solicitudes/Fisica/CambioMedidor";
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { useCambioMedidorFisica, useMedidores } from "../../../Hook/Solicitudes/HookFisicas";
import { useAlerts } from "../../../context/AlertContext";
import { useCedulaLookup } from "../../../Hook/Solicitudes/CedulaLookHook";
import { Loader2 } from "lucide-react";
import PhoneInputComponent from "../PhoneInputComponent";

type Props = {
  onClose: () => void;
};

const normalizePhoneNumber = (phone: string): string => {
  const phoneNumber = parsePhoneNumberFromString(phone);
  if (!phoneNumber?.isValid()) {
    throw new Error('Número de teléfono inválido. Asegúrate de incluir el código de país, ej. +5215512345678');
  }
  return phoneNumber.format('E.164');
};

const STORAGE_KEY = 'cambiomedidor_fisico_temp';

const FormularioCambioMedidor = ({ onClose }: Props) => {
  const sanitizeNameInput = (value: string) => value.replace(/\d/g, "");
  const [archivoSeleccionado, setArchivoSeleccionado] = useState<{ [key: string]: File | null }>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSending, setIsSending] = useState(false);
  // Usar sistema global de alertas
  const { showError } = useAlerts();
  const mutation = useCambioMedidorFisica();
  const [mostrarFormulario, setMostrarFormulario] = useState(true);
  const { lookup, isLoading } = useCedulaLookup();
  const [identificacion, setIdentificacion] = useState('');
  const planosInputRef = useRef<HTMLInputElement>(null);
  const escrituraInputRef = useRef<HTMLInputElement>(null);
  const { medidores, isLoading: isMedidoresLoading } = useMedidores(identificacion);


  const validateField = (fieldName: string, value: any, allValues?: any) => {
    const valuesToValidate = {
      ...allValues,
      [fieldName]: value,
    };

    const validation = CambioMedidorSchema.safeParse(valuesToValidate);
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

  const handleCedulaChange = async (cedula: string) => {
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

    if (tipoId === 'Cedula Nacional' && /^\d{9}$/.test(identificacionProcesada)) {
      const resultado = await lookup(identificacionProcesada);
      if (resultado) {
        form.setFieldValue('Nombre', resultado.firstname || '');
        form.setFieldValue('Apellido1', resultado.lastname1 || '');
        form.setFieldValue('Apellido2', resultado.lastname2 || '');
      }
    }
    // Ya no se valida afiliación aquí
  };

  const getPlaceholder = (fieldName: string, tipoIdentificacion?: TipoIdentificacion) => {
    const placeholders: Record<string, string> = {
      Nombre: 'Juan Carlos',
      Apellido1: 'Pérez',
      Apellido2: 'González',
      Correo: 'ejemplo@gmail.com',
      Numero_Telefono: '+50688887777',
      Direccion_Exacta: 'San José, del Banco Nacional 200m sur',
      Motivo_Solicitud: 'Cambio por daño',
      Id_Medidor: '1',
    };
    if (fieldName === 'Identificacion') {
      switch (tipoIdentificacion) {
        case "Cedula Nacional": return '123456789';
        case "Dimex": return '123456789012'; //  corregido aquí
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
      Nombre: '',
      Apellido1: '',
      Apellido2: '',
      Tipo_Identificacion: 'Cedula Nacional' as TipoIdentificacion,
      Identificacion: '',
      Direccion_Exacta: '',
      Numero_Telefono: '',
      Correo: '',
      Motivo_Solicitud: '',
      Id_Medidor: 0,
      Planos_Terreno: undefined as File | undefined,
      Certificacion_Literal: undefined as File | undefined,
    },
    onSubmit: async ({ value }) => {
      setFormErrors({});
      setFieldErrors({});
      try {
        value.Numero_Telefono = normalizePhoneNumber(value.Numero_Telefono);
        const validation = CambioMedidorSchema.safeParse(value);
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

        // Validar afiliación solo al enviar
        const tipoId = value.Tipo_Identificacion;
        if (tipoId === 'Cedula Nacional' && /^\d{9}$/.test(value.Identificacion)) {
          const soloDigitos = value.Identificacion.replace(/\D/g, '');
          try {
            const resultado = await lookup(soloDigitos);
            if (resultado) {
              form.setFieldValue('Nombre', resultado.firstname || '');
              form.setFieldValue('Apellido1', resultado.lastname1 || '');
              form.setFieldValue('Apellido2', resultado.lastname2 || '');
            }
          } catch (error: any) {
            // Si hay error, igual permitimos el envío para no bloquear el flujo
          }
        }

        const formData = new FormData();
        Object.entries(validation.data).forEach(([key, val]) => {
          if (val !== undefined && val !== null && val !== "") {
            if (val instanceof File) {
              formData.append(key, val);
            } else {
              formData.append(key, String(val));
            }
          }
        });
        setIsSending(true);
        await mutation.createCambioMedidor(formData);
        sessionStorage.removeItem(STORAGE_KEY);

        form.reset();
        setFieldErrors({});
        setArchivoSeleccionado({});
        if (planosInputRef.current) planosInputRef.current.value = '';
        if (escrituraInputRef.current) escrituraInputRef.current.value = '';
        setMostrarFormulario(false);
        onClose();
      } catch (error: any) {
        console.error('Error al enviar formulario de cambio de medidor:', {
          status: error?.response?.status,
          data: error?.response?.data,
          message: error?.message,
        });
        throw error;
      } finally {
        setIsSending(false);
      }
    },
  });


  // Mostrar alert cuando se verifica afiliación (igual que DesconexionFisica)
  useEffect(() => {
    if (
      identificacion &&
      !isMedidoresLoading &&
      identificacion.length >= 9
    ) {
      if (medidores.length === 0) {
        showError(
          "No Eres Afiliado",
          "No puedes solicitar el cambio porque no eres un afiliado con medidores activos. Completa tu afiliación primero."
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
          if (key !== 'Planos_Terreno' && key !== 'Certificacion_Literal') {
            form.setFieldValue(key as any, value as any);
          }
        });
      } catch (error) {
        console.error('Error al cargar datos guardados:', error);
      }
    }
  }, []);



  if (!mostrarFormulario) return null;


  const commonClasses = 'w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring focus:ring-blue-300';

  return (
    <div className="w-full text-gray-800">
      <form
        onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }}
        className="scrollbar-hide w-full rounded-[24px] bg-white px-4 py-3 sm:px-6 sm:py-4"
      >
        <h2 className="text-center text-xl font-semibold mb-6">Formulario de cambio de medidor</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-2">
          {/* Tipo de Identificación y Número de Identificación */}
          <form.Field name="Tipo_Identificacion">
            {(field) => (
              <div className="mb-3 w-full">
                <label htmlFor="Tipo_Identificacion" className="block mb-1 font-medium">Tipo de Identificación <span className="text-red-500">*</span></label>
                <select
                  value={field.state.value}
                  onChange={(e) => {
                    const selectedTipo = e.target.value as TipoIdentificacion;
                    field.handleChange(selectedTipo);
                    validateField('Tipo_Identificacion', selectedTipo, form.state.values);
                    form.setFieldValue('Identificacion', '');
                    setIdentificacion('');
                    setFieldErrors(prev => { const newErrors = { ...prev }; delete newErrors['Identificacion']; return newErrors; });
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
              </div>
            )}
          </form.Field>
          <form.Field name="Identificacion">
            {(field) => (
              <div className="mb-3 w-full">
                <label htmlFor="Identificacion" className="block mb-1 font-medium">Número de Identificación <span className="text-red-500">*</span></label>
                <div className="relative">
                  <input
                    type="text"
                    value={field.state.value}
                    onChange={(e) => {
                      handleCedulaChange(e.target.value);
                    }}
                    placeholder={getPlaceholder("Identificacion", form.state.values.Tipo_Identificacion)}
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
                {fieldErrors["Identificacion"] && (
                  <span className="text-red-500 text-sm block mt-1">{fieldErrors["Identificacion"]}</span>
                )}
              </div>
            )}
          </form.Field>
          {/* Nombre y Primer Apellido  */}
          <form.Field name="Nombre">
            {(field) => (
              <div className="mb-3 w-full">
                <label htmlFor="Nombre" className="block mb-1 font-medium">Nombre <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={field.state.value}
                  onChange={(e) => {
                    const cleanValue = sanitizeNameInput(e.target.value);
                    field.handleChange(cleanValue);
                    validateField("Nombre", cleanValue, form.state.values);
                    saveToSessionStorage({ ...form.state.values, Nombre: cleanValue });
                  }}
                  placeholder={getPlaceholder("Nombre")}
                  maxLength={50}
                  className={commonClasses}
                />
                {fieldErrors["Nombre"] && (
                  <span className="text-red-500 text-sm block mt-1">{fieldErrors["Nombre"]}</span>
                )}
              </div>
            )}
          </form.Field>
          <form.Field name="Apellido1">
            {(field) => (
              <div className="mb-3 w-full">
                <label htmlFor="Apellido1" className="block mb-1 font-medium">Primer Apellido <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={field.state.value}
                  onChange={(e) => {
                    const cleanValue = sanitizeNameInput(e.target.value);
                    field.handleChange(cleanValue);
                    validateField("Apellido1", cleanValue, form.state.values);
                    saveToSessionStorage({ ...form.state.values, Apellido1: cleanValue });
                  }}
                  placeholder={getPlaceholder("Apellido1")}
                  maxLength={50}
                  className={commonClasses}
                />
                {fieldErrors["Apellido1"] && (
                  <span className="text-red-500 text-sm block mt-1">{fieldErrors["Apellido1"]}</span>
                )}
              </div>
            )}
          </form.Field>

          {/* Segundo Apellido y Dirección Exacta */}
          <form.Field name="Apellido2">
            {(field) => (
              <div className="mb-3 w-full">
                <label htmlFor="Apellido2" className="block mb-1 font-medium">Segundo Apellido <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  value={field.state.value}
                  onChange={(e) => {
                    const cleanValue = sanitizeNameInput(e.target.value);
                    field.handleChange(cleanValue);
                    validateField("Apellido2", cleanValue, form.state.values);
                    saveToSessionStorage({ ...form.state.values, Apellido2: cleanValue });
                  }}
                  placeholder={getPlaceholder("Apellido2")}
                  maxLength={50}
                  className={commonClasses}
                />
                {fieldErrors["Apellido2"] && (
                  <span className="text-red-500 text-sm block mt-1">{fieldErrors["Apellido2"]}</span>
                )}
              </div>
            )}
          </form.Field>
          <form.Field name="Direccion_Exacta">
            {(field) => (
              <div className="mb-3 w-full">
                <label htmlFor="Direccion_Exacta" className="block mb-1 font-medium">Dirección exacta <span className="text-red-500">*</span></label>
                <textarea
                  value={field.state.value}
                  onChange={(e) => {
                    const direccion = e.target.value;
                    field.handleChange(direccion);
                    validateField("Direccion_Exacta", direccion, form.state.values);
                    saveToSessionStorage({ ...form.state.values, Direccion_Exacta: direccion });
                  }}
                  placeholder={getPlaceholder("Direccion_Exacta")}
                  maxLength={100}
                  className={commonClasses}
                />
                {fieldErrors["Direccion_Exacta"] && (
                  <span className="text-red-500 text-sm block mt-1">{fieldErrors["Direccion_Exacta"]}</span>
                )}
              </div>
            )}
          </form.Field>

          {/* Correo y Teléfono */}
          <form.Field name="Correo">
            {(field) => (
              <div className="mb-3 w-full">
                <label htmlFor="Correo" className="block mb-1 font-medium">Correo electrónico <span className="text-red-500">*</span></label>
                <input
                  type="email"
                  value={field.state.value}
                  onChange={(e) => {
                    const correo = e.target.value;
                    field.handleChange(correo);
                    validateField("Correo", correo, form.state.values);
                    saveToSessionStorage({ ...form.state.values, Correo: correo });
                  }}
                  placeholder={getPlaceholder("Correo")}
                  maxLength={100}
                  className={commonClasses}
                />
                {fieldErrors["Correo"] && (
                  <span className="text-red-500 text-sm block mt-1">{fieldErrors["Correo"]}</span>
                )}
              </div>
            )}
          </form.Field>
          <form.Field name="Numero_Telefono">
            {(field) => (
              <div className="mb-3 w-full">
                <label htmlFor="Numero_Telefono" className="block mb-1 font-medium">Número de teléfono <span className="text-red-500">*</span></label>
                <PhoneInputComponent
                  value={field.state.value}
                  onChange={(value) => {
                    const telefono = value || "";
                    field.handleChange(telefono);
                    validateField("Numero_Telefono", telefono, form.state.values);
                    saveToSessionStorage({ ...form.state.values, Numero_Telefono: telefono });
                  }}
                  className={`${fieldErrors["Numero_Telefono"] ? 'border-red-500' : ''}`}
                />
                {fieldErrors["Numero_Telefono"] && (
                  <span className="text-red-500 text-sm block mt-1">{fieldErrors["Numero_Telefono"]}</span>
                )}
              </div>
            )}
          </form.Field>

          {/* Número de Medidor y Motivo */}
          <form.Field name="Id_Medidor">
            {(field) => {
              const noMedidores = identificacion && !isMedidoresLoading && medidores.length === 0;
              return (
                <div className="mb-3 w-full">
                  <label htmlFor="Id_Medidor" className="block mb-1 font-medium">Número de Medidor <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <select
                      id="Id_Medidor"
                      value={field.state.value || ''}
                      onChange={(e) => {
                        const idMedidor = Number(e.target.value);
                        field.handleChange(idMedidor);
                        validateField("Id_Medidor", idMedidor, form.state.values);
                      }}
                      onBlur={field.handleBlur}
                      className={commonClasses}
                      disabled={!!(!identificacion || isMedidoresLoading || noMedidores)}
                    >
                      <option value="">Seleccione un medidor</option>
                      {medidores.map((med) => (
                        <option key={med.Id_Medidor} value={med.Id_Medidor}>
                          Medidor #{med.Numero_Medidor} {med.Estado ? `(${med.Estado})` : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                  {fieldErrors["Id_Medidor"] && (
                    <span className="text-red-500 text-sm block mt-1">{fieldErrors["Id_Medidor"]}</span>
                  )}
                  {noMedidores && (
                    <span className="text-red-500 text-sm block mt-1">No hay medidores asociados a esta cédula. Primero debes ser afiliado.</span>
                  )}
                </div>
              );
            }}
          </form.Field>

          {/* Motivo de Solicitud */}
          <form.Field name="Motivo_Solicitud">
            {(field) => (
              <div className="mb-3 w-full">
                <label htmlFor="Motivo_Solicitud" className="block mb-1 font-medium">Motivo de solicitud <span className="text-red-500">*</span></label>
                <textarea
                  id="Motivo_Solicitud"
                  value={field.state.value}
                  onChange={(e) => {
                    const motivo = e.target.value;
                    field.handleChange(motivo);
                    validateField("Motivo_Solicitud", motivo, form.state.values);
                    saveToSessionStorage({ ...form.state.values, Motivo_Solicitud: motivo });
                  }}
                  placeholder="Escribe el motivo de tu solicitud"
                  maxLength={250}
                  className={`${commonClasses} resize-none h-24 overflow-y-auto scrollbar-thumb-blue-600 scrollbar-thin scrollbar-track-blue-100`}
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

          {/* Planos del Terreno */}
          <form.Field name="Planos_Terreno">
            {(field) => {
              const archivoActual = archivoSeleccionado["Planos_Terreno"] ?? null;
              return (
                <div className="mb-3 w-full">
                  <label className="block mb-1 font-medium">Planos del terreno <span className="text-red-500">*</span></label>
                  <input
                    type="file"
                    accept=".png,.jpg,.jpeg,.heic,.pdf"
                    disabled={!!archivoActual}
                    onChange={(e) => {
                      const file = e.target.files?.[0] ?? null;
                      field.handleChange(file ?? undefined);
                      setArchivoSeleccionado(prev => ({ ...prev, ["Planos_Terreno"]: file }));
                      validateField("Planos_Terreno", file, form.state.values);
                    }}
                    className="hidden"
                    id="Planos_Terreno_CambioFisico"
                    ref={planosInputRef}
                    key={archivoActual ? archivoActual.name : 'planos'}
                  />
                  <label
                    htmlFor="Planos_Terreno_CambioFisico"
                    className={`inline-block text-white bg-blue-600 px-3 py-1 rounded text-sm ${archivoActual ? 'cursor-not-allowed opacity-50' : 'hover:bg-blue-700 cursor-pointer'}`}
                  >
                    {archivoActual ? 'Archivo cargado' : 'Subir archivo'}
                  </label>
                  {archivoActual && (
                    <div className="border rounded-md p-3 bg-gray-50 pb-2 mb-2 flex justify-between items-center">
                      <span className="text-sm text-gray-700">{archivoActual.name}</span>
                      <button
                        type="button"
                        onClick={() => {
                          field.handleChange(undefined);
                          setArchivoSeleccionado(prev => ({ ...prev, ["Planos_Terreno"]: null }));
                          setFieldErrors(prev => ({ ...prev, ["Planos_Terreno"]: 'Debe subir el plano del terreno' }));
                          if (planosInputRef.current) planosInputRef.current.value = '';
                        }}
                        className="text-red-500 hover:underline text-xs"
                      >
                        Eliminar
                      </button>
                    </div>
                  )}
                  {fieldErrors["Planos_Terreno"] && (
                    <span className="text-red-500 text-sm block mt-1">{fieldErrors["Planos_Terreno"]}</span>
                  )}
                  {formErrors["Planos_Terreno"] && !fieldErrors["Planos_Terreno"] && (
                    <span className="text-red-500 text-sm block mt-1">{formErrors["Planos_Terreno"]}</span>
                  )}
                </div>
              );
            }}
          </form.Field>

          {/* Certificacion Literal del Terreno */}
          <form.Field name="Certificacion_Literal">
            {(field) => {
              const archivoActual = archivoSeleccionado["Certificacion_Literal"] ?? null;
              return (
                <div className="mb-3 w-full">
                  <label className="block mb-1 font-medium">Certificacion Literal del terreno <span className="text-red-500">*</span></label>
                  <input
                    type="file"
                    accept=".png,.jpg,.jpeg,.heic,.pdf"
                    disabled={!!archivoActual}
                    onChange={(e) => {
                      const file = e.target.files?.[0] ?? null;
                      field.handleChange(file ?? undefined);
                      setArchivoSeleccionado(prev => ({ ...prev, ["Certificacion_Literal"]: file }));
                      validateField("Certificacion_Literal", file, form.state.values);
                    }}
                    className="hidden"
                    id="Certificacion_Literal_CambioFisico"
                    ref={escrituraInputRef}
                    key={archivoActual ? archivoActual.name : 'escritura'}
                  />
                  <label
                    htmlFor="Certificacion_Literal_CambioFisico"
                    className={`inline-block text-white bg-blue-600 px-3 py-1 rounded text-sm ${archivoActual ? 'cursor-not-allowed opacity-50' : 'hover:bg-blue-700 cursor-pointer'}`}
                  >
                    {archivoActual ? 'Archivo cargado' : 'Subir archivo'}
                  </label>
                  {archivoActual && (
                    <div className="border rounded-md p-3 bg-gray-50 pb-2 mb-2 flex justify-between items-center">
                      <span className="text-sm text-gray-700">{archivoActual.name}</span>
                      <button
                        type="button"
                        onClick={() => {
                          field.handleChange(undefined);
                          setArchivoSeleccionado(prev => ({ ...prev, ["Certificacion_Literal"]: null }));
                          setFieldErrors(prev => ({ ...prev, ["Certificacion_Literal"]: 'Debe subir la certificacion literal del terreno' }));
                          if (escrituraInputRef.current) escrituraInputRef.current.value = '';
                        }}
                        className="text-red-500 hover:underline text-xs"
                      >
                        Eliminar
                      </button>
                    </div>
                  )}
                  {fieldErrors["Certificacion_Literal"] && (
                    <span className="text-red-500 text-sm block mt-1">{fieldErrors["Certificacion_Literal"]}</span>
                  )}
                  {formErrors["Certificacion_Literal"] && !fieldErrors["Certificacion_Literal"] && (
                    <span className="text-red-500 text-sm block mt-1">{formErrors["Certificacion_Literal"]}</span>
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
                Object.values(fieldErrors).some(Boolean) ||
                Object.values(formErrors).some(Boolean) ||
                [
                  form.state.values.Nombre,
                  form.state.values.Apellido1,
                  form.state.values.Apellido2,
                  form.state.values.Tipo_Identificacion,
                  form.state.values.Identificacion,
                  form.state.values.Correo,
                  form.state.values.Direccion_Exacta,
                  form.state.values.Numero_Telefono,
                  form.state.values.Id_Medidor,
                  form.state.values.Motivo_Solicitud,
                  form.state.values.Planos_Terreno,
                  form.state.values.Certificacion_Literal
                ].some(val => val === undefined || val === null || val === "")
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

export default FormularioCambioMedidor;
