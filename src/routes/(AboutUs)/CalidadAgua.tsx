import { lazy, Suspense } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { LoadingSpinner } from '../../Components/LoadingSpinner'

const CalidadDeAgua = lazy(() => import('../../Section/DatosGenerales/CalidadDeAgua'))

export const Route = createFileRoute('/(AboutUs)/CalidadAgua')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <CalidadDeAgua />
    </Suspense>
  )
}
