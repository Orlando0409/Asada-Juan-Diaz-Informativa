import { lazy, Suspense } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { LoadingSpinner } from '../../Components/LoadingSpinner'

const FormularioContacto = lazy(() => import('../../Components/FormularioContacto'))

export const Route = createFileRoute('/(Contacto)/Quejas')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <FormularioContacto key={'Queja'} tipo={'Queja'} />
    </Suspense>
  )
}
