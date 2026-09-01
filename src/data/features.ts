/**
 * Fitur Foto Space — klaim selaras dengan app (branch minimize-features).
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
      'Mulai dengan 4 worker, naik otomatis sampai 8 saat koneksi stabil, turun lagi saat server kewalahan. Jumlah worker menyesuaikan kondisi jaringan.',
    spec: '4–8 worker · adaptif',
  },
  {
    id: 'event-profile',
    num: '02',
    icon: 'file-archive',
    title: 'Event Profile & Galeri',
    description:
      'Simpan harga, lokasi, dan tag galeri per event. Saat upload, metadata terisi otomatis dari profil atau dari pengaturan Galeri & Harga default.',
    spec: 'harga · lokasi · tag',
  },
  {
    id: 'video',
    num: '03',
    icon: 'video',
    title: 'Video ikut tayang',
    description:
      'Video event diproses otomatis jadi pratinjau singkat untuk FotoYu (frame ZIP ≤2 MB). Tanpa render manual di aplikasi lain.',
    spec: 'pratinjau otomatis',
  },
  {
    id: 'resume',
    num: '04',
    icon: 'shield-check',
    title: 'Antrean aman & dedup',
    description:
      'Progress upload tersimpan di database lokal. Jika terputus, lanjutkan dari menu Riwayat. File yang sudah pernah sukses dikenali lewat cek MD5 sehingga tidak diunggah dua kali.',
    spec: 'resume · tanpa duplikat',
  },
  {
    id: 'laporan',
    num: '05',
    icon: 'file-text',
    title: 'Laporan CSV per job',
    description:
      'Setiap job upload bisa diekspor ke CSV: file sukses, gagal, dan ringkasan statistik. Berguna untuk cek ulang sebelum menyerahkan ke klien.',
    spec: 'ekspor CSV',
  },
  {
    id: 'multi-akun',
    num: '06',
    icon: 'users',
    title: 'Multi-akun FotoYu',
    description:
      'Kelola beberapa toko FotoYu dari satu aplikasi. Ganti akun aktif tinggal klik, tanpa logout-login berulang di browser.',
    spec: 'beberapa toko',
  },
]
