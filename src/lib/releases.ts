/**
 * Fetch rilis dari repo distribusi publik (tanpa token, sesuai PLAN).
 * Dipakai saat build statis oleh /unduh dan /changelog.
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

const HEADERS = {
  'User-Agent': 'fotospace-website',
  Accept: 'application/vnd.github+json',
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
