// Shared logic for generating a brand-new set of cases with Claude.
// Used by the browser (to build the prompt and validate the reply) and by the
// Node API handler (to build the JSON schema the API must follow).

import { MATERI, pickPoin } from "./materi.js";

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
- SUMBER FAKTA: semua fakta, angka, dosis, jadwal, kategori risiko, dan istilah HARUS diambil dari MATERI KULIAH di bawah. Jangan menambahkan fakta dari luar materi. Bila sebuah poin tidak ada di materi, jangan diuji.
- Setiap kasus: "title" berupa inisial dan usia, contoh "Tn. B, 47 tahun"; "text" berupa vignette klinis 2–4 kalimat yang memuat semua data yang dibutuhkan untuk menjawab soal: keluhan, durasi, riwayat obat dengan nama dan dosis, komorbid, hasil pemeriksaan atau serologi bila relevan.
- Setiap soal menguji SATU poin materi yang ditentukan di rencana, dengan pertanyaan penerapan pada pasien itu, bukan hafalan definisi. Contoh gaya yang diinginkan: "Langkah berikutnya menurut alur tatalaksana di layanan primer adalah…", "Regimen eradikasi yang paling sesuai untuk pasien ini adalah…", "Bila obat X dipakai bersama Y, yang terjadi adalah…", "Hasil serologi ini berarti…", "Pemantauan yang perlu dipertimbangkan bila terapi lebih dari 1 tahun adalah…".
- Setiap soal: 4 pilihan (o), satu jawaban benar (a = indeks 0–3), dan pembahasan (e) 1–3 kalimat yang menjelaskan alasan jawaban benar, menyebut sumber persis seperti tertulis di materi, misalnya "Dipiro 12 ed hal 468" atau "Lexidrug 2025", dan menyinggung mengapa pengecoh utama salah.
- Pengecoh harus berupa obat, dosis, angka, atau tindakan yang benar-benar ada di materi tetapi salah untuk konteks ini, misalnya dosis anak untuk dewasa, regimen lini kedua untuk pasien naif, kategori kehamilan obat lain.
- DILARANG memakai tanda kurung ( ) di pertanyaan (q) maupun di semua pilihan jawaban (o). Tulis keterangan sebagai bagian kalimat, misalnya "Tenofovir, kategori kehamilan B". Jangan menaruh petunjuk di pilihan yang membuat jawaban benar terlihat beda dari pengecoh; panjang dan gaya semua pilihan harus setara.
- Sesuaikan pasien dengan poin yang diuji: bila poin menyangkut kehamilan, anak, lansia, gangguan ginjal, atau alergi penisilin, buat pasien dan vignette-nya memang demikian sehingga pertanyaannya wajar.
- Jangan menulis frasa seperti "menurut materi kuliah", "sesuai slide", atau "berdasarkan materi" di pertanyaan maupun pilihan. Di pembahasan sebut sumber aslinya, misalnya Dipiro, Makmun 2021, Kemenkes 2023, Lexidrug 2025, bukan kata "slide".
- Gunakan simbol × untuk frekuensi, contoh 2×/hari, dan – untuk rentang.`;

const INTRO = `Kamu adalah dosen farmakoterapi yang menyusun kuis kasus untuk mahasiswa S1 Farmasi, berdasarkan slide kuliah "Farmakoterapi Gangguan Saluran Cerna dan Nutrisi" tentang GERD, PUD, Hepatitis A, dan Hepatitis B.`;

const NOVELTY = `harus benar-benar baru dan berbeda dari set sebelumnya: pasien dengan inisial, usia, jenis kelamin, pekerjaan, dan komorbid yang lain; latar layanan yang lain; alur cerita yang lain; dan poin materi yang diuji juga berbeda. Jangan mengulang atau memparafrasakan soal lama.`;

// One slide point per question, chosen at random from the topic's list, so
// every set tests a different slice of the material.
const planLine = (p, i) => {
  const setting = pick(SETTINGS, 1)[0];
  const poin = pickPoin(p.topic, p.n).map((s, j) => `   soal ${j + 1}: ${s}`).join("\n");
  return `${i + 1}. topic "${p.topic}", ${p.n} soal, latar: ${setting}. Poin materi yang WAJIB diuji, satu per soal:\n${poin}`;
};

const materiBlock = (topics) =>
  topics.map((t) => `### ${t}\n${MATERI[t].ringkasan}`).join("\n\n");

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

MATERI KULIAH:
${materiBlock(TOPICS)}

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

MATERI KULIAH:
${materiBlock([p.topic])}

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
    // "menurut materi kuliah", "sesuai slide", "yang tercantum di materi", ...
    .replace(
      /,?\s*(?:yang\s+)?(?:tercantum\s+|dijelaskan\s+|disebutkan\s+)?(?:menurut|sesuai(?:\s+dengan)?|berdasarkan|di|dalam|dari|pada)\s+(?:materi(?:\s+kuliah)?|slide(?:\s+kuliah)?)(?:\s+(?:ini|tersebut|di\s+atas))?/gi,
      ""
    )
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
