import Image from "next/image";
import { ArrowRight, ArrowDown } from "lucide-react";
import { MaskReveal, RiseIn } from "@/components/motion";
import { Spotlight } from "@/components/ui/spotlight";
import { waUrl } from "@/lib/contact";

export function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-[calc(100dvh-1.25rem)] flex-col justify-center overflow-hidden bg-ink px-6 pb-12 pt-32 sm:px-10"
    >
      {/* tekstur halus + glow lembut */}
      <div className="grid-tech pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_85%_65%_at_50%_5%,#000,transparent)]" />
      <div className="glow-blue pointer-events-none absolute -top-24 left-1/2 h-[480px] w-[720px] -translate-x-1/2 opacity-70" />

      <div className="relative z-10 mx-auto w-full max-w-7xl">
        {/* robot maskot — anchor ke blok teks, di belakang teks, floating */}
        <div
          aria-hidden
          className="pointer-events-none absolute -right-4 top-1/2 -z-10 hidden h-[58%] max-h-[500px] -translate-y-1/2 lg:block"
        >
          <Spotlight
            className="-top-24 left-0 h-[150%] w-[150%]"
            fill="#2D6BF5"
          />
          <div className="glow-blue absolute left-1/2 top-1/2 size-[440px] -translate-x-1/2 -translate-y-1/2 opacity-50" />
          <Image
            src="/para-welcome.png"
            alt="Parameter robot"
            width={560}
            height={660}
            priority
            className="animate-float relative h-full w-auto object-contain drop-shadow-[0_40px_80px_rgba(0,0,0,.55)]"
          />
        </div>

        {/* meta */}
        <RiseIn className="flex items-center justify-between">
          <span className="inline-flex items-center gap-2.5 rounded-full border border-linedark bg-white/[0.03] px-4 py-2 text-[12px] font-medium text-mist">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-blue-elec opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-blue-elec" />
            </span>
            Tersedia untuk proyek baru
          </span>
          <span className="label-mono hidden text-slate sm:block">
            EST. 2026
          </span>
        </RiseIn>

        {/* headline — full width seperti sebelumnya */}
        <h1 className="mt-10 text-[clamp(46px,8.2vw,120px)] font-semibold leading-[1.0] tracking-[-0.02em] text-cream">
          <MaskReveal
            lines={[
              <span key="l1">Atur parameter</span>,
              <span key="l2">pertumbuhan</span>,
              <span key="l3">
                bisnis <span className="text-grad-blue">digitalmu.</span>
              </span>,
            ]}
          />
        </h1>

        {/* body copy */}
        <RiseIn delay={0.3} className="mt-10">
          <p className="max-w-xl text-[17px] leading-relaxed text-mist md:text-[19px]">
            Parameter bukan vendor biasa — kami{" "}
            <span className="text-cream">builder yang bikin & jalanin produk sendiri</span>{" "}
            (Platform Belajar Pro, Ritme). Pengalaman itu kami pakai buat bantu
            UMKM punya sistem yang beneran naikin produktivitas.
          </p>
        </RiseIn>

        {/* buttons — kiri */}
        <RiseIn delay={0.4} className="mt-8 flex flex-wrap gap-3">
          <a
            href={waUrl()}
            target="_blank"
            rel="noopener"
            className="group inline-flex items-center gap-2 rounded-full bg-cream px-7 py-4 font-semibold text-ink transition-all hover:bg-white hover:-translate-y-0.5"
          >
            Konsultasi Gratis
            <ArrowRight
              size={18}
              strokeWidth={2.5}
              className="transition-transform group-hover:translate-x-1"
            />
          </a>
          <a
            href="#produk"
            className="inline-flex items-center gap-2 rounded-full border border-linedark px-7 py-4 font-medium text-cream transition-colors hover:border-cream"
          >
            Lihat Produk
          </a>
        </RiseIn>

        {/* maskot — versi mobile (in-flow, centered, no overlap) */}
        <div className="mt-12 flex justify-center lg:hidden">
          <Image
            src="/para-welcome.png"
            alt="Parameter robot"
            width={280}
            height={320}
            priority
            className="animate-float h-auto w-[230px] object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,.5)]"
          />
        </div>

        {/* footer hero */}
        <RiseIn
          delay={0.55}
          className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-linedark pt-6"
        >
          <span className="inline-flex items-center gap-2 text-[12px] font-medium text-slate">
            <ArrowDown size={14} className="animate-bounce" />
            Scroll
          </span>
          <span className="text-[13px] text-slate">
            Dipercaya membangun{" "}
            <span className="text-mist">Platform Belajar Pro</span> ·{" "}
            <span className="text-mist">Ritme</span> ·{" "}
            <span className="text-mist">Sistem UMKM</span>
          </span>
        </RiseIn>
      </div>
    </section>
  );
}
