import React, { useState, useEffect } from 'react'
import { loginWithPassword, getStoredAuth } from '../../lib/auth'
import { ArrowRight, Loader2, Lock, Mail, AlertCircle } from 'lucide-react'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const auth = getStoredAuth()
    if (auth?.token) {
      window.location.href = '/dashboard'
    }
  }, [])

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      await loginWithPassword(email, password)
      window.location.href = '/dashboard'
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Gagal masuk. Periksa kembali email dan kata sandi Anda.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md rounded-[10px] border border-border bg-surface p-6 sm:p-8 shadow-xl">
      <div className="text-center">
        <p className="kicker">Akun Foto Space</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
          Masuk ke Dashboard
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Kelola lisensi, perpanjang masa aktif, dan salin key aktivasi aplikasi Anda.
        </p>
      </div>

      {error && (
        <div className="mt-6 flex items-start gap-2.5 rounded-[6px] border border-red-500/40 bg-red-950/30 p-3 text-sm text-red-300">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label htmlFor="email" className="block text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Email
          </label>
          <div className="relative mt-1.5">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
              className="w-full rounded-[6px] border border-border bg-background py-2.5 pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Kata Sandi
          </label>
          <div className="relative mt-1.5">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-[6px] border border-border bg-background py-2.5 pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary mt-2 w-full justify-center disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Memproses...</span>
            </>
          ) : (
            <>
              <span>Masuk Sekarang</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      <div className="mt-6 border-t border-border pt-5 text-center text-sm text-muted-foreground">
        Belum punya akun?{' '}
        <a href="/daftar" className="font-medium text-foreground underline decoration-border-strong underline-offset-4 hover:text-primary transition-colors">
          Daftar sekarang
        </a>
      </div>
    </div>
  )
}
