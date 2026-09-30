# Kuis

Kuis kasus klinis interaktif: GERD, PUD (tukak peptik), Hepatitis A, dan Hepatitis B.
Setiap soal langsung menampilkan jawaban benar dan pembahasannya setelah dipilih.
Dibuat dengan React, Vite, dan Tailwind CSS. Tampilan dioptimalkan untuk ponsel.

Tombol **Acak soal baru dengan Claude** meminta Claude menyusun set soal yang
benar-benar baru: pasien, skenario, pertanyaan, pilihan jawaban, dan pembahasan
semuanya berubah, dengan topik dan jumlah soal per kasus yang sama seperti set
asli (7 kasus, 25 soal). Set buatan Claude disimpan di browser sampai kamu
memilih **Pakai set asli** atau mengacak lagi.

## Menjalankan (development)

```bash
npm install
cp .env.example .env   # isi ANTHROPIC_API_KEY
npm run dev
```

Buka alamat yang ditampilkan (biasanya http://localhost:5173). Endpoint
`/api/generate` ikut berjalan di server dev, jadi fitur acak soal langsung bisa
dipakai. Tanpa API key, kuis tetap jalan dengan set soal asli.

## Build dan server produksi

```bash
npm run build
npm start
```

`npm start` menjalankan `server.js`: melayani folder `dist/` dan endpoint
`/api/generate`. API key dibaca dari variabel lingkungan `ANTHROPIC_API_KEY`
atau file `.env`. Port default 3000 (ubah lewat `PORT`).

## Sebagai artifact di claude.ai

Halaman yang dipublikasikan sebagai artifact tidak butuh API key: fitur acak
soal memakai akun Claude milik pengguna yang membuka halaman (kapabilitas
`sample`). Kode yang sama mendeteksi lingkungannya di `src/askClaude.js`.

## Struktur

- `src/cases.js`: set soal asli (`BUILTIN_CASES`).
- `src/generator.js`: rencana set (topik dan jumlah soal per kasus), prompt untuk
  Claude, skema JSON, dan validasi balasan.
- `src/askClaude.js`: memilih jalur ke Claude (artifact atau `/api/generate`).
- `api/generate.js`: handler Node yang memanggil Claude API lewat SDK resmi
  (`claude-opus-5-5`, structured output JSON).
- `server.js`: server produksi.

## Menambah soal ke set asli

Semua soal asli ada di `src/cases.js`. Setiap kasus berisi `topic`, `title`,
`text` (skenario), dan daftar `questions`. Setiap soal memiliki `q` (pertanyaan),
`o` (4 pilihan), `a` (indeks jawaban benar, 0–3), dan `e` (pembahasan). Untuk
mengubah komposisi set buatan Claude, ubah `CASE_PLAN` di `src/generator.js`.
