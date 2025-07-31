import { createFileRoute } from '@tanstack/react-router'
import FormularioContacto from '../../Components/FormularioContacto'

export const Route = createFileRoute('/(Contacto)/Quejas')({
  component: RouteComponent,
})

function RouteComponent() {
  return <FormularioContacto tipo={'Quejas'} />
}
