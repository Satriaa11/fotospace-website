import { useEffect, useMemo, useState } from 'react'
import { Apple, AppWindow, Download, Loader2, Monitor } from 'lucide-react'
import {
  fetchLatestReleaseLive,
  formatBytes,
  formatDate,
  groupInstallers,
  type InstallerAsset,
  type InstallerPlatform,
  type Release,
} from '../lib/releases'

interface Props {
  initialRelease: Release | null
}

const PLATFORMS: {
  id: InstallerPlatform
  title: string
  hint: string
  Icon: typeof Monitor
}[] = [
  {
    id: 'windows',
    title: 'Windows',
    hint: 'Installer .exe untuk Windows 10 dan 11.',
    Icon: Monitor,
  },
  {
    id: 'macos',
    title: 'macOS',
    hint: 'Pilih Apple Silicon (M1–M4) atau Intel.',
    Icon: Apple,
  },
  {
    id: 'linux',
    title: 'Linux',
    hint: 'AppImage, jalankan tanpa instalasi.',
    Icon: AppWindow,
  },
]

function detectPreferred(): InstallerPlatform | null {
  if (typeof navigator === 'undefined') return null
  const ua = navigator.userAgent
  if (/Windows/i.test(ua)) return 'windows'
  if (/Mac OS X|Macintosh/i.test(ua)) return 'macos'
  if (/Linux/i.test(ua) && !/Android/i.test(ua)) return 'linux'
  return null
}

function AssetButton({ asset, primary }: { asset: InstallerAsset; primary?: boolean }) {
  return (
    <a
      className={primary ? 'btn-primary w-full' : 'btn-secondary w-full'}
      href={asset.browser_download_url}
    >
      <Download className="h-4 w-4" aria-hidden="true" />
      <span className="truncate">{asset.label}</span>
      <span className="ml-auto shrink-0 font-mono text-xs opacity-80">
        {formatBytes(asset.size)}
      </span>
    </a>
  )
}

export default function DownloadView({ initialRelease }: Props) {
  const [release, setRelease] = useState<Release | null>(initialRelease)
  const [loading, setLoading] = useState(!initialRelease)
  const [preferred, setPreferred] = useState<InstallerPlatform | null>(null)

  useEffect(() => {
    setPreferred(detectPreferred())
    let cancelled = false
    fetchLatestReleaseLive().then((latest) => {
      if (cancelled) return
      if (latest) setRelease(latest)
      setLoading(false)
    })
    return () => {
      cancelled = true
    }
  }, [])

  const groups = useMemo(
    () => groupInstallers(release?.assets ?? []),
    [release],
  )

  if (loading && !release) {
    return (
      <div className="mt-10 flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        Mengambil rilis terbaru…
      </div>
    )
  }

  if (!release) {
    return (
      <div className="mt-10 max-w-xl rounded-[10px] border border-border bg-surface p-6">
        <p className="text-sm leading-[1.65] text-muted-foreground">
          Daftar unduhan sedang tidak bisa diambil. Coba muat ulang halaman ini beberapa saat lagi.
        </p>
      </div>
    )
  }

  return (
    <div className="mt-10">
      <p className="text-sm text-muted-foreground">
        Versi <span className="font-mono text-foreground">{release.tag_name}</span>
        {' · '}
        rilis {formatDate(release.published_at)}.
      </p>

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        {PLATFORMS.map(({ id, title, hint, Icon }) => {
          const assets = groups[id]
          const recommended = preferred === id
          return (
            <article
              key={id}
              className={`flex flex-col rounded-[10px] border p-6 ${
                recommended ? 'border-border-strong bg-surface' : 'border-border bg-background'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  <h2 className="text-sm font-semibold">{title}</h2>
                </div>
                {recommended && <span className="badge font-mono text-xs">Untuk perangkat ini</span>}
              </div>
              <p className="mt-3 text-[13px] leading-[1.55] text-muted-foreground">{hint}</p>
              <div className="mt-5 flex flex-col gap-2">
                {assets.length > 0 ? (
                  assets.map((asset, index) => (
                    <AssetButton key={asset.name} asset={asset} primary={index === 0} />
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">Belum ada file untuk platform ini.</p>
                )}
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}
