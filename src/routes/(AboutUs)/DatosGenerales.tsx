import { createFileRoute } from '@tanstack/react-router'
import DatosGenerales from '../../Section/DatosGenerales'

export const Route = createFileRoute('/(AboutUs)/DatosGenerales')({
  component: RouteComponent,
})

function RouteComponent() {
  return <DatosGenerales/>
}
