// Shared logic for generating a brand-new set of cases with Claude.
// Used by the browser (to build the prompt and validate the reply) and by the
// Node API handler (to build the JSON schema the API must follow).

export const TOPICS = ["GERD", "PUD", "Hepatitis A", "Hepatitis B"];

// Same shape as the original set: 7 cases, same topic distribution.
export const CASE_PLAN = [
  { id: "c1", topic: "GERD", n: 3 },
  { id: "c2", topic: "GERD", n: 3 },
  { id: "c3", topic: "PUD", n: 4 },
  { id: "c4", topic: "PUD", n: 3 },
  { id: "c5", topic: "Hepatitis A", n: 4 },
  { id: "c6", topic: "Hepatitis B", n: 5 },
  { id: "c7", topic: "Hepatitis B", n: 3 },
];

const ANGLES = [
  "diagnosis dan alarm symptom",
  "pilihan obat lini pertama dan dosis",
  "interaksi obat",
  "efek samping dan pemantauan jangka panjang",
  "komplikasi dan kegawatan",
  "interpretasi hasil laboratorium/serologi",
  "vaksinasi dan profilaksis",
  "edukasi dan modifikasi gaya hidup",
  "tatalaksana pada kehamilan atau komorbid",
  "indikasi rujukan dan pemeriksaan penunjang",
  "patofisiologi yang mendasari pilihan terapi",
  "durasi terapi dan evaluasi respons",
];

const SETTINGS = [
  "puskesmas di daerah pedesaan",
  "IGD rumah sakit tipe C",
  "poliklinik penyakit dalam",
  "klinik pratama di kota besar",
  "posko kesehatan asrama mahasiswa",
  "puskesmas pelabuhan",
  "layanan kesehatan pesantren",
  "klinik perusahaan",
];

const pick = (arr, k) => {
  const copy = [...arr];
  const out = [];
  while (out.length < k && copy.length) {
    out.push(copy.splice(Math.floor(Math.random() * copy.length), 1)[0]);
  }
  return out;
};

// JSON schema for the whole reply. The Node handler passes this to the API as
// a structured-output format; the browser uses it only for documentation.
export const CASES_SCHEMA = {
  type: "object",
  properties: {
    cases: {
      type: "array",
      items: {
        type: "object",
        properties: {
          topic: { type: "string", enum: TOPICS },
          title: { type: "string" },
          text: { type: "string" },
          questions: {
            type: "array",
            items: {
              type: "object",
              properties: {
                q: { type: "string" },
                o: { type: "array", items: { type: "string" } },
                a: { type: "integer" },
                e: { type: "string" },
              },
              required: ["q", "o", "a", "e"],
              additionalProperties: false,
            },
          },
        },
        required: ["topic", "title", "text", "questions"],
        additionalProperties: false,
      },
    },
  },
  required: ["cases"],
  additionalProperties: false,
};

/**
 * Build the prompt for one fresh set. `previousCases` is the set the student
 * just used, so the new set can steer clear of it.
 */
export function buildPrompt(previousCases = []) {
  const prevStems = previousCases
    .flatMap((c) => [c.title, ...c.questions.map((q) => q.q)])
    .slice(0, 80)
    .map((s) => `- ${s}`)
    .join("\n");

  const plan = CASE_PLAN.map((p, i) => {
    const angles = pick(ANGLES, 3).join("; ");
    const setting = pick(SETTINGS, 1)[0];
    return `${i + 1}. topic "${p.topic}", ${p.n} soal, latar: ${setting}, sudut pandang yang harus tercakup: ${angles}`;
  }).join("\n");

  const nonce = Math.random().toString(36).slice(2, 8);

  return `Kamu adalah dosen farmakologi klinik/farmakoterapi yang menyusun kuis kasus untuk mahasiswa kedokteran dan farmasi di Indonesia.

Buat SATU SET BARU soal kasus klinis dalam bahasa Indonesia tentang GERD, PUD (tukak peptik), Hepatitis A, dan Hepatitis B. Set ini harus benar-benar baru dan berbeda dari set sebelumnya dari segala sisi: pasien (nama inisial, usia, jenis kelamin, pekerjaan, komorbid), latar layanan, alur cerita kasus, sudut pandang pertanyaan, pilihan jawaban, dan pembahasan. Jangan mengulang atau memparafrasakan soal lama.

Rencana set (ikuti persis urutan, topik, dan jumlah soal per kasus):
${plan}

Aturan isi:
- Setiap kasus: "title" berupa inisial dan usia (contoh: "Tn. B, 47 tahun"), "text" berupa skenario 2–4 kalimat yang memuat data klinis yang dibutuhkan untuk menjawab semua soal kasus itu.
- Setiap soal: 4 pilihan (o), satu jawaban benar (a = indeks 0–3), dan pembahasan (e) 1–3 kalimat yang menjelaskan mengapa jawaban itu benar dan mengapa pengecoh salah bila relevan.
- Sebarkan indeks jawaban benar secara merata; jangan menaruh jawaban benar di indeks yang sama untuk lebih dari dua soal berturut-turut.
- Pengecoh harus masuk akal secara klinis (obat, dosis, atau tindakan yang benar-benar ada), bukan jawaban konyol.
- Konten harus sesuai konsensus dan pedoman yang umum dipakai di Indonesia dan internasional (Konsensus GERD Indonesia, pedoman eradikasi H. pylori, PNPK/Kemenkes 2023 untuk hepatitis B, EASL, ACIP untuk vaksin hepatitis A). Sebutkan dosis dan jadwal yang lazim. Jika ada perbedaan antar sumber, pilih yang paling umum diajarkan dan sebutkan singkat di pembahasan.
- Cakup variasi: obat (PPI, H2RA, antasida, sukralfat, misoprostol, regimen eradikasi, tenofovir, entecavir, vaksin HAV/HBV/kombinasi, HBIG), pemantauan, interaksi, populasi khusus (hamil, lansia, gangguan ginjal), komplikasi, dan interpretasi serologi.
- Gunakan simbol × untuk frekuensi (contoh: 2×/hari) dan – untuk rentang.

Hindari mengulang judul atau pertanyaan berikut (set sebelumnya):
${prevStems || "- (tidak ada)"}

Balas HANYA dengan JSON valid berbentuk:
{"cases":[{"topic":"GERD","title":"...","text":"...","questions":[{"q":"...","o":["...","...","...","..."],"a":0,"e":"..."}]}]}

Tanpa teks lain, tanpa blok kode. Kode variasi: ${nonce}`;
}

/**
 * Validate and normalise a reply. Returns an array of cases in the same
 * shape as the built-in set, or throws with a readable message.
 */
export function normalizeCases(data) {
  const cases = Array.isArray(data) ? data : data && data.cases;
  if (!Array.isArray(cases) || cases.length === 0) {
    throw new Error("Balasan tidak berisi daftar kasus.");
  }
  return cases.map((c, i) => {
    const plan = CASE_PLAN[i] || { id: `g${i + 1}` };
    if (!c || typeof c !== "object") throw new Error(`Kasus ${i + 1} tidak valid.`);
    const topic = TOPICS.includes(c.topic) ? c.topic : plan.topic;
    if (!topic) throw new Error(`Kasus ${i + 1}: topik tidak dikenal.`);
    if (!Array.isArray(c.questions) || c.questions.length === 0) {
      throw new Error(`Kasus ${i + 1}: tidak ada soal.`);
    }
    const questions = c.questions.map((q, j) => {
      if (!q || typeof q.q !== "string" || !Array.isArray(q.o) || q.o.length !== 4) {
        throw new Error(`Kasus ${i + 1} soal ${j + 1}: harus punya 4 pilihan.`);
      }
      const a = Number(q.a);
      if (!Number.isInteger(a) || a < 0 || a > 3) {
        throw new Error(`Kasus ${i + 1} soal ${j + 1}: indeks jawaban tidak valid.`);
      }
      return {
        q: q.q.trim(),
        o: q.o.map((s) => String(s).trim()),
        a,
        e: typeof q.e === "string" ? q.e.trim() : "",
      };
    });
    return {
      id: plan.id,
      topic,
      title: String(c.title || `Kasus ${i + 1}`).trim(),
      text: String(c.text || "").trim(),
      questions,
    };
  });
}
