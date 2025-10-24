import { createFileRoute } from '@tanstack/react-router'
import Faq from '../Section/PreguntasFrecuentes/FAQ'


export const Route = createFileRoute('/PreguntasFrecuentes')({
  component: RouteComponent,
})

function RouteComponent() {
  return <Faq />
}
