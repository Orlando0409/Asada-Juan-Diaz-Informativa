import { lazy, Suspense } from 'react'
import { createFileRoute } from '@tanstack/react-router'

const InformacionAfiliacion = lazy(() => import('../../Section/Afiliacion/Afiliacion'))

export const Route = createFileRoute('/(Solicitudes)/Afiliacion')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Suspense fallback={null}>
      <InformacionAfiliacion />
    </Suspense>
  )
}