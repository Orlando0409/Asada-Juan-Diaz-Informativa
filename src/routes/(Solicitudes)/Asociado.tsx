import { lazy, Suspense } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { LoadingSpinner } from '../../Components/LoadingSpinner'

const Asociado = lazy(() => import('../../Section/Afiliacion/Asociado'))

export const Route = createFileRoute('/(Solicitudes)/Asociado')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Asociado />
    </Suspense>
  )
}
