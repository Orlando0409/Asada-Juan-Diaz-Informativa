import { Suspense, lazy, useEffect, useRef, useState, type ReactNode } from 'react'
import { createFileRoute} from '@tanstack/react-router'
import Hero from '../Section/Landing/Hero'
import MisionVision from '../Section/Landing/MisionVision'

const ServicioSection = lazy(() => import('../Section/Landing/Servicio'))
const DatosGeneralesSection = lazy(() => import('../Section/Landing/DatosGenerales'))
const ProyectosSection = lazy(() => import('../Section/Landing/Proyectos'))
const FaqSection = lazy(() => import('../Section/Landing/FAQ'))

function SectionOnVisible({
  children,
  minHeight = 280,
  rootMargin = '220px',
}: Readonly<{
  children: ReactNode
  minHeight?: number
  rootMargin?: string
}>) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (!containerRef.current || isVisible) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin }
    )

    observer.observe(containerRef.current)

    return () => observer.disconnect()
  }, [isVisible, rootMargin])

  return (
    <div ref={containerRef} style={isVisible ? undefined : { minHeight }}>
      {isVisible ? children : null}
    </div>
  )
}

export const Route = createFileRoute('/')({
  component: LandingPage,
})

 function LandingPage() {
  return (
    <div>
      <Hero/>
      <MisionVision/>
      <SectionOnVisible minHeight={360}>
        <Suspense fallback={null}>
          <ServicioSection />
        </Suspense>
      </SectionOnVisible>
      <SectionOnVisible minHeight={420}>
        <Suspense fallback={null}>
          <DatosGeneralesSection />
        </Suspense>
      </SectionOnVisible>
      <SectionOnVisible minHeight={360}>
        <Suspense fallback={null}>
          <ProyectosSection />
        </Suspense>
      </SectionOnVisible>
      <SectionOnVisible minHeight={420}>
        <Suspense fallback={null}>
          <FaqSection />
        </Suspense>
      </SectionOnVisible>
    </div>
  )
//
}
