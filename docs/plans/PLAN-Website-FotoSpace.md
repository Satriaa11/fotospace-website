# PLAN — Website Promosi Foto Space

> **Status:** Rencana — siap eksekusi (repo `fotospace-website`, deploy Cloudflare Pages)
> **Tujuan:** Landing page ringan (Astro) yang SEO-friendly, meyakinkan fotografer event untuk download Foto Space, dan menjadi pusat distribusi + dokumentasi.

---

## 1. Riset: "Gambar Bergerak" ala Cursor / Linear / Isometricon

Hasil inspeksi langsung ke HTML ketiga situs (2026-08-21):

| Situs | Framework | Teknik visual utama | Bukti di HTML |
|---|---|---|---|
| **cursor.com** | Next.js + React | **Video `.webm` loop senyap** + gradient/glow CSS animasi; koreografi scroll custom | tag `<video>` webm, Next.js |
| **linear.app** | Next.js + Motion | **Video demo produk (webm)** yang play mengikuti scroll + **sprite sheet** + Motion untuk transisi; sebagian efek via canvas/WebGL | `webm`, `Sprite`, `motion` |
| **isometricon.com** | Next.js + Motion | **Ilustrasi PNG isometrik statis** (hosted di CDN mereka) — "hidup" dari transisi hover/scroll Motion, bukan gambarnya yang animasi | ratusan `_next/image` PNG + `motion` |

**Kesimpulan:** hampir semua "gambar bergerak" di situs-situs itu sebenarnya adalah:
1. **Video loop senyap** (webm/mp4) — rekaman layar atau render, PALING umum & paling murah dibuat
2. **Koreografi scroll** (Motion/GSAP) — elemen muncul/geser saat scroll
3. **CSS animasi** — gradient glow, shimmer, marquee
4. Yang benar-benar 3D/vektor interaktif (Spline/Three.js/Rive) hanya sebagian kecil, dan berat.

### Opsi teknologi animasi (dari termurah)

| Teknik | Alat buat | Runtime | Kapan pakai |
|---|---|---|---|
| CSS animasi | tangan | 0 KB | gradient hero, glow, hover |
| Scroll reveal | `motion` (island React) | ~18 KB | section muncul saat scroll |
| **Video loop (Remotion)** ⭐ | komposisi React di `videos/` → `npx remotion render` → `.webm` | 0 JS, ~1–3 MB video | **utama**: animasi hero & section fitur (mock UI app, loop sempurna, revisi = edit kode) |
| Video loop (rekaman layar) | OBS → `ffmpeg -c:v libvpx-vp9` | 0 JS | `/panduan`: demo alur nyata (dirapikan CapCut/Descript AI) |
| Rive | editor rive.app (gratis) + `@rive-app/react-canvas` | ~60–100 KB | ilustrasi vektor interaktif (fase lanjut) |
| Lottie | After Effects → bodymovin | ~250 KB | animasi vektor satu arah |
| Spline / Three.js | spline.design / react-three-fiber | berat (≥300 KB) | hero 3D — **hindari dulu** (merusak budget Lighthouse) |

### Keputusan untuk Foto Space (bertahap)

- **Diputuskan (2026-08-21): Remotion** sebagai alat produksi video animasi website — komposisi React di folder `videos/`, hasil di-render ke `.webm` dan dipakai sebagai `<video>` statis di halaman (bukan `@remotion/player`, demi budget JS). Gratis untuk skala bisnis ini; editing animasi bisa dibantu AI karena berupa kode.
- **MVP (M1–M4):** animasi Remotion mock UI Foto Space di hero (jendela app → foto masuk → progress → sukses → loop) + screenshot app asli di section cara kerja + scroll reveal Motion + gradient CSS.
- **`/panduan`:** rekaman layar asli (OBS) yang dirapikan dengan editor AI (CapCut/Descript: auto-cut diam, zoom ke kursor).
- **Nanti (opsional):** background loop sinematik dari AI generatif video (Veo/Runway/Kling) — hanya untuk visual abstrak, BUKAN untuk UI produk (AI generatif masih merusak teks/UI).
- **Tidak dipakai saat ini:** Three.js/Spline/Lottie, `@remotion/player` di halaman.

## 2. Stack (detail di `AGENTS.md`)

Astro 7 (static) · React islands · Tailwind v4 · Inter self-hosted · Motion · lucide-react · `@astrojs/sitemap` · npm · Cloudflare Pages · **Remotion** (produksi video, folder `videos/`).

## 3. Struktur Halaman

```
/                   Landing
/unduh              Download (deteksi OS + versi terbaru dari GitHub API)
/panduan            Panduan singkat pakai app (SEO long-tail)
/changelog          Riwayat rilis (dari release notes)
/kebijakan-privasi  Wajib (app mengumpulkan feedback + kontak)
/lisensi            Ketentuan lisensi Trial/Basic/Pro
404.astro           Halaman tidak ditemukan
```

### Section landing (`/`)

1. **Hero** — headline hasil ("Upload ribuan foto event ke FotoYu, otomatis"), subheadline, CTA "Download Gratis" + "Lihat Cara Kerja", visual: video demo/screenshot dalam frame laptop + gradient glow
2. **Masalah** — pain point fotografer event (upload manual berjam-jam, file besar, gagal di tengah jalan)
3. **Solusi / Fitur** — 6 kartu: batch upload paralel adaptif (4–8 worker), kompresi otomatis ≤200KB, upload video, resume anti-gagal, laporan CSV/PDF, multi-akun
4. **Cara Kerja** — 3 langkah: pilih folder → pilih event → klik upload (dengan screenshot tiap langkah)
5. **Harga** — 3 tier sesuai lisensi app: Trial / Basic / Pro (sinkron dengan tier lisensi)
6. **FAQ** — 6–8 pertanyaan (aman? perlu internet? beda dengan upload manual? lisensi berapa perangkat?) + JSON-LD FAQPage
7. **CTA akhir + Footer** — download ulang, link panduan, privasi, lisensi

## 4. Integrasi Halaman `/unduh`

- **Build-time:** fetch `https://api.github.com/repos/Stromzzz/fotospace-releases/releases/latest` di frontmatter → render nama versi + link aset statis (SEO dapat)
- **Client enhancement (island):** cek ulang versi saat halaman dibuka (cache singkat), update tombol bila ada versi lebih baru
- **Deteksi OS (island):** `navigator.userAgent` → tombol utama otomatis: Windows → `setup.zip`, macOS Intel/ARM → DMG, Linux → AppImage; tampilkan semua platform di bawahnya
- **Fallback:** bila API gagal saat build, pakai versi hardcoded terakhir + banner "lihat semua rilis di GitHub"

## 5. SEO Plan

- **JSON-LD:** `SoftwareApplication` (landing), `FAQPage` (FAQ), `BreadcrumbList`
- **Kata kunci utama (ID):** "aplikasi upload foto otomatis", "upload fotoyu otomatis", "aplikasi fotografer event", "cara jual foto event online", "upload foto batch"
- Meta title/description unik per halaman; OG image 1200×630 per halaman (template di `src/assets/og/`)
- `sitemap.xml` + `robots.txt`; canonical & OG base URL dari `src/config.ts` (diisi saat domain final)
- Konten panduan ditulis natural menjawab query long-tail (jangan keyword stuffing)

## 6. Struktur File Target

```
fotospace-website/
├── AGENTS.md
├── docs/plans/PLAN-Website-FotoSpace.md
├── public/
│   ├── robots.txt
│   ├── favicon.svg
│   └── demo/               # hasil render Remotion (.webm) — di-commit
├── src/
│   ├── config.ts           # SITE.url, SITE.name, GitHub repo releases
│   ├── layouts/Base.astro  # head SEO + OG + JSON-LD slot + header/footer
│   ├── pages/
│   │   ├── index.astro
│   │   ├── unduh.astro
│   │   ├── panduan.astro
│   │   ├── changelog.astro
│   │   ├── kebijakan-privasi.astro
│   │   ├── lisensi.astro
│   │   └── 404.astro
│   ├── components/
│   │   ├── ui/             # Button, Badge, SectionHeading, Card
│   │   ├── Header.astro / Footer.astro
│   │   ├── Hero.astro
│   │   ├── Features.astro / HowItWorks.astro / Pricing.astro
│   │   ├── Faq.astro
│   │   └── islands/        # DownloadDetector.tsx, FaqAccordion.tsx, VersionBadge.tsx
│   ├── data/               # features.ts, faq.ts, pricing.ts, changelog fallback
│   ├── assets/             # logo, screenshots, og templates
│   └── styles/global.css   # Tailwind v4 @theme tokens
├── videos/                 # studio Remotion (package npm terpisah)
│   ├── src/compositions/   # HeroDemo.tsx, FeatureLoops.tsx (mock UI app)
│   ├── src/Root.tsx
│   └── package.json        # remotion, @remotion/cli, react
└── astro.config.mjs        # react, sitemap, site
```

## 7. Milestones

### M0 — Scaffold ✅ selesai 2026-08-21
- [x] `npm create astro@latest` (Astro 7.2) + integrasi React 19, Tailwind v4, sitemap
- [x] `AGENTS.md` ✅ + dokumen ini ✅
- [x] `src/config.ts`, Base layout, Header/Footer, global.css tokens (Inter, warna)
- [x] Repo git init + push publik; Cloudflare Pages deploy pertama
- [x] Init package `videos/` (Remotion) + render test `hero-placeholder.webm`

**Hasil M0:**
- Repo: `github.com/Satriaa11/fotospace-website` (publik)
- Live: `https://fotospace-website.pages.dev`
- Build/check/lint bersih; render Remotion end-to-end OK (webm 122 KB)

### M1 — Landing tanpa animasi ✅ selesai 2026-08-22
- [x] Semua section landing: Hero (mock jendela app markup, bukan screenshot), Masalah (bon upload manual), Fitur (ledger 6 baris bernomor), Cara Kerja (3 langkah), Harga (3 tier dari PRD), FAQ (details/summary tanpa JS), CTA
- [x] Data features/faq/pricing di `src/data/` — klaim berbasis kode app (worker 4–8 adaptif, kompresi ≤200 KB, resume MD5)
- [x] Meta + JSON-LD SoftwareApplication + FAQPage
- [x] Desain sesuai PRODUCT.md + DESIGN.md ("Safelight Darkroom"); token global.css disinkron

**Hasil M1:**
- Landing 7 section + 3 halaman (`/unduh`, `/changelog`, `/panduan`) dibangun build-time fetch GitHub API, tanpa dead-link di nav
- `astro check` 0/0/0, ESLint bersih, semua rute 200
- Sisa: island deteksi OS di `/unduh` (bagian M2), panduan lengkap (M3)

### M2 — Halaman distribusi (½ hari)
- [x] `/unduh` + integrasi GitHub API latest release (fallback ke halaman rilis GitHub)
- [x] `/changelog` dari release notes (formatter markdown ringan)
- [ ] Island deteksi OS di `/unduh`

### M3 — Konten pendukung (½–1 hari)
- [ ] `/panduan` (ditulis bersama user — butuh input alur app)
- [ ] `/kebijakan-privasi` + `/lisensi` (draft awal, direview user)
- [ ] Halaman 404

### M4 — Visual & animasi (1–2 hari, butuh screenshot user)
- [ ] User deliver: screenshot app (Dashboard/Upload/Riwayat) — bahan referensi mock UI & section cara kerja
- [ ] Komposisi Remotion `HeroDemo` (±12 dtk, loop sempurna): jendela Foto Space → foto masuk grid → progress bar & counter upload naik → sukses checkmark → loop; render VP9 → `public/demo/hero.webm` (target ≤2 MB)
- [ ] Frame laptop + `<video>` webm + poster di hero; pasang di landing
- [ ] Scroll reveal Motion di island (`client:visible`)
- [ ] OG image per halaman; audit Lighthouse ≥95

### M5 — Rilis (½ hari)
- [ ] Set domain final → canonical/OG base
- [ ] Verifikasi: sitemap, robots, OG preview (opengraph.xyz), Lighthouse final
- [ ] Umbar link ke user testing

## 8. Aset yang Dibutuhkan dari User

| Aset | Format | Dipakai di |
|---|---|---|
| Screenshot Dashboard, Upload, Riwayat | PNG (resolusi asli) | referensi komposisi Remotion, cara kerja, fitur |
| Rekaman layar alur pakai app (nanti) | mp4, ±1–3 menit | `/panduan` (dirapikan CapCut/Descript AI; bukan untuk hero) |
| Logo | SVG/PNG (sudah ada di repo app, bisa salin) | header, OG, favicon |
| Harga resmi tier Basic/Pro | teks | section harga |
| Testimoni (nanti) | teks + foto opsional | social proof |

Catatan produksi video:
```bash
# preview & edit komposisi Remotion
cd videos && npx remotion studio
# render hasil → dipakai website (codec VP9, tanpa audio)
npx remotion render HeroDemo --codec vp8 --output ../public/demo/hero.webm
# konversi rekaman layar OBS (untuk /panduan)
ffmpeg -i panduan.mp4 -c:v libvpx-vp9 -b:v 1200k -an -row-mt 1 panduan.webm
```

## 9. Risiko & Mitigasi

| Risiko | Mitigasi |
|---|---|
| Rate-limit GitHub API saat build (60 req/jam/IP) | Fetch hanya 1× per build; fallback versi hardcoded |
| Video demo terlalu berat | Target ≤2 MB webm, `preload="metadata"` + poster, lazy di bawah fold |
| Konten panduan cepat basi saat app update | Panduan ditulis level konsep + tautan changelog |
| Klaim fitur berlebihan (app masih pengembangan) | Copywriting mengikuti fitur yang benar-benar sudah rilis (lihat release notes) |

## 10. Referensi

- `AGENTS.md` — aturan teknis pengerjaan
- App: `/home/satria/Documents/coding/personal-and-freelance/automate-fotoyu`
- Releases: `https://github.com/Stromzzz/fotospace-releases`
- Riset visual: cursor.com (webm+CSS), linear.app (webm+sprite+Motion), isometricon.com (PNG statis+Motion)
