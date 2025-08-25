import { createFileRoute} from '@tanstack/react-router'
import Hero from '../Section/Landing/Hero'
import Proyectos from '../Section/Landing/Proyectos'
import MisionVision from '../Section/Landing/MisionVision'
import Servicio from '../Section/Landing/Servicio'

export const Route = createFileRoute('/')({
  component: LandingPage,
})

 function LandingPage() {
  return (
    <div>
      <Hero/>
      <MisionVision/>
      <Servicio/>
      <Proyectos/>
    </div>
  )
//
}
