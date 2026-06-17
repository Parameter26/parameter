/**
 * WA Follow-up Command Center — generator (v1).
 *
 * Baca leads dari Google Sheet "Lead Canvassing", susun antrian follow-up,
 * bikin pesan WhatsApp personal per kategori, lalu output 1 file HTML yang
 * bisa dibuka di HP: tiap lead ada tombol "Kirim via WA" (wa.me prefilled).
 *
 * Jalankan:
 *   node --env-file=/Users/alwa/Documents/PlatformBelajarPro/.env.local tools/wa-followup.mjs
 *
 * Butuh env: GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY
 * (reuse service account LMSpro). Read-only — belum nulis balik status.
 */
import { google } from "googleapis";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const SHEET_ID = process.env.PARAM_LEADS_SHEET_ID || "1U9tDA3gFVjPEwin6vkIP2LtGdp1CHSt4apwlusDPFYc";
const LEADS_TAB = "Lead Canvassing";
const EXCL_TAB = "Exclusion List";
const SENDER_NAME = "Jon"; // nama yang muncul di pesan
const DAILY_TARGET = 10; // saran kirim per hari biar aman dari spam-flag

const __dir = dirname(fileURLToPath(import.meta.url));

function getAuth() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const key = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, "\n");
  const scopes = ["https://www.googleapis.com/auth/spreadsheets.readonly"];
  if (email && key) return new google.auth.JWT({ email, key, scopes });
  const oc = new google.auth.OAuth2(process.env.GOOGLE_OAUTH_CLIENT_ID, process.env.GOOGLE_OAUTH_CLIENT_SECRET);
  oc.setCredentials({ refresh_token: process.env.GOOGLE_OAUTH_REFRESH_TOKEN });
  return oc;
}

function rowsToObjects(values) {
  const hdrIdx = values.findIndex((r) => r.some((c) => /nama usaha|whatsapp/i.test(c || "")));
  if (hdrIdx < 0) return [];
  const headers = values[hdrIdx].map((h) => (h || "").trim());
  return values.slice(hdrIdx + 1)
    .filter((r) => r.some((c) => c && c.trim()))
    .map((r) => Object.fromEntries(headers.map((h, i) => [h, (r[i] || "").trim()])));
}

/** Normalisasi nomor WA Indonesia jadi format 62xxxx. null kalau ga valid. */
function waNumber(raw) {
  if (!raw) return null;
  const m = String(raw).match(/[\d][\d\s\-]{7,}\d/);
  if (!m) return null;
  let d = m[0].replace(/\D/g, "");
  if (d.startsWith("0")) d = "62" + d.slice(1);
  else if (d.startsWith("8")) d = "62" + d;
  if (!d.startsWith("62") || d.length < 10 || d.length > 15) return null;
  return d;
}

/** Kata-kata khas per kategori usaha buat personalisasi pesan. */
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

function stage1Message(lead) {
  const nama = lead["Nama Usaha"];
  const { hal, aksi } = categoryWords(lead["Kategori"]);
  const produk = (lead["Rekomendasi Produk"] || "website").toLowerCase();
  return (
`Halo kak 👋 saya ${SENDER_NAME} dari Parameter (studio pembuat website buat UMKM).

Kebetulan saya lihat ${nama} di Linktree/Instagram-nya — keren! Cuma kayaknya belum ada website resminya ya.

Kami bantu usaha seperti ${nama} bikin ${produk} — isinya ${hal}, biar ${aksi}. Tampil lebih profesional & ga ketelan kompetitor.

Kalau boleh, saya bikinin 1 contoh demo GRATIS khusus buat ${nama} — kakak tinggal lihat, ga ada kewajiban sama sekali 🙏 Boleh saya kirimin?`
  );
}

function stage2Message(lead) {
  const nama = lead["Nama Usaha"];
  return (
`Halo kak, mau follow up dikit ya 🙏 soal demo website gratis buat ${nama}.

Kalau lagi sibuk gapapa banget — saya cuma mau mastiin pesan saya yang kemarin kebaca. Kalau berminat lihat contohnya, balas "1" aja nanti saya kirim. Makasih kak! 🙏`
  );
}

function isOptedOut(status = "") {
  const s = status.toLowerCase();
  return /tidak berminat|opt-?out|jangan dihubungi|tidak relevan|stop/.test(s);
}

async function main() {
  const sheets = google.sheets({ version: "v4", auth: getAuth() });
  const [leadsRes, exclRes] = await Promise.all([
    sheets.spreadsheets.values.get({ spreadsheetId: SHEET_ID, range: `'${LEADS_TAB}'!A1:Z200` }),
    sheets.spreadsheets.values.get({ spreadsheetId: SHEET_ID, range: `'${EXCL_TAB}'!A1:Z200` }).catch(() => ({ data: { values: [] } })),
  ]);
  const leads = rowsToObjects(leadsRes.data.values || []);
  const exclText = JSON.stringify(exclRes.data.values || []).toLowerCase();

  const queue = [];
  const review = []; // perlu verifikasi dulu
  const skipped = [];
  for (const l of leads) {
    const status = l["Status Outreach"] || "";
    const wa = waNumber(l["WhatsApp/Telepon"]);
    if (isOptedOut(status) || (l["Nama Usaha"] && exclText.includes(l["Nama Usaha"].toLowerCase()))) {
      skipped.push({ ...l, _reason: "opt-out / exclusion" }); continue;
    }
    if (!wa) { review.push({ ...l, _reason: "nomor WA perlu dicek manual" }); continue; }
    if (/perlu verifikasi/i.test(status)) { review.push({ ...l, wa, _reason: "perlu verifikasi bisnis dulu" }); continue; }
    const s = status.toLowerCase();
    const stage = !s.includes("belum") && /sudah dihubungi|tahap 1|follow-?up/.test(s) ? 2 : 1;
    queue.push({ ...l, wa, stage, msg: stage === 2 ? stage2Message(l) : stage1Message(l) });
  }

  // urut prioritas A->B->C lalu skor desc
  const pr = { A: 0, B: 1, C: 2 };
  queue.sort((a, b) => (pr[a.Prioritas] ?? 9) - (pr[b.Prioritas] ?? 9) || (Number(b.Skor) || 0) - (Number(a.Skor) || 0));

  const html = renderHTML(queue, review, { total: leads.length, skipped: skipped.length });
  const outDir = `${__dir}/out`;
  mkdirSync(outDir, { recursive: true });
  const outPath = `${outDir}/wa-followup.html`;
  writeFileSync(outPath, html);
  console.log(`✅ ${queue.length} lead siap follow-up · ${review.length} perlu cek · ${skipped.length} di-skip`);
  console.log(`📄 ${outPath}`);
}

function esc(s = "") { return String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])); }

function card(l, i) {
  const waLink = `https://wa.me/${l.wa}?text=${encodeURIComponent(l.msg)}`;
  const badge = l.stage === 2 ? '<span class="b b-fu">Follow-up</span>' : '<span class="b b-new">Baru</span>';
  return `<div class="card" data-i="${i}">
    <div class="top">
      <div><span class="pr pr-${esc(l.Prioritas)}">${esc(l.Prioritas)}</span> ${badge}</div>
      <label class="done"><input type="checkbox" class="chk"> sudah dikirim</label>
    </div>
    <h3>${esc(l["Nama Usaha"])}</h3>
    <div class="meta">${esc(l["Kategori"])} · ${esc(l["Kota"])} · ${esc(l["Provinsi"] || "")}</div>
    <div class="meta2">📱 ${esc(l["WhatsApp/Telepon"])} &nbsp;·&nbsp; 🌐 ${esc(l["Status Website"] || "")}</div>
    <textarea class="msg" rows="9">${esc(l.msg)}</textarea>
    <div class="acts">
      <a class="btn wa" href="${waLink}" target="_blank" rel="noopener">💬 Kirim via WhatsApp</a>
      <button class="btn copy" onclick="copyMsg(this)">Salin</button>
    </div>
  </div>`;
}

function renderHTML(queue, review, stats) {
  const today = new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  return `<!doctype html><html lang="id"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex">
<title>WA Follow-up — Parameter</title>
<style>
:root{--ink:#0E0F13;--surface:#16181D;--line:rgba(255,255,255,.1);--cream:#F6F7F9;--mist:#9EA1A9;--blue:#4B83FF;--green:#25D366}
*{box-sizing:border-box}body{margin:0;background:#0B0C0F;color:var(--cream);font-family:'Segoe UI',system-ui,-apple-system,sans-serif;padding:18px 14px 60px;line-height:1.5}
.wrap{max-width:620px;margin:0 auto}
h1{font-size:21px;margin:0 0 3px}.sub{color:var(--mist);font-size:13.5px;margin-bottom:8px}
.stats{display:flex;gap:8px;flex-wrap:wrap;margin:12px 0 22px}
.stat{background:var(--surface);border:1px solid var(--line);border-radius:12px;padding:9px 13px;font-size:13px}.stat b{font-size:17px;display:block}
.tip{background:rgba(75,131,255,.1);border:1px solid rgba(75,131,255,.3);border-radius:12px;padding:11px 14px;font-size:13px;color:#cdddff;margin-bottom:22px}
.sec{font-size:12px;letter-spacing:.08em;text-transform:uppercase;color:var(--mist);font-weight:700;margin:26px 0 12px}
.card{background:var(--surface);border:1px solid var(--line);border-radius:16px;padding:16px;margin-bottom:14px}
.card.sent{opacity:.45}
.top{display:flex;justify-content:space-between;align-items:center;margin-bottom:8px}
.pr{font-weight:800;font-size:11px;padding:2px 8px;border-radius:6px;background:#2a2d34}.pr-A{background:#1f5132;color:#9be3b4}.pr-B{background:#4a4327;color:#e3cf8f}
.b{font-size:11px;font-weight:700;padding:2px 9px;border-radius:999px;margin-left:6px}.b-new{background:rgba(75,131,255,.18);color:#9dc0ff}.b-fu{background:rgba(255,176,32,.18);color:#ffce7a}
.done{font-size:12px;color:var(--mist);display:flex;align-items:center;gap:5px;cursor:pointer}
h3{margin:2px 0 3px;font-size:18px}.meta{color:var(--cream);font-size:13.5px;font-weight:600}.meta2{color:var(--mist);font-size:12.5px;margin:4px 0 10px}
textarea{width:100%;background:#0e1014;color:var(--cream);border:1px solid var(--line);border-radius:10px;padding:11px;font-size:13.5px;font-family:inherit;resize:vertical;line-height:1.55}
.acts{display:flex;gap:8px;margin-top:10px}
.btn{flex:1;text-align:center;border:0;border-radius:10px;padding:12px;font-weight:700;font-size:14px;cursor:pointer;text-decoration:none}
.wa{background:var(--green);color:#fff}.copy{flex:0 0 auto;background:#22252c;color:var(--cream);border:1px solid var(--line)}
.rev{background:rgba(255,176,32,.07);border-color:rgba(255,176,32,.25)}
footer{color:var(--mist);font-size:12px;text-align:center;margin-top:30px}
</style></head><body><div class="wrap">
<h1>📋 WA Follow-up · Parameter</h1>
<div class="sub">${today}</div>
<div class="stats">
  <div class="stat"><b>${queue.length}</b>siap kirim</div>
  <div class="stat"><b>${review.length}</b>perlu cek</div>
  <div class="stat"><b>${stats.total}</b>total lead</div>
</div>
<div class="tip">💡 Biar nomor aman dari spam-flag WhatsApp, kirim <b>maksimal ~${DAILY_TARGET} pesan/hari</b> & jeda beberapa menit antar kirim. Centang "sudah dikirim" biar ga dobel besok.</div>
<div class="sec">✅ Siap di-follow-up (${queue.length})</div>
${queue.map(card).join("\n")}
${review.length ? `<div class="sec">⚠️ Perlu dicek manual (${review.length})</div>` + review.map((l) => `<div class="card rev"><h3>${esc(l["Nama Usaha"])}</h3><div class="meta">${esc(l["Kategori"])} · ${esc(l["Kota"])}</div><div class="meta2">📱 ${esc(l["WhatsApp/Telepon"])} — <b>${esc(l._reason)}</b></div></div>`).join("\n") : ""}
<footer>Generated ${new Date().toLocaleString("id-ID")} · Parameter · sumber: Google Sheet "Lead Canvassing"</footer>
</div>
<script>
function copyMsg(b){const t=b.closest('.card').querySelector('.msg');navigator.clipboard.writeText(t.value);b.textContent='Tersalin ✓';setTimeout(()=>b.textContent='Salin',1500);}
document.querySelectorAll('.chk').forEach((c,i)=>{const k='wafu_'+document.querySelectorAll('.chk').length+'_'+i;const card=c.closest('.card');if(localStorage.getItem(k)==='1'){c.checked=true;card.classList.add('sent');}c.addEventListener('change',()=>{card.classList.toggle('sent',c.checked);localStorage.setItem(k,c.checked?'1':'0');});});
</script>
</body></html>`;
}

main().catch((e) => { console.error("ERR:", e.message); process.exit(1); });
