/** Paket lisensi — sinkron dengan license-worker PAYMENT_PLANS. */
export type PlanPkg = 'basic' | 'pro'
export type PlanPeriod = 'weekly' | 'monthly' | 'yearly'

export interface DashboardPlan {
  pkg: PlanPkg
  period: PlanPeriod
  amount: number
  label: string
  devices: number
}

export const DASHBOARD_PLANS: DashboardPlan[] = [
  { pkg: 'basic', period: 'weekly', amount: 75_000, label: 'Basic Mingguan', devices: 1 },
  { pkg: 'basic', period: 'monthly', amount: 199_000, label: 'Basic Bulanan', devices: 1 },
  { pkg: 'basic', period: 'yearly', amount: 1_999_000, label: 'Basic Tahunan', devices: 1 },
  { pkg: 'pro', period: 'monthly', amount: 399_000, label: 'Pro Bulanan', devices: 2 },
  { pkg: 'pro', period: 'yearly', amount: 3_999_000, label: 'Pro Tahunan', devices: 2 },
]

export function getPlanPrice(pkg: PlanPkg, period: PlanPeriod): number {
  const plan = DASHBOARD_PLANS.find((p) => p.pkg === pkg && p.period === period)
  return plan?.amount ?? 0
}

export function formatRupiah(amount: number): string {
  return `Rp ${amount.toLocaleString('id-ID')}`
}

export function formatPlanPeriod(period: PlanPeriod): string {
  switch (period) {
    case 'weekly':
      return 'minggu'
    case 'monthly':
      return 'bulan'
    case 'yearly':
      return 'tahun'
  }
}

export function formatPlanLabel(pkg: PlanPkg, period: PlanPeriod): string {
  const tier = pkg === 'pro' ? 'Pro' : 'Basic'
  switch (period) {
    case 'weekly':
      return `${tier} Mingguan`
    case 'monthly':
      return `${tier} Bulanan`
    case 'yearly':
      return `${tier} Tahunan`
  }
}

export function formatOrderStatus(status: string): string {
  switch (status) {
    case 'completed':
      return 'Lunas'
    case 'pending':
      return 'Menunggu'
    case 'cancelled':
      return 'Dibatalkan'
    case 'expired':
      return 'Kedaluwarsa'
    default:
      return status
  }
}

export function formatOrderDate(iso?: string | null): string {
  if (!iso) return '-'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '-'
  return d.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
