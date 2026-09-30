// Server-side handler for POST /api/generate.
// Holds the API key so the browser never sees it. Shared by the Vite dev
// server (vite.config.js) and the production server (server.js).

import Anthropic from "@anthropic-ai/sdk";
import { CASES_SCHEMA, normalizeCases } from "../src/generator.js";

const MODEL = "claude-opus-5-5";

let client = null;
const getClient = () => {
  if (!client) client = new Anthropic();
  return client;
};

const hasCredentials = () =>
  Boolean(process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_AUTH_TOKEN);

/** Ask Claude for a new set and return the normalised cases array. */
export async function generateCases(prompt) {
  const stream = getClient().beta.messages.stream({
    model: MODEL,
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

  if (message.stop_reason === "refusal") {
    const err = new Error("Claude menolak permintaan ini.");
    err.code = "refused";
    throw err;
  }
  if (message.stop_reason === "max_tokens") {
    const err = new Error("Balasan terpotong. Coba lagi.");
    err.code = "invalid_json";
    throw err;
  }

  const text = message.content
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("");

  let data;
  try {
    data = JSON.parse(text);
  } catch {
    const err = new Error("Balasan bukan JSON valid.");
    err.code = "invalid_json";
    throw err;
  }
  return normalizeCases(data);
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

/** Node http handler. Returns true when it handled the request. */
export async function handleGenerate(req, res) {
  if (req.method !== "POST") {
    send(res, 405, { error: "Use POST", code: "method_not_allowed" });
    return true;
  }
  if (!hasCredentials()) {
    send(res, 500, {
      error: "ANTHROPIC_API_KEY belum diset di server.",
      code: "missing_api_key",
    });
    return true;
  }
  try {
    const { prompt } = await readJson(req);
    if (typeof prompt !== "string" || !prompt.trim()) {
      send(res, 400, { error: "prompt wajib diisi", code: "bad_request" });
      return true;
    }
    const cases = await generateCases(prompt);
    send(res, 200, { cases });
  } catch (e) {
    if (e instanceof Anthropic.AuthenticationError) {
      send(res, 500, { error: "API key tidak valid.", code: "missing_api_key" });
    } else if (e instanceof Anthropic.RateLimitError) {
      send(res, 429, { error: "Rate limit API tercapai.", code: "rate_limited" });
    } else if (e instanceof Anthropic.APIError) {
      send(res, 502, { error: `API error ${e.status}: ${e.message}`, code: "upstream_error" });
    } else {
      send(res, 500, { error: e.message || "Gagal membuat soal.", code: e.code || "server_error" });
    }
  }
  return true;
}
