import React, { useState, useEffect } from 'react'
import { registerWithPassword, getStoredAuth } from '../../lib/auth'
import { ArrowRight, Loader2, Lock, Mail, User, AlertCircle, CheckCircle2 } from 'lucide-react'

export default function RegisterForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
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

    if (password !== passwordConfirm) {
      setError('Konfirmasi kata sandi tidak cocok.')
      return
    }

    if (password.length < 8) {
      setError('Kata sandi minimal 8 karakter.')
      return
    }

    setLoading(true)

    try {
      await registerWithPassword(name, email, password, passwordConfirm)
      window.location.href = '/dashboard'
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Gagal mendaftar. Silakan coba beberapa saat lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md rounded-[10px] border border-border bg-surface p-6 sm:p-8 shadow-xl">
      <div className="text-center">
        <p className="kicker">Daftar Baru</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
          Buat Akun Foto Space
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Satu akun untuk aktivasi trial, langganan lisensi, dan multi-perangkat.
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
          <label htmlFor="name" className="block text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Nama / Studio Foto
          </label>
          <div className="relative mt-1.5">
            <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Budi Santoso / Citra Studio"
              className="w-full rounded-[6px] border border-border bg-background py-2.5 pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

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
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimal 8 karakter"
              className="w-full rounded-[6px] border border-border bg-background py-2.5 pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        <div>
          <label htmlFor="passwordConfirm" className="block text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Konfirmasi Kata Sandi
          </label>
          <div className="relative mt-1.5">
            <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              id="passwordConfirm"
              type="password"
              required
              minLength={8}
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              placeholder="Ketik ulang kata sandi"
              className="w-full rounded-[6px] border border-border bg-background py-2.5 pl-10 pr-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        <div className="rounded-[6px] bg-background/50 p-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-3.5 w-3.5 text-success" />
            <span>Mendapatkan trial gratis 7 hari semua fitur</span>
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
              <span>Mendaftarkan...</span>
            </>
          ) : (
            <>
              <span>Daftar Akun</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      <div className="mt-6 border-t border-border pt-5 text-center text-sm text-muted-foreground">
        Sudah punya akun?{' '}
        <a href="/masuk" className="font-medium text-foreground underline decoration-border-strong underline-offset-4 hover:text-primary transition-colors">
          Masuk di sini
        </a>
      </div>
    </div>
  )
}
