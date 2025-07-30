import { createFileRoute} from '@tanstack/react-router'
import Hero from '../Section/Hero'

export const Route = createFileRoute('/')({
  component: LandingPage,
})

 function LandingPage() {
  return (
    <div>
      <Hero />
    </div>
  )

}
