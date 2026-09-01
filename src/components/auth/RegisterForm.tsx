import { useState, useEffect, type SyntheticEvent } from 'react'
import {
  registerWithPassword,
  getStoredAuth,
  initiateGoogleLogin,
  handleOAuth2Callback,
} from '../../lib/auth'
import { ArrowRight, Loader2, Lock, Mail, User, AlertCircle, CheckCircle2 } from 'lucide-react'

export default function RegisterForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // 1. Cek apakah ada callback OAuth2 dari Google
    const checkOAuth = async () => {
      try {
        const auth = await handleOAuth2Callback()
        if (auth?.token) {
          window.location.href = '/dashboard'
          return
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Gagal menyelesaikan login Google.')
      }

      // 2. Cek sesi lokal
      const stored = getStoredAuth()
      if (stored?.token) {
        window.location.href = '/dashboard'
      }
    }

    checkOAuth()
  }, [])

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
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

  const handleGoogleLogin = async () => {
    setError(null)
    setGoogleLoading(true)

    try {
      await initiateGoogleLogin()
      window.location.href = '/dashboard'
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Gagal membuka login Google.')
      setGoogleLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md rounded-[10px] border border-border bg-surface p-6 sm:p-8 shadow-xl">
      <div className="text-center">
        <p className="kicker">Akun Foto Space</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
          Register Akun Baru
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Satu akun untuk beli lisensi, aktivasi aplikasi, dan multi-perangkat.
        </p>
      </div>

      {error && (
        <div className="mt-6 flex items-start gap-2.5 rounded-[6px] border border-primary/35 bg-primary/10 p-3 text-sm text-foreground">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          <span>{error}</span>
        </div>
      )}

      {/* Tombol Google OAuth */}
      <div className="mt-6">
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={googleLoading || loading}
          className="flex w-full items-center justify-center gap-3 rounded-[6px] border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-border-strong hover:bg-panel disabled:opacity-50"
        >
          {googleLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <svg className="h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
          )}
          <span>Daftar dengan Google</span>
        </button>
      </div>

      <div className="relative my-6 text-center text-xs text-muted-foreground">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border"></div>
        </div>
        <span className="relative bg-surface px-3 uppercase tracking-wider text-muted-foreground/80">
          atau dengan email
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
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
            <span>Tidak ada trial — aktivasi lisensi setelah pembayaran</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || googleLoading}
          className="btn-primary mt-2 w-full justify-center disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Mendaftarkan...</span>
            </>
          ) : (
            <>
              <span>Register Akun</span>
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      <div className="mt-6 border-t border-border pt-5 text-center text-sm text-muted-foreground">
        Sudah punya akun?{' '}
        <a href="/login" className="font-medium text-foreground underline decoration-border-strong underline-offset-4 hover:text-primary transition-colors">
          Login di sini
        </a>
      </div>
    </div>
  )
}
