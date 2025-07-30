import { createFileRoute } from '@tanstack/react-router'
import Historia from '../../Section/Historia'

export const Route = createFileRoute('/(AboutUs)/Historia')({
  component: RouteComponent,
})

function RouteComponent() {
  return  <Historia/>
}
