# Kuis

Kuis kasus klinis interaktif: GERD, PUD (tukak peptik), Hepatitis A, dan Hepatitis B.
Setiap soal langsung menampilkan jawaban benar dan pembahasannya setelah dipilih.
Dibuat dengan React, Vite, dan Tailwind CSS. Tampilan dioptimalkan untuk ponsel.

## Menjalankan

```bash
npm install
npm run dev
```

Buka alamat yang ditampilkan (biasanya http://localhost:5173).

## Build produksi

```bash
npm run build
npm run preview
```

Hasil build ada di folder `dist/`.

## Menambah soal

Semua soal ada di `src/Kuis.jsx` pada konstanta `CASES`. Setiap kasus berisi
`topic`, `title`, `text` (skenario), dan daftar `questions`. Setiap soal memiliki
`q` (pertanyaan), `o` (4 pilihan), `a` (indeks jawaban benar, 0–3), dan `e` (pembahasan).
Topik baru perlu ditambahkan ke konstanta `TOPICS` agar muncul di menu.
