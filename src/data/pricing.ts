/**
 * Harga sesuai docs/prd/11-release-plan.md di repo app.
 * Jujur: saat ini app belum membedakan fitur antar tier (selain durasi &
 * jumlah perangkat), maka copy tidak mengarang batas fitur.
 */
export interface Tier {
  id: 'trial' | 'basic' | 'pro'
  name: string
  price: string
  period: string
  alt?: string
  tagline: string
  features: string[]
  cta: { label: string; href: string }
  featured?: boolean
}

export const TIERS: Tier[] = [
  {
    id: 'trial',
    name: 'Trial',
    price: 'Rp 0',
    period: '7 hari pertama',
    tagline: 'Coba mesin lengkapnya dulu, baru memutuskan.',
    features: ['Semua fitur upload', '1 perangkat', 'Tanpa kartu kredit'],
    cta: { label: 'Unduh Gratis', href: '/unduh' },
  },
  {
    id: 'basic',
    name: 'Basic',
    price: 'Rp 199.000',
    period: 'per bulan',
    alt: 'Rp 1.999.000 per tahun, hemat Rp 389.000',
    tagline: 'Untuk fotografer solo yang upload tiap minggu.',
    features: ['Semua fitur upload', '1 perangkat', 'Dukungan standar'],
    cta: { label: 'Pilih Basic', href: '/unduh' },
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 'Rp 399.000',
    period: 'per bulan',
    alt: 'Rp 3.999.000 per tahun, hemat Rp 789.000',
    tagline: 'Untuk studio dengan lebih dari satu mesin kerja.',
    features: [
      'Semua fitur upload',
      'Multi-perangkat (tambahan Rp 199.000 per perangkat)',
      'Dukungan prioritas',
    ],
    cta: { label: 'Pilih Pro', href: '/unduh' },
    featured: true,
  },
]

export const PRICING_NOTE =
  'Semua tier memakai mesin upload yang sama persis. Yang berbeda hanya durasi lisensi dan jumlah perangkat.'

export const STUDIO_NOTE =
  'Butuh banyak kursi untuk tim besar? Hubungi kami untuk penawaran Studio.'
