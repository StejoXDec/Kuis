import { useState, useMemo } from "react";

const CASES = [
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

const TOPICS = ["GERD", "PUD", "Hepatitis A", "Hepatitis B"];

const buildFlat = () =>
  CASES.flatMap((c) =>
    c.questions.map((q, i) => ({ ...q, caseId: c.id, key: `${c.id}-${i}` }))
  );

const LETTERS = ["A", "B", "C", "D"];

export default function Kuis() {
  const allFlat = useMemo(buildFlat, []);
  const [queue, setQueue] = useState(allFlat);
  const [pos, setPos] = useState(0);
  const [picked, setPicked] = useState(null);
  const [results, setResults] = useState({});
  const [started, setStarted] = useState(false);
  const [topicFilter, setTopicFilter] = useState("Semua");

  const caseById = (id) => CASES.find((c) => c.id === id);
  const finished = started && pos >= queue.length;
  const cur = queue[pos];
  const c = cur ? caseById(cur.caseId) : null;
  const answered = picked !== null;
  const correctCount = queue.filter((q) => results[q.key] === true).length;

  const begin = (filter) => {
    const list =
      filter === "Semua"
        ? allFlat
        : allFlat.filter((q) => caseById(q.caseId).topic === filter);
    setTopicFilter(filter);
    setQueue(list);
    setResults({});
    setPos(0);
    setPicked(null);
    setStarted(true);
  };

  const choose = (i) => {
    if (answered) return;
    setPicked(i);
    setResults((r) => ({ ...r, [cur.key]: i === cur.a }));
  };

  const next = () => {
    setPicked(null);
    setPos((p) => p + 1);
    window.scrollTo && window.scrollTo({ top: 0 });
  };

  const retryWrong = () => {
    const wrong = queue.filter((q) => results[q.key] === false);
    setQueue(wrong);
    setResults({});
    setPos(0);
    setPicked(null);
  };

  const shell = "min-h-screen w-full bg-slate-50 text-slate-900";
  const wrap = "mx-auto max-w-xl px-4 py-6";

  if (!started) {
    return (
      <div className={shell} style={{ fontFamily: "system-ui, sans-serif" }}>
        <div className={wrap}>
          <h1 className="text-2xl font-bold leading-tight text-teal-900">
            Kuis kasus: GERD, PUD, Hepatitis A dan B
          </h1>
          <p className="mt-2 text-slate-600">
            {allFlat.length} soal dari {CASES.length} kasus. Setiap soal langsung
            menampilkan jawaban benar dan pembahasannya setelah kamu memilih.
          </p>
          <div className="mt-6 space-y-2">
            <button
              onClick={() => begin("Semua")}
              className="w-full rounded-xl bg-teal-700 px-4 py-3 text-left font-semibold text-white active:bg-teal-800"
            >
              Semua topik ({allFlat.length} soal)
            </button>
            {TOPICS.map((t) => {
              const n = allFlat.filter((q) => caseById(q.caseId).topic === t).length;
              return (
                <button
                  key={t}
                  onClick={() => begin(t)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-left font-medium active:bg-slate-100"
                >
                  {t} <span className="text-slate-500">({n} soal)</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  if (finished) {
    const total = queue.length;
    const pct = Math.round((correctCount / total) * 100);
    const wrong = queue.filter((q) => results[q.key] === false);
    const byTopic = TOPICS.map((t) => {
      const qs = queue.filter((q) => caseById(q.caseId).topic === t);
      return { t, n: qs.length, ok: qs.filter((q) => results[q.key]).length };
    }).filter((x) => x.n > 0);
    return (
      <div className={shell} style={{ fontFamily: "system-ui, sans-serif" }}>
        <div className={wrap}>
          <h1 className="text-2xl font-bold text-teal-900">Hasil kuis</h1>
          <p className="mt-3 text-5xl font-bold text-teal-700">
            {correctCount}/{total}
          </p>
          <p className="mt-1 text-slate-600">
            {pct >= 80
              ? "Sudah kuat. Cek soal yang salah lalu ulangi."
              : pct >= 60
              ? "Lumayan. Fokus ke soal yang salah di bawah."
              : "Masih perlu diulang. Baca lagi materi lini pertama dan dosisnya."}
          </p>
          <div className="mt-5 space-y-2">
            {byTopic.map((x) => (
              <div key={x.t}>
                <div className="flex justify-between text-sm">
                  <span>{x.t}</span>
                  <span>
                    {x.ok}/{x.n}
                  </span>
                </div>
                <div className="h-2 rounded bg-slate-200">
                  <div
                    className="h-2 rounded bg-teal-600"
                    style={{ width: `${(x.ok / x.n) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {wrong.length > 0 && (
            <div className="mt-6">
              <h2 className="font-semibold">Soal yang salah ({wrong.length})</h2>
              <div className="mt-2 space-y-3">
                {wrong.map((q) => (
                  <div key={q.key} className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm">
                    <p className="font-medium">{q.q}</p>
                    <p className="mt-1 text-green-800">
                      Benar: {LETTERS[q.a]}. {q.o[q.a]}
                    </p>
                    <p className="mt-1 text-slate-700">{q.e}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 space-y-2">
            {wrong.length > 0 && (
              <button
                onClick={retryWrong}
                className="w-full rounded-xl bg-teal-700 px-4 py-3 font-semibold text-white active:bg-teal-800"
              >
                Ulangi soal yang salah saja
              </button>
            )}
            <button
              onClick={() => begin(topicFilter)}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 font-medium active:bg-slate-100"
            >
              Ulangi dari awal
            </button>
            <button
              onClick={() => setStarted(false)}
              className="w-full rounded-xl px-4 py-3 font-medium text-teal-800"
            >
              Pilih topik lain
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isRight = picked === cur.a;

  return (
    <div className={shell} style={{ fontFamily: "system-ui, sans-serif" }}>
      <div className={wrap}>
        <div className="flex items-center justify-between text-sm text-slate-600">
          <span>
            Soal {pos + 1} dari {queue.length}
          </span>
          <span>Benar: {correctCount}</span>
        </div>
        <div className="mt-1 h-2 rounded bg-slate-200">
          <div
            className="h-2 rounded bg-teal-600 transition-all"
            style={{ width: `${((pos + (answered ? 1 : 0)) / queue.length) * 100}%` }}
          />
        </div>

        <div className="mt-4 rounded-xl border-l-4 border-teal-700 bg-white p-3 shadow-sm">
          <p className="text-sm font-semibold text-teal-800">
            {c.topic} · {c.title}
          </p>
          <p className="mt-1 text-sm leading-relaxed text-slate-700">{c.text}</p>
        </div>

        <h2 className="mt-4 text-lg font-semibold leading-snug">{cur.q}</h2>

        <div className="mt-3 space-y-2">
          {cur.o.map((opt, i) => {
            let cls = "border-slate-300 bg-white active:bg-slate-100";
            let badge = "bg-slate-100 text-slate-700";
            if (answered) {
              if (i === cur.a) {
                cls = "border-green-600 bg-green-50";
                badge = "bg-green-600 text-white";
              } else if (i === picked) {
                cls = "border-red-500 bg-red-50";
                badge = "bg-red-500 text-white";
              } else {
                cls = "border-slate-200 bg-white opacity-60";
              }
            }
            return (
              <button
                key={i}
                onClick={() => choose(i)}
                disabled={answered}
                className={`flex w-full items-start gap-3 rounded-xl border-2 p-3 text-left ${cls}`}
              >
                <span
                  className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-sm font-bold ${badge}`}
                >
                  {LETTERS[i]}
                </span>
                <span className="leading-snug">{opt}</span>
              </button>
            );
          })}
        </div>

        {answered && (
          <div
            className={`mt-4 rounded-xl p-4 ${
              isRight ? "bg-green-100 text-green-900" : "bg-amber-100 text-amber-950"
            }`}
            role="status"
          >
            <p className="font-bold">
              {isRight ? "Benar" : `Belum tepat. Jawaban benar: ${LETTERS[cur.a]}`}
            </p>
            {!isRight && <p className="mt-1 font-medium">{cur.o[cur.a]}</p>}
            <p className="mt-2 text-sm leading-relaxed">{cur.e}</p>
          </div>
        )}

        {answered && (
          <button
            onClick={next}
            className="mt-4 w-full rounded-xl bg-teal-700 px-4 py-3 font-semibold text-white active:bg-teal-800"
          >
            {pos + 1 === queue.length ? "Lihat hasil" : "Soal berikutnya"}
          </button>
        )}
      </div>
    </div>
  );
}
