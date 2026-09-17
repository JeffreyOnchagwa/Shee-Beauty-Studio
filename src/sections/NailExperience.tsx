import { useEffect, useRef, useState } from 'react'
import { gsap } from '../utils/gsap'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { nailServices } from '../config/services'

export function NailExperience() {
  const [active, setActive] = useState(0)
  const prevActiveRef = useRef(0)
  const photoRefs = useRef<(HTMLDivElement | null)[]>([])
  const priceRef = useRef<HTMLDivElement>(null)
  const tlRef = useRef<gsap.core.Timeline | null>(null)
  const reducedMotion = useReducedMotion()

  // Initial mount: only the first service's photo is visible.
  useEffect(() => {
    const layers = photoRefs.current.filter((el): el is HTMLDivElement => Boolean(el))
    if (layers.length === 0) return
    gsap.set(layers, { clipPath: 'inset(0% 0% 100% 0%)', opacity: 0, filter: 'blur(12px)', scale: 1.06 })
    if (layers[0]) gsap.set(layers[0], { clipPath: 'inset(0% 0% 0% 0%)', opacity: 1, filter: 'blur(0px)', scale: 1 })
  }, [])

  // On selection change, cross-transition the outgoing/incoming photos.
  useEffect(() => {
    const prev = prevActiveRef.current
    prevActiveRef.current = active
    if (prev === active) return

    const incoming = photoRefs.current[active]
    const outgoing = photoRefs.current[prev]
    if (!incoming) return

    tlRef.current?.kill()

    const vertical = active % 2 === 0
    const closedClip = vertical ? 'inset(0% 0% 100% 0%)' : 'inset(0% 100% 0% 0%)'
    const openClip = 'inset(0% 0% 0% 0%)'

    if (reducedMotion) {
      gsap.set(incoming, { clipPath: openClip, opacity: 1, filter: 'blur(0px)', scale: 1 })
      if (outgoing) gsap.set(outgoing, { opacity: 0 })
      if (priceRef.current) gsap.set(priceRef.current, { opacity: 1, y: 0 })
      return
    }

    const tl = gsap.timeline()
    tlRef.current = tl

    if (outgoing) {
      tl.to(outgoing, { opacity: 0, filter: 'blur(10px)', scale: 1.05, duration: 0.4, ease: 'power2.in' }, 0)
    }
    tl.fromTo(
      incoming,
      { clipPath: closedClip, opacity: 0, filter: 'blur(12px)', scale: 1.06 },
      { clipPath: openClip, opacity: 1, filter: 'blur(0px)', scale: 1, duration: 0.75, ease: 'power2.out' },
      0.12,
    )
    if (priceRef.current) {
      tl.fromTo(
        priceRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' },
        0.3,
      )
    }

    return () => {
      tl.kill()
    }
  }, [active, reducedMotion])

  const activeService = nailServices[active]

  return (
    <section id="nails" aria-label="Nail services" className="relative bg-ink px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
      <div className="mx-auto max-w-[1600px]">
        <p className="font-sans text-xs font-medium uppercase tracking-[0.35em] text-dusty">Nails</p>
        <h2 className="mt-3 font-display text-4xl text-cream sm:text-5xl">Choose Your Finish</h2>

        <div className="mt-14 grid gap-10 lg:grid-cols-[0.36fr_0.64fr] lg:items-center lg:gap-16">
          {/* Selector */}
          <nav aria-label="Nail service selector" className="flex flex-row flex-wrap gap-x-6 gap-y-4 lg:flex-col lg:gap-y-6">
            {nailServices.map((service, i) => {
              const isActive = i === active
              return (
                <button
                  key={service.id}
                  type="button"
                  onClick={() => setActive(i)}
                  aria-pressed={isActive}
                  className={`text-left font-display transition-colors duration-300 ${
                    isActive ? 'text-cream' : 'text-cream/35 hover:text-cream/70'
                  }`}
                  style={{ fontSize: isActive ? 'clamp(1.5rem, 2.6vw, 2.5rem)' : 'clamp(1.15rem, 1.9vw, 1.75rem)' }}
                >
                  {service.name}
                </button>
              )
            })}
          </nav>

          {/* Dominant photo */}
          <div className="relative mx-auto w-full max-w-xl lg:max-w-none">
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-charcoal lg:aspect-[3/4] lg:h-[68vh] lg:w-auto">
              {nailServices.map((service, i) => (
                <div
                  key={service.id}
                  ref={(el) => {
                    photoRefs.current[i] = el
                  }}
                  className="absolute inset-0 will-change-transform"
                >
                  {service.image && (
                    <img
                      src={service.image}
                      alt={`${service.name} at SHEE Beauty Studio`}
                      className="h-full w-full object-cover"
                      style={{ objectPosition: service.imagePosition ?? '50% 50%' }}
                      loading={i === 0 ? 'eager' : 'lazy'}
                      decoding="async"
                    />
                  )}
                </div>
              ))}

              <div
                ref={priceRef}
                className="absolute bottom-6 left-6 border border-champagne/70 bg-ink/50 px-5 py-3 font-sans text-lg text-champagne backdrop-blur-sm"
              >
                {activeService.priceLabel}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
