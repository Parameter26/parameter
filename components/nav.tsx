"use client";

import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { InstagramIcon } from "@/components/icons";
import { Logo } from "@/components/logo";
import { INSTAGRAM, waUrl } from "@/lib/contact";

const LINKS = [
  { href: "#produk", label: "Produk" },
  { href: "#jasa", label: "Jasa" },
  { href: "#kenapa", label: "Kenapa" },
  { href: "#proses", label: "Proses" },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-2 pt-2 sm:pt-3">
      <nav
        className={`flex w-full max-w-6xl items-center justify-between gap-4 rounded-full border py-2 pl-5 pr-2 transition-all duration-300 ${
          scrolled
            ? "border-linedark bg-ink/80 backdrop-blur-xl"
            : "border-transparent bg-ink/40 backdrop-blur-md"
        }`}
      >
        <a href="#top" aria-label="Parameter beranda" className="flex items-center">
          <Logo variant="light" height={24} />
        </a>

        <div className="hidden items-center gap-7 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-[14px] font-medium text-mist transition-colors hover:text-cream"
            >
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <a
            href={INSTAGRAM}
            target="_blank"
            rel="noopener"
            aria-label="Instagram Parameter"
            className="hidden h-10 w-10 items-center justify-center rounded-full border border-linedark text-mist transition-colors hover:border-cream hover:text-cream sm:flex"
          >
            <InstagramIcon size={17} />
          </a>
          <a
            href={waUrl()}
            target="_blank"
            rel="noopener"
            className="group inline-flex items-center gap-2 rounded-full bg-cream px-5 py-2.5 text-sm font-semibold text-ink transition-all hover:bg-white"
          >
            Konsultasi
            <ArrowRight
              size={16}
              strokeWidth={2.5}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </a>
        </div>
      </nav>
    </header>
  );
}
