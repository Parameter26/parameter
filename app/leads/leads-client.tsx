"use client";

import { useState } from "react";
import type { QueueItem, ReviewItem } from "@/lib/wa-followup";

type Stats = {
  total: number;
  waiting: number;
  done: number;
  optout: number;
  dailyTarget: number;
  followUpDays: number;
};

export function LeadsBoard({
  dashKey,
  queue,
  review,
  stats,
}: {
  dashKey: string;
  queue: QueueItem[];
  review: ReviewItem[];
  stats: Stats;
}) {
  const today = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <main style={s.page}>
      <div style={s.wrap}>
        <h1 style={s.h1}>📋 WA Follow-up · Parameter</h1>
        <div style={s.sub}>{today}</div>

        <div style={s.stats}>
          <Stat n={queue.length} label="siap kirim" />
          <Stat n={stats.waiting} label="nunggu balas" />
          <Stat n={review.length} label="perlu cek" />
          <Stat n={stats.done} label="selesai" />
          <Stat n={stats.total} label="total" />
        </div>

        <div style={s.tip}>
          💡 Kirim <b>maksimal ~{stats.dailyTarget} pesan/hari</b> + jeda beberapa menit
          biar nomor aman dari spam-flag. Klik <b>✓ Terkirim</b> setelah kirim — status
          langsung kesimpen di sheet, follow-up otomatis muncul lagi setelah{" "}
          {stats.followUpDays} hari kalau belum dibalas.
        </div>

        <div style={s.sec}>✅ Siap di-follow-up ({queue.length})</div>
        {queue.length === 0 && (
          <div style={s.empty}>Mantap — semua lead udah ditangani hari ini 🎉</div>
        )}
        {queue.map((q) => (
          <Card key={q.lead.rowNumber} item={q} dashKey={dashKey} />
        ))}

        {review.length > 0 && (
          <>
            <div style={s.sec}>⚠️ Perlu dicek manual ({review.length})</div>
            {review.map((r) => (
              <div key={r.lead.rowNumber} style={{ ...s.card, ...s.review }}>
                <h3 style={s.name}>{r.lead.nama}</h3>
                <div style={s.meta}>
                  {r.lead.kategori} · {r.lead.kota}
                </div>
                <div style={s.meta2}>
                  📱 {r.lead.waRaw || "—"} — <b>{r.reason}</b>
                </div>
              </div>
            ))}
          </>
        )}

        <footer style={s.footer}>
          Sumber: Google Sheet “Lead Canvassing” · Parameter
        </footer>
      </div>
    </main>
  );
}

function Stat({ n, label }: { n: number; label: string }) {
  return (
    <div style={s.stat}>
      <b style={s.statN}>{n}</b>
      {label}
    </div>
  );
}

function Card({ item, dashKey }: { item: QueueItem; dashKey: string }) {
  const [msg, setMsg] = useState(item.msg);
  const [state, setState] = useState<"idle" | "busy" | "done">("idle");
  const [label, setLabel] = useState("");
  const num = item.num;

  async function mark(action: string, niceLabel: string) {
    setState("busy");
    try {
      const res = await fetch("/api/leads/mark", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: dashKey, row: item.lead.rowNumber, action, stage: item.stage }),
      });
      const j = await res.json();
      if (j.ok) {
        setState("done");
        setLabel(niceLabel);
      } else {
        setState("idle");
        alert("Gagal: " + (j.error || "?"));
      }
    } catch {
      setState("idle");
      alert("Gagal konek ke server.");
    }
  }

  function sendWA() {
    window.open(`https://wa.me/${num}?text=${encodeURIComponent(msg)}`, "_blank", "noopener");
  }

  if (state === "done") {
    return (
      <div style={{ ...s.card, ...s.cardDone }}>
        <span style={s.doneTag}>{label}</span> <b>{item.lead.nama}</b>
        <span style={s.meta2b}> · {item.lead.kota}</span>
      </div>
    );
  }

  return (
    <div style={s.card}>
      <div style={s.top}>
        <div>
          <span style={{ ...s.pr, ...(prColor[item.lead.prioritas] || {}) }}>
            {item.lead.prioritas || "?"}
          </span>
          <span style={{ ...s.badge, ...(item.stage === 2 ? s.bFu : s.bNew) }}>
            {item.stage === 2 ? "Follow-up" : "Baru"}
          </span>
        </div>
        <span style={s.skor}>skor {item.lead.skor}</span>
      </div>
      <h3 style={s.name}>{item.lead.nama}</h3>
      <div style={s.meta}>
        {item.lead.kategori} · {item.lead.kota} · {item.lead.provinsi}
      </div>
      <div style={s.meta2}>
        📱 {item.lead.waRaw} &nbsp;·&nbsp; 🌐 {item.lead.statusWeb}
      </div>
      <textarea style={s.ta} rows={9} value={msg} onChange={(e) => setMsg(e.target.value)} />
      <div style={s.acts}>
        <button style={{ ...s.btn, ...s.wa }} onClick={sendWA}>
          💬 Kirim via WhatsApp
        </button>
      </div>
      <div style={s.acts2}>
        <button
          style={{ ...s.btnSm, ...s.ok }}
          disabled={state === "busy"}
          onClick={() => mark("sent", item.stage === 2 ? "✓ Follow-up terkirim" : "✓ Terkirim")}
        >
          ✓ Terkirim
        </button>
        <button style={s.btnSm} disabled={state === "busy"} onClick={() => mark("reply", "💬 Dibalas")}>
          💬 Bales
        </button>
        <button style={s.btnSm} disabled={state === "busy"} onClick={() => mark("optout", "🚫 Opt-out")}>
          🚫 Stop
        </button>
      </div>
    </div>
  );
}

const prColor: Record<string, React.CSSProperties> = {
  A: { background: "#1f5132", color: "#9be3b4" },
  B: { background: "#4a4327", color: "#e3cf8f" },
};

const s: Record<string, React.CSSProperties> = {
  page: { minHeight: "100dvh", background: "#0B0C0F", color: "#F6F7F9", fontFamily: "system-ui, -apple-system, sans-serif", padding: "18px 14px 60px", lineHeight: 1.5 },
  wrap: { maxWidth: 620, margin: "0 auto" },
  h1: { fontSize: 21, margin: "0 0 3px" },
  sub: { color: "#9EA1A9", fontSize: 13.5, marginBottom: 8 },
  stats: { display: "flex", gap: 8, flexWrap: "wrap", margin: "12px 0 20px" },
  stat: { background: "#16181D", border: "1px solid rgba(255,255,255,.1)", borderRadius: 12, padding: "8px 12px", fontSize: 12.5, color: "#9EA1A9" },
  statN: { fontSize: 17, display: "block", color: "#F6F7F9" },
  tip: { background: "rgba(75,131,255,.1)", border: "1px solid rgba(75,131,255,.3)", borderRadius: 12, padding: "11px 14px", fontSize: 13, color: "#cdddff", marginBottom: 22 },
  sec: { fontSize: 12, letterSpacing: ".08em", textTransform: "uppercase", color: "#9EA1A9", fontWeight: 700, margin: "26px 0 12px" },
  empty: { color: "#9EA1A9", fontStyle: "italic", fontSize: 14 },
  card: { background: "#16181D", border: "1px solid rgba(255,255,255,.1)", borderRadius: 16, padding: 16, marginBottom: 14 },
  cardDone: { opacity: 0.6, padding: "12px 16px" },
  doneTag: { color: "#9be3b4", fontWeight: 700, fontSize: 13 },
  review: { background: "rgba(255,176,32,.07)", borderColor: "rgba(255,176,32,.25)" },
  top: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  pr: { fontWeight: 800, fontSize: 11, padding: "2px 8px", borderRadius: 6, background: "#2a2d34", marginRight: 6 },
  badge: { fontSize: 11, fontWeight: 700, padding: "2px 9px", borderRadius: 999 },
  bNew: { background: "rgba(75,131,255,.18)", color: "#9dc0ff" },
  bFu: { background: "rgba(255,176,32,.18)", color: "#ffce7a" },
  skor: { fontSize: 11.5, color: "#6A6D75", fontFamily: "monospace" },
  name: { margin: "2px 0 3px", fontSize: 18 },
  meta: { color: "#F6F7F9", fontSize: 13.5, fontWeight: 600 },
  meta2: { color: "#9EA1A9", fontSize: 12.5, margin: "4px 0 10px" },
  meta2b: { color: "#9EA1A9", fontSize: 13 },
  ta: { width: "100%", boxSizing: "border-box", background: "#0e1014", color: "#F6F7F9", border: "1px solid rgba(255,255,255,.1)", borderRadius: 10, padding: 11, fontSize: 13.5, fontFamily: "inherit", resize: "vertical", lineHeight: 1.55 },
  acts: { display: "flex", gap: 8, marginTop: 10 },
  acts2: { display: "flex", gap: 8, marginTop: 8 },
  btn: { flex: 1, textAlign: "center", border: 0, borderRadius: 10, padding: 12, fontWeight: 700, fontSize: 14, cursor: "pointer" },
  wa: { background: "#25D366", color: "#fff" },
  btnSm: { flex: 1, border: "1px solid rgba(255,255,255,.1)", background: "#22252c", color: "#F6F7F9", borderRadius: 9, padding: "9px", fontWeight: 600, fontSize: 12.5, cursor: "pointer" },
  ok: { borderColor: "rgba(37,211,102,.4)", color: "#9be3b4" },
  footer: { color: "#6A6D75", fontSize: 12, textAlign: "center", marginTop: 30 },
};
