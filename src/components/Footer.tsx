import { business } from '../config/business'

export function Footer() {
  return (
    <footer className="border-t border-cream/10 bg-ink px-5 py-10 text-center sm:px-8">
      <p className="font-display text-lg tracking-[0.08em] text-cream">{business.businessName.toUpperCase()}</p>
      <p className="mt-2 font-sans text-xs uppercase tracking-[0.25em] text-dusty">{business.tagline}</p>
      <p className="mt-4 font-sans text-sm text-cream/50">{business.location}</p>
      <a
        href={business.instagramUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-1 inline-block font-sans text-sm text-cream/50 transition-colors duration-300 hover:text-champagne"
      >
        {business.instagramHandle}
      </a>
    </footer>
  )
}
