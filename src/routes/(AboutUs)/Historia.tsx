import { lazy, Suspense } from 'react'
import { createFileRoute } from '@tanstack/react-router'

const Historia = lazy(() => import('../../Section/DatosGenerales/Historia'))

export const Route = createFileRoute('/(AboutUs)/Historia')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <Suspense fallback={null}>
      <Historia />
    </Suspense>
  )
}
