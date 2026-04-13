import { lazy, Suspense } from 'react'
import { createFileRoute } from '@tanstack/react-router'

const CambioMedidor = lazy(() => import('../../Section/Afiliacion/CambioMedidor'))

export const Route = createFileRoute('/(Solicitudes)/Cambiomedidor')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Suspense fallback={null}>
      <CambioMedidor />
    </Suspense>
  )
}
