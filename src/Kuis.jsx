import { useState, useMemo, useEffect, useRef } from "react";
import { BUILTIN_CASES } from "./cases.js";
import { TOPICS, buildPrompt, normalizeCases } from "./generator.js";
import { getAsker, describeError } from "./askClaude.js";

const STORAGE_KEY = "kuis.generated.v1";

const buildFlat = (cases) =>
  cases.flatMap((c) =>
    c.questions.map((q, i) => ({ ...q, caseId: c.id, key: `${c.id}-${i}` }))
  );

const LETTERS = ["A", "B", "C", "D"];

const loadSaved = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const saved = JSON.parse(raw);
    return { cases: normalizeCases(saved.cases), at: saved.at };
  } catch {
    return null;
  }
};

const saveSet = (cases) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ cases, at: Date.now() }));
  } catch {
    /* storage unavailable: the set still works for this session */
  }
};

const clearSaved = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
};

export default function Kuis() {
  const [saved] = useState(loadSaved);
  const [cases, setCases] = useState(() => (saved ? saved.cases : BUILTIN_CASES));
  const [setInfo, setSetInfo] = useState(() =>
    saved ? { kind: "generated", at: saved.at } : { kind: "builtin" }
  );
  const allFlat = useMemo(() => buildFlat(cases), [cases]);

  const [queue, setQueue] = useState(allFlat);
  const [pos, setPos] = useState(0);
  const [picked, setPicked] = useState(null);
  const [results, setResults] = useState({});
  const [started, setStarted] = useState(false);
  const [topicFilter, setTopicFilter] = useState("Semua");

  // Claude generator
  const [asker, setAsker] = useState(undefined); // undefined = still resolving
  const [gen, setGen] = useState({ status: "idle" });
  const [elapsed, setElapsed] = useState(0);
  const abortRef = useRef(null);

  useEffect(() => {
    let alive = true;
    getAsker().then((a) => alive && setAsker(a));
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (gen.status !== "loading") return;
    const t0 = Date.now();
    setElapsed(0);
    const id = setInterval(() => setElapsed(Math.round((Date.now() - t0) / 1000)), 1000);
    return () => clearInterval(id);
  }, [gen.status]);

  const caseById = (id) => cases.find((c) => c.id === id);
  const finished = started && pos >= queue.length;
  const cur = queue[pos];
  const c = cur ? caseById(cur.caseId) : null;
  const answered = picked !== null;
  const correctCount = queue.filter((q) => results[q.key] === true).length;

  const begin = (filter) => {
    const list =
      filter === "Semua"
        ? allFlat
        : allFlat.filter((q) => caseById(q.caseId).topic === filter);
    setTopicFilter(filter);
    setQueue(list);
    setResults({});
    setPos(0);
    setPicked(null);
    setStarted(true);
  };

  const choose = (i) => {
    if (answered) return;
    setPicked(i);
    setResults((r) => ({ ...r, [cur.key]: i === cur.a }));
  };

  const next = () => {
    setPicked(null);
    setPos((p) => p + 1);
    window.scrollTo && window.scrollTo({ top: 0 });
  };

  const retryWrong = () => {
    const wrong = queue.filter((q) => results[q.key] === false);
    setQueue(wrong);
    setResults({});
    setPos(0);
    setPicked(null);
  };

  const generate = async () => {
    if (!asker || gen.status === "loading") return;
    const ctl = new AbortController();
    abortRef.current = ctl;
    setGen({ status: "loading", chars: 0 });
    try {
      const data = await asker.ask(buildPrompt(cases), {
        signal: ctl.signal,
        onText: ({ text }) => setGen({ status: "loading", chars: text.length }),
      });
      const fresh = normalizeCases(data);
      setCases(fresh);
      saveSet(fresh);
      setSetInfo({ kind: "generated", at: Date.now() });
      setStarted(false);
      setGen({ status: "done", n: fresh.reduce((s, x) => s + x.questions.length, 0) });
    } catch (e) {
      if (e && e.code === "cancelled") setGen({ status: "idle" });
      else setGen({ status: "error", message: describeError(e) });
    } finally {
      abortRef.current = null;
    }
  };

  const cancelGenerate = () => abortRef.current && abortRef.current.abort();

  const useBuiltin = () => {
    setCases(BUILTIN_CASES);
    clearSaved();
    setSetInfo({ kind: "builtin" });
    setGen({ status: "idle" });
    setStarted(false);
  };

  const shell = "min-h-screen w-full bg-slate-50 text-slate-900";
  const wrap = "mx-auto max-w-xl px-4 py-6";
  const loading = gen.status === "loading";

  if (!started) {
    const setLabel =
      setInfo.kind === "generated"
        ? `Set buatan Claude · ${new Date(setInfo.at).toLocaleString("id-ID", {
            day: "numeric",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
          })}`
        : "Set soal asli";
    return (
      <div className={shell} style={{ fontFamily: "system-ui, sans-serif" }}>
        <div className={wrap}>
          <h1 className="text-2xl font-bold leading-tight text-teal-900">
            Kuis kasus: GERD, PUD, Hepatitis A dan B
          </h1>
          <p className="mt-2 text-slate-600">
            {allFlat.length} soal dari {cases.length} kasus. Setiap soal langsung
            menampilkan jawaban benar dan pembahasannya setelah kamu memilih.
          </p>

          <div className="mt-5 rounded-xl border border-teal-200 bg-teal-50 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-teal-800">
                  Set soal aktif
                </p>
                <p className="mt-0.5 text-sm font-medium text-teal-950">{setLabel}</p>
              </div>
              {setInfo.kind === "generated" && !loading && (
                <button
                  onClick={useBuiltin}
                  className="shrink-0 text-sm font-medium text-teal-800 underline-offset-2 hover:underline"
                >
                  Pakai set asli
                </button>
              )}
            </div>

            {asker === null ? (
              <p className="mt-3 text-sm text-slate-600">
                Fitur acak soal tidak tersedia di tampilan ini.
              </p>
            ) : (
              <>
                <p className="mt-3 text-sm text-slate-700">
                  Minta Claude menyusun set soal yang benar-benar baru: pasien, skenario,
                  pertanyaan, pilihan, dan pembahasan semuanya berubah, dengan topik dan
                  jumlah soal yang sama.
                </p>
                {!loading ? (
                  <button
                    onClick={generate}
                    disabled={asker === undefined}
                    className="mt-3 w-full rounded-xl bg-teal-700 px-4 py-3 font-semibold text-white active:bg-teal-800 disabled:opacity-50"
                  >
                    Acak soal baru dengan Claude
                  </button>
                ) : (
                  <div className="mt-3" role="status">
                    <div className="flex items-center gap-3 rounded-xl bg-white p-3">
                      <span className="h-3 w-3 shrink-0 animate-pulse rounded-full bg-teal-600" />
                      <div className="min-w-0 flex-1 text-sm">
                        <p className="font-medium text-slate-900">
                          {gen.chars
                            ? `Menerima soal baru… ${gen.chars.toLocaleString("id-ID")} karakter`
                            : "Claude sedang menyusun soal baru…"}
                        </p>
                        <p className="text-slate-500">
                          Biasanya 1–2 menit. Berjalan {elapsed} detik.
                        </p>
                      </div>
                      <button
                        onClick={cancelGenerate}
                        className="shrink-0 rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium"
                      >
                        Batal
                      </button>
                    </div>
                  </div>
                )}
                {gen.status === "error" && (
                  <p className="mt-2 text-sm text-red-700" role="alert">
                    {gen.message}
                  </p>
                )}
                {gen.status === "done" && (
                  <p className="mt-2 text-sm text-green-800" role="status">
                    Set baru siap: {gen.n} soal. Pilih topik di bawah untuk mulai.
                  </p>
                )}
              </>
            )}
          </div>

          <div className="mt-6 space-y-2">
            <button
              onClick={() => begin("Semua")}
              disabled={loading}
              className="w-full rounded-xl bg-teal-700 px-4 py-3 text-left font-semibold text-white active:bg-teal-800 disabled:opacity-50"
            >
              Semua topik ({allFlat.length} soal)
            </button>
            {TOPICS.map((t) => {
              const n = allFlat.filter((q) => caseById(q.caseId).topic === t).length;
              if (n === 0) return null;
              return (
                <button
                  key={t}
                  onClick={() => begin(t)}
                  disabled={loading}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-left font-medium active:bg-slate-100 disabled:opacity-50"
                >
                  {t} <span className="text-slate-500">({n} soal)</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  if (finished) {
    const total = queue.length;
    const pct = Math.round((correctCount / total) * 100);
    const wrong = queue.filter((q) => results[q.key] === false);
    const byTopic = TOPICS.map((t) => {
      const qs = queue.filter((q) => caseById(q.caseId).topic === t);
      return { t, n: qs.length, ok: qs.filter((q) => results[q.key]).length };
    }).filter((x) => x.n > 0);
    return (
      <div className={shell} style={{ fontFamily: "system-ui, sans-serif" }}>
        <div className={wrap}>
          <h1 className="text-2xl font-bold text-teal-900">Hasil kuis</h1>
          <p className="mt-3 text-5xl font-bold text-teal-700">
            {correctCount}/{total}
          </p>
          <p className="mt-1 text-slate-600">
            {pct >= 80
              ? "Sudah kuat. Cek soal yang salah lalu ulangi."
              : pct >= 60
              ? "Lumayan. Fokus ke soal yang salah di bawah."
              : "Masih perlu diulang. Baca lagi materi lini pertama dan dosisnya."}
          </p>
          <div className="mt-5 space-y-2">
            {byTopic.map((x) => (
              <div key={x.t}>
                <div className="flex justify-between text-sm">
                  <span>{x.t}</span>
                  <span>
                    {x.ok}/{x.n}
                  </span>
                </div>
                <div className="h-2 rounded bg-slate-200">
                  <div
                    className="h-2 rounded bg-teal-600"
                    style={{ width: `${(x.ok / x.n) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {wrong.length > 0 && (
            <div className="mt-6">
              <h2 className="font-semibold">Soal yang salah ({wrong.length})</h2>
              <div className="mt-2 space-y-3">
                {wrong.map((q) => (
                  <div key={q.key} className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm">
                    <p className="font-medium">{q.q}</p>
                    <p className="mt-1 text-green-800">
                      Benar: {LETTERS[q.a]}. {q.o[q.a]}
                    </p>
                    <p className="mt-1 text-slate-700">{q.e}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 space-y-2">
            {wrong.length > 0 && (
              <button
                onClick={retryWrong}
                className="w-full rounded-xl bg-teal-700 px-4 py-3 font-semibold text-white active:bg-teal-800"
              >
                Ulangi soal yang salah saja
              </button>
            )}
            <button
              onClick={() => begin(topicFilter)}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 font-medium active:bg-slate-100"
            >
              Ulangi dari awal
            </button>
            {asker && (
              <button
                onClick={() => {
                  setStarted(false);
                  setGen({ status: "idle" });
                  setTimeout(generate, 0);
                }}
                className="w-full rounded-xl border border-teal-300 bg-white px-4 py-3 font-medium text-teal-900 active:bg-teal-50"
              >
                Acak soal baru dengan Claude
              </button>
            )}
            <button
              onClick={() => setStarted(false)}
              className="w-full rounded-xl px-4 py-3 font-medium text-teal-800"
            >
              Pilih topik lain
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isRight = picked === cur.a;

  return (
    <div className={shell} style={{ fontFamily: "system-ui, sans-serif" }}>
      <div className={wrap}>
        <div className="flex items-center justify-between text-sm text-slate-600">
          <span>
            Soal {pos + 1} dari {queue.length}
          </span>
          <span>Benar: {correctCount}</span>
        </div>
        <div className="mt-1 h-2 rounded bg-slate-200">
          <div
            className="h-2 rounded bg-teal-600 transition-all"
            style={{ width: `${((pos + (answered ? 1 : 0)) / queue.length) * 100}%` }}
          />
        </div>

        <div className="mt-4 rounded-xl border-l-4 border-teal-700 bg-white p-3 shadow-sm">
          <p className="text-sm font-semibold text-teal-800">
            {c.topic} · {c.title}
          </p>
          <p className="mt-1 text-sm leading-relaxed text-slate-700">{c.text}</p>
        </div>

        <h2 className="mt-4 text-lg font-semibold leading-snug">{cur.q}</h2>

        <div className="mt-3 space-y-2">
          {cur.o.map((opt, i) => {
            let cls = "border-slate-300 bg-white active:bg-slate-100";
            let badge = "bg-slate-100 text-slate-700";
            if (answered) {
              if (i === cur.a) {
                cls = "border-green-600 bg-green-50";
                badge = "bg-green-600 text-white";
              } else if (i === picked) {
                cls = "border-red-500 bg-red-50";
                badge = "bg-red-500 text-white";
              } else {
                cls = "border-slate-200 bg-white opacity-60";
              }
            }
            return (
              <button
                key={i}
                onClick={() => choose(i)}
                disabled={answered}
                className={`flex w-full items-start gap-3 rounded-xl border-2 p-3 text-left ${cls}`}
              >
                <span
                  className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-sm font-bold ${badge}`}
                >
                  {LETTERS[i]}
                </span>
                <span className="leading-snug">{opt}</span>
              </button>
            );
          })}
        </div>

        {answered && (
          <div
            className={`mt-4 rounded-xl p-4 ${
              isRight ? "bg-green-100 text-green-900" : "bg-amber-100 text-amber-950"
            }`}
            role="status"
          >
            <p className="font-bold">
              {isRight ? "Benar" : `Belum tepat. Jawaban benar: ${LETTERS[cur.a]}`}
            </p>
            {!isRight && <p className="mt-1 font-medium">{cur.o[cur.a]}</p>}
            <p className="mt-2 text-sm leading-relaxed">{cur.e}</p>
          </div>
        )}

        {answered && (
          <button
            onClick={next}
            className="mt-4 w-full rounded-xl bg-teal-700 px-4 py-3 font-semibold text-white active:bg-teal-800"
          >
            {pos + 1 === queue.length ? "Lihat hasil" : "Soal berikutnya"}
          </button>
        )}
      </div>
    </div>
  );
}
