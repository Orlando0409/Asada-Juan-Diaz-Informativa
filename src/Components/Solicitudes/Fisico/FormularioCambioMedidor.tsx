import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import data from "../../../data/Data.json";
import { CambioMedidorSchema, TipoIdentificacionValues, type TipoIdentificacion } from "../../../Schemas/Solicitudes/Fisica/CambioMedidor";
import { useCambioMedidor } from "../../../Hook/Solicitudes/Fisico/hookCambioMedidor";
import { parsePhoneNumberFromString } from 'libphonenumber-js';
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

type SolicitudTipo = 'cambioMedidor';

type Props = {
  tipo: SolicitudTipo;
  onClose: () => void;
};

const normalizePhoneNumber = (phone: string): string => {
  const phoneNumber = parsePhoneNumberFromString(phone);
  if (!phoneNumber || !phoneNumber.isValid()) {
    throw new Error('Número de teléfono inválido. Asegúrate de incluir el código de país, ej. +5215512345678');
  }
  return phoneNumber.format('E.164');
};

const FormularioCambioMedidor = ({ tipo, onClose }: Props) => {
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const mutation = useCambioMedidor();
  const [mostrarFormulario] = useState(true);

  const validateField = (fieldName: string, value: any, allValues?: any) => {
    try {
      const dummy: any = {
        Nombre: "Test",
        Apellido1: "Test",
        Apellido2: "",
        Tipo_Identificacion: "Cedula Nacional" as TipoIdentificacion,
        Identificacion: "123456789",
        Direccion_Exacta: "1234567890",
        Numero_Telefono: "+50688887777",
        Correo: "test@test.com",
        Motivo_Solicitud: "Cambio por daño",
        Numero_Medidor_Anterior: 1234567,
      };
      if (fieldName === "Identificacion" && allValues?.Tipo_Identificacion) {
        dummy.Tipo_Identificacion = allValues.Tipo_Identificacion as TipoIdentificacion;
        dummy.Identificacion = value;
      } else if (fieldName === "Tipo_Identificacion" && allValues?.Identificacion) {
        dummy.Tipo_Identificacion = value as TipoIdentificacion;
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
        errorMessage = fieldError?.message || error.errors[0]?.message || 'Error de validación';
      } else if (error.message) {
        errorMessage = error.message;
      } else {
        errorMessage = 'Error de validación';
      }
      setFieldErrors(prev => ({ ...prev, [fieldName]: errorMessage }));
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
      Motivo_Solicitud: 'Cambio por daño',
      Numero_Medidor_Anterior: '1234567',
    };
    if (fieldName === 'Identificacion') {
      switch (tipoIdentificacion) {
        case "Cedula Nacional": return '123456789';
        case "DIMEX": return '123456789012';
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
        setFormErrors({ general: "¡Solicitud enviada con éxito!" });
        setFieldErrors({});
      } catch (error: any) {
        setFormErrors({ general: error.message });
      }
    },
  });

  if (!mostrarFormulario) return null;

  const campos = data.requisitosSolicitudes[tipo];
  const commonClasses = 'w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300';

  // Orden de los campos para el grid
  const gridFields = [
    "Nombre", "Apellido1",
    "Apellido2", "Direccion_Exacta",
    "Correo", "Numero_Telefono",
    "Numero_Medidor_Anterior", "Motivo_Solicitud",
    "Tipo_Identificacion", "Identificacion"
  ];

  // Agrupa los campos en pares para el grid
  const fieldPairs: string[][] = [];
  for (let i = 0; i < gridFields.length; i += 2) {
    fieldPairs.push(gridFields.slice(i, i + 2));
  }

  return (
    <div className="flex justify-center items-center min-h-screen text-gray-800 p-5 w-full">
      <form
        onSubmit={(e) => { e.preventDefault(); form.handleSubmit(); }}
        className="bg-white shadow-lg pl-20 pr-20 pt-4 pb-4 rounded-lg w-full max-w-6xl"
      >
        <h2 className="text-center text-xl font-semibold mb-8">Formulario de cambio de medidor</h2>

        {/* Grid de campos alineados */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
          {fieldPairs.map((pair, idx) => (
            <>
              {pair.map((fieldName) => {
                const typedFieldName = fieldName as keyof typeof campos;
                const fieldProps = campos[typedFieldName];

                // Número de teléfono con PhoneInput
                if (fieldName === "Numero_Telefono") {
                  return (
                    <form.Field key={fieldName} name={fieldName as keyof typeof form.state.values}>
                      {(field) => (
                        <div className="mb-3 w-full flex flex-col justify-end">
                          <label className="block mb-1 font-medium">
                            {fieldProps.label}
                            {fieldProps.required && <span className="text-red-500">*</span>}
                          </label>
                          <PhoneInput
                            international
                            defaultCountry="CR"
                            value={typeof field.state.value === "number" ? String(field.state.value) : field.state.value}
                            onChange={(value) => {
                              field.handleChange(value || "");
                              validateField(fieldName, value, form.state.values);
                            }}
                            className={`${commonClasses} border-green-500 focus:ring-green-300 ${fieldErrors[fieldName] ? 'border-red-500 focus:ring-red-300' : ''}`}
                          />
                          {fieldErrors[fieldName] && (
                            <span className="text-red-500 text-sm block mt-1">
                              {fieldErrors[fieldName]}
                            </span>
                          )}
                          {formErrors[fieldName] && !fieldErrors[fieldName] && (
                            <span className="text-red-500 text-sm block mt-1">
                              {formErrors[fieldName]}
                            </span>
                          )}
                        </div>
                      )}
                    </form.Field>
                  );
                }

                // Tipo de Identificación (select)
                if (fieldName === "Tipo_Identificacion") {
                  return (
                    <form.Field key={fieldName} name="Tipo_Identificacion">
                      {(field) => (
                        <div className="mb-3 w-full flex flex-col justify-end">
                          <label className="block mb-1 font-medium">Tipo de Identificación <span className="text-red-500">*</span></label>
                          <select
                            value={field.state.value}
                            onChange={(e) => {
                              field.handleChange(e.target.value as TipoIdentificacion);
                              validateField('Tipo_Identificacion', e.target.value, form.state.values);
                              form.setFieldValue('Identificacion', '');
                              setFieldErrors(prev => { const newErrors = { ...prev }; delete newErrors['Identificacion']; return newErrors; });
                            }}
                            className={`${commonClasses} ${fieldErrors['Tipo_Identificacion'] ? 'border-red-500 focus:ring-red-300' : ''}`}
                          >
                            <option value="">Seleccione tipo de identificación</option>
                            {TipoIdentificacionValues.map((tipo) => (
                              <option key={tipo} value={tipo}>{tipo}</option>
                            ))}
                          </select>
                          {fieldErrors['Tipo_Identificacion'] && <span className="text-red-500 text-sm block mt-1">{fieldErrors['Tipo_Identificacion']}</span>}
                          {formErrors['Tipo_Identificacion'] && !fieldErrors['Tipo_Identificacion'] && <span className="text-red-500 text-sm block mt-1">{formErrors['Tipo_Identificacion']}</span>}
                        </div>
                      )}
                    </form.Field>
                  );
                }

                // Número de Identificación
                if (fieldName === "Identificacion") {
                  return (
                    <form.Field key={fieldName} name="Identificacion">
                      {(field) => (
                        <div className="mb-3 w-full flex flex-col justify-end">
                          <label className="block mb-1 font-medium">Número de Identificación <span className="text-red-500">*</span></label>
                          <input
                            type="text"
                            value={field.state.value}
                            onChange={(e) => { field.handleChange(e.target.value); validateField('Identificacion', e.target.value, form.state.values); }}
                            placeholder={getPlaceholder('Identificacion', form.state.values.Tipo_Identificacion as TipoIdentificacion)}
                            disabled={!form.state.values.Tipo_Identificacion}
                            className={`${commonClasses} ${fieldErrors['Identificacion'] ? 'border-red-500 focus:ring-red-300' : ''} ${!form.state.values.Tipo_Identificacion ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                          />
                          {fieldErrors['Identificacion'] && <span className="text-red-500 text-sm block mt-1">{fieldErrors['Identificacion']}</span>}
                          {formErrors['Identificacion'] && !fieldErrors['Identificacion'] && <span className="text-red-500 text-sm block mt-1">{formErrors['Identificacion']}</span>}
                        </div>
                      )}
                    </form.Field>
                  );
                }

                // Input normal para los demás campos
                return (
                  <form.Field key={fieldName} name={fieldName as keyof typeof form.state.values}>
                    {(field) => (
                      <div className="mb-3 w-full flex flex-col justify-end">
                        <label className="block mb-1 font-medium">
                          {fieldProps.label}
                          {fieldProps.required && <span className="text-red-500">*</span>}
                        </label>
                        <input
                          type={fieldProps.type === "email" ? "email" : fieldProps.type === "number" ? "number" : "text"}
                          value={(field.state.value as string | number) ?? ""}
                          onBlur={field.handleBlur}
                          onChange={(e) => {
                            const val = fieldProps.type === "number" ? Number(e.target.value) : e.target.value;
                            field.handleChange(val);
                            validateField(fieldName, val, form.state.values);
                          }}
                          placeholder={getPlaceholder(fieldName)}
                          className={`${commonClasses} ${fieldErrors[fieldName] ? 'border-red-500 focus:ring-red-300' : ''}`}
                        />
                        {fieldErrors[fieldName] && (
                          <span className="text-red-500 text-sm block mt-1">
                            {fieldErrors[fieldName]}
                          </span>
                        )}
                        {formErrors[fieldName] && !fieldErrors[fieldName] && (
                          <span className="text-red-500 text-sm block mt-1">
                            {formErrors[fieldName]}
                          </span>
                        )}
                      </div>
                    )}
                  </form.Field>
                );
              })}
            </>
          ))}
        </div>

        {/* Mensaje general */}
        {formErrors.general && (
          <div className={`text-center mt-4 ${formErrors.general.includes("éxito") ? "text-green-600" : "text-red-500"}`}>
            {formErrors.general}
          </div>
        )}

        <div className="flex justify-end items-end gap-4 mt-8">
          <button type="button" onClick={onClose} className="w-[120px] bg-blue-900 text-white py-2 rounded hover:bg-blue-800 transition">Cerrar</button>
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