/**
 * Konfigurasi site terpusat.
 */
export const SITE = {
  name: 'Foto Space',
  url: 'https://fotospace.online',
  description:
    'Foto Space adalah aplikasi desktop untuk fotografer event: upload batch foto & video ke FotoYu secara paralel, dengan Event Profile, dedup, dan antrean yang bisa dilanjutkan.',
  tagline: 'Upload ribuan foto event ke FotoYu, otomatis.',
}

/** API Backend (PocketBase & Worker). */
export const API = {
  pocketbase: 'https://license.pocketdb.fun',
  worker: 'https://api-license.pocketdb.fun',
}

/** Repo distribusi publik (GitHub Releases, akses tanpa token). */
export const RELEASES = {
  repo: 'Stromzzz/fotospace-releases',
  latestApi: 'https://api.github.com/repos/Stromzzz/fotospace-releases/releases/latest',
}
