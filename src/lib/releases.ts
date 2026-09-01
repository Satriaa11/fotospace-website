/**
 * Fetch rilis dari repo distribusi publik (tanpa token).
 * Halaman /unduh memuat ulang dari GitHub di browser supaya rilis baru
 * muncul tanpa rebuild website.
 */
import { RELEASES } from '../config'

export interface ReleaseAsset {
  name: string
  size: number
  download_count: number
  browser_download_url: string
}

export interface Release {
  tag_name: string
  name: string
  published_at: string
  body: string
  html_url: string
  assets: ReleaseAsset[]
}

export type InstallerPlatform = 'windows' | 'macos' | 'linux'
export type CpuArch = 'x64' | 'arm64'

export interface InstallerAsset extends ReleaseAsset {
  platform: InstallerPlatform
  arch: CpuArch
  label: string
}

const HEADERS = {
  'User-Agent': 'fotospace-website',
  Accept: 'application/vnd.github+json',
}

const INSTALLER_EXT = /\.(exe|msi|appimage|deb|rpm|dmg|pkg)$/i
const SKIP_NAME = /\.(ya?ml|blockmap|zip|nupkg|sha256|sha512|txt|json)$/i

export function isInstallerAsset(name: string): boolean {
  const n = name.toLowerCase()
  if (n.includes('.blockmap')) return false
  if (SKIP_NAME.test(n)) return false
  return INSTALLER_EXT.test(n)
}

function detectArch(name: string): CpuArch {
  const n = name.toLowerCase()
  if (n.includes('arm64') || n.includes('aarch64') || n.includes('apple-silicon')) {
    return 'arm64'
  }
  return 'x64'
}

export function classifyInstaller(asset: ReleaseAsset): InstallerAsset | null {
  if (!isInstallerAsset(asset.name)) return null
  const n = asset.name.toLowerCase()

  let platform: InstallerPlatform
  if (n.endsWith('.exe') || n.endsWith('.msi')) platform = 'windows'
  else if (n.endsWith('.appimage') || n.endsWith('.deb') || n.endsWith('.rpm')) platform = 'linux'
  else if (n.endsWith('.dmg') || n.endsWith('.pkg')) platform = 'macos'
  else return null

  const arch = detectArch(n)
  return {
    ...asset,
    platform,
    arch,
    label: installerLabel(platform, arch, n),
  }
}

function installerLabel(platform: InstallerPlatform, arch: CpuArch, name: string): string {
  if (platform === 'windows') return 'Windows 10/11'
  if (platform === 'linux') {
    if (name.endsWith('.deb')) return 'Linux (Debian/Ubuntu)'
    if (name.endsWith('.rpm')) return 'Linux (Fedora/RHEL)'
    return 'Linux (AppImage)'
  }
  if (arch === 'arm64') return 'macOS Apple Silicon (M1–M4)'
  return 'macOS Intel'
}

export function groupInstallers(
  assets: ReleaseAsset[],
): Record<InstallerPlatform, InstallerAsset[]> {
  const groups: Record<InstallerPlatform, InstallerAsset[]> = {
    windows: [],
    macos: [],
    linux: [],
  }
  for (const asset of assets) {
    const classified = classifyInstaller(asset)
    if (!classified) continue
    groups[classified.platform].push(classified)
  }
  for (const key of Object.keys(groups) as InstallerPlatform[]) {
    groups[key].sort((a, b) => a.arch.localeCompare(b.arch))
  }
  return groups
}

export async function fetchLatestRelease(): Promise<Release | null> {
  try {
    const res = await fetch(RELEASES.latestApi, { headers: HEADERS })
    if (!res.ok) return null
    return (await res.json()) as Release
  } catch {
    return null
  }
}

/** Dipakai di browser: selalu ambil rilis GitHub terbaru, tanpa cache build. */
export async function fetchLatestReleaseLive(): Promise<Release | null> {
  try {
    const res = await fetch(RELEASES.latestApi, {
      headers: { Accept: 'application/vnd.github+json' },
      cache: 'no-store',
    })
    if (!res.ok) return null
    return (await res.json()) as Release
  } catch {
    return null
  }
}

export async function fetchReleases(perPage = 10): Promise<Release[]> {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${RELEASES.repo}/releases?per_page=${perPage}`,
      { headers: HEADERS },
    )
    if (!res.ok) return []
    return (await res.json()) as Release[]
  } catch {
    return []
  }
}

export function formatBytes(bytes: number): string {
  if (bytes >= 1024 ** 3) return `${(bytes / 1024 ** 3).toFixed(1)} GB`
  if (bytes >= 1024 ** 2) return `${(bytes / 1024 ** 2).toFixed(0)} MB`
  return `${(bytes / 1024).toFixed(0)} KB`
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

/** Markdown rilis GitHub → teks polos ringan (tanpa library, tanpa HTML injeksi). */
export function formatReleaseBody(md: string): string {
  return md
    .replace(/`/g, '')
    .replace(/\*\*/g, '')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/^\s*[-*]\s+/gm, '• ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .trim()
}
