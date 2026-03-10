import { createFileRoute} from '@tanstack/react-router'
import Hero from '../Section/Landing/Hero'
import Proyectos from '../Section/Landing/Proyectos'
import MisionVision from '../Section/Landing/MisionVision'
import Servicio from '../Section/Landing/Servicio'
import DatosGenerales from '../Section/Landing/DatosGenerales'
import Faq from '../Section/Landing/FAQ'

export const Route = createFileRoute('/')({
  component: LandingPage,
})

 function LandingPage() {
  return (
    <div>
      <Hero/>
      <MisionVision/>
      <Servicio/>
      <DatosGenerales/>
      <Proyectos/>
      <Faq/>
    </div>
  )
//
}
