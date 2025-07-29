import { createFileRoute } from '@tanstack/react-router'
import MisionVision from '../../Section/MisionVision'

export const Route = createFileRoute('/(AboutUs)/MisionVision')({
  component: RouteComponent,
})

function RouteComponent() {
  return <MisionVision/>
}
