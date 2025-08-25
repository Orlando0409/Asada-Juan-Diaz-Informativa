import { createFileRoute } from '@tanstack/react-router'
import DesconexionMedidor from '../../Section/Afiliacion/DesconexionMedidor'

export const Route = createFileRoute('/(Solicitudes)/DesconexionMedidor')({
  component: RouteComponent,
})

function RouteComponent() {
  return <DesconexionMedidor/>
}
