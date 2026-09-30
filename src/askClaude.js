// Picks how this page reaches Claude.
//
// 1. Inside a claude.ai artifact, the viewer's own Claude account answers via
//    the `sample` capability. No API key needed.
// 2. Anywhere else (npm run dev / npm start), the page calls the local
//    /api/generate endpoint, which holds the API key server-side.
//
// Both resolve to { ask(prompt, {signal, onText}) => Promise<json>, source }.

export async function getAsker() {
  if (typeof window !== "undefined" && window.__kuisAsk) {
    return { ask: window.__kuisAsk, source: "mock" };
  }

  const claude = typeof window !== "undefined" ? window.claude : null;
  if (claude && typeof claude.use === "function") {
    const sample = await claude.use("sample").catch(() => null);
    if (sample) {
      return {
        source: "artifact",
        ask: ({ prompt }, { signal, onText } = {}) =>
          sample.json(prompt, {
            signal,
            onText,
            modelTier: "complex",
            cache: false, // "acak lagi" must always produce a new set
          }),
      };
    }
    // Inside a Claude viewer but sampling unavailable: nothing else will work.
    return null;
  }

  const info = await fetch("/api/generate")
    .then((r) => r.json())
    .catch(() => ({}));

  return {
    source: "server",
    provider: info.provider || null, // "gemini" | "claude" | null
    // The server builds its own prompts (one per case for Gemini), so it
    // only needs the previous set to avoid repeating it.
    // One request per case, in parallel: Netlify's free tier cuts a function
    // off after 10 s, and a whole set in one call often took longer (502).
    ask: async ({ previousCases, indices, usedPoin, plans }, { signal, onProgress } = {}) => {
      const idx = Array.isArray(indices) && indices.length ? indices : null;
      if (!idx) throw Object.assign(new Error("indices kosong"), { code: "bad_request" });
      let done = 0;
      const one = async (i, kIdx, attempt = 1) => {
        const res = await fetch("/api/generate", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ previousCases, indices: [i], usedPoin, plan: plans ? plans[kIdx] : undefined }),
          signal,
        });
        const body = await res.json().catch(() => null);
        if (!res.ok) {
          const gateway = res.status === 502 || res.status === 504 || (body && body.code === "timeout");
          if (gateway && attempt < 3) return one(i, kIdx, attempt + 1); // retry twice on a timeout
          const err = new Error((body && body.error) || (gateway ? "Server kehabisan waktu." : `Server error ${res.status}`));
          err.code = (body && body.code) || (gateway ? "timeout" : "server_error");
          throw err;
        }
        done++;
        onProgress && onProgress({ done, total: idx.length });
        return body.cases[0];
      };
      const cases = await Promise.all(idx.map((i, kIdx) => one(i, kIdx)));
      return { cases };
    },
  };
}

// Viewer-facing copy for an error from either path.
export function describeError(e) {
  const code = e && e.code;
  switch (code) {
    case "cancelled":
      return "Dibatalkan.";
    case "not_granted":
    case "sampling_disabled":
    case "not_declared":
    case "capability_disabled":
      return "Akses ke Claude tidak diizinkan di tampilan ini.";
    case "rate_limited":
      return "Terlalu banyak permintaan. Coba lagi beberapa saat.";
    case "session_expired":
      return "Sesi habis. Masuk kembali lalu coba lagi.";
    case "invalid_json":
      return "Balasan Claude tidak bisa dibaca sebagai soal. Coba lagi.";
    case "refused":
      return "Claude menolak permintaan ini.";
    case "timeout":
      return "Server kehabisan waktu saat meminta Gemini. Coba lagi beberapa detik kemudian.";
    case "missing_api_key":
      return "Server belum punya API key. Lokal: isi GEMINI_API_KEY di file .env. Netlify: tambahkan GEMINI_API_KEY di Environment variables dengan scope Functions, lalu deploy ulang.";
    default:
      return (e && e.message) || "Gagal membuat soal. Coba lagi.";
  }
}
