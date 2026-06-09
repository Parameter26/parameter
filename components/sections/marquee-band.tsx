import { Marquee } from "@/components/motion";

const ITEMS = [
  "Aplikasi",
  "Sistem & Dashboard",
  "Website",
  "Landing Page",
  "Integrasi WhatsApp",
  "Pembayaran QRIS",
  "Produk SaaS",
];

export function MarqueeBand() {
  return (
    <div className="border-y border-linedark bg-navy py-5">
      <Marquee speed={32}>
        <div className="flex items-center">
          {ITEMS.map((t) => (
            <span key={t} className="flex items-center">
              <span className="px-7 text-[clamp(20px,2.4vw,30px)] font-semibold tracking-tight text-cream font-display">
                {t}
              </span>
              <span className="text-blue-elec">✦</span>
            </span>
          ))}
        </div>
      </Marquee>
    </div>
  );
}
