import { lazy, Suspense } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { LoadingSpinner } from '../../Components/LoadingSpinner'

const InformacionAfiliacion = lazy(() => import('../../Section/Afiliacion/Afiliacion'))

export const Route = createFileRoute('/(Solicitudes)/Afiliacion')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <InformacionAfiliacion />
    </Suspense>
  )
}