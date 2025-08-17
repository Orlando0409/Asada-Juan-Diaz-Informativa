import { createFileRoute } from '@tanstack/react-router'
//import FormularioCambioMedidor from '../../Components/Solicitudes/FormularioCambioMedidor'
import CambioMedidor from '../../Section/Afiliacion/CambioMedidor'

export const Route = createFileRoute('/(Solicitudes)/Cambiomedidor')({
  component: RouteComponent,
})

function RouteComponent() {
  return <CambioMedidor/>
}
