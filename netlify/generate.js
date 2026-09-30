// Netlify Function source for /api/generate (Functions v2 API: web Request
// in, Response out). Bundled into netlify/functions/generate.mjs by
// scripts/build-netlify.mjs so the deploy needs no npm install.
//
// Set GEMINI_API_KEY in Netlify: Site configuration > Environment variables.

import { generateCases, pickProvider, cleanIndices, cleanUsedPoin } from "../api/generate.js";

const STATUS = { missing_api_key: 500, rate_limited: 429, refused: 422, invalid_json: 502, upstream_error: 502, empty_completion: 502 };

const json = (status, body) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });

const slimCases = (list) =>
  (Array.isArray(list) ? list : []).slice(0, 20).map((c) => ({
    title: String((c && c.title) || "").slice(0, 120),
    poin: (Array.isArray(c && c.poin) ? c.poin : []).filter((s) => typeof s === "string").slice(0, 10),
    questions: (Array.isArray(c && c.questions) ? c.questions : [])
      .slice(0, 10)
      .map((q) => ({ q: String((q && q.q) || "").slice(0, 300) })),
  }));

export default async (req) => {
  if (req.method === "GET") return json(200, { provider: pickProvider() });
  if (req.method !== "POST") return json(405, { error: "Use POST", code: "method_not_allowed" });
  try {
    const body = await req.json().catch(() => ({}));
    const cases = await generateCases(slimCases(body.previousCases), cleanIndices(body.indices), cleanUsedPoin(body.usedPoin));
    return json(200, { cases, provider: pickProvider() });
  } catch (e) {
    const code = e.code || "server_error";
    return json(STATUS[code] || 500, { error: e.message || "Gagal membuat soal.", code });
  }
};

export const config = { path: "/api/generate" };
