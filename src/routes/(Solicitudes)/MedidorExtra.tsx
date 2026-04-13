import { lazy, Suspense } from 'react'
import { createFileRoute } from '@tanstack/react-router'

const MedidorExtra = lazy(() => import('../../Section/Afiliacion/MedidorExtra'))

export const Route = createFileRoute('/(Solicitudes)/MedidorExtra')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Suspense fallback={null}>
      <MedidorExtra />
    </Suspense>
  )
}
