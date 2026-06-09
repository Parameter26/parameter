import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { MaskReveal, RiseIn } from "@/components/motion";

const SERVICES = [
  {
    n: "01",
    title: "Aplikasi",
    desc: "Aplikasi web/mobile sesuai alur bisnismu — bukan template kaku.",
  },
  {
    n: "02",
    title: "Sistem & Dashboard",
    desc: "Sistem internal & dashboard biar operasional rapi dan datanya kelihatan.",
  },
  {
    n: "03",
    title: "Website",
    desc: "Company profile / toko yang cepat, modern, dan gampang dikelola.",
  },
  {
    n: "04",
    title: "Landing Page",
    desc: "Landing page konversi tinggi buat kampanye, produk, atau jualan.",
  },
];

export function Jasa() {
  return (
    <section id="jasa" className="on-cream py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 className="text-[clamp(30px,5vw,68px)] font-semibold leading-[0.98] tracking-tight text-navy">
            <MaskReveal lines={["Bisnismu butuh", "sistem? Kami bangunin."]} />
          </h2>
          <RiseIn delay={0.2} className="max-w-xs">
            {/* maskot lagi bangun */}
            <div aria-hidden className="mb-6 hidden justify-end lg:flex">
              <Image
                src="/para-building.png"
                alt=""
                width={240}
                height={240}
                className="animate-float h-auto w-[205px] object-contain drop-shadow-[0_28px_55px_rgba(20,22,27,.22)]"
              />
            </div>
            <span className="label-mono text-blue">[ 02 — Jasa untuk UMKM ]</span>
            <p className="mt-3 text-[15px] leading-relaxed text-mutedlight">
              Dari ide jadi produk digital yang kepakai. Teknologi yang pas,
              bukan yang ribet.
            </p>
          </RiseIn>
        </div>

        {/* numbered editorial list */}
        <div className="mt-14 border-t border-linelight">
          {SERVICES.map((s, i) => (
            <RiseIn key={s.n} delay={i * 0.06}>
              <div className="group grid cursor-default grid-cols-[auto_1fr] items-center gap-6 border-b border-linelight py-7 transition-colors hover:bg-navy/[0.03] md:grid-cols-[80px_1fr_1.1fr_auto] md:gap-8">
                <span className="font-mono text-[14px] text-slate">{s.n}</span>
                <h3 className="text-[clamp(22px,3vw,36px)] font-semibold tracking-tight text-navy transition-transform duration-300 group-hover:translate-x-2">
                  {s.title}
                </h3>
                <p className="col-span-2 max-w-md text-[15px] leading-relaxed text-mutedlight md:col-span-1">
                  {s.desc}
                </p>
                <ArrowUpRight
                  size={26}
                  strokeWidth={1.75}
                  className="hidden text-navy/30 transition-all duration-300 group-hover:rotate-45 group-hover:text-blue md:block"
                />
              </div>
            </RiseIn>
          ))}
        </div>

        <RiseIn delay={0.1}>
          <div className="mt-12 flex flex-wrap items-center justify-between gap-5">
            <p className="text-[16px] text-mutedlight">
              Semua demi satu tujuan:{" "}
              <strong className="font-semibold text-navy">
                bisnismu lebih produktif.
              </strong>
            </p>
            <a
              href="https://dev.platformbelajar.my.id"
              target="_blank"
              rel="noopener"
              className="group inline-flex items-center gap-2 rounded-full bg-ink px-7 py-4 font-semibold text-cream transition-transform hover:-translate-y-0.5"
            >
              Mulai Proyek
              <ArrowUpRight
                size={18}
                strokeWidth={2.5}
                className="transition-transform group-hover:rotate-45"
              />
            </a>
          </div>
        </RiseIn>
      </div>
    </section>
  );
}
