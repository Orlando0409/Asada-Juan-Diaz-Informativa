import { lazy, Suspense } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { LoadingSpinner } from '../../Components/LoadingSpinner'

const DesconexionMedidor = lazy(() => import('../../Section/Afiliacion/DesconexionMedidor'))

export const Route = createFileRoute('/(Solicitudes)/DesconexionMedidor')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <DesconexionMedidor />
    </Suspense>
  )
}
