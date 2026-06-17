import { NextResponse } from "next/server";
import { updateLeadStatus } from "@/lib/leads";
import { markStatus } from "@/lib/wa-followup";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const STATUS_BY_ACTION: Record<string, string> = {
  reply: "Bales / Tertarik",
  optout: "Tidak berminat",
  closed: "Closed - deal",
  reset: "Belum dihubungi",
};

export async function POST(req: Request) {
  let body: { key?: string; row?: number; action?: string; stage?: number };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Body tidak valid" }, { status: 400 });
  }

  const key = process.env.LEADS_DASH_KEY;
  if (!key || body.key !== key) {
    return NextResponse.json({ ok: false, error: "Akses ditolak" }, { status: 401 });
  }
  if (!body.row || body.row < 2) {
    return NextResponse.json({ ok: false, error: "row tidak valid" }, { status: 400 });
  }

  let status: string;
  if (body.action === "sent") {
    status = markStatus(body.stage === 2 ? 2 : 1);
  } else if (body.action && STATUS_BY_ACTION[body.action]) {
    status = STATUS_BY_ACTION[body.action];
  } else {
    return NextResponse.json({ ok: false, error: "action tidak dikenal" }, { status: 400 });
  }

  try {
    await updateLeadStatus(body.row, status);
    return NextResponse.json({ ok: true, status });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "gagal nulis sheet" },
      { status: 500 },
    );
  }
}
