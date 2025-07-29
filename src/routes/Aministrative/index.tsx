import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/Aministrative/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/Aministrative/"!</div>
}
