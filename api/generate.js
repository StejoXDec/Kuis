// Server-side handler for /api/generate.
// Holds the API key so the browser never sees it. Shared by the Vite dev
// server (vite.config.js) and the production server (server.js).
//
// Provider is chosen from the environment:
//   GEMINI_API_KEY     -> Google Gemini (default when set; free tier available)
//   ANTHROPIC_API_KEY  -> Claude API (used only when no Gemini key is set)
// Override with AI_PROVIDER=gemini|claude.

import {
  ALL_INDICES,
  CASE_PLAN,
  CASE_SCHEMA,
  CASES_SCHEMA,
  buildPrompt,
  buildCasePrompt,
  buildPlans,
  usedPoinFrom,
  normalizeCases,
} from "../src/generator.js";

// Tried in order; a model that is overloaded (503), rate limited (429) or
// retired (404 / "no longer available") hands over to the next one.
// Lite first: with one small request per case it answers in ~10-20 s and
// the bigger flash models 503 far more often. Override with
// GEMINI_MODEL="a,b,c" in .env (your list is tried before these).
const DEFAULT_GEMINI_MODELS = [
  "gemini-3.5-flash-lite",
  "gemini-3.5-flash",
  "gemini-3.8-flash",
  "gemini-flash-latest",
];
const geminiModels = () =>
  (process.env.GEMINI_MODEL || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .concat(DEFAULT_GEMINI_MODELS)
    .filter((m, i, arr) => arr.indexOf(m) === i);
const CLAUDE_MODEL = "claude-opus-5-5";

const withCode = (message, code, extra) => Object.assign(new Error(message), { code }, extra);

export function pickProvider(env = process.env) {
  const forced = (env.AI_PROVIDER || "").toLowerCase();
  if (forced === "gemini" || forced === "claude") return forced;
  if (env.GEMINI_API_KEY) return "gemini";
  if (env.ANTHROPIC_API_KEY || env.ANTHROPIC_AUTH_TOKEN) return "claude";
  return null;
}

// ---------- Gemini ----------

// Gemini's responseSchema is an OpenAPI subset: drop keys it rejects.
const toGeminiSchema = (node) => {
  if (Array.isArray(node)) return node.map(toGeminiSchema);
  if (!node || typeof node !== "object") return node;
  return Object.fromEntries(
    Object.entries(node)
      .filter(([k]) => k !== "additionalProperties")
      .map(([k, v]) => [k, toGeminiSchema(v)])
  );
};

/**
 * One request to one Gemini model. Resolves the parsed JSON value.
 * Errors carry `code` and, when another model is worth trying, `tryNextModel`.
 */
async function geminiCall(prompt, model, schema, { fetchImpl, apiKey }) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
  const res = await fetchImpl(url, {
    method: "POST",
    headers: { "content-type": "application/json", "x-goog-api-key": apiKey },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: toGeminiSchema(schema),
        temperature: 1.0,
        maxOutputTokens: 8192,
      },
    }),
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = (body.error && body.error.message) || `HTTP ${res.status}`;
    if (res.status === 400 && /API key/i.test(msg)) throw withCode("GEMINI_API_KEY tidak valid.", "missing_api_key");
    if (res.status === 401 || res.status === 403) throw withCode("GEMINI_API_KEY tidak valid atau tidak punya akses.", "missing_api_key");
    if (res.status === 429) throw withCode("Kuota Gemini habis atau terlalu cepat. Coba lagi nanti.", "rate_limited", { tryNextModel: true });
    if (res.status === 503 || res.status === 404 || /no longer available|not found|high demand/i.test(msg)) {
      throw withCode(`Model ${model} tidak tersedia: ${msg}`, "upstream_error", { tryNextModel: true });
    }
    throw withCode(`Gemini error: ${msg}`, "upstream_error");
  }

  const cand = body.candidates && body.candidates[0];
  if (!cand) {
    const reason = body.promptFeedback && body.promptFeedback.blockReason;
    throw withCode(reason ? `Gemini menolak permintaan: ${reason}` : "Gemini tidak memberi jawaban.", reason ? "refused" : "empty_completion");
  }
  if (cand.finishReason === "MAX_TOKENS") throw withCode("Balasan Gemini terpotong. Coba lagi.", "invalid_json");
  if (cand.finishReason === "SAFETY" || cand.finishReason === "PROHIBITED_CONTENT") {
    throw withCode("Gemini menolak permintaan ini.", "refused");
  }
  const text = ((cand.content && cand.content.parts) || []).map((p) => p.text || "").join("");
  return parseJsonLoose(text);
}

// Whole text as JSON; else a ```json fence; else first "{" to last "}".
function parseJsonLoose(text) {
  const attempts = [text];
  const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fence) attempts.push(fence[1]);
  const a = text.indexOf("{");
  const b = text.lastIndexOf("}");
  if (a >= 0 && b > a) attempts.push(text.slice(a, b + 1));
  for (const t of attempts) {
    try {
      return JSON.parse(t);
    } catch {
      /* try next */
    }
  }
  throw withCode("Balasan Gemini bukan JSON valid.", "invalid_json");
}

/** Run `prompt` through the model chain: two tries per model on bad JSON. */
async function geminiWithFallback(prompt, schema, opts) {
  let lastErr = null;
  for (const model of opts.models) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        return await geminiCall(prompt, model, schema, opts);
      } catch (e) {
        lastErr = e;
        if (e.code === "invalid_json" && attempt === 1) {
          console.warn(`[gemini] ${model}: ${e.message} -> mencoba sekali lagi`);
          continue;
        }
        if (!e.tryNextModel && e.code !== "invalid_json") throw e;
        console.warn(`[gemini] ${model}: ${e.message} -> mencoba model berikutnya`);
        break;
      }
    }
  }
  throw lastErr || withCode("Tidak ada model Gemini yang bisa dipakai.", "upstream_error");
}

/**
 * Generate the whole set with Gemini: one small request per case in the
 * plan, all in parallel. A 20 KB single reply from the lite model broke its
 * JSON about half the time; 3 KB replies with a schema never did in testing.
 */
export async function generateWithGemini(previousCases, { fetchImpl = fetch, apiKey = process.env.GEMINI_API_KEY, models = geminiModels(), indices = ALL_INDICES, usedPoin = [] } = {}) {
  if (!apiKey) throw withCode("GEMINI_API_KEY belum diset di server.", "missing_api_key");
  const opts = { fetchImpl, apiKey, models };
  const plans = buildPlans(indices, usedPoinFrom(previousCases, usedPoin));
  const cases = await Promise.all(
    plans.map((plan) => geminiWithFallback(buildCasePrompt(previousCases, plan.i, plan), CASE_SCHEMA, opts))
  );
  return normalizeCases(cases, indices, plans);
}

// ---------- Claude ----------

let anthropicModule = null;
let anthropicClient = null;
const getAnthropic = async () => {
  if (!anthropicModule) anthropicModule = (await import("@anthropic-ai/sdk")).default;
  if (!anthropicClient) anthropicClient = new anthropicModule();
  return { Anthropic: anthropicModule, client: anthropicClient };
};

export async function generateWithClaude(previousCases, indices = ALL_INDICES, usedPoin = []) {
  const { Anthropic, client } = await getAnthropic();
  const plans = buildPlans(indices, usedPoinFrom(previousCases, usedPoin));
  try {
    const stream = client.beta.messages.stream({
      model: CLAUDE_MODEL,
      max_tokens: 32000,
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      thinking: { type: "adaptive" },
      output_config: {
        effort: "medium",
        format: { type: "json_schema", schema: CASES_SCHEMA },
      },
      messages: [{ role: "user", content: buildPrompt(previousCases, indices, plans) }],
    });
    const message = await stream.finalMessage();

    if (message.stop_reason === "refusal") throw withCode("Claude menolak permintaan ini.", "refused");
    if (message.stop_reason === "max_tokens") throw withCode("Balasan terpotong. Coba lagi.", "invalid_json");

    const text = message.content.filter((b) => b.type === "text").map((b) => b.text).join("");
    return normalizeCases(parseJsonLoose(text), indices, plans);
  } catch (e) {
    if (e instanceof Anthropic.AuthenticationError) throw withCode("ANTHROPIC_API_KEY tidak valid.", "missing_api_key");
    if (e instanceof Anthropic.RateLimitError) throw withCode("Rate limit Claude API tercapai.", "rate_limited");
    if (e instanceof Anthropic.APIError) throw withCode(`Claude API error ${e.status}: ${e.message}`, "upstream_error");
    throw e;
  }
}

// ---------- shared ----------

export const cleanIndices = (list) => {
  const ok = (Array.isArray(list) ? list : [])
    .map(Number)
    .filter((i) => Number.isInteger(i) && i >= 0 && i < CASE_PLAN.length);
  const uniq = [...new Set(ok)].sort((x, y) => x - y);
  return uniq.length ? uniq : ALL_INDICES;
};

export const cleanUsedPoin = (list) =>
  (Array.isArray(list) ? list : []).filter((s) => typeof s === "string").map((s) => s.slice(0, 300)).slice(-300);

export async function generateCases(previousCases = [], indices = ALL_INDICES, usedPoin = []) {
  const provider = pickProvider();
  if (provider === "gemini") return generateWithGemini(previousCases, { indices, usedPoin });
  if (provider === "claude") return generateWithClaude(previousCases, indices, usedPoin);
  throw withCode("Belum ada API key. Isi GEMINI_API_KEY di file .env.", "missing_api_key");
}

const readJson = (req) =>
  new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
      if (raw.length > 1_000_000) reject(new Error("Body too large"));
    });
    req.on("end", () => {
      try {
        resolve(raw ? JSON.parse(raw) : {});
      } catch (e) {
        reject(e);
      }
    });
    req.on("error", reject);
  });

const send = (res, status, body) => {
  res.statusCode = status;
  res.setHeader("content-type", "application/json; charset=utf-8");
  res.end(JSON.stringify(body));
};

const STATUS = { missing_api_key: 500, rate_limited: 429, refused: 422, invalid_json: 502, upstream_error: 502, empty_completion: 502 };

// Only what the prompt needs from the previous set: titles and question stems.
const slimCases = (list) =>
  (Array.isArray(list) ? list : []).slice(0, 20).map((c) => ({
    title: String((c && c.title) || "").slice(0, 120),
    poin: (Array.isArray(c && c.poin) ? c.poin : []).filter((s) => typeof s === "string").slice(0, 10),
    questions: (Array.isArray(c && c.questions) ? c.questions : [])
      .slice(0, 10)
      .map((q) => ({ q: String((q && q.q) || "").slice(0, 300) })),
  }));

/** Node http handler. Returns true when it handled the request. */
export async function handleGenerate(req, res) {
  if (req.method === "GET") {
    // Lets the page show which provider will answer, without exposing keys.
    send(res, 200, { provider: pickProvider() });
    return true;
  }
  if (req.method !== "POST") {
    send(res, 405, { error: "Use POST", code: "method_not_allowed" });
    return true;
  }
  try {
    const body = await readJson(req);
    const cases = await generateCases(slimCases(body.previousCases), cleanIndices(body.indices), cleanUsedPoin(body.usedPoin));
    send(res, 200, { cases, provider: pickProvider() });
  } catch (e) {
    const code = e.code || "server_error";
    send(res, STATUS[code] || 500, { error: e.message || "Gagal membuat soal.", code });
  }
  return true;
}
