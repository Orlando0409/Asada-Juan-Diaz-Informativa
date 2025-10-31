import { X, FileText, Calendar, DollarSign, AlertCircle } from 'lucide-react';

type Recibo = {
    numeroRecibo: string;
    fechaEmision: string;
    fechaVencimiento: string;
    monto: number;
    estado: 'Pagado' | 'Pendiente' | 'Vencido';
    periodo: string;
};

type Props = {
    isOpen: boolean;
    onClose: () => void;
    recibos?: Recibo[];
};

const ModalConsulta = ({ isOpen, onClose, recibos }: Props) => {
    if (!isOpen) return null;

    // Datos hardcodeados para demostración
    const recibosDemo: Recibo[] = recibos || [
        {
            numeroRecibo: 'REC-2025-001',
            fechaEmision: '2025-01-15',
            fechaVencimiento: '2025-02-15',
            monto: 8500,
            estado: 'Pendiente',
            periodo: 'Enero 2025'
        },
        {
            numeroRecibo: 'REC-2024-012',
            fechaEmision: '2024-12-15',
            fechaVencimiento: '2025-01-15',
            monto: 8200,
            estado: 'Pagado',
            periodo: 'Diciembre 2024'
        },
        {
            numeroRecibo: 'REC-2024-011',
            fechaEmision: '2024-11-15',
            fechaVencimiento: '2024-12-15',
            monto: 8000,
            estado: 'Pagado',
            periodo: 'Noviembre 2024'
        }
    ];

    const getEstadoBadge = (estado: Recibo['estado']) => {
        const styles = {
            Pagado: 'bg-green-100 text-green-700 border-green-300',
            Pendiente: 'bg-yellow-100 text-yellow-700 border-yellow-300',
            Vencido: 'bg-red-100 text-red-700 border-red-300'
        };
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${styles[estado]}`}>
                {estado}
            </span>
        );
    };

    const totalPendiente = recibosDemo
        .filter(r => r.estado !== 'Pagado')
        .reduce((sum, r) => sum + r.monto, 0);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-10 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-6 flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold">Resultados de Consulta</h2>
                        <p className="text-blue-100 text-sm mt-1">Recibos encontrados</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="hover:bg-white/20 p-2 rounded-full transition-all"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Resumen */}
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 border-b border-blue-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-white rounded-lg p-4 shadow-sm">
                            <p className="text-sm text-gray-600 mb-1">Total de Recibos</p>
                            <p className="text-2xl font-bold text-gray-800">{recibosDemo.length}</p>
                        </div>
                        <div className="bg-white rounded-lg p-4 shadow-sm">
                            <p className="text-sm text-gray-600 mb-1">Monto por Pagar</p>
                            <p className="text-2xl font-bold text-red-600">
                                ₡{totalPendiente.toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Lista de Recibos */}
                <div className="p-6 overflow-y-auto max-h-[400px]">
                    <div className="space-y-4">
                        {recibosDemo.map((recibo) => (
                            <div
                                key={recibo.numeroRecibo}
                                className="bg-white border-2 border-gray-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-md transition-all"
                            >
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                    {/* Info Principal */}
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <FileText className="w-5 h-5 text-blue-600" />
                                            <h3 className="font-semibold text-gray-800">
                                                {recibo.numeroRecibo}
                                            </h3>
                                            {getEstadoBadge(recibo.estado)}
                                        </div>
                                        <p className="text-sm text-gray-600 mb-1">
                                            <span className="font-medium">Periodo:</span> {recibo.periodo}
                                        </p>
                                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-4 h-4" />
                                                Emisión: {new Date(recibo.fechaEmision).toLocaleDateString('es-CR')}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <AlertCircle className="w-4 h-4" />
                                                Vence: {new Date(recibo.fechaVencimiento).toLocaleDateString('es-CR')}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Monto */}
                                    <div className="text-right">
                                        <p className="text-sm text-gray-600 mb-1">Monto</p>
                                        <p className={`text-2xl font-bold flex items-center justify-end gap-1 ${
                                            recibo.estado === 'Pagado' ? 'text-green-600' : 'text-red-600'
                                        }`}>
                                            <DollarSign className="w-5 h-5" />
                                            ₡{recibo.monto.toLocaleString()}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {recibo.estado === 'Pagado' ? 'Pagado' : 'Pendiente de pago'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 p-6 border-t border-gray-200 flex-shrink-0">
                    <p className="text-sm text-gray-600 mb-4">
                        <span className="font-semibold">Nota:</span> Los pagos deben realizarse en las oficinas de ASADA o mediante transferencia bancaria.
                    </p>
                    <div className="flex flex-col md:flex-row gap-3 justify-end">
                        <button
                            onClick={onClose}
                            className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold transition-all"
                        >
                            Cerrar
                        </button>
                        <button className="px-6 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-lg font-semibold transition-all">
                            Descargar Consulta
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ModalConsulta;