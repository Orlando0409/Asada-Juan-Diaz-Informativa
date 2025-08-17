import { createFileRoute } from '@tanstack/react-router'
import InformacionAfiliacion from '../../Section/Afiliacion/InformacionAfiliacion'

export const Route = createFileRoute('/(Solicitudes)/Afiliacion')({
  component: RouteComponent,
})

function RouteComponent() {
  return <InformacionAfiliacion/>

}