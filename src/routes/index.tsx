import { createFileRoute} from '@tanstack/react-router'
import ResumenHistoria from '../Section/DatosGenerales/ResumenHistoria'
import Hero from '../Section/Hero'
import Proyectos from '../Section/Proyectos'

export const Route = createFileRoute('/')({
  component: LandingPage,
})

 function LandingPage() {
  return (
    <div>
      <Hero/>
      <ResumenHistoria/>
      <Proyectos/>
    </div>
  )
//
}
