import { useState } from 'react';
import { useForm } from '@tanstack/react-form';
import { Search, FileText, User, Landmark, CreditCard, AlertCircle } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';

const ConsultaRecibos = () => {
    const [formErrors, setFormErrors] = useState<Record<string, string>>({});
    const [successMessage, setSuccessMessage] = useState<string>('');
    const navigate = useNavigate();

    // 🔑 CLAVE PARA EL FIX:
    // Creamos un estado local de React para guardar los valores clave
    // y asegurar que el componente principal se re-renderice.
    const [clientType, setClientType] = useState('');
    const [idType, setIdType] = useState('');
    
    // NOTA: Usamos los estados locales (clientType, idType) para la lógica de visibilidad.

    const form = useForm({
        defaultValues: {
            tipoCliente: '',
            tipoIdentificacion: '',
            numeroIdentificacion: '',
            numeroMedidor: '',
        },
        onSubmit: async ({ value }) => {
            // ... (Lógica de onSubmit es la misma)
            setFormErrors({});
            setSuccessMessage('');

            if (!value.numeroIdentificacion && !value.numeroMedidor) {
                setFormErrors({
                    general: 'Por favor ingrese al menos un campo: identificación o número de medidor.',
                });
                return;
            }
            
            try {
                await new Promise((resolve) => setTimeout(resolve, 1200));
                setSuccessMessage('¡Recibos encontrados con éxito!');
                setTimeout(() => setSuccessMessage(''), 5000);
            } catch (error) {
                console.error('Error:', error);
                setFormErrors({
                    general: 'Hubo un error al consultar. Por favor intenta nuevamente.',
                });
            }
        },
    });

    const handleAfiliarse = () => navigate({ to: '/Afiliacion' });

    const commonInput =
        'w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all text-sm text-gray-700';
        
    // *** Lógica de Visibilidad basada en el estado LOCAL de React ***
    const isFisica = clientType === 'fisica';
    const isJuridica = clientType === 'juridica';

    const showTipoIdentificacionSelect = isFisica; 

    const showNumeroIdentificacionInput = 
        (isFisica && idType) || isJuridica;
        
    // --- Renderizado del Componente ---

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-6xl flex flex-col lg:flex-row items-stretch gap-6">

                {/* Panel Izquierdo */}
                <div className="flex-1 bg-white rounded-2xl shadow-xl p-6 space-y-6">
                    {/* ... (Encabezado y advertencia son iguales) ... */}
                    
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            form.handleSubmit();
                        }}
                        className="space-y-5"
                    >
                        {/* Tipo de Persona */}
                        <form.Field name="tipoCliente">
                            {(field) => (
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Tipo de persona
                                    </label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <select
                                            id={field.name}
                                            value={field.state.value as string}
                                            onChange={(e) => {
                                                const newValue = e.target.value;
                                                field.handleChange(newValue);
                                                
                                                // 🔑 FIX: Actualizar el estado local para forzar el re-renderizado
                                                setClientType(newValue); 

                                                form.setFieldValue('numeroIdentificacion', '');
                                                
                                                if (newValue === 'juridica') {
                                                    form.setFieldValue('tipoIdentificacion', 'juridica');
                                                    setIdType('juridica'); // 🔑 FIX: Actualizar estado local
                                                } else {
                                                    form.setFieldValue('tipoIdentificacion', '');
                                                    setIdType(''); // 🔑 FIX: Limpiar estado local
                                                }
                                            }}
                                            className={commonInput}
                                        >
                                            <option value="">Seleccione...</option>
                                            <option value="fisica">Persona Física</option>
                                            <option value="juridica">Persona Jurídica</option>
                                        </select>
                                    </div>
                                </div>
                            )}
                        </form.Field>

                        {/* Tipo de Identificación dinámico (Solo para Física) */}
                        {showTipoIdentificacionSelect && (
                            <form.Field name="tipoIdentificacion">
                                {(field) => (
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Tipo de identificación
                                        </label>
                                        <div className="relative">
                                            <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <select
                                                id={field.name}
                                                value={field.state.value as string}
                                                onChange={(e) => {
                                                    field.handleChange(e.target.value);
                                                    // 🔑 FIX: Actualizar el estado local para forzar el re-renderizado
                                                    setIdType(e.target.value); 
                                                    form.setFieldValue('numeroIdentificacion', '');
                                                }}
                                                className={commonInput}
                                            >
                                                <option value="">Seleccione...</option>
                                                <option value="cedula">Cédula Nacional</option>
                                                <option value="dimex">DIMEX</option>
                                                <option value="pasaporte">Pasaporte</option>
                                            </select>
                                        </div>
                                    </div>
                                )}
                            </form.Field>
                        )}

                        {/* Número de Identificación (Dinámico) */}
                        {showNumeroIdentificacionInput && (
                            <form.Field name="numeroIdentificacion">
                                {(field) => (
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                            Número de identificación
                                        </label>
                                        <div className="relative">
                                            {isFisica ? (
                                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            ) : (
                                                <Landmark className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            )}
                                            <input
                                                type="text"
                                                value={field.state.value as string}
                                                onChange={(e) => field.handleChange(e.target.value)}
                                                placeholder={
                                                    isFisica
                                                        ? '1-2345-6789 (Cédula o Pasaporte)'
                                                        : '3-101-123456 (Cédula Jurídica)'
                                                }
                                                className={commonInput}
                                            />
                                        </div>
                                    </div>
                                )}
                            </form.Field>
                        )}

                        {/* ... (El resto del formulario, medidor, botón y mensajes se mantienen igual) ... */}
                        
                        {/* Separador */}
                        <div className="flex items-center gap-3">
                            <div className="flex-1 h-px bg-gray-200" />
                            <span className="text-sm font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                O
                            </span>
                            <div className="flex-1 h-px bg-gray-200" />
                        </div>

                        {/* Número de Medidor */}
                        <form.Field name="numeroMedidor">
                            {(field) => (
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Número de medidor
                                    </label>
                                    <div className="relative">
                                        <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="text"
                                            value={field.state.value as string}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            placeholder="MED-12345"
                                            className={commonInput}
                                        />
                                    </div>
                                </div>
                            )}
                        </form.Field>

                        {/* Botón y mensajes */}
                        <button
                            type="submit"
                            disabled={form.state.isSubmitting}
                            className={`w-full py-3 rounded-xl font-semibold text-white flex items-center justify-center gap-2 ${
                                form.state.isSubmitting
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 transition-all'
                            }`}
                        >
                            {form.state.isSubmitting ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    Consultando...
                                </>
                            ) : (
                                <>
                                    <Search className="w-5 h-5" />
                                    Consultar Recibos
                                </>
                            )}
                        </button>

                        {successMessage && (
                            <div className="p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-center">
                                {successMessage}
                            </div>
                        )}

                        {formErrors.general && (
                            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center">
                                {formErrors.general}
                            </div>
                        )}
                    </form>
                </div>

                {/* Panel Derecho */}
                <div className="hidden lg:flex w-1/3 items-start justify-center">
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border-2 border-blue-100">
                        <h3 className="text-lg font-bold text-gray-800 mb-2">¿No estás afiliado?</h3>
                        <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                            Si aún no estás afiliado, podés hacerlo dando clic en el botón “Afiliarse” y completando el formulario.
                        </p>
                        <button
                            onClick={handleAfiliarse}
                            className="w-full bg-white hover:bg-gray-50 text-blue-700 font-semibold py-2 rounded-xl border-2 border-blue-200 hover:border-blue-300 transition-all"
                        >
                            Afiliarse
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConsultaRecibos;