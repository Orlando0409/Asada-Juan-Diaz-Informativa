import { createFileRoute } from '@tanstack/react-router'
import Asociado from '../../Section/Afiliacion/Asociado'

export const Route = createFileRoute('/(Solicitudes)/Asociado')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Asociado/>
}
