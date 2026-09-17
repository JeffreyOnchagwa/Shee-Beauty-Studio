import classicSet from '../assets/images/lashes/classic-set.jpg'
import hybridSet from '../assets/images/lashes/hybrid-set.jpg'
import voluminousCatEye from '../assets/images/lashes/voluminous-cat-eye.jpg'
import megaVolumeCatEye from '../assets/images/lashes/mega-volume-cat-eye.jpg'

import tipsAndGel from '../assets/images/nails/tips-and-gel.jpg'
import ombre from '../assets/images/nails/ombre.jpg'
import pedicure from '../assets/images/nails/pedicure.jpg'
import gelPolish from '../assets/images/nails/gel-polish.jpg'
import builderGel from '../assets/images/nails/builder-gel.jpg'

export interface Service {
  id: string
  name: string
  price: number
  /** Formatted for display, since the brief fixes these exact figures. */
  priceLabel: string
  image: string | null
  /** Set when `image` is a temporary stand-in borrowed from another service, pending a real photo. */
  imagePlaceholder?: boolean
  /** Object-position override, used to visually distinguish a reused placeholder photo. */
  imagePosition?: string
}

export const lashServices: Service[] = [
  { id: 'classic-set', name: 'Classic Set', price: 800, priceLabel: 'KSh 800', image: classicSet },
  { id: 'hybrid-set', name: 'Hybrid Set', price: 1500, priceLabel: 'KSh 1,500', image: hybridSet },
  {
    id: 'voluminous-cat-eye',
    name: 'Voluminous Cat Eye',
    price: 2000,
    priceLabel: 'KSh 2,000',
    image: voluminousCatEye,
  },
  {
    id: 'mega-volume-cat-eye',
    name: 'Mega Volume Cat Eye',
    price: 2500,
    priceLabel: 'KSh 2,500',
    image: megaVolumeCatEye,
  },
  {
    id: 'cluster-lashes',
    name: 'Cluster Lashes',
    price: 399,
    priceLabel: 'KSh 399',
    // TODO: swap for a real Cluster Lashes photograph once supplied — currently
    // borrows the Classic Set image, cropped differently, so it reads distinctly on screen.
    image: classicSet,
    imagePlaceholder: true,
    imagePosition: '82% 30%',
  },
]

export const lashSupplies: Service[] = [
  { id: 'spoolies', name: 'Spoolies', price: 20, priceLabel: 'KSh 20', image: null },
  { id: 'lip-gloss-applicators', name: 'Lip Gloss Applicators', price: 20, priceLabel: 'KSh 20', image: null },
]

export const nailServices: Service[] = [
  {
    id: 'tips-and-gel',
    name: 'Tips & Gel + Free Nail Art',
    price: 500,
    priceLabel: 'KSh 500',
    image: tipsAndGel,
  },
  {
    id: 'french-tips',
    name: 'French Tips',
    price: 800,
    priceLabel: 'KSh 800',
    // TODO: swap for a real French Tips photograph once supplied — the
    // originally downloaded "french tips.jpg" was actually unrelated nail
    // art (not French tips, possibly not SHEE's own work), so it was
    // dropped. Borrows the Gel Polish image, cropped differently, for now.
    image: gelPolish,
    imagePlaceholder: true,
    imagePosition: '30% 70%',
  },
  { id: 'ombre', name: 'Ombre', price: 1200, priceLabel: 'KSh 1,200', image: ombre },
  { id: 'pedicure', name: 'Pedicure', price: 300, priceLabel: 'KSh 300', image: pedicure },
  { id: 'gel-polish', name: 'Gel Polish', price: 300, priceLabel: 'KSh 300', image: gelPolish },
  { id: 'builder-gel', name: 'Builder Gel', price: 1000, priceLabel: 'KSh 1,000', image: builderGel },
]

export const specialOffers: Service[] = [
  nailServices.find((s) => s.id === 'tips-and-gel')!,
  lashServices.find((s) => s.id === 'cluster-lashes')!,
]
