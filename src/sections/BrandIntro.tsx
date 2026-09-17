import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '../utils/gsap'
import { useReducedMotion } from '../hooks/useReducedMotion'
import lashPhoto from '../assets/images/lashes/voluminous-cat-eye.jpg'
import nailPhoto from '../assets/images/nails/builder-gel.jpg'

const headlineLines = ['Lashes.', 'Nails.', 'Your Look.']

export function BrandIntro() {
  const sectionRef = useRef<HTMLElement>(null)
  const lineRefs = useRef<(HTMLSpanElement | null)[]>([])
  const copyRef = useRef<HTMLParagraphElement>(null)
  const imageWrapRef = useRef<HTMLDivElement>(null)
  const tallPhotoRef = useRef<HTMLDivElement>(null)
  const smallPhotoRef = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    const section = sectionRef.current
    const lines = lineRefs.current.filter((el): el is HTMLSpanElement => Boolean(el))
    const copy = copyRef.current
    const tallPhoto = tallPhotoRef.current
    const smallPhoto = smallPhotoRef.current
    if (!section || !copy || !tallPhoto || !smallPhoto || lines.length === 0) return

    const ctx = gsap.context(() => {
      if (reducedMotion) {
        gsap.set([...lines, copy, tallPhoto, smallPhoto], { clearProps: 'all' })
        return
      }

      gsap.set(lines, { yPercent: 110 })
      gsap.set(copy, { opacity: 0, y: 16 })
      gsap.set(tallPhoto, { clipPath: 'inset(100% 0% 0% 0%)', scale: 1.08 })
      gsap.set(smallPhoto, { clipPath: 'inset(100% 0% 0% 0%)', scale: 1.08 })

      const reveal = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top 70%',
          toggleActions: 'play none none reverse',
        },
        defaults: { ease: 'power3.out' },
      })

      reveal
        .to(lines, { yPercent: 0, duration: 0.9, stagger: 0.1 })
        .to(copy, { opacity: 1, y: 0, duration: 0.7 }, '-=0.5')
        .to(tallPhoto, { clipPath: 'inset(0% 0% 0% 0%)', scale: 1, duration: 1.1, ease: 'power2.out' }, 0.1)
        .to(smallPhoto, { clipPath: 'inset(0% 0% 0% 0%)', scale: 1, duration: 1.1, ease: 'power2.out' }, 0.28)

      // Restrained independent parallax as the section scrolls through.
      gsap.to(tallPhoto, {
        yPercent: -6,
        ease: 'none',
        scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: 1 },
      })
      gsap.to(smallPhoto, {
        yPercent: 8,
        ease: 'none',
        scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: 1 },
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
      id="about"
      aria-label="About SHEE Beauty Studio"
      className="relative overflow-x-clip bg-ink px-5 py-24 sm:px-8 lg:px-12 lg:py-36"
    >
      <div className="mx-auto grid max-w-[1600px] gap-16 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-12">
        <div>
          <h2 className="font-display leading-[0.95] text-cream" style={{ fontSize: 'clamp(2.75rem, 7vw, 5.5rem)' }}>
            {headlineLines.map((line, i) => (
              <span key={line} className="block overflow-hidden">
                <span
                  ref={(el) => {
                    lineRefs.current[i] = el
                  }}
                  className="block"
                >
                  {line}
                </span>
              </span>
            ))}
          </h2>

          <p ref={copyRef} className="mt-8 max-w-sm font-sans text-base leading-relaxed text-cream/70">
            Beauty services in Lower Kabete, created with detail, personality and style.
          </p>
        </div>

        <div ref={imageWrapRef} className="relative mx-auto w-full max-w-md lg:mx-0">
          <div
            ref={tallPhotoRef}
            className="aspect-[4/5] w-full overflow-hidden bg-charcoal will-change-transform"
          >
            <img
              src={lashPhoto}
              alt="Voluminous cat-eye lash set by SHEE Beauty Studio"
              className="h-full w-full object-cover"
              loading="lazy"
              decoding="async"
            />
          </div>

          <div
            ref={smallPhotoRef}
            className="absolute -bottom-10 -left-6 aspect-[5/4] w-[62%] overflow-hidden bg-charcoal shadow-2xl shadow-black/50 will-change-transform sm:-bottom-12 sm:-left-10"
          >
            <img
              src={nailPhoto}
              alt="Builder gel nail application at SHEE Beauty Studio"
              className="h-full w-full object-cover"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
