/**
 * Fitur Foto Space. Semua klaim berbasis kode app (automate-fotoyu):
 * - parallelUploads default 4, maxParallelUploads 8 (settings.ts)
 * - kompresi target ~200 KB, max 1440px, file <600 KB quality 92 (compress.ts)
 * - video: trim ≤4 dtk → frame zip ≤2 MB (video-prepare.ts)
 * - antrean SQLite + dedup MD5 (database.ts, dedup.ts)
 */
export interface Feature {
  id: string
  num: string
  icon: 'zap' | 'file-archive' | 'video' | 'shield-check' | 'file-text' | 'users'
  title: string
  description: string
  spec: string
}

export const FEATURES: Feature[] = [
  {
    id: 'paralel',
    num: '01',
    icon: 'zap',
    title: 'Upload paralel adaptif',
    description:
      'Mulai dengan 4 worker, naik otomatis sampai 8 saat koneksi stabil, turun lagi saat server kewalahan. App yang menyesuaikan, bukan Anda.',
    spec: '4–8 worker · adaptif',
  },
  {
    id: 'kompresi',
    num: '02',
    icon: 'file-archive',
    title: 'Kompresi cerdas',
    description:
      'Foto besar dipangkas ke sekitar 200 KB dengan kualitas tetap layak jual. File kecil yang sudah tajam tidak ikut dikorbankan.',
    spec: 'target ≤200 KB · maks 1440px',
  },
  {
    id: 'video',
    num: '03',
    icon: 'video',
    title: 'Video ikut tayang',
    description:
      'Video event diproses otomatis menjadi pratinjau singkat di FotoYu. Tanpa render manual, tanpa aplikasi tambahan.',
    spec: 'pratinjau otomatis',
  },
  {
    id: 'resume',
    num: '04',
    icon: 'shield-check',
    title: 'Resume anti-gagal',
    description:
      'Koneksi putus, laptop sleep, atau app tertutup: antrean tersimpan di database lokal dan lanjut dari titik terakhir. File yang sudah sampai tidak diunggah ulang.',
    spec: 'lanjut otomatis · tanpa duplikat',
  },
  {
    id: 'laporan',
    num: '05',
    icon: 'file-text',
    title: 'Laporan CSV & PDF',
    description:
      'Setiap job bisa diekspor: file mana yang sukses, yang gagal, dan estimasi pendapatan. Siap diteruskan ke klien.',
    spec: 'ekspor per job',
  },
  {
    id: 'multi-akun',
    num: '06',
    icon: 'users',
    title: 'Multi-akun FotoYu',
    description:
      'Kelola beberapa toko sekaligus dari satu app. Ganti akun tinggal klik, tanpa logout-login berulang.',
    spec: 'tanpa logout-login',
  },
]
