import { NextResponse } from "next/server";
import { readLeads, readExclusionText, isLeadsConfigured } from "@/lib/leads";
import { buildQueue } from "@/lib/wa-followup";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Cron harian: hitung antrian follow-up WA hari ini.
 * Pengiriman tetap manual (Jon tap di /leads) — ini cuma rekap & titik hook
 * buat reminder (mis. nanti kirim ke Telegram/Brevo).
 *
 * Auth: Vercel Cron kirim `Authorization: Bearer <CRON_SECRET>`.
 */
function authorized(req: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return process.env.NODE_ENV !== "production";
  return req.headers.get("authorization") === `Bearer ${secret}`;
}

export async function GET(req: Request) {
  if (!authorized(req)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  if (!isLeadsConfigured()) {
    return NextResponse.json({ ok: false, error: "leads belum dikonfigurasi" }, { status: 503 });
  }
  try {
    const [leads, excl] = await Promise.all([readLeads(), readExclusionText()]);
    const { queue, review, waiting, done, optout } = buildQueue(leads, excl);
    const stage1 = queue.filter((q) => q.stage === 1).length;
    const stage2 = queue.filter((q) => q.stage === 2).length;
    // TODO: kirim reminder ke Jon (Telegram/Brevo) kalau due > 0.
    return NextResponse.json({
      ok: true,
      date: new Date().toISOString().slice(0, 10),
      total: leads.length,
      due: queue.length,
      stage1,
      stage2,
      waiting,
      done,
      optout,
      review: review.length,
    });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "error" },
      { status: 500 },
    );
  }
}
