import type { Metadata } from "next";
import { readLeads, readExclusionText, isLeadsConfigured } from "@/lib/leads";
import { buildQueue, DAILY_TARGET, FOLLOWUP_DAYS } from "@/lib/wa-followup";
import { LeadsBoard } from "./leads-client";

export const metadata: Metadata = {
  title: "WA Follow-up · Parameter",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ key?: string }>;
}) {
  const { key } = await searchParams;
  const dashKey = process.env.LEADS_DASH_KEY;

  if (!dashKey || key !== dashKey) {
    return (
      <main style={S.deny}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>🔒</div>
          <h1 style={{ margin: 0, fontSize: 20 }}>Akses ditolak</h1>
          <p style={{ color: "#9EA1A9", fontSize: 14 }}>
            Buka halaman ini dengan kunci akses yang benar (?key=...).
          </p>
        </div>
      </main>
    );
  }

  if (!isLeadsConfigured()) {
    return (
      <main style={S.deny}>
        <p style={{ color: "#9EA1A9" }}>
          Service account Google belum dikonfigurasi di environment.
        </p>
      </main>
    );
  }

  let view:
    | (ReturnType<typeof buildQueue> & { total: number })
    | null = null;
  let error: string | null = null;
  try {
    const [leads, excl] = await Promise.all([readLeads(), readExclusionText()]);
    view = { ...buildQueue(leads, excl), total: leads.length };
  } catch (e) {
    error = e instanceof Error ? e.message : "gagal baca sheet";
  }

  if (error || !view) {
    return (
      <main style={S.deny}>
        <p style={{ color: "#ff8d7a" }}>Gagal baca leads: {error}</p>
      </main>
    );
  }

  return (
    <LeadsBoard
      dashKey={dashKey}
      queue={view.queue}
      review={view.review}
      stats={{
        total: view.total,
        waiting: view.waiting,
        done: view.done,
        optout: view.optout,
        dailyTarget: DAILY_TARGET,
        followUpDays: FOLLOWUP_DAYS,
      }}
    />
  );
}

const S: Record<string, React.CSSProperties> = {
  deny: {
    minHeight: "100dvh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "#0B0C0F",
    color: "#F6F7F9",
    fontFamily: "system-ui, sans-serif",
    padding: 24,
  },
};
