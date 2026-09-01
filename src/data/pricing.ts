/**
 * Harga lisensi berbayar. App tidak punya trial.
 */
export interface Tier {
  id: 'basic' | 'pro'
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
    id: 'basic',
    name: 'Basic',
    price: 'Rp 75.000',
    period: 'per minggu',
    alt: 'Rp 199.000 per bulan · Rp 1.999.000 per tahun',
    tagline: 'Satu perangkat, mesin upload yang sama.',
    features: ['Semua fitur upload', '1 perangkat', 'Dukungan standar'],
    cta: { label: 'Pilih Basic', href: '/dashboard' },
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 'Rp 399.000',
    period: 'per bulan',
    alt: 'Rp 3.999.000 per tahun',
    tagline: 'Untuk studio dengan lebih dari satu mesin kerja.',
    features: [
      'Semua fitur upload',
      '2 perangkat',
      'Dukungan prioritas',
    ],
    cta: { label: 'Pilih Pro', href: '/dashboard' },
    featured: true,
  },
]

export const PRICING_NOTE =
  'Basic dan Pro memakai mesin upload yang sama. Yang berbeda hanya durasi lisensi dan jumlah perangkat. Basic tersedia mingguan (Rp 75.000), bulanan, atau tahunan.'

export const STUDIO_NOTE =
  'Butuh banyak kursi untuk tim besar? Hubungi kami untuk penawaran Studio.'
