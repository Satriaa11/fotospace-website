/**
 * Konfigurasi site terpusat.
 * TODO(M5): ganti SITE.url dengan domain final, lalu update canonical/OG & robots.txt.
 */
export const SITE = {
  name: 'Foto Space',
  url: 'https://fotospace-website.pages.dev',
  description:
    'Foto Space adalah aplikasi desktop untuk fotografer event: upload ribuan foto & video ke FotoYu secara otomatis — batch, kompresi cerdas, paralel, dan anti-gagal.',
  tagline: 'Upload ribuan foto event ke FotoYu, otomatis.',
}

/** Repo distribusi publik (GitHub Releases, akses tanpa token). */
export const RELEASES = {
  repo: 'Stromzzz/fotospace-releases',
  latestApi: 'https://api.github.com/repos/Stromzzz/fotospace-releases/releases/latest',
}
