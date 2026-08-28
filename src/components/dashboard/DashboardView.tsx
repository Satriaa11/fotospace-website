import { useState, useEffect } from 'react'
import {
  getStoredAuth,
  clearStoredAuth,
  fetchUserDashboard,
  createPaymentOrder,
  checkOrderStatus,
  type DashboardData,
  type PaymentOrderResponse,
} from '../../lib/auth'
import {
  ShieldCheck,
  Check,
  Copy,
  LogOut,
  CreditCard,
  ExternalLink,
  Loader2,
  AlertCircle,
  Zap,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react'

export default function DashboardView() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  // Payment state
  const [selectedPkg, setSelectedPkg] = useState<'basic' | 'pro'>('basic')
  const [selectedPeriod, setSelectedPeriod] = useState<'monthly' | 'yearly'>('monthly')
  const [paying, setPaying] = useState(false)
  const [activeOrder, setActiveOrder] = useState<PaymentOrderResponse | null>(null)
  const [orderChecking, setOrderChecking] = useState(false)
  const [orderMessage, setOrderMessage] = useState<string | null>(null)

  const loadDashboard = async () => {
    const auth = getStoredAuth()
    if (!auth?.token) {
      window.location.href = '/login'
      return
    }

    try {
      const res = await fetchUserDashboard(auth.token)
      setData(res)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Gagal memuat dashboard.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDashboard()
  }, [])

  const handleLogout = () => {
    clearStoredAuth()
    window.location.href = '/login'
  }

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key)
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  const handleCreateOrder = async () => {
    if (!data?.user?.email) return
    setPaying(true)
    setOrderMessage(null)

    try {
      const order = await createPaymentOrder(data.user.email, selectedPkg, selectedPeriod, 'qris')
      setActiveOrder(order)
    } catch (err: unknown) {
      setOrderMessage(err instanceof Error ? err.message : 'Gagal membuat transaksi.')
    } finally {
      setPaying(false)
    }
  }

  const handleCheckOrder = async () => {
    if (!activeOrder?.order_id) return
    setOrderChecking(true)
    setOrderMessage(null)

    try {
      const updated = await checkOrderStatus(activeOrder.order_id)
      if (updated.status === 'completed') {
        setOrderMessage('Pembayaran berhasil! Lisensi Anda telah diperbarui.')
        setActiveOrder(null)
        await loadDashboard()
      } else {
        setOrderMessage('Pembayaran belum terdeteksi. Silakan selesaikan scan QRIS lalu klik tombol ini lagi.')
      }
    } catch (err: unknown) {
      setOrderMessage(err instanceof Error ? err.message : 'Gagal memeriksa status pembayaran.')
    } finally {
      setOrderChecking(false)
    }
  }

  if (loading) {
    return (
      <div className="container-site flex min-h-[60vh] flex-col items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 font-mono text-sm text-muted-foreground">Memuat data dashboard...</p>
      </div>
    )
  }

  if (error && !data) {
    return (
      <div className="container-site py-20 text-center">
        <div className="mx-auto max-w-md rounded-[10px] border border-red-500/30 bg-red-950/20 p-6">
          <AlertCircle className="mx-auto h-8 w-8 text-red-400" />
          <h2 className="mt-3 text-lg font-semibold text-foreground">Terjadi Kendala</h2>
          <p className="mt-2 text-sm text-muted-foreground">{error}</p>
          <button onClick={() => window.location.reload()} className="btn-primary mt-5">
            Coba Lagi
          </button>
        </div>
      </div>
    )
  }

  const user = data?.user
  const license = data?.license
  const orders = data?.orders || []

  return (
    <div className="container-site py-10 sm:py-16">
      {/* Header User & Nav */}
      <div className="flex flex-col gap-4 border-b border-border pb-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="kicker">Dashboard Pengguna</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Halo, {user?.name || user?.email?.split('@')[0]}
          </h1>
          <p className="mt-1 font-mono text-xs text-muted-foreground">{user?.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="btn-secondary self-start text-xs sm:self-center"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>Keluar</span>
        </button>
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-3">
        {/* Kolom Kiri: Status Lisensi & Key */}
        <div className="space-y-6 lg:col-span-2">
          {/* Card Status Lisensi */}
          <div className="rounded-[10px] border border-border bg-surface p-6 sm:p-7 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-6 w-6 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">Status Lisensi</h2>
              </div>
              {license ? (
                <span
                  className={`badge font-mono text-xs ${
                    license.status === 'active' && !license.is_expired
                      ? 'bg-success/20 text-success border border-success/30'
                      : 'bg-red-500/20 text-red-400 border border-red-500/30'
                  }`}
                >
                  {license.is_expired
                    ? 'Kadaluarsa'
                    : license.status === 'active'
                      ? 'Aktif'
                      : 'Nonaktif'}
                </span>
              ) : (
                <span className="badge font-mono text-xs bg-panel text-muted-foreground">
                  Belum Ada Lisensi
                </span>
              )}
            </div>

            {license ? (
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-[8px] border border-border/80 bg-background/60 p-4">
                  <p className="text-xs text-muted-foreground">Paket Layanan</p>
                  <p className="mt-1 text-lg font-semibold uppercase text-foreground">
                    {license.tier}
                  </p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    {license.tier === 'pro' ? 'Studio multi-worker' : 'Solo fotografer'}
                  </p>
                </div>

                <div className="rounded-[8px] border border-border/80 bg-background/60 p-4">
                  <p className="text-xs text-muted-foreground">Masa Berlaku</p>
                  <p className="mt-1 text-lg font-semibold text-foreground font-mono">
                    {license.expires}
                  </p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    {license.is_expired
                      ? 'Sudah berakhir'
                      : `Sisa ${license.days_remaining} hari lagi`}
                  </p>
                </div>

                <div className="rounded-[8px] border border-border/80 bg-background/60 p-4">
                  <p className="text-xs text-muted-foreground">Perangkat</p>
                  <p className="mt-1 text-lg font-semibold text-foreground">
                    {license.devices_count} / {license.max_devices}
                  </p>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">Perangkat terhubung</p>
                </div>
              </div>
            ) : (
              <div className="mt-6 rounded-[8px] border border-dashed border-border bg-background/40 p-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Akun Anda belum memiliki lisensi berbayar aktif. Pilih paket di bawah untuk mengaktifkan lisensi Foto Space Anda.
                </p>
              </div>
            )}

            {/* License Key Display */}
            {license && (
              <div className="mt-6 border-t border-border pt-6">
                <label className="block text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  License Key Aplikasi Desktop
                </label>
                <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-center">
                  <div className="flex-1 rounded-[6px] border border-border bg-background px-4 py-2.5 font-mono text-base font-semibold tracking-wider text-primary">
                    {license.key}
                  </div>
                  <button
                    onClick={() => handleCopyKey(license.key)}
                    className="btn-secondary shrink-0 gap-1.5"
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4 text-success" />
                        <span>Tersalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        <span>Salin Key</span>
                      </>
                    )}
                  </button>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">
                  Buka aplikasi <strong>Foto Space</strong> di laptop Anda → menu <strong>Lisensi</strong> → masukkan key di atas untuk aktivasi.
                </p>
              </div>
            )}
          </div>

          {/* Card Beli / Perpanjang Lisensi */}
          <div className="rounded-[10px] border border-border bg-surface p-6 sm:p-7 shadow-sm">
            <div className="flex items-center gap-3">
              <Zap className="h-6 w-6 text-primary" />
              <h2 className="text-lg font-semibold text-foreground">
                {license ? 'Perpanjang Masa Aktif' : 'Pilih Paket Lisensi'}
              </h2>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Pembayaran instan via QRIS (BCA, GoPay, OVO, Dana, ShopeePay, LinkAja, Mandiri, dll).
            </p>

            {/* Toggle Bulanan / Tahunan */}
            <div className="mt-6 flex items-center gap-2 rounded-[8px] bg-background/80 p-1 border border-border w-fit">
              <button
                type="button"
                onClick={() => setSelectedPeriod('monthly')}
                className={`rounded-[6px] px-4 py-1.5 text-xs font-medium transition-colors ${
                  selectedPeriod === 'monthly'
                    ? 'bg-panel text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Bulanan
              </button>
              <button
                type="button"
                onClick={() => setSelectedPeriod('yearly')}
                className={`rounded-[6px] px-4 py-1.5 text-xs font-medium transition-colors flex items-center gap-1.5 ${
                  selectedPeriod === 'yearly'
                    ? 'bg-panel text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <span>Tahunan</span>
                <span className="rounded-full bg-primary/20 px-1.5 py-0.5 text-[10px] font-semibold text-primary">
                  Hemat 2 Bulan
                </span>
              </button>
            </div>

            {/* Pilihan Paket */}
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {/* Basic */}
              <div
                onClick={() => setSelectedPkg('basic')}
                className={`cursor-pointer rounded-[8px] border p-5 transition-all ${
                  selectedPkg === 'basic'
                    ? 'border-primary bg-primary/5 ring-1 ring-primary'
                    : 'border-border bg-background hover:border-border-strong'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">Basic</h3>
                  <span className="text-xs text-muted-foreground font-mono">1 Perangkat</span>
                </div>
                <p className="mt-3 font-mono text-xl font-bold text-foreground">
                  {selectedPeriod === 'monthly' ? 'Rp 199.000' : 'Rp 1.999.000'}
                  <span className="text-xs font-normal text-muted-foreground">
                    /{selectedPeriod === 'monthly' ? 'bulan' : 'tahun'}
                  </span>
                </p>
                <ul className="mt-4 space-y-1.5 text-xs text-muted-foreground">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                    <span>Upload batch tanpa batas</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                    <span>Kompresi cerdas adaptif</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                    <span>Laporan CSV & PDF</span>
                  </li>
                </ul>
              </div>

              {/* Pro */}
              <div
                onClick={() => setSelectedPkg('pro')}
                className={`cursor-pointer rounded-[8px] border p-5 transition-all ${
                  selectedPkg === 'pro'
                    ? 'border-primary bg-primary/5 ring-1 ring-primary'
                    : 'border-border bg-background hover:border-border-strong'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">Pro</h3>
                  <span className="text-xs text-primary font-mono font-medium">Studio Multi-Alat</span>
                </div>
                <p className="mt-3 font-mono text-xl font-bold text-foreground">
                  {selectedPeriod === 'monthly' ? 'Rp 399.000' : 'Rp 3.999.000'}
                  <span className="text-xs font-normal text-muted-foreground">
                    /{selectedPeriod === 'monthly' ? 'bulan' : 'tahun'}
                  </span>
                </p>
                <ul className="mt-4 space-y-1.5 text-xs text-muted-foreground">
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                    <span>Semua fitur Basic</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                    <span>Multi-perangkat (2 laptop)</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                    <span>Prioritas dukungan langsung</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Tombol Bayar */}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Total yang akan dibayar:</p>
                <p className="font-mono text-lg font-bold text-foreground">
                  {selectedPkg === 'basic'
                    ? selectedPeriod === 'monthly'
                      ? 'Rp 199.000'
                      : 'Rp 1.999.000'
                    : selectedPeriod === 'monthly'
                      ? 'Rp 399.000'
                      : 'Rp 3.999.000'}
                </p>
              </div>
              <button
                onClick={handleCreateOrder}
                disabled={paying}
                className="btn-primary shrink-0 gap-2"
              >
                {paying ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Menyiapkan Pembayaran...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4" />
                    <span>Bayar dengan QRIS</span>
                  </>
                )}
              </button>
            </div>

            {orderMessage && (
              <div className="mt-4 rounded-[6px] border border-primary/30 bg-primary/10 p-3 text-xs text-foreground">
                {orderMessage}
              </div>
            )}
          </div>
        </div>

        {/* Kolom Kanan: Panduan Cepat & Info App */}
        <div className="space-y-6">
          <div className="rounded-[10px] border border-border bg-surface p-6">
            <h3 className="text-sm font-semibold text-foreground">Panduan Aktivasi App</h3>
            <ol className="mt-4 space-y-3 text-xs leading-[1.6] text-muted-foreground">
              <li className="flex gap-2">
                <span className="font-mono font-bold text-foreground">1.</span>
                <span>
                  Unduh dan pasang aplikasi Foto Space dari halaman{' '}
                  <a href="/unduh" className="text-primary underline">
                    Unduh
                  </a>
                  .
                </span>
              </li>
              <li className="flex gap-2">
                <span className="font-mono font-bold text-foreground">2.</span>
                <span>Buka app, masuk ke menu <strong>Lisensi</strong> di sidebar.</span>
              </li>
              <li className="flex gap-2">
                <span className="font-mono font-bold text-foreground">3.</span>
                <span>Salin dan tempel <strong>License Key</strong> Anda, lalu klik Aktivasi.</span>
              </li>
            </ol>
          </div>

          <div className="rounded-[10px] border border-border bg-surface p-6">
            <h3 className="text-sm font-semibold text-foreground">Butuh Bantuan?</h3>
            <p className="mt-2 text-xs leading-[1.6] text-muted-foreground">
              Jika mengalami kendala lisensi atau pembayaran, hubungi tim kami di{' '}
              <a
                href="mailto:satria.fotospace@gmail.com"
                className="text-foreground underline decoration-border-strong hover:text-primary"
              >
                satria.fotospace@gmail.com
              </a>
              .
            </p>
          </div>
        </div>
      </div>

      {/* Modal Popup QRIS jika Order Aktif */}
      {activeOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[12px] border border-border bg-surface p-6 sm:p-7 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">Pembayaran QRIS</h3>
              <button
                onClick={() => setActiveOrder(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>

            <p className="mt-1 text-xs text-muted-foreground">
              Order ID: <span className="font-mono text-foreground">{activeOrder.order_id}</span>
            </p>

            {/* QR Area */}
            <div className="mt-5 flex flex-col items-center justify-center rounded-[8px] border border-border bg-background p-6">
              {activeOrder.payment_number ? (
                <div className="text-center">
                  <div className="mx-auto rounded-lg bg-white p-3 shadow-inner">
                    {/* Menggunakan API QR Image publik untuk render QR string Pakasir */}
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
                        activeOrder.payment_number
                      )}`}
                      alt="QRIS Code"
                      width={220}
                      height={220}
                      className="h-52 w-52"
                    />
                  </div>
                  <p className="mt-3 text-xs text-muted-foreground">
                    Scan menggunakan aplikasi m-Banking atau e-Wallet apa saja.
                  </p>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-sm text-muted-foreground">
                    Buka halaman pembayaran langsung di Pakasir:
                  </p>
                </div>
              )}

              <div className="mt-4 w-full border-t border-border pt-4 text-center">
                <p className="text-xs text-muted-foreground">Total Pembayaran:</p>
                <p className="font-mono text-xl font-bold text-primary">
                  Rp {activeOrder.total_payment?.toLocaleString('id-ID') || activeOrder.amount?.toLocaleString('id-ID')}
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-2.5">
              <button
                onClick={handleCheckOrder}
                disabled={orderChecking}
                className="btn-primary w-full justify-center gap-2"
              >
                {orderChecking ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Memeriksa Pembayaran...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4" />
                    <span>Saya Sudah Bayar</span>
                  </>
                )}
              </button>

              {activeOrder.checkout_url && (
                <a
                  href={activeOrder.checkout_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary w-full justify-center gap-2 text-xs"
                >
                  <span>Buka Halaman Checkout Pakasir</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
            </div>

            {orderMessage && (
              <p className="mt-3 text-center text-xs text-amber-400 font-medium">
                {orderMessage}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Riwayat Transaksi */}
      <div className="mt-14 border-t border-border pt-10">
        <h2 className="text-lg font-semibold text-foreground">Riwayat Pembayaran</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Daftar pesanan dan perpanjangan lisensi akun Anda.
        </p>

        {orders.length > 0 ? (
          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-background/50 text-muted-foreground">
                <tr>
                  <th className="py-3 px-4 font-mono">Invoice ID</th>
                  <th className="py-3 px-4">Paket</th>
                  <th className="py-3 px-4 font-mono">Total</th>
                  <th className="py-3 px-4">Metode</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">License Key</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border border-b border-border">
                {orders.map((o) => (
                  <tr key={o.order_id} className="hover:bg-panel/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-foreground">
                      {o.order_id}
                    </td>
                    <td className="py-3 px-4 capitalize">
                      {o.pkg} ({o.period})
                    </td>
                    <td className="py-3 px-4 font-mono">
                      Rp {o.total_payment?.toLocaleString('id-ID') || o.amount?.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3 px-4 uppercase text-muted-foreground font-mono">
                      {o.payment_method}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${
                          o.status === 'completed'
                            ? 'bg-success/20 text-success'
                            : o.status === 'pending'
                              ? 'bg-amber-500/20 text-amber-300'
                              : 'bg-panel text-muted-foreground'
                        }`}
                      >
                        {o.status === 'completed'
                          ? 'Lunas'
                          : o.status === 'pending'
                            ? 'Menunggu'
                            : o.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-muted-foreground">
                      {o.license_key || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="mt-6 rounded-[8px] border border-border bg-surface p-6 text-center text-sm text-muted-foreground">
            Belum ada riwayat transaksi.
          </div>
        )}
      </div>
    </div>
  )
}
