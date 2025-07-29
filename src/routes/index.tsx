import { createFileRoute} from '@tanstack/react-router'
import ResumenHistoria from '../Section/ResumenHistoria'

export const Route = createFileRoute('/')({
  component: LandingPage,
})

 function LandingPage() {
  return (
    <div>
    <ResumenHistoria/>
    </div>
  )

}
