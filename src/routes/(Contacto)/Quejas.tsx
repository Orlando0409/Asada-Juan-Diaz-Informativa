import { lazy, Suspense } from 'react'
import { createFileRoute } from '@tanstack/react-router'

const FormularioContacto = lazy(() => import('../../Components/FormularioContacto'))

export const Route = createFileRoute('/(Contacto)/Quejas')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Suspense fallback={null}>
      <FormularioContacto key={'Queja'} tipo={'Queja'} />
    </Suspense>
  )
}
