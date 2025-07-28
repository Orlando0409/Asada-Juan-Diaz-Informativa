import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(Auth)/ForgotPassword')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(Auth)/ForgotPassword"!</div>
}
