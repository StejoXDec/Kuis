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
        ask: (prompt, { signal, onText } = {}) =>
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

  return {
    source: "server",
    ask: async (prompt, { signal } = {}) => {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ prompt }),
        signal,
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        const err = new Error(body.error || `Server error ${res.status}`);
        err.code = body.code || "server_error";
        throw err;
      }
      return body;
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
    case "missing_api_key":
      return "Server belum punya ANTHROPIC_API_KEY. Lihat README.";
    default:
      return (e && e.message) || "Gagal membuat soal. Coba lagi.";
  }
}
