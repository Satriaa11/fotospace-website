import { useEffect, useState } from 'react'
import { Moon, Sun } from 'lucide-react'
import { applyTheme, resolveTheme, toggleTheme, type Theme } from '../lib/theme'

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('light')
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const current = resolveTheme()
    applyTheme(current)
    setTheme(current)
    setReady(true)
  }, [])

  const onToggle = () => {
    setTheme(toggleTheme())
  }

  return (
    <button
      type="button"
      onClick={onToggle}
      className="nav-link inline-flex h-9 w-9 items-center justify-center p-0"
      aria-label={theme === 'dark' ? 'Aktifkan mode terang' : 'Aktifkan mode gelap'}
      title={theme === 'dark' ? 'Mode terang' : 'Mode gelap'}
    >
      {ready && theme === 'dark' ? (
        <Sun className="h-4 w-4" aria-hidden="true" />
      ) : (
        <Moon className="h-4 w-4" aria-hidden="true" />
      )}
    </button>
  )
}
