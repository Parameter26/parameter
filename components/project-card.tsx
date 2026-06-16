import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/lib/showcase";

export function ProjectCard({ p }: { p: Project }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[22px] border border-linedark bg-surface">
      {/* cover — recreate hero situsnya */}
      <a
        href={p.href}
        target="_blank"
        rel="noopener"
        className="relative block h-60 overflow-hidden sm:h-72"
        aria-label={`Buka website ${p.name}`}
      >
        <Image
          src={p.hero}
          alt={`Website ${p.name}`}
          fill
          sizes="(max-width:768px) 100vw, 66vw"
          className="object-cover object-[center_38%] transition-transform duration-700 group-hover:scale-[1.06]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-ink/40" />
        <span className="absolute right-5 top-5 flex items-center gap-1.5 rounded-full border border-cream/20 bg-ink/60 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-cream backdrop-blur">
          <span className="size-1.5 animate-pulse rounded-full bg-blue-elec" />
          Live
        </span>
        {p.logo && (
          <div className="absolute inset-0 flex items-center justify-center px-8">
            <Image
              src={p.logo}
              alt={p.name}
              width={320}
              height={76}
              className="w-[170px] object-contain opacity-95 drop-shadow-[0_8px_30px_rgba(0,0,0,.55)] sm:w-[200px]"
            />
          </div>
        )}
        <span className="absolute bottom-4 left-6 font-mono text-[11px] tracking-wide text-cream/65">
          {p.domain}
        </span>
      </a>

      {/* body */}
      <div className="flex flex-1 flex-col p-7">
        <div className="font-mono text-[12px] font-medium text-blue-elec">{p.kategori}</div>
        <h3 className="mt-2 text-2xl font-semibold text-cream">{p.name}</h3>
        <p className="mt-3 text-[15px] leading-relaxed text-mist">{p.desc}</p>

        <div className="mt-5 rounded-2xl border border-linedark bg-ink/40 p-5">
          <span className="label-mono text-slate">Bantu bisnisnya dari sisi</span>
          <p className="mt-2 text-[14.5px] leading-relaxed text-mist">{p.bantu}</p>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {p.tags.map((t) => (
            <span
              key={t}
              className="rounded-full border border-cream/15 px-3 py-1 text-[12px] font-medium text-mist"
            >
              {t}
            </span>
          ))}
        </div>

        <a
          href={p.href}
          target="_blank"
          rel="noopener"
          className="mt-7 inline-flex items-center gap-1.5 font-mono text-[13px] font-bold text-cream transition-all hover:gap-3 hover:text-blue-elec"
        >
          Lihat website live
          <ArrowUpRight size={16} strokeWidth={2.5} />
        </a>
      </div>
    </article>
  );
}

/** Kartu ajakan "slot kosong" — calon klien berikutnya. */
export function ProjectInviteCard({ href }: { href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener"
      className="group flex h-full min-h-[280px] flex-col justify-between rounded-[22px] border border-dashed border-cream/20 bg-ink/40 p-7 transition-colors hover:border-blue-elec/50 hover:bg-ink/60"
    >
      <div>
        <span className="label-mono text-blue-elec">[ Slot kosong ]</span>
        <h3 className="mt-4 text-2xl font-semibold leading-tight text-cream">
          Usaha kamu
          <br />
          berikutnya?
        </h3>
        <p className="mt-3 text-[15px] leading-relaxed text-mist">
          Punya bisnis yang pengen punya website atau landing page yang jualan kayak gini? Bisa jadi
          karya kami selanjutnya.
        </p>
      </div>
      <span className="mt-6 inline-flex items-center gap-2 self-start rounded-full bg-cream px-6 py-3 font-semibold text-ink transition-transform group-hover:-translate-y-0.5">
        Ajukan proyek
        <ArrowUpRight size={16} strokeWidth={2.5} className="transition-transform group-hover:rotate-45" />
      </span>
    </a>
  );
}
