# Onboarding Tim — Parameter

Panduan buat anggota tim baru (dan agent Claude masing-masing) biar bisa langsung kerja di
semua project Parameter. Semua repo ada di GitHub org **[Parameter26](https://github.com/Parameter26)**.

## Daftar project

| Project | Repo | Live URL |
|---|---|---|
| Parameter (web utama) | [Parameter26/parameter](https://github.com/Parameter26/parameter) | https://parameter.cloud |
| Kalkulator HPP | [Parameter26/kalkulator-hpp](https://github.com/Parameter26/kalkulator-hpp) | https://hpp.parameter.cloud |
| Platform Belajar Pro (LMSpro) | [Parameter26/platformbelajar-pro](https://github.com/Parameter26/platformbelajar-pro) | https://pro.platformbelajar.my.id |
| Ritme | [Parameter26/ritme](https://github.com/Parameter26/ritme) | (cek domain di Vercel) |

## Setup awal (sekali per project)

```bash
git clone https://github.com/Parameter26/<repo>.git
cd <repo>
npm install
cp .env.example .env.local   # isi value-nya — minta ke Alwa kalau ada secret
npm run dev                  # jalanin lokal
```

## Alur kerja sehari-hari (SAMA buat semua project)

> **Aturan emas: `main` = production. Push ke `main` = otomatis LIVE.**

```bash
git pull origin main         # ambil versi terbaru dulu
# ... edit / ngoding (boleh dibantu agent Claude) ...
git add -A
git commit -m "deskripsi perubahan"
git push origin main         # otomatis ke-deploy ke live oleh Vercel
```

- Tiap **push ke `main`** → Vercel auto-deploy ke production (live). Ga perlu `vercel --prod` lagi.
- Kalau bikin **branch lain** lalu buka Pull Request → Vercel auto-bikin **Preview URL** buat
  ngetes sebelum digabung ke `main`. Cocok buat fitur besar / eksperimen.
- Selalu `git pull` dulu sebelum mulai biar ga bentrok sama kerjaan tim lain.

## Catatan penting buat ngoding (WAJIB dibaca agent)

Project-project ini pakai **versi Next.js yang sudah dimodifikasi** — API & konvensi bisa beda
dari yang kamu hafal. Sebelum nulis kode, **baca panduan di `node_modules/next/dist/docs/`** di
repo terkait. Lihat juga `AGENTS.md` di tiap repo.

## Akses

- **GitHub**: minta Alwa undang ke org `Parameter26` (Settings → People → Invite).
- **Vercel**: deploy jalan otomatis dari GitHub — kamu **tidak perlu** akun Vercel buat sekadar
  ngoding & deploy. Akses dashboard Vercel (env var, domain) cuma buat yang ngurus infra.
