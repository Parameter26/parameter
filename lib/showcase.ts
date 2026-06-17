/** Data bersama untuk Portofolio & UMKM Tools — dipakai teaser homepage + halaman penuh. */

export type Project = {
  name: string;
  kategori: string;
  hero: string;
  logo?: string;
  domain: string;
  href: string;
  desc: string;
  bantu: string;
  tags: string[];
};

export const PROJECTS: Project[] = [
  {
    name: "Alana Bakery",
    kategori: "Website Toko Roti · Company Profile + Pre-Order",
    hero: "/portfolio/alana-hero.webp",
    logo: "/portfolio/alana-logo.png",
    domain: "alana.parameter.cloud",
    href: "https://alana.parameter.cloud",
    desc: "Usaha roti rumahan yang tadinya cuma jualan lewat chat & status WhatsApp, kami kasih 'rumah digital' sendiri: website sinematik dengan foto produk yang menggugah, cerita brand, menu, sampai tombol pesan yang langsung nyambung ke WhatsApp.",
    bantu:
      "Bikin usaha kecil tampil sekelas brand besar — naikin kepercayaan calon pembeli & permudah pemesanan. Dari sekadar 'jualan di story' jadi punya etalase yang kerja 24 jam.",
    tags: ["Tampil profesional", "Foto produk sinematik", "Order via WhatsApp", "Mobile-first"],
  },
];

export type Tool = {
  name: string;
  tagline: string;
  desc: string;
  icon: string;
  thumbnail?: string;
  badge: "Berbayar" | "Gratis" | "Segera";
  price: string;
  priceNote?: string;
  href?: string;
  features: string[];
  live: boolean;
};

export const TOOLS: Tool[] = [
  {
    name: "Kalkulator HPP & Stok Bahan",
    tagline: "Berhenti nebak harga jual",
    desc: "Hitung HPP (Harga Pokok Produksi) & harga jual otomatis, kelola stok bahan + tanggal kadaluarsa. Multi-usaha, jalan di HP & offline.",
    icon: "🧮",
    thumbnail: "/tools/kalkulator-hpp-banner-thumbnail.png",
    badge: "Berbayar",
    price: "Rp 49.000",
    priceNote: "sekali bayar, pakai selamanya",
    href: "https://hpp.parameter.cloud",
    features: ["Multi-usaha", "Stok + kadaluarsa", "Hitung untung & margin", "Offline di HP"],
    live: true,
  },
  {
    name: "Kalkulator Margin & Diskon",
    tagline: "Kasih diskon tanpa boncos",
    desc: "Cek cepat berapa margin yang aman buat kasih promo & diskon, biar nggak jualan malah rugi.",
    icon: "🏷️",
    badge: "Segera",
    price: "Gratis",
    features: ["Hitung margin aman", "Simulasi diskon"],
    live: false,
  },
  {
    name: "50 Prompt AI Terbaik",
    tagline: "Prompt siap pakai buat kerja lebih cepat",
    desc: "Kumpulan prompt AI gratis untuk bantu bikin ide konten, copywriting, riset, strategi bisnis, dan pekerjaan harian lebih efisien.",
    icon: "🤖",
    thumbnail: "/tools/50-prompt-ai-thumbnail.png",
    badge: "Gratis",
    price: "Gratis",
    priceNote: "akses langsung lewat pakaiAI",
    href: "https://pakaiai.platformbelajar.my.id/50-prompt-ai/",
    features: ["Siap pakai", "Untuk konten & bisnis", "Cocok buat pemula", "Akses gratis"],
    live: true,
  },
  {
    name: "Template Invoice UMKM",
    tagline: "Tagihan rapi & profesional",
    desc: "Bikin invoice/nota rapi buat pelanggan dalam hitungan menit — tinggal isi, simpan, kirim.",
    icon: "🧾",
    badge: "Segera",
    price: "Gratis",
    features: ["Isi cepat", "Siap kirim ke WA"],
    live: false,
  },
];
