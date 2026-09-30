// Server-side handler for POST /api/generate.
// Holds the API key so the browser never sees it. Shared by the Vite dev
// server (vite.config.js) and the production server (server.js).
//
// Provider is chosen from the environment:
//   GEMINI_API_KEY     -> Google Gemini (default when set; free tier available)
//   ANTHROPIC_API_KEY  -> Claude API (used only when no Gemini key is set)
// Override with AI_PROVIDER=gemini|claude.

import { CASES_SCHEMA, normalizeCases } from "../src/generator.js";

const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";
const CLAUDE_MODEL = "claude-opus-5-5";

const withCode = (message, code) => {
  const err = new Error(message);
  err.code = code;
  return err;
};

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
  const out = {};
  for (const [k, v] of Object.entries(node)) {
    if (k === "additionalProperties") continue;
    out[k] = toGeminiSchema(v);
  }
  return out;
};

export async function generateWithGemini(prompt, { fetchImpl = fetch, apiKey = process.env.GEMINI_API_KEY } = {}) {
  if (!apiKey) throw withCode("GEMINI_API_KEY belum diset di server.", "missing_api_key");

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;
  const res = await fetchImpl(url, {
    method: "POST",
    headers: { "content-type": "application/json", "x-goog-api-key": apiKey },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: toGeminiSchema(CASES_SCHEMA),
        temperature: 1.0,
        maxOutputTokens: 32768,
      },
    }),
  });

  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = (body.error && body.error.message) || `HTTP ${res.status}`;
    if (res.status === 400 && /API key/i.test(msg)) throw withCode("GEMINI_API_KEY tidak valid.", "missing_api_key");
    if (res.status === 401 || res.status === 403) throw withCode("GEMINI_API_KEY tidak valid atau tidak punya akses.", "missing_api_key");
    if (res.status === 429) throw withCode("Kuota Gemini habis atau terlalu cepat. Coba lagi nanti.", "rate_limited");
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

  const text = ((cand.content && cand.content.parts) || [])
    .map((p) => p.text || "")
    .join("");
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw withCode("Balasan Gemini bukan JSON valid.", "invalid_json");
  }
  return normalizeCases(data);
}

// ---------- Claude ----------

let anthropicModule = null;
let anthropicClient = null;
const getAnthropic = async () => {
  if (!anthropicModule) anthropicModule = (await import("@anthropic-ai/sdk")).default;
  if (!anthropicClient) anthropicClient = new anthropicModule();
  return { Anthropic: anthropicModule, client: anthropicClient };
};

export async function generateWithClaude(prompt) {
  const { Anthropic, client } = await getAnthropic();
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
      messages: [{ role: "user", content: prompt }],
    });
    const message = await stream.finalMessage();

    if (message.stop_reason === "refusal") throw withCode("Claude menolak permintaan ini.", "refused");
    if (message.stop_reason === "max_tokens") throw withCode("Balasan terpotong. Coba lagi.", "invalid_json");

    const text = message.content.filter((b) => b.type === "text").map((b) => b.text).join("");
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      throw withCode("Balasan bukan JSON valid.", "invalid_json");
    }
    return normalizeCases(data);
  } catch (e) {
    if (e instanceof Anthropic.AuthenticationError) throw withCode("ANTHROPIC_API_KEY tidak valid.", "missing_api_key");
    if (e instanceof Anthropic.RateLimitError) throw withCode("Rate limit Claude API tercapai.", "rate_limited");
    if (e instanceof Anthropic.APIError) throw withCode(`Claude API error ${e.status}: ${e.message}`, "upstream_error");
    throw e;
  }
}

// ---------- shared ----------

export async function generateCases(prompt) {
  const provider = pickProvider();
  if (provider === "gemini") return generateWithGemini(prompt);
  if (provider === "claude") return generateWithClaude(prompt);
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
    const { prompt } = await readJson(req);
    if (typeof prompt !== "string" || !prompt.trim()) {
      send(res, 400, { error: "prompt wajib diisi", code: "bad_request" });
      return true;
    }
    const cases = await generateCases(prompt);
    send(res, 200, { cases, provider: pickProvider() });
  } catch (e) {
    const code = e.code || "server_error";
    send(res, STATUS[code] || 500, { error: e.message || "Gagal membuat soal.", code });
  }
  return true;
}
