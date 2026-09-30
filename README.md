# Kuis

Kuis kasus klinis interaktif: GERD, PUD (tukak peptik), Hepatitis A, dan Hepatitis B.
Setiap soal langsung menampilkan jawaban benar dan pembahasannya setelah dipilih.
Dibuat dengan React, Vite, dan Tailwind CSS. Tampilan dioptimalkan untuk ponsel.

Tombol **Acak soal baru** meminta AI menyusun set soal yang benar-benar baru:
pasien, skenario, pertanyaan, pilihan jawaban, dan pembahasan semuanya berubah.
Klasifikasinya selalu mengikuti set asli: kasus c1 sampai c7 dengan topik dan
jumlah soal yang sama (GERD 2 kasus, PUD 2 kasus, Hepatitis A 1 kasus,
Hepatitis B 2 kasus, total 25 soal). Pertanyaan dan pilihan jawaban tidak
memakai tanda kurung. Set buatan AI disimpan di browser sampai kamu memilih
**Pakai set asli** atau mengacak lagi.

## Menjalankan dengan Gemini (gratis)

1. Buat API key di https://aistudio.google.com/apikey
2. Salin `.env.example` ke `.env`, isi `GEMINI_API_KEY=...`
3. Jalankan:

```bash
npm install
npm run dev
```

Buka alamat yang ditampilkan (biasanya http://localhost:5173). Endpoint
`/api/generate` ikut berjalan di server dev. Key hanya dibaca oleh server, tidak
pernah dikirim ke browser. Tanpa key, kuis tetap jalan dengan set soal asli.

Server mengirim satu permintaan kecil per kasus, 7 permintaan sekaligus, jadi
satu set biasanya jadi dalam 10–20 detik. Model dicoba berurutan:
`gemini-3.5-flash-lite`, lalu `gemini-3.5-flash`, `gemini-3.8-flash`,
`gemini-flash-latest` bila yang sebelumnya penuh atau ditutup. Isi
`GEMINI_MODEL` di `.env` (boleh beberapa, dipisah koma) untuk mendahulukan
model lain.

## Provider lain

- `ANTHROPIC_API_KEY` diisi dan `GEMINI_API_KEY` kosong: memakai Claude API
  (`claude-opus-5-5`, bayar per token).
- Keduanya diisi: Gemini dipakai. Paksa lewat `AI_PROVIDER=claude` bila perlu.
- Dibuka sebagai artifact di claude.ai: memakai kuota langganan Claude milik
  yang membuka halaman, tanpa API key.

## Deploy ke Netlify (zip drag-and-drop)

```bash
npm run build:netlify
```

Menghasilkan `kuis-netlify.zip` berisi situs statis, `netlify.toml`, dan satu
Netlify Function mandiri untuk `/api/generate` (tanpa `node_modules`). Lalu:

1. Buka https://app.netlify.com/drop dan lepas file zip itu, atau di situs yang
   sudah ada pilih Deploys lalu drag and drop.
2. Di Site configuration > Environment variables tambahkan `GEMINI_API_KEY`.
   Key tidak pernah ada di dalam zip.
3. Deploy ulang sekali (drop zip yang sama lagi) supaya function membaca key.

Netlify juga bisa dihubungkan ke repo Git: `netlify.toml` sudah mengatur
perintah build dan folder function.

## Build dan server produksi

```bash
npm run build
npm start
```

`npm start` menjalankan `server.js`: melayani folder `dist/` dan endpoint
`/api/generate`. Port default 3000 (ubah lewat `PORT`).

## Struktur

- `src/cases.js`: set soal asli (`BUILTIN_CASES`).
- `src/generator.js`: rencana set (`CASE_PLAN`), prompt, skema JSON, validasi
  balasan, dan penghapusan tanda kurung.
- `src/askClaude.js`: memilih jalur (artifact claude.ai atau `/api/generate`).
- `api/generate.js`: handler Node; memanggil Gemini lewat REST (satu permintaan
  per kasus, paralel, dengan skema JSON dan fallback model) atau Claude lewat SDK
  resmi. Pilihan jawaban diacak ulang di sisi aplikasi supaya jawaban benar tidak
  selalu di posisi yang sama.
- `server.js`: server produksi.

## Menambah soal ke set asli

Semua soal asli ada di `src/cases.js`. Setiap kasus berisi `topic`, `title`,
`text` (skenario), dan daftar `questions`. Setiap soal memiliki `q` (pertanyaan),
`o` (4 pilihan), `a` (indeks jawaban benar, 0–3), dan `e` (pembahasan). Untuk
mengubah komposisi set buatan AI, ubah `CASE_PLAN` di `src/generator.js`.
