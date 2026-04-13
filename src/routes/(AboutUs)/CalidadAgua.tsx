import { lazy, Suspense } from 'react'
import { createFileRoute } from '@tanstack/react-router'

const CalidadDeAgua = lazy(() => import('../../Section/DatosGenerales/CalidadDeAgua'))

export const Route = createFileRoute('/(AboutUs)/CalidadAgua')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Suspense fallback={null}>
      <CalidadDeAgua />
    </Suspense>
  )
}
