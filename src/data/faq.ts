/** FAQ landing. Jawaban ditulis jujur sesuai kemampuan app saat ini. */
export interface FaqItem {
  q: string
  a: string
}

export const FAQ: FaqItem[] = [
  {
    q: 'Apakah Foto Space aman untuk akun FotoYu saya?',
    a: 'Foto Space login melalui API resmi FotoYu, jalur yang sama dengan login lewat browser. Kredensial disimpan di database lokal perangkat Anda dan hanya dipakai untuk berbicara dengan server FotoYu, tidak dikirim ke tempat lain.',
  },
  {
    q: 'Apa bedanya dengan upload manual dari website FotoYu?',
    a: 'Manual berarti memilih foto satu per satu, mengisi harga dan lokasi untuk tiap upload, dan menunggu di depan laptop. Foto Space bekerja sebaliknya: pilih folder sekali, seluruh isi diproses paralel, dan Anda bisa pergi mengerjakan hal lain.',
  },
  {
    q: 'Bagaimana kalau koneksi putus di tengah upload?',
    a: 'Antrean upload disimpan di database lokal. Saat koneksi kembali, pekerjaan lanjut dari titik terakhir, bukan dari nol. File yang sudah berhasil sampai ke FotoYu dikenali lewat cek MD5 sehingga tidak diunggah dua kali.',
  },
  {
    q: 'Laptop saya biasa saja, kuat menjalankan ini?',
    a: 'Kuat. Foto Space dibuat untuk laptop kerja fotografer, bukan server. Kompresi berjalan efisien dengan jumlah worker yang menyesuaikan kondisi mesin dan koneksi.',
  },
  {
    q: 'Bagaimana sistem lisensinya?',
    a: 'Tidak ada trial. Unduh aplikasinya, buat akun di website, lalu bayar paket Basic atau Pro. Kunci lisensi diaktivasi dari dalam app. Satu lisensi terikat ke perangkat, dan bisa dipindahkan lewat menu lisensi.',
  },
  {
    q: 'Jalan di sistem operasi apa?',
    a: 'Windows 10/11 (installer), macOS (Apple Silicon dan Intel), dan Linux (AppImage).',
  },
]
