/**
 * Central business configuration.
 * Fields left empty are not yet known — wire them up here once available
 * and every component that needs them (Navigation, BookingCTA, Contact,
 * Footer) will pick them up automatically.
 */
export const business = {
  businessName: 'SHEE Beauty Studio',
  tagline: 'Lashes • Nails • Beauty',
  location: 'Lower Kabete',

  instagramHandle: '@shee.beautystudio',
  instagramUrl: 'https://instagram.com/shee.beautystudio',

  /** Set to a real booking link (Fresha, etc.) if one ever replaces the WhatsApp flow below. */
  bookingUrl: '',
  /** Kenyan number 0720 645 218 in international format, digits only, for the wa.me link. */
  whatsappNumber: '254720645218',
} as const

// Falls back to the on-page Contact section only if neither a booking URL
// nor a WhatsApp number is configured.
export const bookingHref =
  business.bookingUrl || (business.whatsappNumber ? `https://wa.me/${business.whatsappNumber}` : '#contact')

/** True when bookingHref points off-site (WhatsApp/booking URL) rather than an in-page anchor. */
export const bookingIsExternal = Boolean(business.bookingUrl || business.whatsappNumber)
