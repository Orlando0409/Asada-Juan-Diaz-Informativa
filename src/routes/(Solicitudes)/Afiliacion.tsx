import { createFileRoute } from '@tanstack/react-router'
import FormularioAfiliacion from '../../Components/FormularioAfiliacion'

export const Route = createFileRoute('/(Solicitudes)/Afiliacion')({
  component: RouteComponent,
})

function RouteComponent() {
  return <FormularioAfiliacion tipo="abonado"/>
}
