import { lazy, Suspense } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { LoadingSpinner } from '../../Components/LoadingSpinner'

const MedidorExtra = lazy(() => import('../../Section/Afiliacion/MedidorExtra'))

export const Route = createFileRoute('/(Solicitudes)/MedidorExtra')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <MedidorExtra />
    </Suspense>
  )
}
