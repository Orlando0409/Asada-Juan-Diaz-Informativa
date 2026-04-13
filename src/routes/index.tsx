import { Suspense, lazy, useEffect, useRef, useState, type ReactNode } from 'react'
import { createFileRoute} from '@tanstack/react-router'
import Hero from '../Section/Landing/Hero'
import MisionVision from '../Section/Landing/MisionVision'
import { LoadingSpinner } from '../Components/LoadingSpinner'

const ServicioSection = lazy(() => import('../Section/Landing/Servicio'))
const DatosGeneralesSection = lazy(() => import('../Section/Landing/DatosGenerales'))
const ProyectosSection = lazy(() => import('../Section/Landing/Proyectos'))
const FaqSection = lazy(() => import('../Section/Landing/FAQ'))

function SectionOnVisible({
  children,
  minHeight = 280,
  rootMargin = '80px',
  forceVisible = false,
}: Readonly<{
  children: ReactNode
  minHeight?: number
  rootMargin?: string
  forceVisible?: boolean
}>) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (forceVisible && !isVisible) {
      setIsVisible(true)
    }
  }, [forceVisible, isVisible])

  const shouldRender = isVisible || forceVisible

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
    <div
      ref={containerRef}
      style={
        shouldRender
          ? undefined
          : {
              minHeight,
              backgroundColor: '#fff',
            }
      }
    >
      {shouldRender ? children : null}
    </div>
  )
}

export const Route = createFileRoute('/')({
  component: LandingPage,
})

 function LandingPage() {
  const [hash, setHash] = useState<string>(globalThis.window.location.hash)
  const normalizedHash = hash.replace('#', '').toUpperCase()
  const isFaqHash = normalizedHash === 'FAQ'

  useEffect(() => {
    const onHashChange = () => {
      setHash(globalThis.window.location.hash)
    }

    globalThis.window.addEventListener('hashchange', onHashChange)
    return () => globalThis.window.removeEventListener('hashchange', onHashChange)
  }, [])

  useEffect(() => {
    if (!isFaqHash) return

    let attempts = 0
    const maxAttempts = 30
    const timerId = globalThis.window.setInterval(() => {
      const target = globalThis.window.document.getElementById('FAQ')
      if (target) {
        const offset = 95
        const top = target.getBoundingClientRect().top + globalThis.window.scrollY - offset
        globalThis.window.scrollTo({ top, behavior: 'smooth' })
        globalThis.window.clearInterval(timerId)
        return
      }

      attempts += 1
      if (attempts >= maxAttempts) {
        globalThis.window.clearInterval(timerId)
      }
    }, 50)

    return () => globalThis.window.clearInterval(timerId)
  }, [isFaqHash])

  return (
    <div>
      <Hero/>
      <MisionVision/>
      <SectionOnVisible minHeight={360}>
        <Suspense fallback={<LoadingSpinner />}>
          <ServicioSection />
        </Suspense>
      </SectionOnVisible>
      <SectionOnVisible minHeight={420}>
        <Suspense fallback={<LoadingSpinner />}>
          <DatosGeneralesSection />
        </Suspense>
      </SectionOnVisible>
      <SectionOnVisible minHeight={360}>
        <Suspense fallback={<LoadingSpinner />}>
          <ProyectosSection />
        </Suspense>
      </SectionOnVisible>
      <SectionOnVisible minHeight={420} forceVisible={isFaqHash}>
        <Suspense fallback={<LoadingSpinner />}>
          <FaqSection />
        </Suspense>
      </SectionOnVisible>
    </div>
  )
//
}
