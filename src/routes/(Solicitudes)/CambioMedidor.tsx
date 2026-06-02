import { lazy, Suspense } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { LoadingSpinner } from '../../Components/LoadingSpinner'

const CambioMedidor = lazy(() => import('../../Section/Afiliacion/CambioMedidor'))

export const Route = createFileRoute('/(Solicitudes)/CambioMedidor')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <CambioMedidor />
    </Suspense>
  )
}
