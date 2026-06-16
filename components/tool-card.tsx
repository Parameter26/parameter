import { ArrowUpRight, Check } from "lucide-react";
import type { Tool } from "@/lib/showcase";

const BADGE: Record<Tool["badge"], string> = {
  Berbayar: "border-blue/30 bg-blue/10 text-blue",
  Gratis: "border-emerald-500/30 bg-emerald-500/10 text-emerald-600",
  Segera: "border-navy/15 bg-navy/[0.04] text-mutedlight",
};

export function ToolCard({ t }: { t: Tool }) {
  const inner = (
    <>
      <div className="flex items-start justify-between gap-3">
        <div className="flex size-12 items-center justify-center rounded-2xl border border-linelight bg-frame text-2xl">
          {t.icon}
        </div>
        <span
          className={`rounded-full border px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider ${BADGE[t.badge]}`}
        >
          {t.badge}
        </span>
      </div>

      <h3 className="mt-5 text-xl font-semibold text-navy">{t.name}</h3>
      <div className="mt-1 font-mono text-[12px] font-medium text-blue">{t.tagline}</div>
      <p className="mt-3 text-[14.5px] leading-relaxed text-mutedlight">{t.desc}</p>

      <ul className="mt-4 flex flex-col gap-1.5">
        {t.features.map((f) => (
          <li key={f} className="flex items-center gap-2 text-[13.5px] text-navy/75">
            <Check size={15} strokeWidth={2.5} className="text-blue" />
            {f}
          </li>
        ))}
      </ul>

      <div className="mt-6 flex items-end justify-between gap-3 border-t border-linelight pt-5">
        <div>
          <div className="text-[19px] font-semibold text-navy">{t.price}</div>
          {t.priceNote && <div className="text-[12px] text-mutedlight">{t.priceNote}</div>}
        </div>
        {t.live ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-cream transition-transform group-hover:-translate-y-0.5">
            Lihat tool
            <ArrowUpRight size={15} strokeWidth={2.5} className="transition-transform group-hover:rotate-45" />
          </span>
        ) : (
          <span className="rounded-full border border-linelight px-5 py-2.5 text-sm font-semibold text-mutedlight">
            Segera
          </span>
        )}
      </div>
    </>
  );

  const base =
    "group flex h-full flex-col rounded-[22px] border bg-card p-7 transition-all";

  return t.live && t.href ? (
    <a
      href={t.href}
      target="_blank"
      rel="noopener"
      className={`${base} border-linelight hover:-translate-y-1 hover:border-blue/40 hover:shadow-[0_24px_50px_-30px_rgba(20,22,27,.4)]`}
    >
      {inner}
    </a>
  ) : (
    <div className={`${base} border-dashed border-navy/15 opacity-90`}>{inner}</div>
  );
}
