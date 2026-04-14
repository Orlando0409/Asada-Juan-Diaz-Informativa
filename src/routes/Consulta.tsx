import { lazy, Suspense } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { LoadingSpinner } from '../Components/LoadingSpinner'

const ConsultaRecibos = lazy(() => import('../Section/Consulta/ConsultaPagos'))

export const Route = createFileRoute('/Consulta')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ConsultaRecibos />
    </Suspense>
  )
}
