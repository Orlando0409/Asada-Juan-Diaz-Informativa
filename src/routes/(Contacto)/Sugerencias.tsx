import { lazy, Suspense } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { LoadingSpinner } from '../../Components/LoadingSpinner'

const FormularioContacto = lazy(() => import('../../Components/FormularioContacto'))

export const Route = createFileRoute('/(Contacto)/Sugerencias')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <FormularioContacto key={'Sugerencia'} tipo={'Sugerencia'} />
    </Suspense>
  )
}
