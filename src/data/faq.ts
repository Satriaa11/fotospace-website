/** FAQ landing. Jawaban ditulis jujur sesuai kemampuan app saat ini. */
export interface FaqItem {
  q: string
  a: string
}

export const FAQ: FaqItem[] = [
  {
    q: 'Apakah Foto Space aman untuk akun FotoYu saya?',
    a: 'Foto Space login melalui API resmi FotoYu, jalur yang sama dengan login lewat browser. Token sesi disimpan terenkripsi di perangkat Anda (bukan di cloud kami) dan hanya dipakai untuk berkomunikasi dengan server FotoYu.',
  },
  {
    q: 'Apa bedanya dengan upload manual dari website FotoYu?',
    a: 'Manual berarti memilih foto satu per satu dan mengisi metadata berulang. Foto Space bekerja sebaliknya: pilih folder sekali, app memindai isinya, lalu mengunggah paralel sambil mengisi harga dan lokasi dari profil event atau Galeri & Harga.',
  },
  {
    q: 'Bagaimana kalau koneksi putus di tengah upload?',
    a: 'Antrean upload tersimpan di database lokal. Setelah koneksi kembali, buka menu Riwayat dan lanjutkan job yang terputus. File yang sudah sukses tidak diunggah ulang berkat cek MD5 per akun.',
  },
  {
    q: 'Laptop saya biasa saja, kuat menjalankan ini?',
    a: 'Ya. Foto Space dibuat untuk laptop kerja fotografer. Jumlah worker upload menyesuaikan kondisi mesin dan koneksi. Kompresi foto bersifat opsional di Pengaturan.',
  },
  {
    q: 'Bagaimana sistem lisensinya?',
    a: 'Tidak ada trial. Unduh aplikasi, buat akun di website, bayar paket Basic atau Pro, salin kunci lisensi dari dashboard, lalu tempel di layar aktivasi saat pertama buka app (atau lewat Pengaturan). Satu lisensi terikat per perangkat; bisa dicabut lewat Pengaturan untuk pindah ke mesin lain.',
  },
  {
    q: 'Jalan di sistem operasi apa?',
    a: 'Windows 10/11 (installer), macOS Apple Silicon dan Intel (.dmg), serta Linux (AppImage).',
  },
]
