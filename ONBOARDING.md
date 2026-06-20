# 🚀 Onboarding Tim Parameter — Panduan untuk Kamu & Agent-mu

> **Untuk siapa:** anggota tim Parameter + agent Claude masing-masing.
> **Tujuan:** sekali baca, kamu (dan agent-mu) langsung paham 4 project kita, cara dapat akses,
> cara kerja, dan cara update fitur sampai live — tanpa ngerusak apa pun.
>
> **🤖 Agent: baca file ini SAMPAI HABIS dulu sebelum nyentuh kode apa pun.**

---

## 1. Apa itu Parameter

Parameter adalah **studio digital** yang bikin & ngejalanin beberapa produk software.
Semua kode ada di satu GitHub organization: **https://github.com/Parameter26**.

Aturan paling penting di seluruh tim — hafalin ini:

> ## ⭐ Push ke branch `main` = otomatis LIVE (production). Titik.
> Ga ada lagi deploy manual. Commit + `git push origin main` → situs production ke-update sendiri.

---

## 2. Empat Project Kita

| Project | Repo | Live URL | Isinya |
|---|---|---|---|
| **parameter** | [Parameter26/parameter](https://github.com/Parameter26/parameter) | https://parameter.cloud | Website utama studio (marketing/landing) |
| **platformbelajar-pro** | [Parameter26/platformbelajar-pro](https://github.com/Parameter26/platformbelajar-pro) | https://pro.platformbelajar.my.id | LMS (Learning Management System) + pembayaran |
| **ritme** | [Parameter26/ritme](https://github.com/Parameter26/ritme) | (lihat Vercel dashboard) | SaaS booking/membership buat studio fitness & wellness |
| **kalkulator-hpp** | [Parameter26/kalkulator-hpp](https://github.com/Parameter26/kalkulator-hpp) | https://hpp.parameter.cloud | Kalkulator HPP (situs statis) |

---

## 3. Stack Teknis per Project (biar agent ga nebak)

### parameter — Next.js 16, React 19
- **Stack:** Next.js 16.2.7, React 19, Tailwind CSS + shadcn/ui. **Tanpa database** (data leads via Google Sheets).
- **Struktur:** `app/` (routes), `components/`, `lib/`, `public/`, `tools/` (script WA follow-up), `legacy/`, `deck/`.
- **Deploy:** Native Vercel Git integration → push `main` langsung ke production.

### platformbelajar-pro — LMS, Next.js + Postgres
- **Stack:** Next.js, React, **Better Auth** (autentikasi), **Drizzle ORM** + **Neon PostgreSQL**, Pusher (realtime), Nodemailer (email), Zod, Tailwind. Pembayaran via Mayar/Xendit (lihat `.env.example`).
- **Struktur:** `app/` (termasuk `app/api/` backend routes), `lib/db/` (schema Drizzle), `drizzle/` (migrasi), `components/`, `scripts/`, `tools/`.
- **Database:** Neon project `neon-bronze-yacht`. Migrasi: `npm run db:generate`, `db:migrate`, `db:studio`.
- **Deploy:** **GitHub Actions** (`.github/workflows/deploy.yml`) → push `main` jalanin build + deploy ke Vercel.

### ritme — SaaS booking, Next.js + Postgres
- **Stack:** Next.js 15 (dev pakai `--turbopack`), React, **Better Auth**, **Drizzle ORM** + **Neon PostgreSQL**, Cloudflare R2 (storage gambar), Fonnte (WhatsApp gateway buat OTP/notif), Nodemailer, Zod, Tailwind.
- **Struktur:** `app/`, `lib/`, `drizzle/`, `design/`, `docs/`, `scripts/`, `tools/`, `types/`.
- **Database:** Neon project `ritme-db`. Migrasi: `npm run db:generate`, `db:migrate`, `db:push`, `db:studio`.
- **Deploy:** **GitHub Actions** → push `main`.

### kalkulator-hpp — situs statis
- **Stack:** HTML/CSS/JS murni. **Tidak ada framework, build, atau database.**
- **Deploy:** ⚠️ **DIPARKIR.** Auto-deploy belum jalan (kendala deploy statis di Vercel free). Situs live tetap jalan. Baca `DEPLOY.md` di repo itu. **Jangan berharap push langsung live** untuk project ini.

---

## 4. ⚠️ ATURAN WAJIB BUAT AGENT (baca pelan-pelan)

1. **Ini BUKAN Next.js yang kamu hafal.** Project ini pakai versi Next.js yang sudah dimodifikasi
   — API, konvensi, struktur file bisa beda dari data latihanmu. **WAJIB baca panduan di
   `node_modules/next/dist/docs/` di repo terkait SEBELUM nulis kode.** Lihat juga `AGENTS.md`
   di tiap repo. Patuhi notice deprecation.
2. **JANGAN pernah commit file `.env.local` / secret.** Sudah di-`.gitignore`. Value asli dibagi
   terpisah. File `.env.example` itu template aman (tanpa value) — boleh dibaca.
3. **`main` itu production.** Tiap push ke `main` langsung ke user beneran. Perubahan besar/eksperimen
   → bikin branch + Pull Request dulu (khusus `parameter`, PR otomatis bikin Preview URL).
   Selalu `git pull` dulu sebelum mulai.
4. **Hati-hati database (platformbelajar & ritme).** Migrasi Drizzle yang salah bisa ngerusak data
   production. Jangan jalanin `db:push`/`db:migrate` ke production tanpa yakin.
5. **kalkulator-hpp ≠ auto-deploy.** Boleh edit & push, tapi deploy-nya masih manual/diparkir.

---

## 5. 🔑 Cara Dapat Akses ke GitHub Org Parameter26 (langkah detail)

Ini yang harus dilakuin anggota tim baru SEKALI di awal. Tanpa ini, repo private (3 dari 4) ga bisa di-clone.

### Langkah A — Diundang ke org (sekali)
1. Kirim **username GitHub** kamu ke **Alwa**.
2. Alwa undang lewat https://github.com/orgs/Parameter26/people → **Invite member**.
3. Cek email kamu / buka https://github.com/Parameter26 → klik **Accept invitation**.
4. Pastikan udah jadi member: profilmu muncul di tab **People** org.

### Langkah B — Setup Git auth di komputer (biar bisa clone repo private)
Pilih **salah satu** (yang paling gampang: GitHub CLI):

**Opsi 1 — GitHub CLI `gh` (REKOMENDASI):**
```bash
# install gh (mac): brew install gh
gh auth login
#  -> pilih: GitHub.com  ->  HTTPS  ->  Login with a web browser
#  -> ikutin, paste kode di browser, selesai.
```
Setelah ini `git clone`/`push` ke repo private otomatis jalan tanpa minta password lagi.

**Opsi 2 — Personal Access Token (PAT):**
1. github.com → foto profil → **Settings** → **Developer settings** → **Personal access tokens** → **Tokens (classic)** → **Generate new token**.
2. Centang scope **`repo`** (dan `workflow` kalau mau edit GitHub Actions) → Generate → **copy**.
3. Saat `git clone`/`push` lewat HTTPS diminta password, **paste token ini** (bukan password GitHub).

**Opsi 3 — SSH key:**
```bash
ssh-keygen -t ed25519 -C "email-kamu@contoh.com"      # enter terus aja
cat ~/.ssh/id_ed25519.pub                              # copy isinya
# github.com -> Settings -> SSH and GPG keys -> New SSH key -> paste
# lalu clone pakai URL SSH: git clone git@github.com:Parameter26/<repo>.git
```

### Langkah C — Clone project
```bash
git clone https://github.com/Parameter26/<nama-repo>.git
```
Kalau berhasil clone repo **private** (mis. `platformbelajar-pro`), berarti akses kamu udah beres. ✅

---

## 6. Setup Pertama Kali (per project)

```bash
git clone https://github.com/Parameter26/<nama-repo>.git
cd <nama-repo>
npm install
cp .env.example .env.local      # buka & isi value-nya. Value asli minta ke Alwa (jalur aman).
npm run db:generate             # khusus platformbelajar & ritme (kalau perlu)
npm run dev                     # buka http://localhost:3000
```
> **kalkulator-hpp:** statis, ga ada `npm install`. Cukup buka `index.html` / serve folder-nya.

---

## 7. Alur Kerja Sehari-hari (SAMA buat semua project ber-framework)

```bash
git pull origin main          # 1. ambil versi terbaru DULU
# ... edit/ngoding (boleh dibantu agent) ...
npm run dev                   # 2. tes di lokal sampai bener
npm run lint                  # 3. cek error
git add -A
git commit -m "deskripsi jelas perubahanmu"
git push origin main          # 4. otomatis ke-deploy ke LIVE
```
- Push `main` → Vercel auto-deploy ke production. **Ga perlu `vercel --prod`.**
- Mau tes tanpa risiko production → bikin branch + Pull Request (di `parameter` dapat Preview URL otomatis).

---

## 8. 🤖 Buat Bos yang Mau Update Fitur Pakai Agent (flow ringkas)

Skenario: kamu (pemilik/anggota) pengen nambah/ubah fitur di salah satu project, dikerjain sama agent Claude-mu.

1. **Pastikan akses beres** — udah member org `Parameter26` + git auth udah di-setup (Bagian 5).
2. **Clone repo** project yang mau diubah (Bagian 6), lalu `npm install` + isi `.env.local`.
3. **Buka agent (Claude Code) di dalam folder repo itu.**
4. **Suruh agent baca dulu:** file `ONBOARDING.md` ini + `AGENTS.md` + docs di `node_modules/next/dist/docs/`.
   Contoh perintah ke agent:
   > "Baca ONBOARDING.md dan AGENTS.md di repo ini, lalu baca node_modules/next/dist/docs/ sebelum nulis kode. Setelah itu, [jelaskan fitur yang kamu mau]."
5. **Agent ngerjain** → kamu review → tes lokal (`npm run dev`).
6. **Push ke `main`** → fitur otomatis **live** di production.

Hasilnya: tiap orang + agent-nya bisa update fitur & deploy sendiri dari org Parameter, ga perlu nunggu satu orang.

---

## 9. Cara Agent Mempelajari Codebase (urutan baca yang efisien)

1. **`AGENTS.md`** & **`README.md`** — aturan & konteks project.
2. **`package.json`** — stack, dependencies, script yang tersedia.
3. **`app/`** — routing & halaman (App Router). Mulai dari `app/page.tsx` & `app/layout.tsx`.
4. **`app/api/`** — backend/endpoint (platformbelajar & ritme).
5. **`lib/`** — utilitas inti, koneksi DB, auth, config.
6. **`lib/db/` + `drizzle/`** — skema database & migrasi.
7. **`node_modules/next/dist/docs/`** — WAJIB sebelum nulis kode Next.js (versi modifikasi).

Lalu `npm run dev` dan klik-klik aplikasinya buat ngerti alur nyatanya.

---

## 10. Akses Lain yang Perlu Diketahui

- **Vercel:** kamu **TIDAK perlu** akun Vercel buat ngoding & deploy — deploy jalan otomatis lewat GitHub.
  Akun Vercel cuma buat yang ngurus infra (env, domain).
- **Value `.env.local`:** minta ke Alwa lewat jalur aman (password manager / GDrive private). Jangan lewat chat biasa.

---

## 11. Catatan Operasional Penting (biar ga ngulang kesalahan)

- **Database Neon (platformbelajar & ritme) pakai free plan.** Jangan pasang uptime-monitor yang
  nembak endpoint yang query DB (mis. `/api/health`) tiap beberapa menit — itu bikin DB ga pernah
  "tidur" dan ngabisin jatah compute. Untuk monitoring pakai endpoint **DB-free** (`/api/ping`).
  (Ini pelajaran nyata yang udah pernah kejadian & bikin DB platformbelajar kena limit.)
- **Cold-start wajar:** DB Neon free butuh ~2-3 detik buat "bangun" setelah idle. Itu normal.
- **Jangan hapus** Neon project `neon-bronze-yacht` (platformbelajar) & `ritme-db` (ritme) — production.

---

## 12. Cheat Sheet

```bash
# Clone semua project sekaligus (setelah akses beres)
for r in parameter platformbelajar-pro ritme kalkulator-hpp; do
  git clone https://github.com/Parameter26/$r.git
done

# Deploy = cukup push ke main
git push origin main

# Database tools (platformbelajar & ritme)
npm run db:studio      # GUI database
npm run db:generate    # generate migrasi dari perubahan schema
npm run db:migrate     # apply migrasi
```

---

## 13. Kalau Bingung / Mentok

- Baca dulu `AGENTS.md` + `README.md` repo terkait, dan docs Next.js di `node_modules/next/dist/docs/`.
- Yang paling paham produk untuk production: **Alwa (Sam Alu)**.
- Jangan eksperimen langsung di `main` untuk perubahan besar — pakai branch + PR.

---

**Selamat datang di Parameter. Sekarang kamu (dan agent-mu) udah punya semua yang dibutuhin buat mulai. 🚀**
