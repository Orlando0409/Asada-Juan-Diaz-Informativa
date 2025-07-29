import { createFileRoute} from '@tanstack/react-router'
import ResumenHistoria from '../Section/ResumenHistoria'
import Hero from '../Section/Hero'

export const Route = createFileRoute('/')({
  component: LandingPage,
})

 function LandingPage() {
  return (
    <div>
      <Hero/>
    <ResumenHistoria/>
    
    </div>
  )
//
}
