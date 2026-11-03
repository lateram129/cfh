# Cilangkahan Football Hub (CFH)

Ekosistem digital sepak bola calon DOB Cilangkahan — talent pool pemain muda, tournament center, career & trial portal, dan fanzone/UMKM. Next.js 16 (App Router, Turbopack) + custom design system (lihat `app/globals.css`), siap jadi PWA yang bisa di-*install* ke home screen iOS/Android.

## Menjalankan secara lokal

```bash
npm install
npm run dev
```

Buka http://localhost:3000.

## Status data: dummy dulu, Supabase menyusul

Saat ini semua halaman membaca dari `lib/data/dummy.ts` (persis meniru `supabase/seed.sql`) lewat satu pintu masuk: `lib/data/index.ts`. Form pendaftaran pemain (`/pemain/daftar`) menyimpan hasilnya ke `localStorage` browser (`lib/data/submissions.ts`) supaya alurnya tetap terasa nyata sebelum backend asli ada.

Untuk menyambungkan Supabase sungguhan:

1. Buat project di https://supabase.com (gratis).
2. Di **SQL Editor**, jalankan `supabase/schema.sql` lalu `supabase/seed.sql` (opsional, untuk data contoh).
3. Isi `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxx
   ```
4. Ganti isi fungsi di `lib/data/index.ts` satu per satu dengan query `createClient().from('...').select(...)` memakai client di `lib/supabase/client.ts` (browser) atau `lib/supabase/server.ts` (server component). Tidak ada halaman yang perlu diubah — semua sudah memanggil fungsi dari file ini.
5. Hapus `lib/data/submissions.ts` dan ganti pemanggilannya di `app/pemain/daftar/page.tsx` dengan `insert` ke tabel `players`.

## PWA

- `public/manifest.json` — nama, warna tema, ikon (`public/icons/`, digenerate dari crest CFH).
- `public/sw.js` — service worker custom (bukan `next-pwa`, yang berbasis webpack dan tidak kompatibel dengan Turbopack default Next 16). Strategi: cache-first untuk aset statis `_next/static`, network-first untuk navigasi halaman, dengan fallback `public/offline.html`.
- Didaftarkan lewat `components/ServiceWorkerRegister.tsx`, hanya aktif di production build (`npm run build && npm run start`, atau setelah deploy).

## Struktur

```
app/            halaman (App Router): /, /pemain, /pemain/daftar, /pemain/[id], /liga, /trial, /fanzone
components/     AppShell, AppHeader, BottomNav, ServiceWorkerRegister
lib/data/       data layer (dummy + submissions) — satu-satunya tempat yang perlu diubah untuk connect Supabase
lib/i18n/       terjemahan ID/EN + helper format tanggal/harga/umur
lib/supabase/   Supabase client (browser & server) + tipe tabel
supabase/       schema.sql & seed.sql untuk dijalankan di Supabase SQL Editor
```

## Deploy

Lihat panduan deploy ke Vercel + cara *Add to Home Screen* di iPhone yang diberikan terpisah.
