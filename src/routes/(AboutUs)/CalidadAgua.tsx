import { createFileRoute } from '@tanstack/react-router'
import CalidadDeAgua from '../../Section/DatosGenerales/CalidadDeAgua'

export const Route = createFileRoute('/(AboutUs)/CalidadAgua')({
  component: RouteComponent,
})

function RouteComponent() {
  return <CalidadDeAgua />
}
