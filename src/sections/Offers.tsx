import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '../utils/gsap'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { specialOffers } from '../config/services'

export function Offers() {
  const sectionRef = useRef<HTMLElement>(null)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (reducedMotion) return
    const section = sectionRef.current
    if (!section) return
    const cards = section.querySelectorAll('[data-offer]')
    if (cards.length === 0) return

    const ctx = gsap.context(() => {
      gsap.set(cards, { opacity: 0, y: 40, clipPath: 'inset(0% 0% 8% 0%)' })
      gsap.to(cards, {
        opacity: 1,
        y: 0,
        clipPath: 'inset(0% 0% 0% 0%)',
        duration: 0.9,
        ease: 'power2.out',
        stagger: 0.15,
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
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
    <section ref={sectionRef} aria-label="Special offers" className="bg-ink px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
      <div className="mx-auto max-w-[1400px]">
        <p className="font-sans text-xs font-medium uppercase tracking-[0.35em] text-dusty">Special Offers</p>
        <h2 className="mt-3 font-display text-4xl text-cream sm:text-5xl">Worth Trying</h2>

        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:gap-12">
          {specialOffers.map((service) => (
            <div key={service.id} data-offer className="group relative overflow-hidden bg-charcoal">
              <div className="aspect-[4/3]">
                {service.image && (
                  <img
                    src={service.image}
                    alt={`${service.name} at SHEE Beauty Studio`}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    style={{ objectPosition: service.imagePosition ?? '50% 50%' }}
                    loading="lazy"
                    decoding="async"
                  />
                )}
              </div>
              <div className="flex items-baseline justify-between gap-4 border-t border-cream/10 px-6 py-5">
                <span className="font-display text-2xl text-cream">{service.name}</span>
                <span className="font-sans text-lg text-champagne">{service.priceLabel}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
