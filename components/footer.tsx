import Link from "next/link";
import { InstagramIcon } from "@/components/icons";
import { Logo } from "@/components/logo";
import { INSTAGRAM, mailUrl, waUrl } from "@/lib/contact";

const LINKS = [
  { href: "/#produk", label: "Produk" },
  { href: "/#jasa", label: "Jasa" },
  { href: "/portofolio", label: "Portofolio" },
  { href: "/umkmtools", label: "UMKM Tools" },
  { href: "/#kenapa", label: "Kenapa Kami" },
];

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-linedark bg-ink py-14">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <Logo variant="light" height={26} />
          <div className="flex flex-wrap items-center gap-x-7 gap-y-3 font-mono text-[13px] text-mist">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="transition-colors hover:text-blue-elec"
              >
                {l.label}
              </Link>
            ))}
            <a
              href={INSTAGRAM}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-1.5 transition-colors hover:text-blue-elec"
            >
              <InstagramIcon size={15} />
              Instagram
            </a>
            <a
              href={waUrl()}
              target="_blank"
              rel="noopener"
              className="transition-colors hover:text-blue-elec"
            >
              WhatsApp
            </a>
            <a href={mailUrl()} className="transition-colors hover:text-blue-elec">
              Email
            </a>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap justify-between gap-3 border-t border-linedark pt-7 font-mono text-[12px] text-mist">
          <span>© {year} Parameter · PT Platform Belajar Mandiri</span>
          <span>Studio produk digital · Dibikin di Indonesia 🇮🇩</span>
        </div>
      </div>
    </footer>
  );
}
