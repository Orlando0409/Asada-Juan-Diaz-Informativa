import { createFileRoute } from '@tanstack/react-router'
import ConsultaRecibos from '../Section/Consulta/ConsultaPagos'

export const Route = createFileRoute('/Consulta')({
  component: RouteComponent,
})

function RouteComponent() {
  return <ConsultaRecibos />
}
