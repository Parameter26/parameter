/**
 * Klien Google Sheet untuk leads Parameter (read + write-back status).
 * Sumber kebenaran: sheet "Lead Canvassing" milik Jon. Reuse service account.
 */
import { google } from "googleapis";

const TAB = "Lead Canvassing";
const EXCL_TAB = "Exclusion List";

export function getSheetId() {
  return process.env.PARAM_LEADS_SHEET_ID || "1U9tDA3gFVjPEwin6vkIP2LtGdp1CHSt4apwlusDPFYc";
}

function getAuth() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const key = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, "\n");
  const scopes = ["https://www.googleapis.com/auth/spreadsheets"];
  if (email && key) return new google.auth.JWT({ email, key, scopes });
  const cid = process.env.GOOGLE_OAUTH_CLIENT_ID;
  const cs = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
  const rt = process.env.GOOGLE_OAUTH_REFRESH_TOKEN;
  if (cid && cs && rt) {
    const oc = new google.auth.OAuth2(cid, cs);
    oc.setCredentials({ refresh_token: rt });
    return oc;
  }
  return null;
}

export function isLeadsConfigured() {
  return Boolean(
    (process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY) ||
      process.env.GOOGLE_OAUTH_REFRESH_TOKEN,
  );
}

function sheetsClient() {
  const auth = getAuth();
  if (!auth) throw new Error("Service account belum dikonfigurasi");
  return google.sheets({ version: "v4", auth });
}

export type Lead = {
  rowNumber: number; // baris asli di sheet (1-based)
  id: string;
  prioritas: string;
  skor: string;
  nama: string;
  kategori: string;
  kota: string;
  provinsi: string;
  waRaw: string;
  email: string;
  presence: string;
  statusWeb: string;
  rekomendasi: string;
  hook: string;
  status: string;
};

let statusColCache = -1;
let headerRowCache = -1; // baris header (1-based) — buat guard anti nimpa header

const FIELD_BY_HEADER: Record<string, keyof Lead> = {
  ID: "id",
  Prioritas: "prioritas",
  Skor: "skor",
  "Nama Usaha": "nama",
  Kategori: "kategori",
  Kota: "kota",
  Provinsi: "provinsi",
  "WhatsApp/Telepon": "waRaw",
  Email: "email",
  "Presence Saat Ini": "presence",
  "Status Website": "statusWeb",
  "Rekomendasi Produk": "rekomendasi",
  "Personalization Hook": "hook",
  "Status Outreach": "status",
};

export async function readLeads(): Promise<Lead[]> {
  const sheets = sheetsClient();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: getSheetId(),
    range: `'${TAB}'!A1:Z300`,
  });
  const values = res.data.values || [];
  const hdrIdx = values.findIndex((r) => r.some((c) => /nama usaha|whatsapp/i.test(c || "")));
  if (hdrIdx < 0) return [];
  const headers = values[hdrIdx].map((h) => (h || "").trim());
  statusColCache = headers.findIndex((h) => h === "Status Outreach");
  headerRowCache = hdrIdx + 1;

  const leads: Lead[] = [];
  for (let i = hdrIdx + 1; i < values.length; i++) {
    const row = values[i];
    if (!row || !row.some((c) => c && c.trim())) continue;
    const lead = {
      rowNumber: i + 1,
      id: "", prioritas: "", skor: "", nama: "", kategori: "", kota: "", provinsi: "",
      waRaw: "", email: "", presence: "", statusWeb: "", rekomendasi: "", hook: "", status: "",
    } as Lead;
    headers.forEach((h, c) => {
      const f = FIELD_BY_HEADER[h];
      if (f) (lead[f] as string) = (row[c] || "").trim();
    });
    if (!lead.nama) continue;
    leads.push(lead);
  }
  return leads;
}

export async function readExclusionText(): Promise<string> {
  try {
    const sheets = sheetsClient();
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: getSheetId(),
      range: `'${EXCL_TAB}'!A1:Z200`,
    });
    return JSON.stringify(res.data.values || []).toLowerCase();
  } catch {
    return "[]";
  }
}

function colLetter(idx0: number) {
  // 0 -> A
  let n = idx0;
  let s = "";
  do {
    s = String.fromCharCode(65 + (n % 26)) + s;
    n = Math.floor(n / 26) - 1;
  } while (n >= 0);
  return s;
}

/** Tulis balik Status Outreach untuk 1 lead (by rowNumber). */
export async function updateLeadStatus(rowNumber: number, status: string) {
  const sheets = sheetsClient();
  if (statusColCache < 0) {
    // cari baris header di mana pun (sheet punya baris judul/catatan di atas)
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: getSheetId(),
      range: `'${TAB}'!A1:Z12`,
    });
    const rows = res.data.values || [];
    for (let r = 0; r < rows.length; r++) {
      const idx = (rows[r] || []).findIndex((c) => (c || "").trim() === "Status Outreach");
      if (idx >= 0) {
        statusColCache = idx;
        headerRowCache = r + 1;
        break;
      }
    }
  }
  if (statusColCache < 0) throw new Error("Kolom 'Status Outreach' tidak ditemukan");
  // Guard: jangan pernah nulis ke baris header atau di atasnya.
  if (headerRowCache > 0 && rowNumber <= headerRowCache) {
    throw new Error(`Tolak nulis ke baris ${rowNumber} (header di baris ${headerRowCache})`);
  }
  const cell = `'${TAB}'!${colLetter(statusColCache)}${rowNumber}`;
  await sheets.spreadsheets.values.update({
    spreadsheetId: getSheetId(),
    range: cell,
    valueInputOption: "RAW",
    requestBody: { values: [[status]] },
  });
}
