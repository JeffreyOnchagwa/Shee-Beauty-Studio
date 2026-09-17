import { useEffect } from 'react'
import { gsap, ScrollTrigger } from '../utils/gsap'

const NAV_OFFSET = 88

/**
 * Routes every in-page `#hash` link through GSAP instead of the browser's
 * native jump. Several sections are GSAP-pinned (position: fixed during
 * their scroll range), and a raw anchor jump can land at a stale scroll
 * position because it doesn't account for those pin spacers — this keeps
 * navigation and CTAs working correctly regardless of what's pinned.
 */
export function useAnchorScroll() {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement)?.closest('a[href^="#"]') as HTMLAnchorElement | null
      if (!anchor) return
      const hash = anchor.getAttribute('href')
      if (!hash || hash === '#') return
      const el = document.querySelector(hash)
      if (!el) return

      event.preventDefault()
      ScrollTrigger.refresh()
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      gsap.to(window, {
        duration: reduced ? 0 : 1.1,
        ease: 'power2.inOut',
        scrollTo: { y: el, offsetY: NAV_OFFSET },
      })
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])
}
