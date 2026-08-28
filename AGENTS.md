# AGENTS.md — Foto Space Website

Panduan untuk AI agent (dan developer) yang mengerjakan repo ini.

## Project Overview

Website promosi **Foto Space** — aplikasi desktop (Electron) untuk fotografer event yang meng-upload foto & video ke FotoYu secara otomatis (batch, kompresi, paralel, anti-gagal). Website ini bersifat **marketing + distribusi**: landing page, download, panduan, changelog, dan halaman legal.

- Bahasa konten: **Bahasa Indonesia** (target pasar fotografer Indonesia)
- Sumber kebenaran produk: repo private `Satriaa11/fotoyu-auto` (jangan pernah me-render/mengutip source code app di sini)
- Distribusi: release publik di `Stromzzz/fotospace-releases` (GitHub Releases, akses tanpa token)

## CodeGraph (wajib sebelum grep/read)

Repo ini ter-index oleh **CodeGraph** (direktori `.codegraph/` di root, daemon file-watcher aktif). Gunakan SEBELUM grep/read untuk memahami atau mencari kode — hemat token dan round-trip:

- **Satu panggilan, hasil lengkap**: `codegraph explore "<pertanyaan atau nama simbol>"` (shell) atau tool MCP `codegraph_explore` mengembalikan source verbatim (line-numbered, fresh dari disk) + call path + blast radius. Hasilnya setara dengan `read` — jangan baca ulang file yang sudah muncul di output.
- **Jangan re-verify hasil dengan grep**: hasil berasal dari AST parse penuh; grep ulang hanya membuang token. `grep`/`read` hanya untuk detail yang tidak di-cover codegraph (config, docs, dll).
- **Sebelum refactor/rename**: cek blast radius via `codegraph impact <simbol>` atau `codegraph callers <simbol>`.

### Sync index

- Daemon auto-sync perubahan file dalam ~1 detik. Cek status: `codegraph status`.
- Bila watcher mati atau index stale: `codegraph sync` (inkremental) atau `codegraph index` (rebuild penuh).
- Jika output codegraph memuat banner "edited since last index sync" untuk suatu file, file itu belum ter-index ulang — baca langsung dengan `read` sebelum mengeditnya.
- Jangan hapus `.codegraph/` — menghapusnya memaksa rebuild penuh.

## Tech Stack (fixed — jangan ganti tanpa diskusi)

| Komponen | Pilihan |
|---|---|
| Framework | **Astro 7** — static-first (`output: 'static'`) |
| UI interaktif | **React 19** sebagai Astro islands (`@astrojs/react`) |
| Styling | **Tailwind CSS v4** |
| Font | Inter self-hosted via `@fontsource-variable/inter` — DILARANG Google Fonts/CDN font |
| Animasi | CSS dulu; **Motion** (`motion` package, ex framer-motion) hanya di island React |
| Gambar | `astro:assets` (`<Image>`) — output AVIF/WebP, selalu set width/height |
| Video demo | `<video muted playsinline loop preload="metadata">` format `.webm` — diproduksi via **Remotion** di folder `videos/` (lihat bawah) |
| Sitemap/SEO | `@astrojs/sitemap`, JSON-LD manual di layout |
| Package manager | **npm** |

### Video pipeline (Remotion)

- Komposisi video hidup di `videos/` (package npm terpisah dalam repo ini, React + `remotion`)
- Website HANYA memakai hasil render (`public/demo/*.webm`), bukan `@remotion/player` (menjaga budget JS)
- Render: `cd videos && npx remotion render <Composition> --codec vp8 --output ../public/demo/<nama>.webm`
- File `.webm` hasil render di-commit (ukuran kecil ≤3 MB) agar build website tidak perlu toolchain render

## Commands (website)

```bash
npm install
npm run dev        # dev server http://localhost:4321
npm run build      # production build → dist/
npm run preview    # preview hasil build
npm run check      # astro check (TypeScript)
npm run lint       # eslint
```

## Commands (videos/)

```bash
cd videos
npm install
npx remotion studio     # preview & edit komposisi di browser
npx remotion render <Composition> --codec vp8 --output ../public/demo/<nama>.webm
```

## Architecture Rules

1. **Static-first**: setiap halaman default prerender. React HANYA untuk komponen interaktif (deteksi OS download, accordion FAQ, toggle harga). Konten teks/gambar = Astro components murni (`.astro`), nol JS.
2. Setiap island wajib pakai direktif `client:` yang paling hemat: prioritaskan `client:visible`, hindari `client:load` kecuali harus interaktif segera.
3. Gambar selalu lewat `astro:assets`; simpan sumber di `src/assets/`. Jangan hotlink gambar eksternal.
4. Tidak boleh ada `<script>` inline untuk logic halaman — pakai module script Astro atau island React.
5. Data dinamis (mis. versi rilis terbaru dari GitHub API) di-fetch **saat build** di frontmatter; fallback client-side boleh sebagai enhancement progresif.
6. Layout global di `src/layouts/Base.astro` (meta SEO, OG, JSON-LD slot). Halaman tidak menduplikasi `<head>` manual.
7. Konten berulang (fitur, FAQ, tier harga) sebagai data di `src/content/` atau `src/data/*.ts`, bukan copy-paste markup.

## Style & Design

- Desain mengikuti app desktop Foto Space: font **Inter**, nuansa dark-mode elegan (lihat `automate-fotoyu/src/renderer` untuk token warna bila perlu referensi)
- Tailwind v4: token di `src/styles/global.css` via `@theme`
- Komponen UI reusable di `src/components/ui/` (Button, Badge, SectionHeading, …)
- Jangan gunakan emoji sebagai icon — pakai **lucide-react** (konsisten dengan app)
- Copywriting: kalimat pendek, fokus hasil ("upload ribuan foto otomatis"), hindari jargon teknis berlebihan

## SEO Rules

- Setiap halaman: title unik ≤60 char, meta description ≤155 char, canonical, OG image
- JSON-LD: `SoftwareApplication` di landing, `FAQPage` di section FAQ, `BreadcrumbList` bila perlu
- `lang="id"` di `<html>`; slug URL lowercase-hyphenate
- Sitemap otomatis via `@astrojs/sitemap`; robots.txt di `public/`

## Performance Budget

- Lighthouse mobile ≥ 95 semua kategori
- Total JS per halaman < 100 KB (gzipped) — islands harus sedikit dan kecil
- Hero image/video di-preload; video demo `preload="metadata"` + poster
- Tidak ada third-party script (analitik, chat widget) tanpa persetujuan eksplisit

## Security & Privacy

- JANGAN menaruh secret apa pun (token GitHub, key lisensi) di repo ini — GitHub API releases publik tidak butuh token
- Form kontak (jika nanti ada) tidak boleh menyimpan data tanpa halaman kebijakan privasi yang aktif
- Jangan mengekspos detail internal arsitektur app (bytecode, lisensi worker, endpoint FotoYu) di konten web

## Repository & Deployment

- Repo: public, nama `fotospace-website`
- Deploy: **Cloudflare Pages**, build command `npm run build`, output `dist/`
- Branch `main` auto-deploy; preview deploy per PR
- Domain produksi: `https://fotospace.online`

## Definition of Done (per task)

- `npm run build` sukses tanpa warning TS
- `npm run check` + `npm run lint` bersih
- Tampilan dicek di viewport mobile (375px) dan desktop (1280px)
- Lighthouse cepat pada halaman yang diubah (tidak menurunkan skor di bawah budget)
