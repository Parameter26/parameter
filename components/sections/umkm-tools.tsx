import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { MaskReveal, RiseIn } from "@/components/motion";
import { ToolCard } from "@/components/tool-card";
import { TOOLS } from "@/lib/showcase";

export function UmkmTools() {
  return (
    <section id="umkmtools" className="on-cream py-28">
      <div className="mx-auto max-w-7xl px-6">
        {/* header */}
        <div className="flex flex-wrap items-end justify-between gap-6 border-b border-linelight pb-8">
          <h2 className="text-[clamp(30px,5vw,68px)] font-semibold leading-[0.98] tracking-tight text-navy">
            <MaskReveal lines={["Alat siap pakai", "buat bantu usahamu"]} />
          </h2>
          <RiseIn delay={0.2} className="max-w-xs">
            <span className="label-mono text-blue">[ 04 — UMKM Tools ]</span>
            <p className="mt-3 text-[15px] leading-relaxed text-mutedlight">
              Tools praktis — ada yang gratis, ada yang sekali bayar pakai selamanya. Dibuat khusus
              biar UMKM lebih gampang ngatur usaha.
            </p>
          </RiseIn>
        </div>

        {/* grid */}
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {TOOLS.map((t, i) => (
            <RiseIn key={t.name} delay={i * 0.1}>
              <ToolCard t={t} />
            </RiseIn>
          ))}
        </div>

        {/* lihat semua */}
        <RiseIn delay={0.1}>
          <div className="mt-12 flex justify-center">
            <Link
              href="/umkmtools"
              className="group inline-flex items-center gap-2 rounded-full bg-ink px-7 py-4 font-semibold text-cream transition-transform hover:-translate-y-0.5"
            >
              Lihat semua UMKM Tools
              <ArrowUpRight size={18} strokeWidth={2.5} className="transition-transform group-hover:rotate-45" />
            </Link>
          </div>
        </RiseIn>
      </div>
    </section>
  );
}
