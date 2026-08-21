# Product

## Register

brand

## Users

Fotografer event Indonesia (wedding, wisuda, konser, olahraga) yang menjual foto lewat FotoYu. Mayoritas solo atau studio kecil, tidak terlalu teknis, dan bekerja berpacu waktu: begitu event selesai, ribuan foto harus segera tayang supaya klien bisa membeli. Konteks pemakaian: laptop di lokasi atau sesudah event, sering dengan koneksi tidak stabil; pertama kali mengenal produk dari link yang dibagikan via WhatsApp, jadi mobile-first penting.

## Product Purpose

Foto Space adalah aplikasi desktop yang mengotomatiskan upload foto & video ke FotoYu secara batch: paralel adaptif (mulai 4 worker, naik otomatis hingga 8 sesuai kondisi koneksi), kompresi cerdas, resume anti-gagal, laporan CSV/PDF, multi-akun. Website ini berperan tiga: (1) mengonversi fotografer pengunjung menjadi downloader, (2) membangun kepercayaan SEBELUM mereka menyerahkan kredensial akun FotoYu ke aplikasi, (3) menjadi pusat distribusi (download + changelog) dan dokumentasi (panduan). Sukses = pengunjung mengunduh, mengaktifkan lisensi, dan merekomendasikan ke sesama fotografer.

## Brand Personality

Cepat, andal, profesional. Suara: singkat, berbasis bukti (angka nyata, spesifikasi nyata), tanpa hype dan tanpa basa-basi. Bahasa Indonesia langsung, tanpa jargon teknis berlebihan. Emosi yang dibangun: percaya dan yakin, bahwa ini alat serius yang aman dipercaya memegang akun dan ribuan file mereka.

## Anti-references

- Template SaaS generik: hero gradient ungu-biru, tiga kartu fitur identik berjejer, emoji berlebihan, testimonial yang terasa palsu
- AI slop klasik: gradient text, glassmorphism dekoratif, badge "AI-powered", glow neon berlebihan
- Startup hype / crypto style: klaim bombastis, dark-neon menyala, urgency palsu
- Terlalu ramai: semua elemen beranimasi sekaligus, scroll-jacking, parallax berlebihan
- Tolok ukur kualitas yang DITIRU (bukan ditiru mentah): restraint dan polish Linear, Stripe, Cursor

## Design Principles

1. **Bukti di atas janji**: screenshot app asli, angka nyata (jumlah worker, target kompresi, versi rilis), link changelog. Tidak ada klaim tanpa bukti.
2. **Kepercayaan sebelum unduhan**: pengunjung akan menyerahkan akun FotoYu mereka; desain dan copy harus terasa seperti alat yang dirawat, transparan, dan aman.
3. **Satu pesan per layar**: satu aksi utama (Unduh), informasi lain mendukung; tidak ada elemen yang berebut perhatian.
4. **Restraint dalam motion**: animasi hanya kalau memperjelas cara kerja; ease-out eksponensial, tanpa bounce, hormati reduced motion.
5. **Bahasa yang menghormati pembaca**: kalimat pendek, heading tidak mengulang subjudul, tanpa em dash, tanpa jargon tanpa penjelasan.

## Accessibility & Inclusion

- Target WCAG 2.1 AA: kontras teks minimal 4.5:1, focus visible, navigasi keyboard penuh
- Hormati `prefers-reduced-motion`: semua animasi non-esensial mati
- Mobile-first: banyak fotografer membuka link pertama kali dari ponsel
