// Shared logic for generating a brand-new set of cases with Claude.
// Used by the browser (to build the prompt and validate the reply) and by the
// Node API handler (to build the JSON schema the API must follow).

import { MATERI, FORMAT_SOAL, TUGAS_KASUS, pickPoin, kutipanFor, konteksUmum } from "./materi.js";

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
                poin: { type: "string" },
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
- SUMBER FAKTA: soal nomor j HANYA boleh menguji isi KUTIPAN MATERI nomor j. Jawaban benar wajib tertulis di kutipan itu; pengecoh diambil dari kutipan yang sama atau konteks umum. DILARANG membuat soal tentang alur tatalaksana, dosis PPI, atau lini pertama kecuali kutipan nomor itu memang membahasnya. Jangan menambahkan fakta dari luar kutipan.
- Setiap kasus: "title" berupa inisial dan usia, contoh "Tn. B, 47 tahun"; "text" berupa vignette klinis 3–5 kalimat bergaya kasus tugas dosen: identitas dengan TB dan BB, keluhan dan durasi, komorbid, obat yang dibeli sendiri bila ada, hasil pemeriksaan fisik dan laboratorium atau serologi yang relevan, diagnosis dokter, dan daftar terapi yang sedang diberikan lengkap dengan dosis dan frekuensi. Sengaja selipkan satu atau dua masalah terapi di daftar itu, misalnya NSAID pada GERD atau ulkus, PPI kategori C pada kehamilan, dosis antivirus keliru, atau obat tanpa indikasi, sehingga sebagian soal bisa menanyakannya.
- Setiap soal menguji SATU poin materi dengan BENTUK SOAL yang ditentukan di rencana, sebagai pertanyaan penerapan pada pasien itu seperti di ujian. Isi field "poin" tiap soal dengan teks poin yang diuji, persis seperti di rencana. Bentuk soal harus benar-benar diikuti: bila bentuknya "temukan kesalahan dalam resep", vignette harus memuat resep yang keliru; bila "tentukan dosis", pilihannya adalah dosis-dosis; bila "langkah berikutnya", pilihannya adalah tindakan. Tanyakan hal yang dosen tekankan, jangan tanyakan detail sepele. Contoh gaya yang diinginkan: "Langkah berikutnya menurut alur tatalaksana di layanan primer adalah…", "Regimen eradikasi yang paling sesuai untuk pasien ini adalah…", "Bila obat X dipakai bersama Y, yang terjadi adalah…", "Hasil serologi ini berarti…", "Pemantauan yang perlu dipertimbangkan bila terapi lebih dari 1 tahun adalah…".
- Setiap soal: 4 pilihan (o), satu jawaban benar (a = indeks 0–3), dan pembahasan (e) 1–3 kalimat yang menjelaskan alasan jawaban benar, menyebut sumber persis seperti tertulis di materi, misalnya "Dipiro 12 ed hal 468" atau "Lexidrug 2025", dan menyinggung mengapa pengecoh utama salah.
- Pengecoh harus berupa obat, dosis, angka, atau tindakan yang benar-benar ada di materi tetapi salah untuk konteks ini, misalnya dosis anak untuk dewasa, regimen lini kedua untuk pasien naif, kategori kehamilan obat lain.
- DILARANG memakai tanda kurung ( ) di pertanyaan (q) maupun di semua pilihan jawaban (o). Tulis keterangan sebagai bagian kalimat, misalnya "Tenofovir, kategori kehamilan B". Jangan menaruh petunjuk di pilihan yang membuat jawaban benar terlihat beda dari pengecoh; panjang dan gaya semua pilihan harus setara.
- Sesuaikan pasien dengan poin yang diuji: bila poin menyangkut kehamilan, anak, lansia, gangguan ginjal, atau alergi penisilin, buat pasien dan vignette-nya memang demikian sehingga pertanyaannya wajar.
- Jangan menulis frasa seperti "menurut materi kuliah", "sesuai slide", atau "berdasarkan materi" di pertanyaan maupun pilihan. Di pembahasan sebut sumber aslinya, misalnya Dipiro, Makmun 2021, Kemenkes 2023, Lexidrug 2025, bukan kata "slide".
- Gunakan simbol × untuk frekuensi, contoh 2×/hari, dan – untuk rentang.`;

const INTRO = `Kamu adalah dosen farmakoterapi yang menyusun SOAL UJIAN kasus untuk mahasiswa S1 Farmasi, berdasarkan slide kuliah "Farmakoterapi Gangguan Saluran Cerna dan Nutrisi" tentang GERD, PUD, Hepatitis A, dan Hepatitis B. Capaian pembelajaran di slide: mahasiswa mampu menjelaskan definisi dan patofisiologi, menjelaskan tatalaksana, mengetahui efek samping obat, dan menyelesaikan kasus dengan metode SOAP. Soal harus seperti soal UTS/UAS yang benar-benar mungkin ditanyakan dosen: hal-hal yang UMUM dan DITEKANKAN di slide seperti alur tatalaksana, obat lini pertama beserta dosis dan durasi, regimen eradikasi, interaksi obat dengan kategori risikonya, efek samping dan pemantauan, interpretasi serologi, jadwal dan dosis vaksin, kategori kehamilan, serta komplikasi. Hindari trivia yang tidak mungkin diujikan seperti angka epidemiologi, nama produsen, atau detail farmakokinetik yang tidak berdampak klinis.`;

const NOVELTY = `harus benar-benar baru dan berbeda dari set sebelumnya: pasien dengan inisial, usia, jenis kelamin, pekerjaan, dan komorbid yang lain; latar layanan yang lain; alur cerita yang lain; dan poin materi yang diuji juga berbeda. Jangan mengulang atau memparafrasakan soal lama.`;

/** Slide points already tested in the given cases (and any extra history). */
export function usedPoinFrom(cases = [], history = []) {
  const fromCases = (Array.isArray(cases) ? cases : []).flatMap((c) => (Array.isArray(c && c.poin) ? c.poin : []));
  return [...new Set([...history, ...fromCases].filter((s) => typeof s === "string"))];
}

/**
 * Decide, per plan slot, the setting plus one slide point and one question
 * form per question. Points already used (in `usedPoin` or earlier in this
 * same batch) are avoided, so consecutive sets test different material.
 */
const INISIAL = "ABCDEFGHIJKLMNOPRSTUVWY".split("");
const identitasFor = (topic, taken) => {
  // Pregnancy-related Hepatitis B cases need a woman; otherwise random.
  const sex = Math.random() < 0.5 ? "Ny." : "Tn.";
  let huruf;
  do huruf = INISIAL[Math.floor(Math.random() * INISIAL.length)]; while (taken.has(huruf));
  taken.add(huruf);
  const bands = topic === "Hepatitis A" ? ["19-25", "26-35", "36-45"] : ["22-30", "31-40", "41-50", "51-60", "61-70"];
  const usia = bands[Math.floor(Math.random() * bands.length)];
  return `${sex} ${huruf}, usia sekitar ${usia} tahun`;
};

export function buildPlans(indices = ALL_INDICES, usedPoin = []) {
  const exclude = [...usedPoin];
  const takenInitials = new Set();
  return indices.map((i) => {
    const p = CASE_PLAN[i];
    const poin = pickPoin(p.topic, p.n, exclude);
    exclude.push(...poin);
    const formats = pick(FORMAT_SOAL, p.n);
    return {
      i,
      setting: pick(SETTINGS, 1)[0],
      identitas: identitasFor(p.topic, takenInitials),
      items: poin.map((s, j) => ({ poin: s, format: formats[j] || pick(FORMAT_SOAL, 1)[0] })),
    };
  });
}

// One slide point and one question form per question.
const planLine = (plan, k) => {
  const p = CASE_PLAN[plan.i];
  const lines = plan.items
    .map((it, j) => {
      const kutipan = kutipanFor(p.topic, it.poin).map((s) => `      | ${s}`).join("\n");
      return `   SOAL ${j + 1}. Bentuk soal: ${it.format}.\n      Poin yang diuji: ${it.poin}\n      KUTIPAN MATERI untuk soal ${j + 1} (satu-satunya sumber jawaban benar dan pengecoh soal ini):\n${kutipan}`;
    })
    .join("\n");
  return `${k + 1}. topic "${p.topic}", ${plan.items.length} soal, latar: ${plan.setting}, pasien: ${plan.identitas} (boleh diubah bila poin materi menuntut pasien hamil, anak, atau lansia).\n${lines}`;
};

const konteksBlock = (topics) =>
  topics.map((t) => `### ${t}\n${konteksUmum(t).join("\n")}`).join("\n\n");

const contohBlock = (topics) => {
  const list = TUGAS_KASUS.filter((k) => topics.includes(k.topic));
  if (!list.length) return "";
  return `\n\nCONTOH KASUS TUGAS DARI DOSEN (tiru GAYANYA: data pemeriksaan lengkap, daftar terapi yang sedang dipakai termasuk obat bermasalah, lalu soal yang meminta mahasiswa mengenali masalah dan memperbaikinya; JANGAN menyalin pasien, angka, atau obatnya):\n` +
    list.map((k, i) => `Contoh ${i + 1} [${k.topic}]: ${k.kasus}\n   Masalah terapi yang diharapkan dikenali: ${k.masalah}`).join("\n");
};

const materiBlock = (topics) =>
  topics.map((t) => `### ${t}\n${MATERI[t].ringkasan}`).join("\n\n");

const nonce = () => Math.random().toString(36).slice(2, 8);

/**
 * Prompt for the whole set in one reply (used by the claude.ai artifact and
 * the Claude API path). `previousCases` is the set the student just used.
 */
export const ALL_INDICES = CASE_PLAN.map((_, i) => i);

/**
 * Which plan slots to regenerate for a scope: "semua" = every case,
 * "satu" = one random case per topic, the rest of the set is kept.
 */
export function indicesForScope(scope) {
  if (scope !== "satu") return ALL_INDICES;
  return TOPICS.map((t) => {
    const slots = CASE_PLAN.map((p, i) => (p.topic === t ? i : -1)).filter((i) => i >= 0);
    return slots[Math.floor(Math.random() * slots.length)];
  })
    .filter((i) => i !== undefined)
    .sort((a, b) => a - b);
}

export function buildPrompt(previousCases = [], indices = ALL_INDICES, plans = buildPlans(indices, usedPoinFrom(previousCases))) {
  const plan = indices.map((i) => CASE_PLAN[i]);
  const topics = TOPICS.filter((t) => plan.some((p) => p.topic === t));
  return `${INTRO}

Buat ${plan.length} kasus klinis BARU dalam bahasa Indonesia untuk kuis. Kasus-kasus ini ${NOVELTY}

Rencana set (ikuti persis urutan, topik, dan jumlah soal per kasus):
${plans.map(planLine).join("\n")}

${RULES}

KONTEKS UMUM (untuk menulis vignette; bukan bahan soal):
${konteksBlock(topics)}${contohBlock(topics)}

Hindari mengulang judul atau pertanyaan berikut (set sebelumnya):
${prevStemsOf(previousCases)}

Balas HANYA dengan JSON valid berbentuk (field "poin" sudah diisi per soal, jangan diubah):
{"cases":[${plans.map((pl) => `{"topic":"${CASE_PLAN[pl.i].topic}","title":"...","text":"...","questions":[${pl.items.map((it) => `{"poin":${JSON.stringify(it.poin)},"q":"...","o":["...","...","...","..."],"a":0,"e":"..."}`).join(",")}]}`).join(",")}]}

Tepat ${plan.length} kasus, urutannya sama dengan rencana. Tanpa teks lain, tanpa blok kode. Kode variasi: ${nonce()}`;
}

/**
 * Prompt for ONE case of the plan (index `i`). Small replies are far more
 * reliable from small models, and the 7 requests can run in parallel.
 */
export function buildCasePrompt(previousCases = [], i, plan = buildPlans([i], usedPoinFrom(previousCases))[0]) {
  const p = CASE_PLAN[i];
  return `${INTRO}

Buat SATU kasus klinis baru dalam bahasa Indonesia untuk kuis. Kasus ini ${NOVELTY}

Kasus yang diminta:
${planLine(plan, i)}

${RULES}

KONTEKS UMUM (untuk menulis vignette; bukan bahan soal):
${konteksBlock([p.topic])}${contohBlock([p.topic])}

Hindari mengulang judul atau pertanyaan berikut (set sebelumnya):
${prevStemsOf(previousCases)}

Balas HANYA dengan JSON valid berbentuk (field "poin" sudah diisi, jangan diubah):
{"topic":"${p.topic}","title":"...","text":"...","questions":[${plan.items.map((it) => `{"poin":${JSON.stringify(it.poin)},"q":"...","o":["...","...","...","..."],"a":0,"e":"..."}`).join(",")}]}

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
export function normalizeCases(data, indices = ALL_INDICES, plans = null) {
  const cases = Array.isArray(data) ? data : data && data.cases;
  if (!Array.isArray(cases) || cases.length === 0) {
    throw new Error("Balasan tidak berisi daftar kasus.");
  }
  if (cases.length < indices.length) {
    throw new Error(
      `Balasan hanya berisi ${cases.length} kasus, seharusnya ${indices.length}.`
    );
  }
  // Classification always follows CASE_PLAN (same ids and topics as the
  // built-in set), whatever the model labelled them.
  return cases.slice(0, indices.length).map((c, k) => {
    const i = indices[k];
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
    // Which slide points this case tested: from the server's reply when it
    // planned the case, else from the plans built here.
    const fromReply = Array.isArray(c.poin) ? c.poin.filter((s) => typeof s === "string") : null;
    const fromPlan = plans && plans[k] ? plans[k].items.map((it) => it.poin) : null;
    return {
      id: plan.id,
      topic,
      title: String(c.title || `Kasus ${i + 1}`).trim(),
      text: String(c.text || "").trim(),
      questions,
      poin: fromReply && fromReply.length ? fromReply : fromPlan || [],
    };
  });
}
