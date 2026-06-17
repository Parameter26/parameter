/**
 * Logika follow-up WA: normalisasi nomor, generate pesan personal per kategori,
 * dan susun antrian (siapa yang due hari ini berdasarkan status + tanggal kontak).
 */
import type { Lead } from "@/lib/leads";

const SENDER = process.env.SENDER_NAME || "Jon";
export const FOLLOWUP_DAYS = Number(process.env.OUTREACH_FOLLOWUP_DAYS || 4);
export const DAILY_TARGET = Number(process.env.OUTREACH_DAILY_LIMIT || 10);

/** 62xxxx atau null kalau ga valid. */
export function waNumber(raw: string): string | null {
  if (!raw) return null;
  const m = String(raw).match(/[\d][\d\s\-]{7,}\d/);
  if (!m) return null;
  let d = m[0].replace(/\D/g, "");
  if (d.startsWith("0")) d = "62" + d.slice(1);
  else if (d.startsWith("8")) d = "62" + d;
  if (!d.startsWith("62") || d.length < 10 || d.length > 15) return null;
  return d;
}

function categoryWords(kategori = "") {
  const k = kategori.toLowerCase();
  if (/wedding|wo\b/.test(k)) return { hal: "galeri, paket & testimoni", aksi: "calon pengantin gampang lihat paket & konsultasi" };
  if (/bimbel|les|privat|paud|pendidikan|course|sekolah/.test(k)) return { hal: "program, biaya & form pendaftaran", aksi: "orang tua/siswa gampang daftar" };
  if (/klinik|dokter|medis|kesehatan/.test(k)) return { hal: "layanan, jadwal dokter & reservasi", aksi: "pasien gampang lihat layanan & bikin janji" };
  if (/mua|makeup|make up|beauty|nail|salon|spa/.test(k)) return { hal: "portfolio, paket & booking", aksi: "klien gampang lihat hasil kerja & booking" };
  if (/cake|bakery|kue|florist|bunga|catering|cater/.test(k)) return { hal: "katalog produk & form order", aksi: "pelanggan gampang lihat katalog & pesan" };
  if (/resto|restoran|coffee|kopi|cafe|kuliner|eatery|food/.test(k)) return { hal: "menu, lokasi & reservasi", aksi: "pelanggan gampang lihat menu & pesan" };
  if (/laundry/.test(k)) return { hal: "harga, layanan & lokasi cabang", aksi: "pelanggan gampang lihat harga & lokasi" };
  return { hal: "layanan, harga & kontak", aksi: "calon pelanggan gampang nemu & menghubungi kamu" };
}

export function stage1Message(l: Lead): string {
  const { hal, aksi } = categoryWords(l.kategori);
  const produk = (l.rekomendasi || "website").toLowerCase();
  return `Halo kak 👋 saya ${SENDER} dari Parameter (studio pembuat website buat UMKM).

Kebetulan saya lihat ${l.nama} di Linktree/Instagram-nya — keren! Cuma kayaknya belum ada website resminya ya.

Kami bantu usaha seperti ${l.nama} bikin ${produk} — isinya ${hal}, biar ${aksi}. Tampil lebih profesional & ga ketelan kompetitor.

Kalau boleh, saya bikinin 1 contoh demo GRATIS khusus buat ${l.nama} — kakak tinggal lihat, ga ada kewajiban sama sekali 🙏 Boleh saya kirimin?`;
}

export function stage2Message(l: Lead): string {
  return `Halo kak, mau follow up dikit ya 🙏 soal demo website gratis buat ${l.nama}.

Kalau lagi sibuk gapapa banget — saya cuma mau mastiin pesan saya yang kemarin kebaca. Kalau berminat lihat contohnya, balas "1" aja nanti saya kirim. Makasih kak! 🙏`;
}

export function waLink(num: string, msg: string) {
  return `https://wa.me/${num}?text=${encodeURIComponent(msg)}`;
}

// ---- status convention (ditulis balik ke kolom Status Outreach) ----
// "Belum dihubungi" | "Perlu verifikasi"  -> awal
// "Dihubungi · YYYY-MM-DD · T1"            -> stage 1 terkirim
// "Follow-up · YYYY-MM-DD · T2"            -> stage 2 terkirim
// "Bales / Tertarik" | "Tidak berminat" | "Closed - deal"
export function markStatus(stage: 1 | 2, date = new Date()) {
  const d = date.toISOString().slice(0, 10);
  return stage === 1 ? `Dihubungi · ${d} · T1` : `Follow-up · ${d} · T2`;
}

function isOptedOut(s: string) {
  return /tidak berminat|opt-?out|jangan dihubungi|tidak relevan|\bstop\b/i.test(s);
}
function isDone(s: string) {
  return /bales|tertarik|minat\b|deal|closed|follow-up|t2/i.test(s);
}
function parseContactDate(s: string): Date | null {
  const m = s.match(/(\d{4}-\d{2}-\d{2})/);
  if (!m) return null;
  const d = new Date(m[1]);
  return isNaN(d.getTime()) ? null : d;
}

export type QueueItem = {
  lead: Lead;
  stage: 1 | 2;
  num: string;
  msg: string;
  link: string;
};
export type ReviewItem = { lead: Lead; reason: string };

export function buildQueue(
  leads: Lead[],
  exclText: string,
  followUpDays = FOLLOWUP_DAYS,
): { queue: QueueItem[]; review: ReviewItem[]; waiting: number; done: number; optout: number } {
  const queue: QueueItem[] = [];
  const review: ReviewItem[] = [];
  let waiting = 0;
  let done = 0;
  let optout = 0;

  for (const lead of leads) {
    const status = lead.status || "";
    if (isOptedOut(status) || (lead.nama && exclText.includes(lead.nama.toLowerCase()))) {
      optout++;
      continue;
    }
    const num = waNumber(lead.waRaw);
    if (!num) {
      review.push({ lead, reason: "Nomor WA perlu dicek manual" });
      continue;
    }
    if (/perlu verifikasi/i.test(status)) {
      review.push({ lead, reason: "Bisnis perlu diverifikasi dulu" });
      continue;
    }
    if (isDone(status)) {
      done++;
      continue;
    }
    const s = status.toLowerCase();
    const contactedStage1 = s.startsWith("dihubungi") || s.includes("· t1");
    if (contactedStage1) {
      const dt = parseContactDate(status);
      const daysSince = dt ? (Date.now() - dt.getTime()) / 86400000 : 999;
      if (daysSince >= followUpDays) {
        queue.push({ lead, stage: 2, num, msg: stage2Message(lead), link: waLink(num, stage2Message(lead)) });
      } else {
        waiting++;
      }
      continue;
    }
    // belum dihubungi / kosong -> stage 1
    queue.push({ lead, stage: 1, num, msg: stage1Message(lead), link: waLink(num, stage1Message(lead)) });
  }

  const pr: Record<string, number> = { A: 0, B: 1, C: 2 };
  queue.sort(
    (a, b) =>
      a.stage - b.stage ||
      (pr[a.lead.prioritas] ?? 9) - (pr[b.lead.prioritas] ?? 9) ||
      (Number(b.lead.skor) || 0) - (Number(a.lead.skor) || 0),
  );
  return { queue, review, waiting, done, optout };
}
