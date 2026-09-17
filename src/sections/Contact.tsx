import { useEffect, useRef } from 'react'
import { ArrowRight } from 'lucide-react'
import { gsap, ScrollTrigger } from '../utils/gsap'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { business, bookingHref, bookingIsExternal } from '../config/business'

export function Contact() {
  const sectionRef = useRef<HTMLElement>(null)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (reducedMotion) return
    const section = sectionRef.current
    if (!section) return
    const targets = section.querySelectorAll('[data-reveal]')
    if (targets.length === 0) return

    const ctx = gsap.context(() => {
      gsap.set(targets, { opacity: 0, y: 24 })
      gsap.to(targets, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power2.out',
        stagger: 0.12,
        scrollTrigger: {
          trigger: section,
          start: 'top 75%',
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
      id="contact"
      aria-label="Book your slot"
      className="relative bg-ink px-5 py-28 text-center sm:px-8 lg:py-40"
    >
      <div className="mx-auto max-w-2xl">
        <h2
          data-reveal
          className="font-display leading-[0.95] text-cream"
          style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}
        >
          Ready For Your
          <br />
          Next Set?
        </h2>

        <div data-reveal className="mt-10">
          <a
            href={bookingHref}
            target={bookingIsExternal ? '_blank' : undefined}
            rel={bookingIsExternal ? 'noopener noreferrer' : undefined}
            className="group relative inline-flex items-center gap-2 overflow-hidden border border-champagne px-8 py-4 font-sans text-sm font-semibold uppercase tracking-[0.18em] text-cream transition-colors duration-500 ease-[var(--ease-editorial)] hover:text-ink"
          >
            <span className="absolute inset-0 origin-left scale-x-0 bg-champagne transition-transform duration-500 ease-[var(--ease-editorial)] group-hover:scale-x-100" />
            <span className="relative z-10 inline-flex items-center gap-2">
              Book Your Slot
              <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </a>
        </div>

        <div data-reveal className="mt-20 flex flex-col items-center gap-2">
          <p className="font-display text-xl tracking-[0.1em] text-cream">{business.businessName.toUpperCase()}</p>
          <p className="font-sans text-sm text-cream/60">{business.location}</p>
          <a
            href={business.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 font-sans text-sm text-dusty transition-colors duration-300 hover:text-champagne"
          >
            {business.instagramHandle}
          </a>
        </div>
      </div>
    </section>
  )
}
