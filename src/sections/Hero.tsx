import { useEffect, useRef } from 'react'
import { ArrowRight } from 'lucide-react'
import { gsap, ScrollTrigger } from '../utils/gsap'
import { useReducedMotion } from '../hooks/useReducedMotion'
import { bookingHref, bookingIsExternal } from '../config/business'
import heroPortrait from '../assets/video/hero-portrait.mp4'

export function Hero() {
  const heroRef = useRef<HTMLElement>(null)
  const videoWrapRef = useRef<HTMLDivElement>(null)
  const sheeRef = useRef<HTMLHeadingElement>(null)
  const midgroundRef = useRef<HTMLDivElement>(null)
  const foregroundRef = useRef<HTMLDivElement>(null)
  const teaserRef = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    const hero = heroRef.current
    const videoWrap = videoWrapRef.current
    const shee = sheeRef.current
    const midground = midgroundRef.current
    const foreground = foregroundRef.current
    const teaser = teaserRef.current
    if (!hero || !videoWrap || !shee || !midground || !foreground || !teaser) return

    const ctx = gsap.context(() => {
      // ---- Entrance ---------------------------------------------------
      const entrance = gsap.timeline({
        defaults: { ease: 'power3.out' },
        delay: reducedMotion ? 0 : 0.15,
      })
      if (reducedMotion) {
        gsap.set([shee, midground, foreground], { opacity: 1, y: 0 })
      } else {
        entrance
          .from(shee, { opacity: 0, y: 40, duration: 1.1 })
          .from(midground, { opacity: 0, y: 24, duration: 0.9 }, '-=0.7')
          .from(foreground, { opacity: 0, y: 18, duration: 0.9 }, '-=0.6')
      }

      // ---- Desktop pointer parallax ------------------------------------
      const mm = gsap.matchMedia()

      mm.add('(hover: hover) and (pointer: fine)', () => {
        if (reducedMotion) return

        const videoX = gsap.quickTo(videoWrap, 'x', { duration: 0.7, ease: 'power3' })
        const videoY = gsap.quickTo(videoWrap, 'y', { duration: 0.7, ease: 'power3' })
        const sheeX = gsap.quickTo(shee, 'x', { duration: 0.6, ease: 'power3' })
        const sheeY = gsap.quickTo(shee, 'y', { duration: 0.6, ease: 'power3' })
        const midX = gsap.quickTo(midground, 'x', { duration: 0.55, ease: 'power3' })
        const midY = gsap.quickTo(midground, 'y', { duration: 0.55, ease: 'power3' })
        const foreX = gsap.quickTo(foreground, 'x', { duration: 0.5, ease: 'power3' })
        const foreY = gsap.quickTo(foreground, 'y', { duration: 0.5, ease: 'power3' })

        const handlePointerMove = (event: PointerEvent) => {
          const { innerWidth, innerHeight } = window
          const nx = event.clientX / innerWidth - 0.5
          const ny = event.clientY / innerHeight - 0.5

          videoX(nx * 8)
          videoY(ny * 8)
          sheeX(nx * 16)
          sheeY(ny * 10)
          midX(nx * 22)
          midY(ny * 14)
          foreX(nx * 28)
          foreY(ny * 16)
        }

        hero.addEventListener('pointermove', handlePointerMove)
        return () => hero.removeEventListener('pointermove', handlePointerMove)
      })

      // ---- Scroll-pinned cinematic transition --------------------------
      mm.add(
        {
          desktop: '(min-width: 1024px)',
          mobile: '(max-width: 1023px)',
          reduced: '(prefers-reduced-motion: reduce)',
        },
        (context: gsap.Context) => {
          const { desktop, reduced } = context.conditions as { desktop: boolean; reduced: boolean }

          if (reduced) {
            // Static, fully legible hero — no pin, no scroll-driven motion.
            gsap.set(teaser, { opacity: 0 })
            return
          }

          const distance = desktop ? '+=160%' : '+=110%'

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: hero,
              start: 'top top',
              end: distance,
              scrub: 1,
              pin: true,
              anticipatePin: 1,
              onUpdate: (self: ScrollTrigger) => {
                document.documentElement.style.setProperty('--hero-progress', self.progress.toFixed(4))
              },
              onLeave: () => {
                document.documentElement.style.setProperty('--hero-progress', '1')
              },
              onEnterBack: () => {
                document.documentElement.style.setProperty('--hero-progress', '1')
              },
            },
          })

          // Video: slow push-in, then it settles into a smaller cropped frame.
          tl.to(videoWrap, { scale: 1.18, ease: 'none', duration: 0.6 }, 0)
            .to(
              videoWrap,
              {
                clipPath: desktop
                  ? 'inset(6% 22% 6% 22% round 18px)'
                  : 'inset(4% 10% 30% 10% round 18px)',
                scale: desktop ? 0.92 : 0.88,
                x: desktop ? '-18%' : 0,
                ease: 'power2.inOut',
                duration: 0.4,
              },
              0.6,
            )
            .to(videoWrap, { '--overlay-o': 0.55, ease: 'none', duration: 0.4 }, 0.6)

            // Supporting elements recede first.
            .to(foreground, { opacity: 0, y: -30, ease: 'power2.in', duration: 0.32 }, 0)
            .to(midground, { opacity: 0, y: -24, scale: 0.94, ease: 'power2.in', duration: 0.38 }, 0.05)

            // SHEE becomes dominant, then yields at the very end.
            .to(shee, { scale: 1.32, y: '-8%', ease: 'none', duration: 0.55 }, 0)
            .to(shee, { opacity: 0, y: '-14%', ease: 'power2.in', duration: 0.25 }, 0.72)

            // Next section rises into the same visual space.
            .fromTo(
              teaser,
              { opacity: 0, y: 48, scale: 0.97 },
              { opacity: 1, y: 0, scale: 1, ease: 'power2.out', duration: 0.45 },
              0.55,
            )

          return () => {
            tl.scrollTrigger?.kill()
            tl.kill()
          }
        },
      )

      return () => mm.revert()
    }, hero)

    return () => {
      ctx.revert()
      ScrollTrigger.getAll().forEach((trigger: ScrollTrigger) => trigger.kill())
      document.documentElement.style.removeProperty('--hero-progress')
    }
  }, [reducedMotion])

  return (
    <section
      ref={heroRef}
      id="top"
      aria-label="SHEE Beauty Studio — Lashes, Nails, Beauty in Lower Kabete"
      className="relative h-[100svh] w-full overflow-hidden bg-ink"
    >
      {/* Background: cinematic video */}
      <div
        ref={videoWrapRef}
        className="absolute inset-0 hero-video-layer"
        style={{ ['--overlay-o' as string]: 0.2 }}
      >
        <video
          className="h-full w-full object-contain"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
          role="presentation"
        >
          <source src={heroPortrait} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-ink/10 to-ink/75" />
        <div className="hero-overlay-dynamic absolute inset-0 bg-ink" />
      </div>

      {/* Midground: supporting editorial typography */}
      <div
        ref={midgroundRef}
        className="pointer-events-none absolute inset-x-0 top-[54%] flex flex-col items-center px-5 text-center"
      >
        <p className="font-display text-2xl italic tracking-wide text-cream/95 sm:text-3xl md:text-4xl">
          Beauty Studio
        </p>
        <p className="mt-3 font-sans text-[11px] font-medium uppercase tracking-[0.4em] text-dusty sm:text-xs">
          Lashes • Nails • Beauty
        </p>
      </div>

      {/* Mid-foreground: dominant SHEE wordmark */}
      <h1
        ref={sheeRef}
        className="pointer-events-none absolute inset-x-0 top-[16%] select-none text-center font-display leading-[0.78] text-cream sm:top-[18%]"
        style={{ fontSize: 'clamp(5rem, 24vw, 17rem)', letterSpacing: '-0.02em' }}
      >
        SHEE
      </h1>

      {/* Foreground: CTAs + scroll cue */}
      <div
        ref={foregroundRef}
        className="absolute inset-x-0 bottom-10 flex flex-col items-center gap-8 px-5 sm:bottom-14"
      >
        <div className="flex w-full max-w-md flex-col gap-3 sm:w-auto sm:flex-row sm:gap-4">
          <a
            href={bookingHref}
            target={bookingIsExternal ? '_blank' : undefined}
            rel={bookingIsExternal ? 'noopener noreferrer' : undefined}
            className="group relative overflow-hidden border border-champagne px-7 py-4 text-center font-sans text-[12px] font-semibold uppercase tracking-[0.18em] text-cream transition-colors duration-500 ease-[var(--ease-editorial)] hover:text-ink"
          >
            <span className="absolute inset-0 origin-left scale-x-0 bg-champagne transition-transform duration-500 ease-[var(--ease-editorial)] group-hover:scale-x-100" />
            <span className="relative z-10 inline-flex items-center justify-center gap-2">
              Book Your Slot
              <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </a>

          <a
            href="#pricing"
            className="border border-cream/50 px-7 py-4 text-center font-sans text-[12px] font-semibold uppercase tracking-[0.18em] text-cream transition-colors duration-300 hover:border-cream hover:bg-cream/10"
          >
            View Services
          </a>
        </div>

        <div className="hidden flex-col items-center gap-2 opacity-70 sm:flex" aria-hidden="true">
          <span className="h-10 w-px bg-cream/50" />
          <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-cream/70">Scroll</span>
        </div>
      </div>

      {/* Teaser layer: next section rising into the same visual space */}
      <div
        ref={teaserRef}
        className="pointer-events-none absolute inset-x-0 top-1/2 flex -translate-y-1/2 flex-col items-center px-6 text-center opacity-0"
      >
        <p className="font-display text-4xl leading-tight text-cream sm:text-6xl md:text-7xl">
          Lashes.
          <br />
          Nails.
          <br />
          Your Look.
        </p>
      </div>
    </section>
  )
}
