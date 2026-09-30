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
export const CASE_SCHEMA = {
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
};

export const CASES_SCHEMA = {
  type: "object",
  properties: { cases: { type: "array", items: CASE_SCHEMA } },
  required: ["cases"],
  additionalProperties: false,
};

const prevStemsOf = (previousCases) =>
  previousCases
    .flatMap((c) => [c.title, ...c.questions.map((q) => q.q)])
    .slice(0, 80)
    .map((s) => `- ${s}`)
    .join("\n") || "- (tidak ada)";

const RULES = `Aturan isi:
- Setiap kasus: "title" berupa inisial dan usia (contoh: "Tn. B, 47 tahun"), "text" berupa skenario 2–4 kalimat yang memuat data klinis yang dibutuhkan untuk menjawab semua soal kasus itu.
- Setiap soal: 4 pilihan (o), satu jawaban benar (a = indeks 0–3), dan pembahasan (e) 1–3 kalimat yang menjelaskan mengapa jawaban itu benar dan mengapa pengecoh salah bila relevan.
- Sebarkan indeks jawaban benar secara merata; jangan menaruh jawaban benar di indeks yang sama untuk lebih dari dua soal berturut-turut.
- Pengecoh harus masuk akal secara klinis (obat, dosis, atau tindakan yang benar-benar ada), bukan jawaban konyol.
- DILARANG memakai tanda kurung ( ) di pertanyaan (q) maupun di semua pilihan jawaban (o). Tulis keterangan tambahan sebagai bagian kalimat biasa, misalnya "Tenofovir, kategori kehamilan B" bukan "Tenofovir (kategori B)". Jangan menaruh petunjuk di pilihan yang membuat jawaban benar terlihat berbeda dari pengecoh; semua pilihan harus panjang dan gayanya setara.
- Konten harus sesuai konsensus dan pedoman yang umum dipakai di Indonesia dan internasional (Konsensus GERD Indonesia, pedoman eradikasi H. pylori, PNPK/Kemenkes 2023 untuk hepatitis B, EASL, ACIP untuk vaksin hepatitis A). Sebutkan dosis dan jadwal yang lazim. Jika ada perbedaan antar sumber, pilih yang paling umum diajarkan dan sebutkan singkat di pembahasan.
- Cakup variasi: obat (PPI, H2RA, antasida, sukralfat, misoprostol, regimen eradikasi, tenofovir, entecavir, vaksin HAV/HBV/kombinasi, HBIG), pemantauan, interaksi, populasi khusus (hamil, lansia, gangguan ginjal), komplikasi, dan interpretasi serologi.
- Gunakan simbol × untuk frekuensi (contoh: 2×/hari) dan – untuk rentang.`;

const INTRO = `Kamu adalah dosen farmakologi klinik/farmakoterapi yang menyusun kuis kasus untuk mahasiswa kedokteran dan farmasi di Indonesia.`;

const NOVELTY = `harus benar-benar baru dan berbeda dari set sebelumnya dari segala sisi: pasien (nama inisial, usia, jenis kelamin, pekerjaan, komorbid), latar layanan, alur cerita kasus, sudut pandang pertanyaan, pilihan jawaban, dan pembahasan. Jangan mengulang atau memparafrasakan soal lama.`;

const planLine = (p, i) => {
  const angles = pick(ANGLES, 3).join("; ");
  const setting = pick(SETTINGS, 1)[0];
  return `${i + 1}. topic "${p.topic}", ${p.n} soal, latar: ${setting}, sudut pandang yang harus tercakup: ${angles}`;
};

const nonce = () => Math.random().toString(36).slice(2, 8);

/**
 * Prompt for the whole set in one reply (used by the claude.ai artifact and
 * the Claude API path). `previousCases` is the set the student just used.
 */
export function buildPrompt(previousCases = []) {
  return `${INTRO}

Buat SATU SET BARU soal kasus klinis dalam bahasa Indonesia tentang GERD, PUD (tukak peptik), Hepatitis A, dan Hepatitis B. Set ini ${NOVELTY}

Rencana set (ikuti persis urutan, topik, dan jumlah soal per kasus):
${CASE_PLAN.map(planLine).join("\n")}

${RULES}

Hindari mengulang judul atau pertanyaan berikut (set sebelumnya):
${prevStemsOf(previousCases)}

Balas HANYA dengan JSON valid berbentuk:
{"cases":[{"topic":"GERD","title":"...","text":"...","questions":[{"q":"...","o":["...","...","...","..."],"a":0,"e":"..."}]}]}

Tanpa teks lain, tanpa blok kode. Kode variasi: ${nonce()}`;
}

/**
 * Prompt for ONE case of the plan (index `i`). Small replies are far more
 * reliable from small models, and the 7 requests can run in parallel.
 */
export function buildCasePrompt(previousCases = [], i) {
  const p = CASE_PLAN[i];
  return `${INTRO}

Buat SATU kasus klinis baru dalam bahasa Indonesia untuk kuis. Kasus ini ${NOVELTY}

Kasus yang diminta:
${planLine(p, i)}

${RULES}

Hindari mengulang judul atau pertanyaan berikut (set sebelumnya):
${prevStemsOf(previousCases)}

Balas HANYA dengan JSON valid berbentuk:
{"topic":"${p.topic}","title":"...","text":"...","questions":[{"q":"...","o":["...","...","...","..."],"a":0,"e":"..."}]}

Tepat ${p.n} soal. Tanpa teks lain, tanpa blok kode. Kode variasi: ${nonce()}`;
}

/**
 * Remove parentheses from a question or option. "Tenofovir (kategori B)"
 * becomes "Tenofovir, kategori B" so no information is lost but nothing is
 * bracketed. Safety net for when the model ignores the prompt rule.
 */
export function stripParens(s) {
  return String(s)
    .replace(/\s*\(\s*/g, ", ")
    .replace(/\s*\)/g, "")
    .replace(/^,\s*/, "")
    .replace(/,\s*,/g, ",")
    .replace(/,\s*$/, "")
    .replace(/\s{2,}/g, " ")
    .trim();
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
  if (cases.length < CASE_PLAN.length) {
    throw new Error(
      `Balasan hanya berisi ${cases.length} kasus, seharusnya ${CASE_PLAN.length}.`
    );
  }
  // Classification always follows CASE_PLAN (same ids and topics as the
  // built-in set), whatever the model labelled them.
  return cases.slice(0, CASE_PLAN.length).map((c, i) => {
    const plan = CASE_PLAN[i];
    if (!c || typeof c !== "object") throw new Error(`Kasus ${i + 1} tidak valid.`);
    const topic = plan.topic;
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
      // Shuffle the options ourselves: models tend to put the correct answer
      // first, which would make the quiz guessable.
      const order = pick([0, 1, 2, 3], 4);
      return {
        q: stripParens(q.q),
        o: order.map((k) => stripParens(q.o[k])),
        a: order.indexOf(a),
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
