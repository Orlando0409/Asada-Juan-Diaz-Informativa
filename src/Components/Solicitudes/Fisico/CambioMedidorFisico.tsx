import { useForm } from "@tanstack/react-form";
import { useEffect, useState } from "react";
import { CambioMedidorSchema, TipoIdentificacionValues, type TipoIdentificacion } from "../../../Schemas/Solicitudes/Fisica/CambioMedidor";
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { useCambioMedidorFisica, useMedidores } from "../../../Hook/Solicitudes/HookFisicas";
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
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSending, setIsSending] = useState(false);
  const mutation = useCambioMedidorFisica();
  const [mostrarFormulario, setMostrarFormulario] = useState(true);
  const { lookup, isLoading } = useCedulaLookup();
  const [identificacion, setIdentificacion] = useState('');
  const { medidores, isLoading: isMedidoresLoading } = useMedidores(identificacion);


  const validateField = (fieldName: string, value: any, allValues?: any) => {
    try {
      const dummy: any = {
        Nombre: "Test",
        Apellido1: "Test",
        Apellido2: "",
        Tipo_Identificacion: "Cedula Nacional",
        Identificacion: "123456789",
        Direccion_Exacta: "1234567890",
        Numero_Telefono: "+50688887777",
        Correo: "test@test.com",
        Motivo_Solicitud: "1234567890",
        Id_Medidor: 1,
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
    },
    onSubmit: async ({ value }) => {
      setFormErrors({});
      try {
        value.Numero_Telefono = normalizePhoneNumber(value.Numero_Telefono);
        const validation = CambioMedidorSchema.safeParse(value);
        if (!validation.success) {
          const validationErrors: Record<string, string> = {};
          validation.error.errors.forEach((err) => {
            const field = err.path[0] as string;
            validationErrors[field] = err.message;
          });
          setFormErrors(validationErrors);
          return;
        }
        console.log('Payload enviado:', value);
        setIsSending(true);
        await mutation.createCambioMedidor(value);
        sessionStorage.removeItem(STORAGE_KEY);

        form.reset();
        setFieldErrors({});
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


  const commonClasses = 'w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring focus:ring-blue-300';

  return (
    <div className="w-full text-gray-800">
      <form
        onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }}
        className="scrollbar-hide w-full overflow-y-auto rounded-[24px] bg-white px-4 py-3 shadow-[0_30px_80px_-32px_rgba(15,23,42,0.55)] sm:px-6 sm:py-4"
        style={{ maxHeight: "calc(100dvh - 3rem)" }}
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
                    field.handleChange(e.target.value as TipoIdentificacion);
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
                    field.handleChange(e.target.value);
                    saveToSessionStorage({ ...form.state.values, Direccion_Exacta: e.target.value });
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
                    field.handleChange(e.target.value);
                    saveToSessionStorage({ ...form.state.values, Correo: e.target.value });
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
                    field.handleChange(value || "");
                    saveToSessionStorage({ ...form.state.values, Numero_Telefono: value || "" });
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
                      }}
                      onBlur={field.handleBlur}
                      className={commonClasses}
                      disabled={!identificacion || isMedidoresLoading}
                    >
                      <option value="">Seleccione un medidor</option>
                      {medidores.map((med) => (
                        <option key={med.Id_Medidor} value={med.Id_Medidor}>
                          Medidor #{med.Numero_Medidor} {med.Estado ? `(${med.Estado})` : ''}
                        </option>
                      ))}
                    </select>

                    {isMedidoresLoading && (
                      <div className="absolute right-10 top-1/2 -translate-y-1/2">
                        <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                      </div>
                    )}
                  </div>

                  {fieldErrors["Id_Medidor"] && (
                    <span className="text-red-500 text-sm block mt-1">
                      {fieldErrors["Id_Medidor"]}
                    </span>
                  )}

                  {medidores.length === 0 && identificacion && !isMedidoresLoading && (
                    <span className="text-red-500 text-sm block mt-1">
                      No se encontraron medidores para esta identificación
                    </span>
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
                    field.handleChange(e.target.value);
                    saveToSessionStorage({ ...form.state.values, Motivo_Solicitud: e.target.value });
                  }}
                  placeholder="Escribe el motivo de tu solicitud"
                  maxLength={250}
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

export default FormularioCambioMedidor;
