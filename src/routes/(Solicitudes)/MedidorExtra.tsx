import { createFileRoute } from '@tanstack/react-router'
import MedidorExtra from '../../Section/Afiliacion/MedidorExtra'

export const Route = createFileRoute('/(Solicitudes)/MedidorExtra')({
  component: RouteComponent,
})

function RouteComponent() {
  return <MedidorExtra />
}
