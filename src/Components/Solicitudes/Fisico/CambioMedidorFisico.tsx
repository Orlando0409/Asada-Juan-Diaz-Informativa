import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import { z } from "zod";
import { CambioMedidorSchema, TipoIdentificacionValues, type TipoIdentificacion } from "../../../Schemas/Solicitudes/Fisica/CambioMedidor";
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import { useCambioMedidorFisica } from "../../../Hook/Solicitudes/HookFisicas";
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

// Extrae los esquemas individuales de Zod
const fieldSchemas: Record<string, z.ZodTypeAny> = CambioMedidorSchema.shape;

const FormularioCambioMedidor = ({ onClose }: Props) => {
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const mutation = useCambioMedidorFisica();
  const [mostrarFormulario, setMostrarFormulario] = useState(true);
  const { lookup, isLoading } = useCedulaLookup();

  // Función para manejar el cambio de cédula con búsqueda automática
  const handleCedulaChange = async (cedula: string) => {
    form.setFieldValue('Identificacion', cedula);
    handleFieldChange('Identificacion', cedula);

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

  // Validación en tiempo real SOLO del campo editado
  const handleFieldChange = (fieldName: string, value: any) => {
    if (fieldSchemas[fieldName]) {
      try {
        fieldSchemas[fieldName].parse(value);
        setFieldErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[fieldName];
          return newErrors;
        });
      } catch (error: any) {
        let errorMessage = '';
        if (error.errors && Array.isArray(error.errors)) {
          errorMessage = error.errors[0]?.message || 'Error de validación';
        } else if (error.message) {
          errorMessage = error.message;
        } else {
          errorMessage = 'Error de validación';
        }
        setFieldErrors(prev => ({ ...prev, [fieldName]: errorMessage }));
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
      Numero_Medidor_Anterior: '1234567',
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
      Numero_Medidor_Anterior: 0,
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
        await mutation.createCambioMedidor(value);
        form.reset();
        setFieldErrors({});
        setMostrarFormulario(false);
        onClose();
      } catch (error: any) {
       console.log('Error al enviar formulario de cambio de medidor:', error);
      }
    },
  });

  if (!mostrarFormulario) return null;


  const commonClasses = 'w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300';

  return (
   <div className="flex justify-center items-center min-h-screen text-gray-800 p-7 w-full">
      <form
        onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }}
          className="bg-white shadow-lg  pl-8 pr-8 pt-4 pb-4 rounded-lg w-[95%] max-w-7xl mx-auto max-h-auto overflow-y-auto scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-blue-100"
      >
        <h2 className="text-center text-2xl font-semibold mb-10">Formulario de cambio de medidor</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
          {/* Tipo de Identificación y Número de Identificación */}
          <form.Field name="Tipo_Identificacion">
            {(field) => (
              <div className="mb-3 w-full">
                <label htmlFor="Tipo_Identificacion" className="block mb-1 font-medium">Tipo de Identificación <span className="text-red-500">*</span></label>
                <select
                  value={field.state.value}
                  onChange={(e) => {
                    field.handleChange(e.target.value as TipoIdentificacion);
                    handleFieldChange('Tipo_Identificacion', e.target.value as TipoIdentificacion);
                    form.setFieldValue('Identificacion', '');
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
                    field.handleChange(e.target.value);
                    handleFieldChange("Nombre", e.target.value);
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
                    field.handleChange(e.target.value);
                    handleFieldChange("Apellido1", e.target.value);
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
                    field.handleChange(e.target.value);
                    handleFieldChange("Apellido2", e.target.value);
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
                    handleFieldChange("Direccion_Exacta", e.target.value);
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
                    handleFieldChange("Correo", e.target.value);
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
                    handleFieldChange("Numero_Telefono", value || "");
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
          <form.Field name="Numero_Medidor_Anterior">
            {(field) => (
              <div className="mb-3 w-full">
                <label htmlFor="Numero_Medidor_Anterior" className="block mb-1 font-medium">Número de Medidor <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  min={0}
                  value={field.state.value}
                  onChange={(e) => {
                    field.handleChange(Number(e.target.value));
                    handleFieldChange("Numero_Medidor_Anterior", Number(e.target.value));
                  }}
                  placeholder={getPlaceholder("Numero_Medidor_Anterior")}
                  className={commonClasses}
                />
                {fieldErrors["Numero_Medidor_Anterior"] && (
                  <span className="text-red-500 text-sm block mt-1">{fieldErrors["Numero_Medidor_Anterior"]}</span>
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
                  id="Motivo_Solicitud"
                  value={field.state.value}
                  onChange={(e) => {
                    field.handleChange(e.target.value);
                    handleFieldChange("Motivo_Solicitud", e.target.value);
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

export default FormularioCambioMedidor;
