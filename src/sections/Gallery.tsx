import { useEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '../utils/gsap'
import { useReducedMotion } from '../hooks/useReducedMotion'
import megaVolumeCatEye from '../assets/images/lashes/mega-volume-cat-eye.jpg'
import hybridSet from '../assets/images/lashes/hybrid-set.jpg'
import nailArtFeather from '../assets/images/gallery/nail-art-feather.jpg'
import ombre from '../assets/images/nails/ombre.jpg'
import builderGel from '../assets/images/nails/builder-gel.jpg'
import pedicureSandals from '../assets/images/gallery/pedicure-sandals.jpg'

interface GalleryImage {
  id: string
  src: string
  alt: string
  className: string
  aspect: string
  parallax: number
}

const images: GalleryImage[] = [
  {
    id: 'hero-lash',
    src: megaVolumeCatEye,
    alt: 'Mega volume cat-eye lash set by SHEE Beauty Studio',
    className: 'lg:col-start-6 lg:col-span-4 lg:row-start-1 lg:row-span-6',
    aspect: 'aspect-[3/4]',
    parallax: -26,
  },
  {
    id: 'nail-art',
    src: nailArtFeather,
    alt: 'Hand-painted feather nail art detail by SHEE Beauty Studio',
    className: 'lg:col-start-10 lg:col-span-3 lg:row-start-1 lg:row-span-3',
    aspect: 'aspect-square',
    parallax: 18,
  },
  {
    id: 'ombre',
    src: ombre,
    alt: 'Ombre nail set by SHEE Beauty Studio',
    className: 'lg:col-start-10 lg:col-span-3 lg:row-start-4 lg:row-span-3',
    aspect: 'aspect-[4/5]',
    parallax: -14,
  },
  {
    id: 'builder-gel',
    src: builderGel,
    alt: 'Builder gel application by SHEE Beauty Studio',
    className: 'lg:col-start-1 lg:col-span-5 lg:row-start-3 lg:row-span-4',
    aspect: 'aspect-[4/3]',
    parallax: 22,
  },
  {
    id: 'pedicure-sandals',
    src: pedicureSandals,
    alt: 'Pedicure with gold sandals by SHEE Beauty Studio',
    className: 'lg:col-start-6 lg:col-span-5 lg:row-start-7 lg:row-span-6',
    aspect: 'aspect-[4/5]',
    parallax: -30,
  },
  {
    id: 'hybrid-set',
    src: hybridSet,
    alt: 'Hybrid lash set by SHEE Beauty Studio',
    className: 'lg:col-start-1 lg:col-span-5 lg:row-start-7 lg:row-span-4',
    aspect: 'aspect-[4/3]',
    parallax: 16,
  },
]

export function Gallery() {
  const sectionRef = useRef<HTMLElement>(null)
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (reducedMotion) return
    const section = sectionRef.current
    const items = itemRefs.current.filter((el): el is HTMLDivElement => Boolean(el))
    if (!section || items.length === 0) return

    const ctx = gsap.context(() => {
      items.forEach((item, i) => {
        const img = item.querySelector('img')
        gsap.set(item, { opacity: 0, y: 48, scale: 0.97 })

        gsap.to(item, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 88%',
            toggleActions: 'play none none reverse',
          },
        })

        if (img) {
          gsap.to(img, {
            yPercent: images[i].parallax,
            ease: 'none',
            scrollTrigger: {
              trigger: section,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1,
            },
          })
        }
      })
    }, section)

    return () => {
      ctx.revert()
      ScrollTrigger.getAll()
        .filter((trigger) => items.includes(trigger.trigger as HTMLDivElement) || trigger.trigger === section)
        .forEach((trigger) => trigger.kill())
    }
  }, [reducedMotion])

  return (
    <section
      ref={sectionRef}
      id="gallery"
      aria-label="Gallery"
      className="relative overflow-x-clip bg-ink px-5 py-24 sm:px-8 lg:px-12 lg:py-32"
    >
      <div className="mx-auto grid max-w-[1600px] grid-cols-1 gap-6 lg:grid-cols-12 lg:[grid-auto-rows:70px] lg:gap-6">
        <div className="flex flex-col justify-end pb-2 lg:col-start-1 lg:col-span-5 lg:row-start-1 lg:row-span-2">
          <p className="font-sans text-xs font-medium uppercase tracking-[0.35em] text-dusty">Gallery</p>
          <h2 className="mt-3 font-display leading-[0.95] text-cream" style={{ fontSize: 'clamp(2.5rem, 5.5vw, 4.5rem)' }}>
            The Work
          </h2>
        </div>

        {images.map((image, i) => (
          <div
            key={image.id}
            ref={(el) => {
              itemRefs.current[i] = el
            }}
            className={`relative overflow-hidden bg-charcoal will-change-transform ${image.aspect} lg:aspect-auto ${image.className}`}
          >
            <img
              src={image.src}
              alt={image.alt}
              className="h-full w-full object-cover"
              loading="lazy"
              decoding="async"
              style={{ transform: 'scale(1.15)' }}
            />
          </div>
        ))}
      </div>
    </section>
  )
}
