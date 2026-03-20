import { useState } from 'react';
import { useForm } from '@tanstack/react-form';
import { Search, User, Landmark, CreditCard } from 'lucide-react';
import { motion, type Variants } from 'framer-motion';
import { useNavigate } from '@tanstack/react-router';
import ModalConsulta from './ModalConsulta';
import { useConsultaPago } from '../../Hook/ConsultaPagoHook';
import { useAlerts } from '../../context/AlertContext';
import type { ConsultaResultado, TipoIdentificacion } from '../../types/Consulta/Pagos';

type ConsultaFormValues = {
    tipoCliente: string;
    tipoIdentificacion: string;
    numeroIdentificacion: string;
    numeroMedidor: string;
};

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.16,
        },
    },
};

const panelVariants: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.45,
            ease: 'easeOut',
        },
    },
};

const getBackendErrorMessage = (error: unknown): string => {
    if (typeof error !== 'object' || error === null) {
        return 'Hubo un error al consultar. Por favor intenta nuevamente.';
    }

    const errorWithResponse = error as {
        message?: unknown;
        response?: {
            data?: {
                message?: unknown;
                error?: unknown;
            };
        };
    };

    const apiMessage = errorWithResponse.response?.data?.message;

    if (typeof apiMessage === 'string' && apiMessage.trim()) {
        return apiMessage;
    }

    if (Array.isArray(apiMessage)) {
        const messages = apiMessage.filter(
            (value): value is string => typeof value === 'string' && value.trim().length > 0
        );

        if (messages.length > 0) {
            return messages.join(', ');
        }
    }

    const apiError = errorWithResponse.response?.data?.error;
    if (typeof apiError === 'string' && apiError.trim()) {
        return apiError;
    }

    if (typeof errorWithResponse.message === 'string' && errorWithResponse.message.trim()) {
        return errorWithResponse.message;
    }

    return 'Hubo un error al consultar. Por favor intenta nuevamente.';
};

const formatCedulaJuridica = (value: string): string => {
    const digits = value.replaceAll(/\D/g, '');
    let formatted = '';

    if (digits.length > 0) {
        formatted += digits[0];
    }
    if (digits.length > 1) {
        formatted += `-${digits.slice(1, 4)}`;
    }
    if (digits.length > 4) {
        formatted += `-${digits.slice(4, 10)}`;
    }

    return formatted;
};

const normalizeCedulaJuridica = (value: string): string => value.replaceAll(/\D/g, '');

const ConsultaRecibos = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [consultaResultado, setConsultaResultado] = useState<ConsultaResultado | null>(null);
    const navigate = useNavigate();
    const [clientType, setClientType] = useState('');
    const [idType, setIdType] = useState('');
    const { showSuccess, showError, showWarning } = useAlerts();
    const { consultaPagosMedidor, consultaPagosAfiliadoFisico, consultaPagosAfiliadoJuridico } = useConsultaPago();

    const parseNumeroMedidor = (numeroMedidor: string): number | undefined | null => {
        if (!numeroMedidor.trim()) {
            return undefined;
        }

        const soloDigitos = numeroMedidor.replaceAll(/\D/g, '');
        if (!soloDigitos) {
            return null;
        }

        const medidor = Number.parseInt(soloDigitos, 10);
        return Number.isNaN(medidor) ? null : medidor;
    };

    const getTipoIdentificacion = (tipoIdentificacion: string): TipoIdentificacion | undefined => {
        if (tipoIdentificacion === 'Cedula Nacional' || tipoIdentificacion === 'Dimex' || tipoIdentificacion === 'Pasaporte') {
            return tipoIdentificacion;
        }
        return undefined;
    };

    const handleConsultaPorMedidor = async (value: ConsultaFormValues) => {
        const numeroMedidor = parseNumeroMedidor(value.numeroMedidor);
        if (numeroMedidor === null || numeroMedidor === undefined) {
            showWarning(
                'Número de medidor inválido',
                'Ingrese un número de medidor válido para continuar.'
            );
            return false;
        }

        const response = await consultaPagosMedidor(numeroMedidor);

        if (response) {
            setConsultaResultado({ tipo: 'medidor', data: response });
            showSuccess('¡Éxito!', 'Consulta por medidor completada correctamente');
            setIsModalOpen(true);
        }

        return !!response;
    };

    // Funciones auxiliares para consulta
    const handleConsultaFisica = async (value: ConsultaFormValues) => {
        const numeroMedidor = parseNumeroMedidor(value.numeroMedidor);
        if (numeroMedidor === null) {
            showWarning(
                'Número de medidor inválido',
                'El número de medidor debe contener solo valores numéricos.'
            );
            return false;
        }

        if (value.numeroIdentificacion && !value.tipoIdentificacion) {
            showWarning(
                'Tipo de identificación requerido',
                'Seleccione el tipo de identificación para consultar por persona física.'
            );
            return false;
        }

        const response = await consultaPagosAfiliadoFisico({
            Tipo_Identificacion: getTipoIdentificacion(value.tipoIdentificacion),
            Identificacion: value.numeroIdentificacion || undefined,
            Numero_Medidor: numeroMedidor,
        });

        if (response) {
            setConsultaResultado({ tipo: 'fisica', data: response });
            showSuccess('¡Éxito!', 'Recibos encontrados correctamente');
            setIsModalOpen(true);
        }
        return !!response;
    };

    const handleConsultaJuridica = async (value: ConsultaFormValues) => {
        const numeroMedidor = parseNumeroMedidor(value.numeroMedidor);
        if (numeroMedidor === null) {
            showWarning(
                'Número de medidor inválido',
                'El número de medidor debe contener solo valores numéricos.'
            );
            return false;
        }

        const cedulaJuridica = value.numeroIdentificacion
            ? normalizeCedulaJuridica(value.numeroIdentificacion)
            : undefined;

        const response = await consultaPagosAfiliadoJuridico({
            Cedula_Juridica: cedulaJuridica,
            Numero_Medidor: numeroMedidor,
        });

        if (response) {
            setConsultaResultado({ tipo: 'juridica', data: response });
            showSuccess('¡Éxito!', 'Recibos encontrados correctamente');
            setIsModalOpen(true);
        }
        return !!response;
    };

    const form = useForm({
        defaultValues: {
            tipoCliente: '',
            tipoIdentificacion: '',
            numeroIdentificacion: '',
            numeroMedidor: '',
        },
        onSubmit: async ({ value }) => {
            const hasIdentificacion = value.numeroIdentificacion.trim().length > 0;
            const hasMedidor = value.numeroMedidor.trim().length > 0;

            // Validar que al menos un campo esté completo
            if (!hasIdentificacion && !hasMedidor) {
                showWarning(
                    'Campos incompletos',
                    'Por favor ingrese al menos un campo: identificación o número de medidor.'
                );
                return;
            }

            try {
                // Si solo hay número de medidor, se usa endpoint dedicado
                if (!hasIdentificacion && hasMedidor) {
                    await handleConsultaPorMedidor(value);
                    return;
                }

                // Si hay identificación (con o sin medidor), se usa físico o jurídico
                if (!clientType) {
                    showWarning(
                        'Tipo de cliente requerido',
                        'Seleccione persona física o jurídica para consultar con identificación.'
                    );
                    return;
                }

                if (clientType === 'fisica') {
                    await handleConsultaFisica(value);
                } else if (clientType === 'juridica') {
                    await handleConsultaJuridica(value);
                }
            } catch (error) {
                console.error('Error al consultar pagos:', error);
                showError(
                    'Error en la consulta',
                    getBackendErrorMessage(error)
                );
            }
        },
    });

    const handleAfiliarse = () => navigate({ to: '/Afiliacion' });

    // Función para obtener placeholders dinámicos según el tipo de identificación
    const getPlaceholderIdentificacion = () => {
        if (isJuridica) {
            return '3-101-123456 (Cédula Jurídica)';
        }
        
        if (isFisica && idType) {
            switch (idType) {
                case 'Cedula Nacional':
                    return '123456789';
                case 'Dimex':
                    return '123456789012';
                case 'Pasaporte':
                    return 'A1234567';
                default:
                    return 'Ingrese su número de identificación';
            }
        }
        
        return 'Seleccione tipo de identificación primero';
    };

    const commonInput =
        'w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all text-sm text-gray-700';
        
    const isFisica = clientType === 'fisica';
    const isJuridica = clientType === 'juridica';
    const showTipoIdentificacionSelect = isFisica; 
    const showNumeroIdentificacionInput =  (isFisica && idType) || isJuridica;
        

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-gray-50 flex items-center justify-center p-4">
            <motion.div
                className="w-full max-w-6xl flex flex-col lg:flex-row items-stretch gap-6"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.15 }}
                variants={containerVariants}
            >

                {/* Panel Izquierdo */}
                <motion.div
                    className="flex-1 bg-white rounded-2xl shadow-xl p-6 space-y-6"
                    variants={panelVariants}
                >
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
                                                
                                                setClientType(newValue); 

                                                form.setFieldValue('numeroIdentificacion', '');
                                                
                                                form.setFieldValue('tipoIdentificacion', '');
                                                setIdType('');
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
                                                    setIdType(e.target.value); 
                                                    form.setFieldValue('numeroIdentificacion', '');
                                                }}
                                                className={commonInput}
                                            >
                                                <option value="">Seleccione...</option>
                                                <option value="Cedula Nacional">Cédula Nacional</option>
                                                <option value="Dimex">DIMEX</option>
                                                <option value="Pasaporte">Pasaporte</option>
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
                                                onChange={(e) => {
                                                    const nextValue = e.target.value;

                                                    if (isJuridica) {
                                                        field.handleChange(formatCedulaJuridica(nextValue));
                                                        return;
                                                    }

                                                    field.handleChange(nextValue);
                                                }}
                                                placeholder={getPlaceholderIdentificacion()}
                                                maxLength={isJuridica ? 12 : undefined}
                                                className={commonInput}
                                            />
                                        </div>
                                    </div>
                                )}
                            </form.Field>
                        )}

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
                                            value={String(field.state.value)}
                                            onChange={(e) => field.handleChange(e.target.value)}
                                            placeholder="MED-12345"
                                            className={commonInput}
                                        />
                                    </div>
                                </div>
                            )}
                        </form.Field>

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
                    </form>
                </motion.div>

                <motion.div
                    className="flex w-full lg:w-1/3 items-start justify-center"
                    variants={panelVariants}
                >
                    <div className="w-full bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-6 border-2 border-blue-100">
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
                </motion.div>
            </motion.div>

            {/* Modal de Resultados */}
            <ModalConsulta 
                isOpen={isModalOpen} 
                onClose={() => {
                    setIsModalOpen(false);
                    setConsultaResultado(null);
                }}
                resultado={consultaResultado}
            />
        </div>
    );
};

export default ConsultaRecibos;