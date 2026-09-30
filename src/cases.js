// Set soal bawaan (asli). Set baru dibuat oleh Claude lewat src/generator.js.
export const BUILTIN_CASES = [
  {
    id: "c1",
    topic: "GERD",
    title: "Ny. D, 29 tahun",
    text: "Panas di dada (heartburn) dan regurgitasi 3×/minggu, terutama setelah makan malam lalu langsung berbaring. Suka minum kopi dan makanan berlemak. Skor GERD-Q positif. Tidak ada sulit menelan, penurunan BB, atau muntah darah.",
    questions: [
      {
        q: "Langkah berikutnya menurut alur tatalaksana GERD di layanan primer adalah…",
        o: [
          "Rujuk untuk operasi antirefluks",
          "PPI test, lalu terapi 8 minggu bila positif",
          "Ambulatory pH monitoring segera",
          "Hentikan semua obat dan observasi",
        ],
        a: 1,
        e: "GERD-Q positif tanpa alarm symptom → lakukan PPI test. Jika positif, terapi diberikan 8 minggu. Baru bila ada alarm symptom pasien dirujuk.",
      },
      {
        q: "Terapi obat resep yang sesuai untuk gejala sedang Ny. D adalah…",
        o: [
          "Misoprostol 200 mcg 4×/hari",
          "Famotidin 20 mg 4×/hari",
          "Esomeprazol 20–40 mg 1×/hari",
          "Sukralfat 2 g 1×/hari",
        ],
        a: 2,
        e: "PPI adalah lini pertama GERD (esomeprazol 20–40 mg 1×/hari). Famotidin dosis resepnya 20 mg 2×/hari, misoprostol dan sukralfat adalah obat ulkus.",
      },
      {
        q: "Mengapa kopi dan makanan berlemak memperburuk GERD?",
        o: [
          "Meningkatkan tonus LES",
          "Menetralkan asam lambung",
          "Memperkuat dinding esofagus",
          "Menurunkan tonus LES sehingga refluks lebih mudah terjadi",
        ],
        a: 3,
        e: "Kopi dan lemak menurunkan tonus LES (kopi juga meningkatkan produksi asam, lemak menurunkan motilitas lambung).",
      },
    ],
  },
  {
    id: "c2",
    topic: "GERD",
    title: "Tn. K, 60 tahun",
    text: "Riwayat pemasangan stent koroner, rutin minum clopidogrel. Kini mengeluh heartburn dan akan diberi obat penekan asam. Ia juga minum ketokonazol untuk infeksi jamur kuku.",
    questions: [
      {
        q: "Menurut materi kuliah (Lexidrug 2025), PPI yang menurunkan efektivitas clopidogrel adalah…",
        o: ["Pantoprazol", "Rabeprazol", "Lansoprazol", "Semua PPI aman tanpa interaksi"],
        a: 0,
        e: "Di slide, pantoprazol disebut menurunkan efektivitas clopidogrel (risiko C, perlu pemantauan). Catatan: literatur lain lebih sering menyorot omeprazol/esomeprazol karena jalur CYP2C19, jadi konfirmasi juga ke dosen.",
      },
      {
        q: "Bila Tn. K memakai H2RA bersama ketokonazol, yang terjadi adalah…",
        o: [
          "Kadar ketokonazol meningkat",
          "Kadar ketokonazol menurun",
          "Tidak ada interaksi",
          "H2RA menjadi tidak aktif",
        ],
        a: 1,
        e: "H2RA dapat menurunkan kadar ketokonazol (risiko D: pertimbangkan modifikasi terapi), karena ketokonazol butuh suasana asam untuk absorpsi.",
      },
      {
        q: "Bila Tn. K memakai PPI lebih dari 1 tahun, pemantauan yang perlu dipertimbangkan adalah…",
        o: ["Kadar asam urat", "Gula darah puasa", "Kadar magnesium dan vitamin B12 secara periodik", "Kalsium urine"],
        a: 2,
        e: "PPI jangka panjang berisiko hipomagnesemia, fraktur, dan defisiensi vitamin B12 (biasanya pada penggunaan >3 tahun).",
      },
    ],
  },
  {
    id: "c3",
    topic: "PUD",
    title: "Ny. R, 58 tahun",
    text: "Osteoartritis lutut, memakai NSAID jangka panjang. Nyeri ulu hati terbakar saat perut kosong dan malam hari. Endoskopi: ulkus lambung. Tes H. pylori positif. Ia alergi penisilin.",
    questions: [
      {
        q: "Regimen eradikasi H. pylori yang paling sesuai untuk Ny. R adalah…",
        o: [
          "PPI 2×1 + klaritromisin 2×500 mg + amoksisilin 2×1000 mg",
          "PPI 2×1 + bismut subsitrat 2×750 mg + tetrasiklin 4×500 mg + metronidazol 3×500 mg",
          "PPI 1×1 saja",
          "Amoksisilin 3×1000 mg saja",
        ],
        a: 1,
        e: "Alergi penisilin (atau riwayat makrolida) → bismut kuadrupel. Regimen lain mengandung amoksisilin.",
      },
      {
        q: "Untuk pasien lain tanpa alergi penisilin, bila bismut tidak tersedia, regimen yang dipakai adalah…",
        o: [
          "PPI + rifabutin",
          "Antasida saja",
          "PPI monoterapi",
          "Konkomitan: PPI + klaritromisin + amoksisilin + metronidazol",
        ],
        a: 3,
        e: "Regimen konkomitan (PPI 2×1, klaritromisin 2×500 mg, amoksisilin 2×1000 mg, metronidazol 3×500 mg) dipakai bila terapi bismut tidak tersedia.",
      },
      {
        q: "Bila NSAID tetap harus dilanjutkan, langkah yang tepat adalah…",
        o: [
          "Hentikan semua obat pelindung lambung",
          "Tambah PPI atau misoprostol, atau pakai COX-2 selektif dengan dosis dan durasi minimal",
          "Naikkan dosis NSAID",
          "Ganti ke NSAID non-selektif lain",
        ],
        a: 1,
        e: "Profilaksis dengan PPI atau misoprostol menurunkan risiko tukak dan perdarahan. Alternatif: COX-2 selektif atau analgesik parasetamol.",
      },
      {
        q: "Bila Ny. R diberi misoprostol, antasida yang sebaiknya dihindari bersamaan adalah…",
        o: [
          "Antasida yang mengandung magnesium",
          "Parasetamol",
          "Vitamin C",
          "Air putih",
        ],
        a: 0,
        e: "Antasida (terutama yang mengandung magnesium) bersama misoprostol meningkatkan toksisitas berupa diare. Risiko X: hindari kombinasi.",
      },
    ],
  },
  {
    id: "c4",
    topic: "PUD",
    title: "Tn. T, 55 tahun",
    text: "Riwayat PUD. Tiba-tiba nyeri perut hebat, denyut jantung cepat, perut kaku seperti papan, demam, dan leukositosis.",
    questions: [
      {
        q: "Komplikasi yang paling mungkin adalah…",
        o: [
          "Refluks esofagitis ringan",
          "Ulkus yang sedang sembuh",
          "Perforasi dengan peritonitis",
          "Hepatitis akut",
        ],
        a: 2,
        e: "Trias nyeri perut, takikardia, dan rigiditas abdomen menunjukkan perforasi. Demam dan leukositosis menyertai peritonitis sekunder.",
      },
      {
        q: "Pencitraan yang lebih sensitif untuk mendeteksi udara bebas adalah…",
        o: [
          "Foto polos selalu menunjukkan udara subdiafragma",
          "CT abdomen",
          "USG hati",
          "Tidak perlu pencitraan",
        ],
        a: 1,
        e: "CT abdomen lebih sensitif. Foto polos toraks/abdomen tidak selalu memperlihatkan udara subdiafragma.",
      },
      {
        q: "Tatalaksana awal yang tepat adalah…",
        o: [
          "Makanan lunak dan antasida",
          "H2RA oral saja",
          "Observasi 48 jam",
          "NPO, selang nasogastrik, resusitasi cairan, PPI IV, antibiotik spektrum luas, dan konsul bedah",
        ],
        a: 3,
        e: "Ini kondisi gawat bedah. Semua langkah dilakukan bersamaan dan cepat dengan koordinasi medik-bedah.",
      },
    ],
  },
  {
    id: "c5",
    topic: "Hepatitis A",
    title: "Dina, 20 tahun",
    text: "Mahasiswa yang akan KKN ke daerah endemik hepatitis A. Belum pernah divaksin HAV. Kakaknya baru saja terdiagnosis hepatitis A.",
    questions: [
      {
        q: "Dosis vaksin VAQTA untuk usia ≥19 tahun adalah…",
        o: [
          "25 U (0,5 mL), 2 dosis",
          "50 U (1 mL), 2 dosis pada bulan 0 dan 6–18",
          "720 EL.U (0,5 mL), 1 dosis",
          "1.440 EL.U (1 mL), 3 dosis",
        ],
        a: 1,
        e: "VAQTA usia ≥19 tahun: 50 U (1 mL), 2 dosis, jadwal 0 dan 6–18 bulan. Yang 25 U (0,5 mL) untuk usia 1–18 tahun.",
      },
      {
        q: "Jika Dina memilih TWINRIX (vaksin A+B), jadwal standar dewasa adalah…",
        o: [
          "1 dosis saja",
          "2 dosis pada bulan 0 dan 6",
          "3 dosis pada bulan 0, 1, 6",
          "4 dosis pada hari 0, 7, 21–30, dan bulan 12",
        ],
        a: 2,
        e: "TWINRIX standar ≥18 tahun: 3 dosis (0, 1, 6 bulan). Jadwal 4 dosis adalah jadwal dipercepat.",
      },
      {
        q: "Cara penularan dan masa inkubasi rata-rata hepatitis A adalah…",
        o: [
          "Darah, 45–180 hari",
          "Tetesan udara, 7 hari",
          "Ibu ke anak, 60–90 hari",
          "Fekal-oral, rata-rata 28–30 hari",
        ],
        a: 3,
        e: "HAV menular fekal-oral (makanan/air terkontaminasi). Inkubasi 15–50 hari, rata-rata 28–30 hari.",
      },
      {
        q: "Hasil tes Dina: IgG anti-HAV positif, IgM anti-HAV negatif. Artinya…",
        o: [
          "Imun (pulih dari infeksi lalu atau berhasil vaksinasi)",
          "Infeksi akut",
          "Hepatitis B kronis",
          "Sirosis hati",
        ],
        a: 0,
        e: "IgM anti-HAV = infeksi akut. IgG anti-HAV = imunitas jangka panjang akibat infeksi sebelumnya atau vaksinasi.",
      },
    ],
  },
  {
    id: "c6",
    topic: "Hepatitis B",
    title: "Tn. W, 50 tahun",
    text: "HBsAg positif lebih dari 6 bulan, sirosis kompensata, HBV DNA terdeteksi, ALT normal. Fungsi ginjal normal.",
    questions: [
      {
        q: "Apakah Tn. W memerlukan terapi antivirus?",
        o: [
          "Tidak, karena ALT normal",
          "Ya, pada sirosis kompensata dengan HBV DNA terdeteksi terapi diberikan tanpa memandang kadar ALT",
          "Tunggu 1 tahun dulu",
          "Cukup vaksinasi",
        ],
        a: 1,
        e: "Indikasi terapi pada sirosis kompensata: HBV DNA terdeteksi, tanpa memandang level ALT (EASL 2025).",
      },
      {
        q: "Pilihan obat lini pertama adalah…",
        o: [
          "Telbivudin 600 mg/hari",
          "Lamivudin 100 mg/hari",
          "Entecavir 0,5 mg atau tenofovir 300 mg 1×/hari",
          "Adefovir 10 mg/hari",
        ],
        a: 2,
        e: "Lini pertama: tenofovir 300 mg atau entecavir 0,5 mg per hari. Lamivudin, adefovir, telbivudin adalah lini kedua.",
      },
      {
        q: "Petunjuk minum entecavir yang benar adalah…",
        o: [
          "Bersama makanan berlemak",
          "Dilarutkan dalam susu",
          "Kapan saja tanpa aturan",
          "Saat perut kosong",
        ],
        a: 3,
        e: "Entecavir sebaiknya diminum saat perut kosong.",
      },
      {
        q: "Monitoring berkala yang sesuai adalah…",
        o: [
          "HBV DNA, ALT, AFP tiap 3–6 bulan dan USG abdomen tiap 6 bulan untuk skrining HCC",
          "Hanya kreatinin tiap tahun",
          "Tidak perlu monitoring",
          "Vaksin tiap bulan",
        ],
        a: 0,
        e: "Pemantauan meliputi HBV DNA, ALT, AFP tiap 3–6 bulan dan USG abdomen tiap 6 bulan untuk skrining karsinoma hepatoseluler.",
      },
      {
        q: "Anak Tn. W: HBsAg (−), anti-HBs (+), anti-HBc (−). Interpretasinya…",
        o: [
          "Infeksi akut",
          "Imun karena vaksinasi",
          "Infeksi kronis",
          "Infeksi lampau",
        ],
        a: 1,
        e: "Hanya anti-HBs positif (anti-HBc negatif) menunjukkan kekebalan akibat vaksinasi. Infeksi lampau bila anti-HBc juga positif.",
      },
    ],
  },
  {
    id: "c7",
    topic: "Hepatitis B",
    title: "Ny. L, 30 tahun, hamil 24 minggu",
    text: "HBsAg positif, HBV DNA ≥200.000 IU/mL (≥5,3 log10), tanpa sirosis.",
    questions: [
      {
        q: "Obat yang dipilih untuk Ny. L adalah…",
        o: [
          "Peg-interferon",
          "Entecavir (kategori C)",
          "Adefovir",
          "Tenofovir (kategori B)",
        ],
        a: 3,
        e: "Tenofovir kategori B dan aman untuk pencegahan transmisi vertikal. Entecavir kategori C (perlu pertimbangan risiko-manfaat).",
      },
      {
        q: "Profilaksis tenofovir dimulai pada…",
        o: [
          "Minggu ke-28 kehamilan sampai setidaknya saat persalinan",
          "Setelah bayi lahir",
          "Trimester pertama saja",
          "Tidak perlu diberikan",
        ],
        a: 0,
        e: "Alur Kemenkes 2023: mulai minggu ke-28 hingga setidaknya persalinan, lalu nilai kembali untuk terapi jangka panjang.",
      },
      {
        q: "Bagaimana bila HBV DNA <200.000 IU/mL atau HBeAg negatif tanpa sirosis?",
        o: [
          "Beri tenofovir seumur hidup",
          "Beri interferon",
          "Tidak perlu profilaksis tenofovir, tunda terapi jangka panjang, tetap pantau dan nilai kembali",
          "Hentikan pemeriksaan",
        ],
        a: 2,
        e: "Pada kelompok ini tidak perlu profilaksis tenofovir; terapi jangka panjang ditunda dengan tetap pemantauan dan penilaian ulang.",
      },
    ],
  },
];
