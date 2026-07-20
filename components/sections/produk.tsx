import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { MaskReveal, RiseIn } from "@/components/motion";
import { PRODUCTS } from "@/lib/contact";

export function Produk() {
  return (
    <section id="produk" className="relative bg-ink py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-wrap items-end justify-between gap-6 border-b border-linedark pb-8">
          <h2 className="text-[clamp(30px,5vw,68px)] font-semibold leading-[0.98] tracking-tight text-cream">
            <MaskReveal lines={["Produk yang kami", "bangun & jalanin"]} />
          </h2>
          <RiseIn delay={0.2} className="max-w-xs">
            <span className="label-mono text-blue-elec">[ 01 — Produk ]</span>
            <p className="mt-3 text-[15px] leading-relaxed text-mist">
              Bukti kami ngerti bikin produk yang dipakai beneran — bukan proyek
              yang selesai lalu ditinggal.
            </p>
          </RiseIn>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {PRODUCTS.map((p, i) => (
            <RiseIn key={p.name} delay={i * 0.12}>
              <a
                href={p.href}
                target="_blank"
                rel="noopener"
                className="group relative flex h-full flex-col overflow-hidden rounded-[22px] border border-linedark bg-surface/50 transition-all duration-500 hover:border-cream/30"
              >
                {/* panel terang — logo produk pop */}
                <div className="relative flex h-52 items-center justify-center overflow-hidden bg-cream">
                  <div className="grid-tech-light pointer-events-none absolute inset-0 opacity-60" />
                  <Image
                    src={p.logo}
                    alt={p.name}
                    width={p.logoH * 8}
                    height={p.logoH}
                    style={{ height: p.logoH + 6, width: "auto" }}
                    className="relative object-contain transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute right-5 top-5 flex items-center gap-1.5 rounded-full border border-linelight bg-white/80 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-ink">
                    <span className="size-1.5 animate-pulse rounded-full bg-blue" />
                    {p.badge}
                  </span>
                </div>

                {/* body */}
                <div className="flex flex-1 flex-col p-7">
                  <span className="font-mono text-[12px] text-slate">
                    0{i + 1}
                  </span>
                  <h3 className="mt-2 text-2xl font-semibold text-cream">
                    {p.name}
                  </h3>
                  <div className="mt-1 font-mono text-[12px] font-medium text-blue-elec">
                    {p.role}
                  </div>
                  <p className="mt-4 flex-1 text-[15px] leading-relaxed text-mist">
                    {p.desc}
                  </p>
                  <div className="mt-6 inline-flex items-center gap-1.5 font-mono text-[13px] font-bold text-cream transition-all group-hover:gap-3 group-hover:text-blue-elec">
                    Lihat selengkapnya
                    <ArrowUpRight size={16} strokeWidth={2.5} />
                  </div>
                </div>
              </a>
            </RiseIn>
          ))}
        </div>
      </div>
    </section>
  );
}
