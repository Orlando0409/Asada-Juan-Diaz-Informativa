import { createFileRoute } from '@tanstack/react-router'
import FormularioContacto from '../../Components/FormularioContacto'

export const Route = createFileRoute('/(Contacto)/Reportes')({
  component: RouteComponent,
})

function RouteComponent() {
  return <FormularioContacto key={'Reporte'} tipo={'Reporte'} />
}
