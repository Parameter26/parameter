// Kontak Parameter — satu sumber kebenaran (dipakai Nav, Hero, CTA, Footer)
export const WA_NUMBER = "6281218566134";
export const EMAIL = "jamagis1897@gmail.com";
export const INSTAGRAM = "https://www.instagram.com/parameter.id2026";
export const IG_HANDLE = "@parameter.id2026";

export const waUrl = (
  text = "Halo Parameter, saya mau konsultasi soal kebutuhan digital bisnis saya."
) => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;

export const mailUrl = (subject = "Konsultasi Parameter") =>
  `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}`;

// Produk yang dibangun & dijalankan sendiri
export const PRODUCTS = [
  {
    name: "Platform Belajar Pro",
    role: "LMS & Kursus Online",
    logo: "/brand-logo-horizontal.png",
    logoH: 34,
    desc: "Sistem manajemen pembelajaran untuk instruktur & lembaga: kelas live, jadwal, materi, pembayaran, sampai rekaman — semua dalam satu platform.",
    href: "https://pro.platformbelajar.my.id",
    badge: "Live",
  },
  {
    name: "Ritme",
    role: "Sistem Operasi untuk Studio Kelas",
    logo: "/ritme-logo-web-2048.png",
    logoH: 30,
    desc: "Booking, paket & credit member, reminder WhatsApp, dan pembayaran QRIS untuk studio yoga, pilates, dance & gym kecil. Lokal-first.",
    href: "https://ritme.my.id",
    badge: "Live",
  },
] as const;
