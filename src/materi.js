// Basis materi kuliah Farmakoterapi Gangguan Saluran Cerna dan Nutrisi
// (apt. Ade Wirastuti, S.Farm., M.Clin.Pharm, FK Untan):
//   - PPT GERD dan PUD, Pertemuan 6
//   - Bahan Ajar Hepatitis A dan Hepatitis B
//
// Dipakai sebagai satu-satunya sumber fakta saat AI menyusun soal baru.
// `ringkasan` masuk ke prompt utuh; `poin` adalah daftar hal yang bisa diuji,
// dipilih acak per kasus supaya setiap set menyentuh bagian materi yang beda.

export const MATERI = {
  GERD: {
    ringkasan: `DEFINISI: GERD adalah melemahnya Lower Esophageal Sphincter/LES sehingga isi lambung refluks ke esofagus, orofaring, dan/atau saluran napas, menimbulkan gejala mengganggu dan/atau komplikasi. Sumber: PGI 2022; Saputera & Budianto 2017.
EPIDEMIOLOGI: prevalensi GERD Indonesia populasi umum 9,35%; pada pasien dispepsia dengan endoskopi 53,8%. Sumber: PGI 2022.
FAKTOR RISIKO: makanan tinggi lemak; minuman bersoda, kopi, cokelat, makanan pedas; hernia hiatal; obesitas; merokok; TLESRs/Transient LES Relaxations.
MEKANISME DIET (PGI 2022 hal 31): makanan/minuman asam dan makanan pedas = iritasi mukosa esofagus; minuman bersoda, porsi besar, makanan padat kalori = peningkatan distensi lambung/TLESRs; kopi = penurunan tonus LES dan peningkatan produksi asam; alkohol dan lemak = penurunan tonus LES/motilitas lambung; cokelat, mint, karbohidrat = penurunan tonus LES; makan tengah malam = peningkatan produksi asam.
OBAT YANG MEMPERBURUK GERD (Dipiro 12 ed hal 461): menurunkan tekanan LES = antikolinergik, barbiturat, kafein, CCB dihidropiridin, dopamin, estrogen, nikotin, nitrat, progesteron, tetrasiklin, teofilin. Iritan langsung mukosa esofagus = aspirin, bisfosfonat, NSAID, zat besi, kuinidin, kalium klorida. Golongan lain di slide: NSAID, antibiotik, opioid, calcium channel blocker.
GEJALA: heartburn, regurgitasi, nyeri dada, batuk persisten, disfagia, bersendawa, mual muntah, sesak. Alarm symptom: disfagia, penurunan berat badan, perdarahan/muntah darah, anemia.
GERD-Q (Saputera & Budianto 2017): 6 pertanyaan frekuensi gejala dalam 7 hari terakhir. Heartburn, regurgitasi, gangguan tidur karena gejala, dan minum obat tambahan diberi skor 0/1/2/3 untuk 0 hari/1 hari/2-3 hari/4-7 hari. Nyeri ulu hati dan mual diberi skor terbalik 3/2/1/0. Total 0-18. Skor kurang dari atau sama dengan 7 kemungkinan bukan GERD; skor 8-18 kemungkinan GERD.
TES DIAGNOSTIK: gejala klinik/riwayat, barium swallow, endoskopi, ambulatory pH monitoring, esophageal manometry.
ALUR LAYANAN PRIMER (Saputera & Budianto 2017): terduga GERD, isi GERD-Q. Negatif = bukan GERD. Positif, cek alarm symptom. Alarm symptom positif = rujuk. Alarm symptom negatif = PPI test. PPI test positif = GERD, beri terapi GERD 8 minggu, lalu evaluasi GERD negatif/positif.
TUJUAN TERAPI: mengatasi gejala, memperbaiki kerusakan mukosa, mencegah kekambuhan, mencegah komplikasi.
NON FARMAKOLOGI (Dipiro hal 469): turunkan BB bila obesitas; tinggikan kepala 15-20 cm saat berbaring; makan malam paling lambat 2-3 jam sebelum tidur; hindari makanan pemicu.
EFEKTIVITAS OBAT (Saputera & Budianto 2017, skala 0 sampai +4 untuk perbaikan gejala/penyembuhan lesi/pencegahan komplikasi/penyembuhan kekambuhan): antasida +1/0/0/0; prokinetik +2/+1/0/+1; H2RA +2/+2/+1/+1; H2RA plus prokinetik +3/+3/+1/+1; H2RA dosis tinggi +3/+3/+2/+2; PPI +4/+4/+3/+4; pembedahan +4/+4/+3/+4. PPI paling efektif.
DOSIS GERD (Dipiro 12 ed hal 468, Tabel 50-3). Terapi mandiri pasien usia 12 tahun ke atas: antasida Mg hidroksida/Al hidroksida dengan simetikon 10-20 mL setelah makan dan sebelum tidur, maksimal 16 sendok teh per 24 jam; antasida/asam alginat 2-4 tablet atau 10-20 mL; kalsium karbonat 500 mg 2-4 tablet; H2RA OTC sampai 2 kali sehari: simetidin 200 mg, famotidin 10-20 mg, nizatidin 75 mg. PPI OTC usia di atas 18 tahun sekali sehari: esomeprazol 20 mg, lansoprazol 15 mg, omeprazol 20 mg, omeprazol/natrium bikarbonat 20 mg/1.100 mg. Bila gejala tidak membaik dengan modifikasi gaya hidup dan obat bebas setelah 2 minggu, pasien harus ke dokter.
DOSIS RESEP untuk gejala GERD: H2RA resep = simetidin 400 mg 4 kali sehari atau 800 mg 2 kali sehari, famotidin 20 mg 2 kali sehari, nizatidin 150 mg 2 kali sehari. PPI resep = dexlansoprazol 30 mg sekali sehari 4 minggu, esomeprazol 20-40 mg sekali sehari, lansoprazol 15 mg sekali sehari, omeprazol 20 mg sekali sehari, omeprazol/Na bikarbonat 20 mg sekali sehari, pantoprazol 40 mg sekali sehari, rabeprazol 20 mg sekali sehari. Pasien gejala sedang sampai berat sebaiknya langsung PPI.
ESOFAGITIS EROSIF atau gejala sedang-berat/komplikasi: PPI sampai 2 kali sehari hingga 8 minggu = dexlansoprazol 60 mg, esomeprazol 20-40 mg, lansoprazol 30 mg 1-2 kali, omeprazol 20 mg 1-2 kali, rabeprazol 20 mg 1-2 kali, pantoprazol 40 mg 1-2 kali. H2RA dosis tinggi 8-12 minggu = simetidin 400 mg 4 kali atau 800 mg 2 kali, famotidin 20-40 mg 2 kali, nizatidin 150 mg 2-4 kali. Gejala ekstraesofageal atau alarm symptom = endoskopi dengan biopsi. Reflux chest syndrome = mulai PPI 2 kali sehari. PPI adalah terapi pemeliharaan paling efektif. Tidak respons terapi = manometri dan/atau ambulatory reflux monitoring. Terapi intervensi: bedah antirefluks, bedah bariatrik, terapi endoskopik.
GOODMAN GILMAN Tabel 53-2 dosis dewasa: simetidin 400 mg 4 kali atau 800 mg 2 kali selama 12 minggu; famotidin 10-20 mg 2 kali sampai 12 minggu; nizatidin 150 mg 2 kali; ranitidin 150 mg 2 kali; esomeprazol 20-40 mg per hari 4-8 minggu; dexlansoprazol 30 mg per hari 4 minggu non erosif, erosif 60 mg per hari sampai 6 bulan lalu 30 mg pemeliharaan; lansoprazol 15 mg non erosif atau 30 mg erosif per hari sampai 8 minggu; omeprazol 20 mg per hari; pantoprazol 40 mg per hari erosif; rabeprazol 20 mg per hari erosif. Potassium competitive acid blocker: revaprazan 200 mg, tegoprazan 50 mg, vonoprazan 10-20 mg per hari. Anak: famotidin 0,5 mg/kg/hari; esomeprazol 1-11 tahun 10 mg/hari, di atas 12 tahun 20 mg/hari.
PPI FARMAKOLOGI (Lexidrug 2025): omeprazol, lansoprazol, pantoprazol, esomeprazol menghambat H+/K+ ATPase sel parietal. Ikatan protein 95-98%. Metabolisme hati CYP2C19 dan CYP3A4, variasi genetik berpengaruh pada omeprazol dan esomeprazol. Ekskresi urine. Waktu paruh 0,5-3,5 jam tetapi efek bertahan lebih dari 24 jam. Makanan berlemak memperlambat absorpsi omeprazol; makanan mengubah tmax lansoprazol, pantoprazol, esomeprazol tanpa mengubah bioavailabilitas. Bioavailabilitas lansoprazol 80-90%, pantoprazol 77%, esomeprazol 90%.
PPI EFEK SAMPING: umum = sakit kepala, mual, diare, flatulens, nyeri perut. Jangka panjang = hipomagnesemia terutama lebih dari 1 tahun, fraktur osteoporosis terutama dosis tinggi dan lebih dari 1 tahun, defisiensi vitamin B12 biasanya lebih dari 3 tahun karena hambatan faktor intrinsik, infeksi enterik, pneumonia komunitas terutama 30 hari pertama, penyakit ginjal kronik. Monitoring (Dipiro Tabel 50-5): jumlah episode diare, kadar magnesium periodik bila dosis tinggi atau lebih dari 1 tahun, densitas tulang hanya bila ada faktor risiko lain, gejala respirasi 30 hari pertama, vitamin B12 periodik pada penggunaan lama.
PPI INTERAKSI (Lexidrug 2025 di slide): pantoprazol menurunkan efektivitas clopidogrel, risiko C perlu pemantauan.
H2RA FARMAKOLOGI (Lexidrug 2025): ranitidin, simetidin, famotidin menghambat reseptor H2 sel parietal. Bioavailabilitas ranitidin 50%, simetidin 60-70%, famotidin 40-50%. Ikatan protein 15-20%. Ekskresi urine sebagai obat utuh: ranitidin 35%, simetidin 48%, famotidin 25-30% oral dan 65-70% IV. Waktu paruh 2-3,5 jam. Efek samping: sakit kepala, mengantuk, kelelahan, pusing, konstipasi atau diare; efek SSP lebih mungkin pada usia di atas 50 tahun atau gangguan ginjal/hati; defisiensi B12 pada terapi lama dosis tinggi; simetidin ginekomastia. Interaksi: H2RA menurunkan kadar ketokonazol, risiko D pertimbangkan modifikasi terapi, karena ketokonazol butuh asam untuk absorpsi.
ANTASIDA: diare atau konstipasi tergantung produk, gangguan mineral, gangguan asam basa; hati-hati antasida aluminium dan kalsium pada gangguan ginjal; aluminium mengikat fosfat dan dapat menyebabkan demineralisasi tulang; pantau kalsium dan fosfat pada terapi kronik.
KASUS SOAP DI SLIDE: Tn. M 37 tahun, TB 160 cm, BB 80 kg, nyeri epigastrik 4-6 minggu setelah makan malam, muntah saat tiduran menonton TV, gejala muncul setelah makan cokelat malam hari, skala nyeri 4, diagnosis GERD, terapi asam mefenamat 500 mg 3 kali 1, antasida 3 kali 1, domperidon 3 kali 1. Masalah: obesitas, NSAID memperburuk GERD, belum ada PPI.`,
    poin: [
      "alur GERD di layanan primer: GERD-Q, alarm symptom, PPI test, terapi 8 minggu, kapan rujuk",
      "cara skoring GERD-Q termasuk dua item yang skornya terbalik dan ambang 8-18",
      "alarm symptom yang mengharuskan rujukan atau endoskopi dengan biopsi",
      "mekanisme kopi, cokelat, mint, lemak, alkohol, minuman bersoda, porsi besar terhadap LES dan TLESRs",
      "obat yang menurunkan tekanan LES: CCB dihidropiridin, nitrat, teofilin, antikolinergik, estrogen, progesteron",
      "obat iritan langsung mukosa esofagus: NSAID, aspirin, bisfosfonat, zat besi, kalium klorida",
      "terapi non farmakologi: tinggikan kepala 15-20 cm, makan malam 2-3 jam sebelum tidur, turunkan BB",
      "tabel efektivitas terapi: mengapa PPI unggul dibanding H2RA, prokinetik, antasida",
      "dosis obat bebas untuk terapi mandiri pasien 12 tahun ke atas dan batas 2 minggu sebelum ke dokter",
      "dosis PPI resep untuk gejala GERD: esomeprazol 20-40 mg, omeprazol 20 mg, pantoprazol 40 mg, lansoprazol 15 mg, rabeprazol 20 mg sekali sehari",
      "dosis H2RA resep: famotidin 20 mg 2 kali sehari, simetidin 400 mg 4 kali atau 800 mg 2 kali, nizatidin 150 mg 2 kali",
      "regimen esofagitis erosif: PPI sampai 2 kali sehari hingga 8 minggu, dosis tiap PPI",
      "H2RA dosis tinggi 8-12 minggu dan mengapa PPI lebih dipilih daripada H2RA dosis tinggi",
      "reflux chest syndrome mulai PPI dua kali sehari; gejala ekstraesofageal perlu endoskopi biopsi",
      "pasien tidak respons terapi: manometri dan ambulatory reflux monitoring; opsi bedah antirefluks dan bariatrik",
      "farmakokinetik PPI: metabolisme CYP2C19 dan CYP3A4, waktu paruh pendek tetapi efek lebih dari 24 jam, pengaruh makanan",
      "efek samping PPI jangka panjang: hipomagnesemia, fraktur, defisiensi B12, pneumonia komunitas, infeksi enterik, dan parameter pemantauannya",
      "interaksi pantoprazol dengan clopidogrel risiko C menurut slide Lexidrug",
      "interaksi H2RA dengan ketokonazol risiko D dan alasannya",
      "efek samping H2RA termasuk efek SSP pada lansia dan gangguan ginjal, ginekomastia simetidin",
      "risiko antasida aluminium dan kalsium pada gangguan ginjal serta demineralisasi tulang",
      "potassium competitive acid blocker: vonoprazan 10-20 mg, tegoprazan 50 mg, revaprazan 200 mg",
      "dosis PPI anak dan famotidin anak 0,5 mg/kg/hari",
      "kasus SOAP Tn. M: obesitas, asam mefenamat memperburuk GERD, cokelat malam hari, perlunya PPI",
      "tujuan pengobatan GERD dan urutan tes diagnostik",
    ],
  },

  PUD: {
    ringkasan: `DEFINISI (Makmun 2021): PUD adalah luka pada mukosa lambung atau duodenum akibat asam lambung dan pepsin; diameter luka harus lebih dari 5 mm untuk disebut ulkus.
PENYEBAB UTAMA: infeksi H. pylori; NSAID termasuk aspirin; merokok dan alkohol; stres.
GEJALA: nyeri ulu hati terbakar terutama saat perut kosong atau malam hari; mual, muntah, gangguan pencernaan; nyeri mereda setelah makan atau antasida tetapi sering kambuh.
PENUNJANG: endoskopi lambung dan duodenum; tes deteksi H. pylori.
TUJUAN TERAPI: mengatasi gejala, mencegah faktor risiko lain, mencegah kekambuhan, mencegah komplikasi. Non farmakologi: hindari zat iritatif dan pemicu sekresi asam seperti alkohol dan rokok.
ALUR DIPIRO Gambar 51-5 (hal 488): pasien gejala ulkus. Tanpa alarm symptom: bila pakai NSAID, hentikan NSAID atau turunkan dosis; bila gejala menetap mulai H2RA atau PPI. Bila tidak pakai NSAID dan belum pernah diobati H. pylori: serologi; positif = terapi eradikasi berbasis PPI. Ada alarm symptom seperti perdarahan, anemia, penurunan BB: endoskopi. Ulkus ada: tes H. pylori. Positif = eradikasi; negatif dan pakai NSAID = hentikan NSAID dan PPI; bila NSAID tidak bisa dihentikan lanjutkan NSAID atau ganti COX-2 inhibitor, obati ulkus dengan PPI lalu ko-terapi PPI atau misoprostol. Gejala menetap setelah eradikasi: pertimbangkan NSAID, resistensi antibiotik, ketidakpatuhan, diagnosis lain.
REGIMEN H. PYLORI (Fashner & Gitu 2015, Tabel 3): lini pertama triple standar = PPI, amoksisilin 1 g, klaritromisin 500 mg, 2 kali sehari, 7-10 hari sampai 14 hari, eradikasi 70-85%, preferred; atau PPI, klaritromisin 500 mg, metronidazol 500 mg 2 kali sehari 10-14 hari. Sekuensial = PPI plus amoksisilin 1 g 2 kali sehari 5 hari lalu PPI, klaritromisin 500 mg, tinidazol atau metronidazol 500 mg 2 kali sehari 5 hari, eradikasi lebih dari 84%. Lini kedua: kuadrupel non bismut/konkomitan = PPI, amoksisilin 1 g, klaritromisin 500 mg, tinidazol atau metronidazol 500 mg 2 kali sehari 10 hari, eradikasi 90%; kuadrupel bismut = bismut subsalisilat 525 mg atau subsitrat 300 mg, metronidazol 250 mg, tetrasiklin 500 mg 4 kali sehari plus PPI 2 kali sehari 10-14 hari, eradikasi 75-90%, juga bila lini pertama gagal; triple levofloksasin = PPI plus amoksisilin 1 g 2 kali sehari plus levofloksasin 500 mg sekali sehari 10 hari, salvage saja.
REGIMEN ACG 2017 versi Makmun 2021. Lini pertama: klaritromisin tripel bila resistensi klaritromisin kurang dari 15% dan tanpa riwayat makrolida = PPI 2 kali 1, klaritromisin 2 kali 500 mg, amoksisilin 2 kali 1000 mg atau metronidazol 3 kali 500 mg. Bismut kuadrupel bila riwayat makrolida atau alergi penisilin = PPI 2 kali 1, bismut subsitrat 2 kali 750 mg, tetrasiklin 4 kali 500 mg, metronidazol 3 kali 500 mg. Konkomitan bila bismut tidak tersedia = PPI 2 kali 1, klaritromisin 2 kali 500 mg, amoksisilin 2 kali 1000 mg, metronidazol 3 kali 500 mg. Sekuensial = 5-7 hari pertama PPI 1 kali 1 plus amoksisilin 2 kali 1000 mg, 5-7 hari berikutnya PPI 1 kali 1, klaritromisin 2 kali 500 mg, nitroimidazol 2 kali 500 mg. Levofloksasin tripel = PPI 2 kali 1, levofloksasin 2 kali 500 mg, amoksisilin 2 kali 1000 mg. Salvage bila gagal lini pertama, hindari antibiotik yang sama: bismut kuadrupel bagi yang sebelumnya klaritromisin; levofloksasin tripel bagi yang sebelumnya bismut atau klaritromisin; konkomitan; rifabutin tripel = PPI 2 kali 1, rifabutin 1 kali 300 mg, amoksisilin 2 kali 1000 mg; dual dosis tinggi = PPI 2 kali 1 plus amoksisilin 3 kali 1000 mg.
DOSIS OBAT PUD (Dipiro Tabel 51-9, hal 490): omeprazol 40 mg/hari awal, rentang 20-40, kategori hamil C, sesuaikan pada penyakit hati; lansoprazol 30 mg awal, 15-30, kategori B; rabeprazol 20 mg, 20-40, B, hati-hati hati berat; pantoprazol 40 mg, 40-80, B; esomeprazol 40 mg, 20-40, B, batasi 20 mg/hari pada hati berat; dexlansoprazol 30-60 mg, B. Simetidin 300 mg 4 kali, 400 mg 2 kali, atau 800 mg malam, 800-1600 mg/hari, B, sesuaikan ginjal dan hati; famotidin 20 mg 2 kali atau 40 mg malam, 20-40 mg/hari, B, sesuaikan ginjal; nizatidin 150 mg 2 kali atau 300 mg malam, B; ranitidin 150 mg 2 kali atau 300 mg malam, B, sudah ditarik di AS. Sukralfat 1 g 4 kali sehari atau 2 g 2 kali sehari, 2-4 g/hari, aluminium menumpuk pada gagal ginjal, B. Misoprostol 100-200 mcg 4 kali sehari, 400-800 mcg/hari, kategori X.
MONITORING (Dipiro Tabel 51-12, hal 494): PPI = sakit kepala, mual muntah diare, flatulens; jarang trombositopenia, neutropenia, hipomagnesemia, hipokalsemia, gangguan fungsi hati, gangguan ginjal; pantau CBC, elektrolit, fungsi ginjal/hati; risiko fraktur, pneumonia, infeksi Clostridioides difficile. H2RA = sakit kepala, pusing, diare, somnolen, ginekomastia simetidin; jarang trombositopenia, neutropenia, pankreatitis. Sukralfat = konstipasi, toksisitas aluminium, bezoar lambung. Misoprostol = diare, nyeri perut, sakit kepala, mual muntah, flatulens, dismenore, hipofosfatemia; pantau tes kehamilan dan fosfat serum; hindari pada kehamilan.
ULKUS AKIBAT OAINS (Makmun 2021): skrining H. pylori pada semua pengguna OAINS jangka panjang, hentikan OAINS bila positif; tambahkan PPI atau misoprostol bila OAINS harus lanjut, misoprostol kontraindikasi ibu hamil; gunakan OAINS selektif COX-2 dosis dan durasi minimal khusus pasien riwayat ulkus; alternatif analgesik asetaminofen; profilaksis: misoprostol 100-200 mcg 4 kali sehari, omeprazol 20-40 mg/hari, lansoprazol 15-30 mg/hari. Misoprostol (Ko & Lee 2025) analog prostaglandin E1, menurunkan ulkus duodenum akibat NSAID dari 4,6% menjadi 0,6% dan ulkus lambung dari 7,7% menjadi 1,9% dalam 12 minggu, tetapi diare dan nyeri perut sering membuat terapi dihentikan.
MISOPROSTOL (Lexidrug 2025): meningkatkan mukus pelindung dan menurunkan asam; merangsang kontraksi uterus. Absorpsi cepat, makanan mengurangi absorpsi; de-esterifikasi cepat di hati menjadi asam misoprostol aktif; ekskresi urine 80%; waktu paruh 20-40 menit. Efek samping kram perut, mual, muntah, diare paling sering. Interaksi: antasida terutama yang mengandung magnesium meningkatkan toksisitas misoprostol berupa diare, risiko X hindari.
SITOPROTEKTIF (Makmun 2021): sukralfat berikatan dengan protein eksudat ulkus membentuk lapisan adhesif, 1.000 mg 3 kali sehari oral, dapat mengikat obat lain sehingga beri jeda sekitar 2 jam; rebamipide meningkatkan ekspresi EGF dan EGFR, merangsang mukus dan perfusi submukosa, 100 mg 3 kali sehari oral, adjuvan regenerasi epitel.
KOMPLIKASI PERDARAHAN (Makmun 2021): komplikasi tersering, sekitar 15% pasien, mortalitas 5-10% dalam 30 hari; selain endoskopi, supresi asam penting; asam mendukung pepsin yang mendegradasi bekuan fibrin; target pH mukosa lebih dari 6 agar hemostasis primer tercapai; PPI pilihan utama karena mempertahankan pH lebih dari 6 lebih lama daripada H2 blocker.
KOMPLIKASI PERFORASI (Makmun 2021): trias nyeri perut, takikardia, rigiditas abdomen; demam dan leukositosis menyertai peritonitis sekunder; CT abdomen lebih sensitif mendeteksi udara bebas, foto polos tidak selalu menunjukkan udara subdiafragma; tatalaksana awal NPO, selang nasogastrik, resusitasi cairan, PPI IV, antibiotik spektrum luas, konsultasi bedah secara simultan; kondisi gawat bedah.`,
    poin: [
      "definisi ulkus: diameter lebih dari 5 mm, peran asam dan pepsin",
      "pola nyeri PUD: perut kosong, malam hari, mereda setelah makan atau antasida",
      "alur Dipiro untuk pasien gejala ulkus tanpa alarm symptom yang memakai NSAID",
      "alur Dipiro: alarm symptom perdarahan, anemia, penurunan BB, kapan endoskopi",
      "alur Dipiro: ulkus H. pylori negatif pada pengguna NSAID yang tidak bisa berhenti NSAID",
      "regimen triple standar PPI, amoksisilin 1 g, klaritromisin 500 mg 2 kali sehari, durasi dan angka eradikasi",
      "bismut kuadrupel untuk alergi penisilin atau riwayat makrolida dengan dosis ACG 2017 versi Makmun",
      "regimen konkomitan bila bismut tidak tersedia",
      "terapi sekuensial: 5-7 hari pertama dan 5-7 hari berikutnya",
      "salvage therapy: prinsip hindari antibiotik yang sama, levofloksasin tripel, rifabutin tripel, dual dosis tinggi",
      "kategori kehamilan obat PUD: omeprazol C, PPI lain B, misoprostol X, H2RA B",
      "dosis awal dan rentang PPI untuk ulkus serta penyesuaian pada penyakit hati berat",
      "dosis H2RA untuk ulkus termasuk dosis tunggal malam hari dan penyesuaian ginjal",
      "sukralfat: dosis 1 g 4 kali atau 2 g 2 kali, jeda 2 jam dari obat lain, aluminium pada gagal ginjal, bezoar",
      "rebamipide 100 mg 3 kali sehari dan mekanismenya lewat EGF",
      "misoprostol: dosis 100-200 mcg 4 kali sehari, kategori X, diare, tes kehamilan dan fosfat",
      "interaksi misoprostol dengan antasida magnesium risiko X",
      "farmakokinetik misoprostol: makanan mengurangi absorpsi, waktu paruh 20-40 menit",
      "data Ko & Lee 2025: penurunan ulkus duodenum dan lambung dengan misoprostol dan alasan sering dihentikan",
      "tatalaksana ulkus akibat OAINS: skrining H. pylori, COX-2 selektif, asetaminofen, dosis profilaksis PPI",
      "monitoring PPI pada PUD: CBC, elektrolit, fungsi ginjal hati, C. difficile",
      "efek samping H2RA jarang: pankreatitis, trombositopenia; ginekomastia simetidin",
      "perdarahan ulkus: 15% pasien, mortalitas 5-10%, target pH lebih dari 6, mengapa PPI bukan H2 blocker",
      "perforasi: trias klinis, tanda peritonitis, CT abdomen, tatalaksana awal simultan",
      "penyebab utama PUD dan terapi non farmakologi",
    ],
  },

  "Hepatitis A": {
    ringkasan: `VIRUS: hepatitis A adalah virus RNA untai positif tanpa selubung, picornavirus, ditularkan fekal-oral melalui kontak orang ke orang, menyebabkan peradangan hati; biasanya infeksi akut self-limiting, jarang fatal. Sumber: Husna & Nurhidayati 2024; Langan & Goodbred 2021; Dipiro 12 ed hal 591.
EPIDEMIOLOGI: sekitar 1,4 juta kasus per tahun global dan meningkat; jangkauan vaksinasi 78% dan menurun di daerah tertentu; prevalensi tinggi di negara berkembang dengan sanitasi buruk terutama Asia Tenggara dan Afrika; anak di daerah endemik insiden tertinggi dan sering asimtomatik; program vaksinasi menurunkan kejadian hingga 95%.
PENULARAN DAN INKUBASI (Kemenkes 2020): fekal-oral; virus dikeluarkan lewat feses; penularan lewat makanan dan air terkontaminasi; kelompok risiko anak dan pelancong ke daerah endemik; masa inkubasi 15-50 hari, rata-rata 28-30 hari.
PATOFISIOLOGI: HAV menginfeksi hepatosit dan bereplikasi di sitoplasma; aktivasi imun menyebabkan peradangan dan lisis sel; penyembuhan dengan regenerasi hepatosit dan imunitas seumur hidup.
MANIFESTASI KLINIS (NSW 2019): fase prodromal 1-2 minggu = demam ringan, kelelahan, mual, muntah, anoreksia; fase ikterik 2-4 minggu = jaundice, urine gelap, feses dempul, hepatomegali; fase recovery 2-6 minggu = perbaikan bertahap, normalisasi fungsi hati.
DIAGNOSIS: serologi. IgM anti-HAV = penanda infeksi akut, infeksi baru atau sedang berlangsung. IgG anti-HAV = pemulihan dari infeksi sebelumnya atau keberhasilan vaksinasi, perlindungan jangka panjang. Laboratorium pendukung: ALT dan AST fungsi hati, bilirubin total untuk jaundice, darah lengkap.
TATALAKSANA: terapi suportif dan pemantauan; tidak ada antivirus spesifik. Pencegahan: vaksinasi, higienitas, sanitasi, edukasi; pemeriksaan dini.
INDIKASI VAKSIN (Dipiro Tabel 58-2): semua anak usia 1 tahun; anak 2-18 tahun yang belum divaksin; pelancong atau pekerja ke negara endemisitas tinggi atau sedang; laki-laki yang berhubungan seks dengan laki-laki; pengguna narkoba suntik maupun bukan suntik; risiko pekerjaan seperti bekerja dengan primata terinfeksi HAV atau di laboratorium HAV; penyakit hati kronis termasuk hepatitis B dan C; kontak dekat dengan anak adopsi internasional dari negara endemis dalam 60 hari pertama; siapa pun yang ingin vaksin. Pelancong ke Kanada, Eropa Barat, Jepang, Australia, Selandia Baru tidak berisiko lebih tinggi.
DOSIS VAKSIN (Dipiro Tabel 58-3): HAVRIX usia 1-18 tahun 720 ELISA unit 0,5 mL, 2 dosis, jadwal 0 dan 6-12 bulan; HAVRIX usia 19 tahun ke atas 1.440 ELISA unit 1 mL, 2 dosis, 0 dan 6-12 bulan. VAQTA usia 1-18 tahun 25 unit 0,5 mL, 2 dosis, 0 dan 6-18 bulan; VAQTA 19 tahun ke atas 50 unit 1 mL, 2 dosis, 0 dan 6-18 bulan. TWINRIX kombinasi A dan B usia 18 tahun ke atas 720 ELISA unit 1 mL, 3 dosis, 0, 1, 6 bulan; jadwal dipercepat 4 dosis hari 0, 7, 21-30, dan booster 12 bulan; TWINRIX juga mengandung 20 mcg HBsAg dan butuh 3 dosis untuk respons HBV adekuat.
MEREK DI INDONESIA (Imuni 2025): AVAXIM 80U pediatrik dan 160 U dewasa produksi Sanofi; HAVRIX 720 dan 1440 produksi GSK; TWINRIX kombinasi A dan B produksi GSK. TWINRIX anak 2-15 tahun 2 dosis jarak 6 bulan; usia lebih dari 16 tahun dan dewasa 3 dosis jarak 0, 1, 6 bulan.`,
    poin: [
      "karakter virus HAV: RNA, tanpa selubung, picornavirus, self-limiting",
      "cara penularan fekal-oral dan masa inkubasi 15-50 hari rata-rata 28-30 hari",
      "kelompok berisiko dan epidemiologi: anak daerah endemik, pelancong, sanitasi buruk, efek vaksinasi 95%",
      "tiga fase klinis: prodromal, ikterik, recovery beserta durasi dan gejalanya",
      "interpretasi IgM anti-HAV versus IgG anti-HAV dalam skenario yang berbeda",
      "pemeriksaan laboratorium pendukung: ALT AST, bilirubin total, darah lengkap",
      "prinsip tatalaksana: suportif, tanpa antivirus spesifik, pemantauan",
      "pencegahan: vaksinasi, higienitas, sanitasi, edukasi",
      "indikasi vaksinasi hepatitis A menurut Dipiro Tabel 58-2, termasuk penyakit hati kronis dan risiko pekerjaan",
      "negara tujuan yang tidak menambah risiko: Kanada, Eropa Barat, Jepang, Australia, Selandia Baru",
      "dosis HAVRIX anak 720 ELISA unit 0,5 mL versus dewasa 1.440 ELISA unit 1 mL, jadwal 0 dan 6-12 bulan",
      "dosis VAQTA anak 25 unit 0,5 mL versus dewasa 50 unit 1 mL, jadwal 0 dan 6-18 bulan",
      "TWINRIX standar 3 dosis 0, 1, 6 bulan versus jadwal dipercepat 4 dosis hari 0, 7, 21-30, dan 12 bulan",
      "TWINRIX mengandung 20 mcg HBsAg dan butuh 3 dosis untuk respons hepatitis B",
      "merek vaksin hepatitis A di Indonesia: AVAXIM 80U dan 160 U, HAVRIX 720 dan 1440, produsen",
      "jadwal TWINRIX versi Imuni: anak 2-15 tahun 2 dosis jarak 6 bulan, dewasa 3 dosis",
      "patofisiologi: replikasi di sitoplasma hepatosit, lisis akibat respons imun, imunitas seumur hidup",
    ],
  },

  "Hepatitis B": {
    ringkasan: `VIRUS: hepatitis B adalah virus DNA famili Hepadnaviridae yang menginfeksi hepatosit secara kronis; transmisi melalui darah, hubungan seksual, dan vertikal ibu ke anak; masa inkubasi 45-180 hari, rata-rata 60-90 hari. Sumber: Menkes RI 2019; Kemenkes 2020.
EPIDEMIOLOGI (Infodatin 2023): 296 juta orang hidup dengan hepatitis B kronis global; 820 ribu kematian per tahun; Asia Tenggara sekitar 60 juta, rentang 45-121 juta.
PATOFISIOLOGI: HBV masuk hepatosit lewat reseptor NTCP; pembentukan cccDNA dan replikasi genom; aktivasi sel T sitotoksik dan peradangan kronis; fibrosis progresif.
FASE (Kemenkes 2023 hal 8): 1 immune tolerant = HBeAg positif, HBV DNA tinggi, ALT normal; 2 immune clearance = HBeAg positif, HBV DNA dan ALT fluktuatif; 3 pengidap inaktif = HBeAg negatif, HBV DNA rendah kurang dari 2.000 IU/mL, ALT normal; 4 reaktivasi = HBeAg negatif, HBV DNA meningkat, ALT tinggi.
MARKER (Kemenkes 2023): HBsAg = infeksi aktif; anti-HBs = imunitas/vaksinasi; HBeAg = replikasi aktif; anti-HBe = serokonversi; anti-HBc IgM = infeksi akut; HBV DNA = viral load. Interpretasi: infeksi akut = HBsAg positif, anti-HBc IgM positif, anti-HBs negatif; infeksi kronis = HBsAg positif lebih dari 6 bulan, anti-HBc IgG positif; imun karena infeksi lampau = HBsAg negatif, anti-HBs positif, anti-HBc positif; imun karena vaksinasi = HBsAg negatif, anti-HBs positif, anti-HBc negatif.
KRITERIA DIAGNOSIS (Dipiro hal 597; Menkes 2019): HBsAg positif lebih dari 6 bulan = kronis; konfirmasi HBV DNA; evaluasi fase lewat HBeAg/anti-HBe; aktivitas lewat ALT AST; staging fibrosis dengan biopsi atau elastografi.
MANIFESTASI KRONIK (Menkes 2019): 70% asimtomatik; 30% simtomatik seperti fatigue, nyeri abdomen, demam, muntah, jaundice; 15% berkembang jadi sirosis atau karsinoma hepatoseluler.
SASARAN TERAPI (EASL 2025): supresi viral, kontrol inflamasi, pencegahan fibrosis, reduksi risiko HCC; target HBV DNA kurang dari 2.000 IU/mL dan normalisasi ALT.
INDIKASI TERAPI (EASL 2025): HBeAg positif = HBV DNA lebih dari 2.000 IU/mL plus ALT lebih dari 2 kali ULN atau fibrosis signifikan; HBeAg negatif = HBV DNA lebih dari 2.000 IU/mL plus ALT lebih dari ULN atau fibrosis moderate-severe; sirosis kompensata = HBV DNA terdeteksi tanpa memandang ALT. Algoritma EASL: fibrosis lanjut atau sirosis dengan HBV DNA positif = terapi; tanpa fibrosis lanjut, HBV DNA 2.000 IU/mL atau lebih ditambah ALT lebih dari ULN atau fibrosis atau faktor risiko HCC atau manifestasi ekstrahepatik atau imunosupresi atau risiko transmisi = terapi; selain itu monitoring. Tenofovir pada ibu hamil dengan HBV DNA 200.000 IU/mL atau lebih.
IBU HAMIL (Kemenkes 2023 hal 46, Gambar 11): tes HBsAg pada ibu hamil dengan RDT atau ELISA/CLIA. HBsAg positif: tes DNA VHB atau HBeAg bila DNA tidak ada, dan nilai sirosis. DNA kurang dari 200.000 IU/mL atau HBeAg negatif tanpa sirosis = tidak perlu profilaksis tenofovir, tunda terapi jangka panjang, tetap pantau dan nilai kembali. DNA 200.000 IU/mL atau lebih, setara 5,3 log10, atau HBeAg positif tanpa sirosis = mulai profilaksis tenofovir dari minggu ke-28 kehamilan sampai setidaknya saat persalinan, lalu nilai kembali untuk terapi jangka panjang sesudah bersalin. Ada sirosis, DNA lebih dari 20.000 IU/mL plus ALT abnormal persisten = mulai terapi tenofovir jangka panjang pada ibu dan pantau.
LINI TERAPI (Menkes RI 2019): pilihan peg-interferon dan analog nukleos(t)ida; lini pertama = peg-interferon, entecavir, atau tenofovir; analog nukleos(t)ida lini pertama = tenofovir 300 mg per hari atau entecavir 0,5 mg per hari, rekomendasi A1; lini kedua bila tidak tersedia = lamivudin 100 mg/hari, adefovir 10 mg/hari, telbivudin 600 mg/hari, rekomendasi A2.
OBAT (Lexidrug 2025): tenofovir disoproxil fumarate TDF analog nukleotida adenin, hambat DNA polimerase HBV, 300 mg sekali sehari, lini pertama, aman jangka panjang, resistensi rendah. Tenofovir alafenamide TAF, prodrug, lebih selektif di hati, efek samping ginjal dan tulang lebih sedikit, 25 mg sekali sehari, pilihan terbaik pada risiko gangguan ginjal atau tulang. Entecavir analog nukleosida guanosin, menghambat priming, reverse transcription, dan sintesis DNA, 0,5 mg sekali sehari pada pasien naif atau 1 mg sekali sehari bila resisten lamivudin, lini pertama, diminum saat perut kosong. Lamivudin analog sitidin 100 mg sekali sehari, jarang dipakai karena resistensi tinggi. Adefovir dipivoxil 10 mg sekali sehari, nefrotoksik, jarang dipakai. Telbivudin analog timidin 600 mg sekali sehari, efektif tetapi cepat resisten. Interferon alfa-2b 5-10 juta IU subkutan 3 kali seminggu selama 16-24 minggu, efek samping flu-like syndrome, depresi, kelelahan. Peginterferon alfa-2a 180 mcg subkutan sekali seminggu selama 48 minggu, lini alternatif, cocok pasien muda dengan fungsi hati baik.
TERRAULT 2016 Tabel 4: peg-IFN kategori hamil C, efek samping flu-like, mood, sitopenia, autoimun; pantau CBC bulanan sampai tiap 3 bulan dan TSH tiap 3 bulan. Lamivudin C, pankreatitis, asidosis laktat. Telbivudin B, peningkatan creatine kinase dan miopati, neuropati perifer; pantau CK. Entecavir C, asidosis laktat. Adefovir C, gagal ginjal akut, sindrom Fanconi, diabetes insipidus nefrogenik; klirens kreatinin awal, pantau kreatinin, fosfat, glukosa urine, protein tiap tahun. Tenofovir B, nefropati, sindrom Fanconi, osteomalasia, asidosis laktat; klirens kreatinin awal, pantau ginjal, pertimbangkan densitas tulang bila riwayat fraktur atau osteopenia. Anak: entecavir usia 2 tahun ke atas berbasis berat badan 10-30 kg, di atas 30 kg 0,5 mg; tenofovir usia 12 tahun ke atas 300 mg; lamivudin 3 mg/kg maksimal 100 mg.
POPULASI KHUSUS (Menkes 2019): ibu hamil = tenofovir kategori B aman untuk pencegahan transmisi vertikal, entecavir kategori C pertimbangan risiko-manfaat; geriatri = sesuaikan dosis dengan fungsi ginjal, monitor ketat pada komorbiditas multipel; gangguan ginjal = reduksi dosis atau perpanjangan interval bila klirens kreatinin kurang dari 50 mL/menit.
NON FARMAKOLOGI: vaksinasi keluarga dan kontak seksual dengan seri 3 dosis; eliminasi alkohol, diet seimbang, olahraga teratur, manajemen berat badan; monitoring HBV DNA, ALT, AFP tiap 3-6 bulan dan USG abdomen tiap 6 bulan untuk skrining HCC.
VAKSIN HEPATITIS B (Imuni 2025): merek ENGERIX B GSK, VECON Bio Farma Indonesia 10 mcg pediatrik dan 20 mcg dewasa, EUVAX B Sanofi, TWINRIX GSK kombinasi. Jadwal anak: dosis 0 dalam 24 jam setelah lahir di rumah sakit, dosis 1 usia 2 bulan, dosis 2 usia 3 bulan, dosis 3 usia 4 bulan, dosis 4 usia 18 bulan booster; dapat lewat vaksin kombinasi INFANRIX HEXA, HEXAXIM, PENTABIO. Jadwal dewasa 3 dosis jarak 0, 1, 6 bulan. TWINRIX anak 2-15 tahun 2 dosis jarak 6 bulan; usia lebih dari 16 tahun 3 dosis 0, 1, 6 bulan.`,
    poin: [
      "karakter virus HBV, jalur transmisi, dan masa inkubasi 45-180 hari rata-rata 60-90 hari",
      "empat fase hepatitis B kronis dan profil HBeAg, HBV DNA, ALT tiap fase",
      "arti tiap marker: HBsAg, anti-HBs, HBeAg, anti-HBe, anti-HBc IgM, HBV DNA",
      "interpretasi kombinasi serologi: akut, kronis, imun pasca infeksi, imun pasca vaksinasi",
      "kriteria diagnosis kronis: HBsAg lebih dari 6 bulan, HBV DNA, fase, aktivitas, staging fibrosis",
      "indikasi terapi EASL 2025 untuk HBeAg positif, HBeAg negatif, dan sirosis kompensata",
      "target terapi: HBV DNA kurang dari 2.000 IU/mL dan normalisasi ALT",
      "alur ibu hamil Kemenkes 2023: ambang 200.000 IU/mL atau 5,3 log10, mulai tenofovir minggu ke-28",
      "ibu hamil dengan DNA rendah atau HBeAg negatif tanpa sirosis: tunda terapi, pantau",
      "ibu hamil dengan sirosis dan DNA lebih dari 20.000 IU/mL plus ALT abnormal: terapi jangka panjang",
      "lini pertama Menkes 2019: tenofovir 300 mg atau entecavir 0,5 mg; lini kedua lamivudin, adefovir, telbivudin dengan dosis",
      "entecavir 0,5 mg naif versus 1 mg resisten lamivudin, mekanisme tiga aktivitas polimerase, perut kosong",
      "TAF 25 mg versus TDF 300 mg: kapan memilih TAF",
      "efek samping dan pemantauan tenofovir: nefropati, Fanconi, osteomalasia, klirens kreatinin, densitas tulang",
      "adefovir: nefrotoksik, pemantauan kreatinin fosfat glukosa urine protein tahunan",
      "telbivudin: kategori B tetapi resistensi cepat, miopati dan CK; lamivudin pankreatitis",
      "interferon alfa-2b versus peginterferon alfa-2a: dosis, rute, durasi, efek samping, pemantauan CBC dan TSH",
      "kategori kehamilan antivirus: tenofovir B, telbivudin B, entecavir C, lamivudin C, adefovir C, peg-IFN C",
      "penyesuaian dosis pada klirens kreatinin kurang dari 50 mL/menit dan pada geriatri",
      "monitoring berkala pasien kronis: HBV DNA, ALT, AFP tiap 3-6 bulan, USG tiap 6 bulan",
      "vaksinasi kontak serumah dan pasangan seksual: seri 3 dosis 0, 1, 6 bulan",
      "jadwal vaksin hepatitis B bayi: 24 jam setelah lahir, 2, 3, 4 bulan, booster 18 bulan",
      "merek vaksin hepatitis B: ENGERIX B, VECON 10 dan 20 mcg, EUVAX B, kombinasi INFANRIX HEXA, HEXAXIM, PENTABIO",
      "epidemiologi: 296 juta, 820 ribu kematian, Asia Tenggara 60 juta; 70% asimtomatik, 15% komplikasi",
      "patofisiologi: reseptor NTCP, cccDNA, sel T sitotoksik, fibrosis",
      "dosis anak: entecavir usia 2 tahun berbasis BB, tenofovir usia 12 tahun 300 mg, lamivudin 3 mg/kg",
    ],
  },
};

/** Random sample of `k` testable points for a topic. */
export function pickPoin(topic, k) {
  const list = [...((MATERI[topic] && MATERI[topic].poin) || [])];
  const out = [];
  while (out.length < k && list.length) {
    out.push(list.splice(Math.floor(Math.random() * list.length), 1)[0]);
  }
  return out;
}
