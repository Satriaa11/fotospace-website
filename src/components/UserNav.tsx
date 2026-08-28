import { useState, useEffect } from 'react'
import { getStoredAuth, type AuthState } from '../lib/auth'
import { LayoutDashboard } from 'lucide-react'
export default function UserNav() {
  const [auth, setAuth] = useState<AuthState | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setAuth(getStoredAuth())
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="flex items-center gap-2">
        <a className="nav-link text-xs sm:text-sm" href="/masuk">
          Masuk
        </a>
        <a className="btn-primary ml-1 text-xs sm:text-sm" href="/unduh">
          Unduh
        </a>
      </div>
    )
  }

  if (auth?.token) {
    return (
      <div className="flex items-center gap-2">
        <a
          href="/dashboard"
          className="btn-primary ml-1 gap-1.5 text-xs sm:text-sm"
        >
          <LayoutDashboard className="h-3.5 w-3.5" />
          <span>Dashboard</span>
        </a>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-1.5 sm:gap-2">
      <a className="nav-link text-xs sm:text-sm" href="/masuk">
        Masuk
      </a>
      <a className="btn-primary ml-1 text-xs sm:text-sm" href="/unduh">
        Unduh
      </a>
    </div>
  )
}
