import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '../utils/gsap'
import { useReducedMotion } from '../hooks/useReducedMotion'
import lashImage from '../assets/images/lashes/mega-volume-cat-eye.jpg'
import nailImage from '../assets/images/nails/ombre.jpg'

export function LashToNailTransition() {
  const sectionRef = useRef<HTMLElement>(null)
  const lashRef = useRef<HTMLDivElement>(null)
  const nailRef = useRef<HTMLDivElement>(null)
  const darkRef = useRef<HTMLDivElement>(null)
  const glareRef = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (reducedMotion) return
    const section = sectionRef.current
    const lash = lashRef.current
    const nail = nailRef.current
    const dark = darkRef.current
    const glare = glareRef.current
    if (!section || !lash || !nail || !dark || !glare) return

    const ctx = gsap.context(() => {
      gsap.set(lash, { scale: 1, filter: 'blur(0px)', opacity: 1 })
      gsap.set(nail, { scale: 1.3, filter: 'blur(24px)', opacity: 0 })
      gsap.set(dark, { opacity: 0 })
      gsap.set(glare, { xPercent: -150 })

      const mm = gsap.matchMedia()
      mm.add({ desktop: '(min-width: 1024px)', mobile: '(max-width: 1023px)' }, (context) => {
        const { desktop } = context.conditions as { desktop: boolean }
        const distance = desktop ? '+=160%' : '+=120%'

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top top',
            end: distance,
            scrub: 1.6,
            pin: true,
            anticipatePin: 1,
          },
        })

        tl
          // Camera pushes into the lash macro, image abstracts.
          .to(lash, { scale: 1.7, filter: 'blur(26px)', ease: 'sine.in', duration: 0.4 }, 0)
          .to(dark, { opacity: 0.92, ease: 'sine.in', duration: 0.32 }, 0.16)
          // A glossy reflection sweeps across the darkened frame.
          .to(glare, { xPercent: 150, ease: 'sine.inOut', duration: 0.3 }, 0.34)
          // The polished nail resolves out of the reflection, camera pulls back.
          .to(nail, { opacity: 1, filter: 'blur(0px)', scale: 1, ease: 'sine.out', duration: 0.46 }, 0.42)
          .to(lash, { opacity: 0, ease: 'sine.in', duration: 0.3 }, 0.42)
          .to(dark, { opacity: 0, ease: 'sine.out', duration: 0.4 }, 0.5)

        return () => {
          tl.scrollTrigger?.kill()
          tl.kill()
        }
      })

      return () => mm.revert()
    }, section)

    return () => {
      ctx.revert()
      ScrollTrigger.getAll()
        .filter((trigger) => trigger.trigger === section)
        .forEach((trigger) => trigger.kill())
    }
  }, [reducedMotion])

  if (reducedMotion) {
    return (
      <section
        aria-label="From lashes to nails"
        className="relative flex h-[70vh] items-center justify-center overflow-hidden bg-ink"
      >
        <img
          src={nailImage}
          alt="Polished nail set by SHEE Beauty Studio"
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </section>
    )
  }

  return (
    <section ref={sectionRef} aria-hidden="true" className="relative bg-ink">
      <div className="relative h-[100svh] w-full overflow-hidden">
        <div ref={lashRef} className="absolute inset-0 will-change-transform">
          <img src={lashImage} alt="" className="h-full w-full object-cover" loading="lazy" decoding="async" />
        </div>

        <div ref={nailRef} className="absolute inset-0 will-change-transform">
          <img src={nailImage} alt="" className="h-full w-full object-cover" loading="lazy" decoding="async" />
        </div>

        <div ref={darkRef} className="pointer-events-none absolute inset-0 bg-ink" />

        <div
          ref={glareRef}
          className="pointer-events-none absolute inset-0"
          style={{
            background: 'linear-gradient(112deg, transparent 42%, rgba(246,240,230,0.5) 50%, transparent 58%)',
          }}
        />
      </div>
    </section>
  )
}
