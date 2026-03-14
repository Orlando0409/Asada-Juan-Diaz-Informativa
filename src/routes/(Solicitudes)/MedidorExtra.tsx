import { Navigate, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(Solicitudes)/MedidorExtra')({
    component: RouteComponent,
})

function RouteComponent() {
    return <Navigate to="/Afiliacion" hash="medidor-extra" replace />
}


