import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { MaskReveal, RiseIn } from "@/components/motion";
import { ProjectCard, ProjectInviteCard } from "@/components/project-card";
import { PROJECTS } from "@/lib/showcase";
import { waUrl } from "@/lib/contact";

export function Portofolio() {
  /** Teaser: tampilkan maks 2 proyek + kartu ajakan biar pas 3 kolom. */
  const teaser = PROJECTS.slice(0, 2);
  const single = teaser.length === 1;
  return (
    <section id="portofolio" className="bg-ink py-28">
      <div className="mx-auto max-w-7xl px-6">
        {/* header */}
        <div className="flex flex-wrap items-end justify-between gap-6 border-b border-linedark pb-8">
          <h2 className="text-[clamp(30px,5vw,68px)] font-semibold leading-[0.98] tracking-tight text-cream">
            <MaskReveal lines={["Karya yang kami", "bangun buat usaha lokal"]} />
          </h2>
          <RiseIn delay={0.2} className="max-w-xs">
            <span className="label-mono text-blue-elec">[ 03 — Portofolio ]</span>
            <p className="mt-3 text-[15px] leading-relaxed text-mist">
              Bukan mockup. Ini website beneran yang udah online & kepakai — hasil kerja kami buat
              bisnis nyata.
            </p>
          </RiseIn>
        </div>

        {/* grid teaser */}
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {teaser.map((p, i) => (
            <RiseIn key={p.name} delay={i * 0.12} className={single ? "lg:col-span-2" : ""}>
              <ProjectCard p={p} />
            </RiseIn>
          ))}
          <RiseIn delay={teaser.length * 0.12}>
            <ProjectInviteCard href={waUrl("Halo Parameter, usaha saya mau dibangunin website")} />
          </RiseIn>
        </div>

        {/* lihat semua */}
        <RiseIn delay={0.1}>
          <div className="mt-12 flex justify-center">
            <Link
              href="/portofolio"
              className="group inline-flex items-center gap-2 rounded-full border border-linedark px-7 py-4 font-semibold text-cream transition-colors hover:border-cream/40 hover:bg-cream/[0.04]"
            >
              Lihat semua portofolio
              <ArrowUpRight size={18} strokeWidth={2.5} className="transition-transform group-hover:rotate-45" />
            </Link>
          </div>
        </RiseIn>
      </div>
    </section>
  );
}
