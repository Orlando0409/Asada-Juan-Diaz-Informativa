// Mapping unificado de estados de factura a clases Tailwind.
// Replica exacta del helper en SAGA-JD-Administrativa (mantener sincronizados).
//
// Estados backend (factura.service.ts):
//   - Disponible: recién creada, antes de vencer
//   - Pendiente:  vencida (cron diario la marca)
//   - Pagada:     pagada
//   - Anulada:    anulada
//
// Aliases legacy aceptados: "Pagado" → Pagada, "Vencido"/"Vencida" → Pendiente.

export type EstadoFacturaCanonico = 'Disponible' | 'Pendiente' | 'Pagada' | 'Anulada';

export function normalizarEstadoFactura(estado: string | undefined | null): EstadoFacturaCanonico | 'Desconocido' {
    const v = (estado ?? '').trim();
    if (v === 'Pagada' || v === 'Pagado') return 'Pagada';
    if (v === 'Pendiente' || v === 'Vencido' || v === 'Vencida') return 'Pendiente';
    if (v === 'Anulada' || v === 'Anulado') return 'Anulada';
    if (v === 'Disponible') return 'Disponible';
    return 'Desconocido';
}

export function getEstadoFacturaBadgeClass(estado: string | undefined | null): string {
    const base = 'border rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap';
    switch (normalizarEstadoFactura(estado)) {
        case 'Pagada':
            return `${base} border-green-300 bg-green-100 text-green-700`;
        case 'Pendiente':
            return `${base} border-red-300 bg-red-100 text-red-700`;
        case 'Anulada':
            return `${base} border-gray-300 bg-gray-100 text-gray-700`;
        case 'Disponible':
            return `${base} border-yellow-300 bg-yellow-100 text-yellow-700`;
        default:
            return `${base} border-slate-300 bg-slate-100 text-slate-600`;
    }
}
