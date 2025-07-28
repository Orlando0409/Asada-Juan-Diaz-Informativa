import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(Auth)/Login')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/auth"!</div>
}
