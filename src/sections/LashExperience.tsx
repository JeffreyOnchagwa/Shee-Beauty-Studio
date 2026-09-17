import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '../utils/gsap'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { lashServices } from '../config/services'

const UNIT = 1
const OVERLAP = 0.4

export function LashExperience() {
  const sectionRef = useRef<HTMLElement>(null)
  const photoRefs = useRef<(HTMLDivElement | null)[]>([])
  const imgRefs = useRef<(HTMLImageElement | null)[]>([])
  const nameRefs = useRef<(HTMLDivElement | null)[]>([])
  const priceRefs = useRef<(HTMLDivElement | null)[]>([])
  const progressLabelRef = useRef<HTMLSpanElement>(null)
  const progressLineRef = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (reducedMotion) return
    const section = sectionRef.current
    const photos = photoRefs.current
    const imgs = imgRefs.current
    const names = nameRefs.current
    const prices = priceRefs.current
    if (!section || photos.some((p) => !p) || names.some((n) => !n) || prices.some((n) => !n)) return

    const n = lashServices.length
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()

      mm.add(
        { desktop: '(min-width: 1024px)', mobile: '(max-width: 1023px)' },
        (context) => {
          const { desktop } = context.conditions as { desktop: boolean }
          const distance = desktop ? `+=${n * 130}%` : `+=${n * 90}%`

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: 'top top',
              end: distance,
              scrub: 1.8,
              pin: true,
              anticipatePin: 1,
              onUpdate: (self: ScrollTrigger) => {
                const step = Math.min(n, Math.max(1, Math.ceil(self.progress * n)))
                if (progressLabelRef.current) {
                  progressLabelRef.current.textContent = `0${step} / 0${n}`
                }
                if (progressLineRef.current) {
                  progressLineRef.current.style.transform = `scaleX(${self.progress})`
                }
              },
            },
          })

          lashServices.forEach((service, i) => {
            const photo = photos[i]!
            const img = imgs[i]
            const name = names[i]!
            const price = prices[i]!

            const start = i * UNIT
            const end = start + UNIT
            const entryLead = i === 0 ? 0 : OVERLAP
            const exitTail = i === n - 1 ? 0 : OVERLAP

            const inTime = start - entryLead
            const settledTime = start + 0.45
            const outStartTime = end - 0.45
            const outTime = end + exitTail

            const vertical = i % 2 === 0
            const closedClip = vertical ? 'inset(0% 0% 100% 0%)' : 'inset(0% 100% 0% 0%)'
            const openClip = 'inset(0% 0% 0% 0%)'
            const closedClipOpposite = vertical ? 'inset(100% 0% 0% 0%)' : 'inset(0% 0% 0% 100%)'
            const baseScale = service.imagePlaceholder ? 1.4 : 1

            // Purely 2D (clip-path + opacity + blur + scale) — no 3D
            // transform, so stacking order can never be ambiguous across
            // browsers/GPUs regardless of z-index.
            gsap.set(photo, {
              clipPath: closedClip,
              opacity: 0,
              filter: 'blur(18px)',
              zIndex: i + 1,
            })
            if (img) gsap.set(img, { scale: baseScale })
            gsap.set(name, { clipPath: 'inset(0% 0% 100% 0%)' })
            gsap.set(price, { opacity: 0, x: 24 })

            tl.fromTo(
              photo,
              { clipPath: closedClip, opacity: 0, filter: 'blur(18px)' },
              {
                clipPath: openClip,
                opacity: 1,
                filter: 'blur(0px)',
                duration: settledTime - inTime,
                ease: 'sine.inOut',
              },
              inTime,
            )
              .to(img ?? photo, { scale: baseScale * 1.14, duration: outTime - inTime, ease: 'none' }, inTime)
              .to(
                photo,
                {
                  clipPath: closedClipOpposite,
                  opacity: 0,
                  filter: 'blur(18px)',
                  duration: outTime - outStartTime,
                  ease: 'sine.inOut',
                },
                outStartTime,
              )
              .fromTo(
                name,
                { clipPath: 'inset(0% 0% 100% 0%)' },
                { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.65, ease: 'power2.out' },
                inTime + entryLead + 0.15,
              )
              .to(name, { clipPath: 'inset(100% 0% 0% 0%)', duration: 0.55, ease: 'power2.in' }, outStartTime + 0.05)
              .fromTo(
                price,
                { opacity: 0, x: 24 },
                { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out' },
                inTime + entryLead + 0.32,
              )
              .to(price, { opacity: 0, x: -24, duration: 0.45, ease: 'power2.in' }, outStartTime + 0.12)
          })

          return () => {
            tl.scrollTrigger?.kill()
            tl.kill()
          }
        },
      )

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
      <section id="lashes" aria-label="Lash services" className="bg-ink px-5 py-24 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl">
          <p className="font-sans text-xs font-medium uppercase tracking-[0.35em] text-dusty">Lashes</p>
          <h2 className="mt-3 font-display text-4xl text-cream sm:text-5xl">Find Your Set</h2>

          <ul className="mt-14 flex flex-col gap-10">
            {lashServices.map((service) => (
              <li key={service.id} className="flex items-center gap-6 border-b border-cream/10 pb-10">
                {service.image && (
                  <img
                    src={service.image}
                    alt={`${service.name} lashes at SHEE Beauty Studio`}
                    className="h-28 w-28 flex-none rounded-sm object-cover sm:h-36 sm:w-36"
                    style={{ objectPosition: service.imagePosition ?? '50% 50%' }}
                    loading="lazy"
                  />
                )}
                <div className="flex flex-1 items-baseline justify-between gap-4">
                  <span className="font-display text-2xl text-cream sm:text-3xl">{service.name}</span>
                  <span className="font-sans text-lg text-champagne">{service.priceLabel}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    )
  }

  return (
    <section ref={sectionRef} id="lashes" aria-label="Lash services" className="relative bg-ink">
      <div aria-hidden="true" className="relative h-[100svh] w-full overflow-hidden">
        {/* Intro label, always present */}
        <div className="pointer-events-none absolute inset-x-0 top-8 z-30 flex items-center justify-between px-5 sm:px-8 lg:px-12">
          <p className="font-sans text-xs font-medium uppercase tracking-[0.35em] text-dusty">Lashes</p>
          <div className="flex items-center gap-3">
            <div className="h-px w-16 overflow-hidden bg-cream/20 sm:w-24">
              <div
                ref={progressLineRef}
                className="h-full w-full origin-left bg-champagne"
                style={{ transform: 'scaleX(0)' }}
              />
            </div>
            <span ref={progressLabelRef} className="font-sans text-xs tabular-nums tracking-[0.1em] text-cream/70">
              01 / 0{lashServices.length}
            </span>
          </div>
        </div>

        {/* One stacked layer per service: photo, then name, then price — in
            that DOM order — so the name and price always paint in front of
            their own photo, overlapping it directly. */}
        {lashServices.map((service, i) => (
          <div key={service.id} className="absolute inset-0" style={{ zIndex: i + 1 }}>
            {/* Photo, centered, large */}
            <div className="absolute inset-0 mx-auto flex items-center justify-center">
              <div
                ref={(el) => {
                  photoRefs.current[i] = el
                }}
                className="relative overflow-hidden bg-charcoal"
                style={{
                  width: 'clamp(280px, 62vw, 780px)',
                  height: 'clamp(360px, 76vh, 880px)',
                }}
              >
                {service.image && (
                  <img
                    ref={(el) => {
                      imgRefs.current[i] = el
                    }}
                    src={service.image}
                    alt={`${service.name} lash set at SHEE Beauty Studio`}
                    className="h-full w-full object-cover will-change-transform"
                    style={{ objectPosition: service.imagePosition ?? '50% 50%' }}
                    loading={i === 0 ? 'eager' : 'lazy'}
                    decoding="async"
                  />
                )}
              </div>
            </div>

            {/* Name + price, grouped, in front of the photo */}
            <div className="pointer-events-none absolute left-5 top-[18%] flex max-w-[80vw] flex-col items-start gap-5 sm:left-8 lg:left-12">
              <div
                ref={(el) => {
                  nameRefs.current[i] = el
                }}
                className="overflow-hidden"
              >
                <span
                  className="block whitespace-nowrap font-display leading-none text-cream"
                  style={{ fontSize: 'clamp(2.25rem, 5.4vw, 4.75rem)', textShadow: '0 4px 28px rgba(0,0,0,0.6)' }}
                >
                  {service.name}
                </span>
              </div>

              <div
                ref={(el) => {
                  priceRefs.current[i] = el
                }}
                className="whitespace-nowrap border border-champagne/70 bg-ink/50 px-5 py-3 font-sans text-lg text-champagne backdrop-blur-sm"
              >
                {service.priceLabel}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Screen-reader accessible equivalent of the decorative visual sequence above */}
      <ul className="sr-only">
        {lashServices.map((service) => (
          <li key={service.id}>
            {service.name} — {service.priceLabel}
          </li>
        ))}
      </ul>
    </section>
  )
}
