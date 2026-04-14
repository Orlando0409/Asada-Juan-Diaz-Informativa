import { lazy, Suspense } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { LoadingSpinner } from '../../Components/LoadingSpinner'

const FormularioContacto = lazy(() => import('../../Components/FormularioContacto'))

export const Route = createFileRoute('/(Contacto)/Reportes')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <FormularioContacto key={'Reporte'} tipo={'Reporte'} />
    </Suspense>
  )
}
