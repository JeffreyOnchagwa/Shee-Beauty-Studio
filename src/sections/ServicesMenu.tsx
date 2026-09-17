import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '../utils/gsap'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { lashServices, lashSupplies, nailServices, type Service } from '../config/services'

function MenuRow({ service, secondary = false }: { service: Service; secondary?: boolean }) {
  return (
    <div className="flex items-baseline gap-4 py-4">
      <span
        className={`font-display whitespace-nowrap ${secondary ? 'text-lg text-ink/70' : 'text-xl text-ink sm:text-2xl'}`}
      >
        {service.name}
      </span>
      <span className="mb-1.5 h-0 flex-1 border-b border-dotted border-ink/25" aria-hidden="true" />
      <span
        className={`font-sans tracking-wide whitespace-nowrap ${secondary ? 'text-sm text-ink/60' : 'text-base text-ink/80'}`}
      >
        {service.priceLabel}
      </span>
    </div>
  )
}

export function ServicesMenu() {
  const sectionRef = useRef<HTMLElement>(null)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (reducedMotion) return
    const section = sectionRef.current
    if (!section) return
    const columns = section.querySelectorAll('[data-menu-column]')
    if (columns.length === 0) return

    const ctx = gsap.context(() => {
      gsap.set(columns, { opacity: 0, y: 28 })
      gsap.to(columns, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power2.out',
        stagger: 0.15,
        scrollTrigger: {
          trigger: section,
          start: 'top 78%',
          toggleActions: 'play none none reverse',
        },
      })
    }, section)

    return () => {
      ctx.revert()
      ScrollTrigger.getAll()
        .filter((trigger) => trigger.trigger === section)
        .forEach((trigger) => trigger.kill())
    }
  }, [reducedMotion])

  return (
    <section
      ref={sectionRef}
      id="pricing"
      aria-label="Full price list"
      className="bg-cream px-5 py-24 text-ink sm:px-8 lg:px-12 lg:py-32"
    >
      <div className="mx-auto max-w-4xl text-center">
        <p className="font-sans text-xs font-medium uppercase tracking-[0.35em] text-rose">The Menu</p>
        <h2 className="mt-3 font-display text-4xl sm:text-5xl">Full Price List</h2>
      </div>

      <div className="mx-auto mt-16 grid max-w-4xl gap-16 lg:grid-cols-2 lg:gap-20">
        <div data-menu-column>
          <h3 className="font-sans text-xs font-semibold uppercase tracking-[0.3em] text-rose">Lashes</h3>
          <div className="mt-4 divide-y divide-ink/10">
            {lashServices.map((service) => (
              <MenuRow key={service.id} service={service} />
            ))}
          </div>

          <h4 className="mt-8 font-sans text-[11px] font-semibold uppercase tracking-[0.3em] text-ink/40">
            Lash Supplies
          </h4>
          <div className="mt-2 divide-y divide-ink/10">
            {lashSupplies.map((service) => (
              <MenuRow key={service.id} service={service} secondary />
            ))}
          </div>
        </div>

        <div data-menu-column>
          <h3 className="font-sans text-xs font-semibold uppercase tracking-[0.3em] text-rose">Nails</h3>
          <div className="mt-4 divide-y divide-ink/10">
            {nailServices.map((service) => (
              <MenuRow key={service.id} service={service} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
