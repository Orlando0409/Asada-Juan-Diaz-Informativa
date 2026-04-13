import { lazy, Suspense } from 'react'
import { createFileRoute } from '@tanstack/react-router'

const DesconexionMedidor = lazy(() => import('../../Section/Afiliacion/DesconexionMedidor'))

export const Route = createFileRoute('/(Solicitudes)/DesconexionMedidor')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Suspense fallback={null}>
      <DesconexionMedidor />
    </Suspense>
  )
}
