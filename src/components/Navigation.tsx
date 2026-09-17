import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { bookingHref, bookingIsExternal } from '../config/business'

const links = [
  { label: 'Services', href: '#pricing' },
  { label: 'Lashes', href: '#lashes' },
  { label: 'Nails', href: '#nails' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Contact', href: '#contact' },
]

export function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false)

  // Lock body scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  return (
    <header className="fixed inset-x-0 top-0 z-50 nav-scroll-surface">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
        <a
          href="#top"
          className="font-display text-xl tracking-[0.2em] text-cream sm:text-2xl"
          onClick={() => setMenuOpen(false)}
        >
          SHEE
        </a>

        <nav className="hidden items-center gap-10 lg:flex" aria-label="Primary">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-sans text-[13px] font-medium uppercase tracking-[0.14em] text-cream/85 transition-colors duration-300 hover:text-cream"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <a
            href={bookingHref}
            target={bookingIsExternal ? '_blank' : undefined}
            rel={bookingIsExternal ? 'noopener noreferrer' : undefined}
            className="group hidden items-center gap-2 border border-cream/40 px-5 py-2.5 font-sans text-[12px] font-semibold uppercase tracking-[0.16em] text-cream transition-colors duration-300 hover:border-champagne hover:bg-champagne hover:text-ink lg:inline-flex"
          >
            Book
          </a>

          <button
            type="button"
            className="inline-flex items-center justify-center p-2 text-cream lg:hidden"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      <div
        id="mobile-menu"
        aria-hidden={!menuOpen}
        className="fixed inset-0 top-0 flex flex-col bg-ink transition-[clip-path] duration-500 ease-[var(--ease-editorial)] lg:hidden"
        style={{
          clipPath: menuOpen ? 'inset(0 0 0 0)' : 'inset(0 0 100% 0)',
        }}
      >
        <div className="flex items-center justify-between px-5 py-5">
          <span className="font-display text-xl tracking-[0.2em] text-cream">SHEE</span>
          <button
            type="button"
            className="p-2 text-cream"
            aria-label="Close menu"
            tabIndex={menuOpen ? 0 : -1}
            onClick={() => setMenuOpen(false)}
          >
            <X size={26} />
          </button>
        </div>

        <nav className="flex flex-1 flex-col justify-center gap-2 px-8" aria-label="Mobile">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              tabIndex={menuOpen ? 0 : -1}
              onClick={() => setMenuOpen(false)}
              className="border-b border-cream/10 py-4 font-display text-3xl text-cream"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="px-8 pb-10">
          <a
            href={bookingHref}
            target={bookingIsExternal ? '_blank' : undefined}
            rel={bookingIsExternal ? 'noopener noreferrer' : undefined}
            tabIndex={menuOpen ? 0 : -1}
            onClick={() => setMenuOpen(false)}
            className="flex items-center justify-center border border-champagne bg-champagne px-6 py-4 font-sans text-sm font-semibold uppercase tracking-[0.16em] text-ink"
          >
            Book Your Slot
          </a>
        </div>
      </div>
    </header>
  )
}
