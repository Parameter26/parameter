"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useReveal } from "@/components/motion";

type Param = { label: string; target: number };

const PARAMS: Param[] = [
  { label: "Produktivitas", target: 82 },
  { label: "Efisiensi operasional", target: 67 },
  { label: "Penjualan online", target: 94 },
];

const PRODUCTS = [
  { n: "Platform Belajar Pro", d: "LMS & kursus" },
  { n: "Ritme", d: "OS studio kelas" },
];

const EASE = "cubic-bezier(.16,1,.3,1)";

/** Satu slider instrumen — bisa di-drag, value update real-time. */
function Slider({ label, target, reveal }: Param & { reveal: boolean }) {
  const [pct, setPct] = useState(0);
  const [dragging, setDragging] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!reveal) return;
    const t = window.setTimeout(() => setPct(target), 0);
    return () => clearTimeout(t);
  }, [reveal, target]);

  const setFromClientX = (clientX: number) => {
    const el = trackRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const next = ((clientX - rect.left) / rect.width) * 100;
    setPct(Math.max(0, Math.min(100, Math.round(next))));
  };

  return (
    <div className="select-none">
      <div className="mb-2 flex items-baseline justify-between">
        <span className="font-mono text-[12px] font-medium tracking-wide text-mist">
          {label}
        </span>
        <span className="font-mono text-[13px] font-bold tabular-nums text-blue-elec">
          +{pct}%
        </span>
      </div>

      <div
        ref={trackRef}
        role="slider"
        aria-label={label}
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        tabIndex={0}
        onPointerDown={(e) => {
          (e.target as HTMLElement).setPointerCapture(e.pointerId);
          setDragging(true);
          setFromClientX(e.clientX);
        }}
        onPointerMove={(e) => dragging && setFromClientX(e.clientX)}
        onPointerUp={() => setDragging(false)}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") setPct((p) => Math.min(100, p + 2));
          if (e.key === "ArrowLeft") setPct((p) => Math.max(0, p - 2));
        }}
        className="relative h-2 cursor-ew-resize rounded-full bg-white/[0.07] outline-none focus-visible:ring-2 focus-visible:ring-blue-elec/60"
      >
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-blue to-blue-elec"
          style={{
            width: `${pct}%`,
            transition: dragging ? "none" : "width 1.2s cubic-bezier(.2,.8,.2,1)",
          }}
        />
        <div
          className="absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-ink bg-white shadow-[0_2px_8px_rgba(0,0,0,.5)]"
          style={{
            left: `${pct}%`,
            transition: dragging ? "none" : "left 1.2s cubic-bezier(.2,.8,.2,1)",
          }}
        />
        <div
          className="pointer-events-none absolute -bottom-2 left-0 right-0 h-1.5 opacity-40"
          style={{
            backgroundImage:
              "repeating-linear-gradient(90deg, rgba(201,216,255,.3) 0 1px, transparent 1px 10%)",
          }}
        />
      </div>
    </div>
  );
}

function ConsolePanel() {
  const { ref, shown } = useReveal<HTMLDivElement>();

  return (
    <div ref={ref} className="relative">
      <div
        className="relative overflow-hidden rounded-[22px] border border-linedark bg-surface p-7 shadow-[0_40px_90px_-30px_rgba(0,0,0,.8)]"
        style={{
          opacity: shown ? 1 : 0,
          transform: shown ? "none" : "translateY(24px)",
          transition: `opacity .7s ${EASE}, transform .7s ${EASE}`,
        }}
      >
        <div className="glow-blue pointer-events-none absolute -right-12 -top-12 size-56" />

        <div className="mb-6 flex items-center justify-between">
          <span className="label-mono text-mist">parameter.config</span>
          <div className="flex gap-1.5">
            <span className="size-2.5 bg-blue-elec" />
            <span className="size-2.5 bg-white/15" />
            <span className="size-2.5 bg-white/15" />
          </div>
        </div>

        <div className="flex flex-col gap-6">
          {PARAMS.map((p) => (
            <Slider key={p.label} {...p} reveal={shown} />
          ))}
        </div>

        <div className="mt-7 flex gap-2.5 border-t border-linedark pt-5">
          {PRODUCTS.map((p) => (
            <div
              key={p.n}
              className="flex-1 rounded-xl border border-linedark bg-white/[0.03] px-3 py-2.5"
            >
              <div className="font-mono text-[12.5px] font-bold text-white">
                {p.n}
              </div>
              <div className="font-mono text-[10px] text-mist">{p.d}</div>
            </div>
          ))}
        </div>
      </div>

      <div
        className="absolute -right-3 top-8 flex items-center gap-2 rounded-full bg-blue px-4 py-2 text-[12px] font-semibold text-white shadow-lg"
        style={{
          opacity: shown ? 1 : 0,
          transform: shown ? "none" : "scale(.9)",
          transition: `opacity .5s ${EASE} .4s, transform .5s ${EASE} .4s`,
        }}
      >
        <span className="font-mono">▲ +82%</span>
        diatur otomatis
      </div>
    </div>
  );
}

export function ConsoleSection() {
  const { ref, shown } = useReveal<HTMLDivElement>();
  return (
    <section className="relative overflow-hidden bg-navy py-28">
      <div className="grid-tech pointer-events-none absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_70%_80%_at_30%_50%,#000,transparent)]" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-6 lg:grid-cols-[1fr_1fr]">
        <div
          ref={ref}
          style={{
            opacity: shown ? 1 : 0,
            transform: shown ? "none" : "translateY(24px)",
            transition: `opacity .7s ${EASE}, transform .7s ${EASE}`,
          }}
        >
          <span className="label-mono text-blue-elec">[ Cara Kami Mikir ]</span>
          <h2 className="mt-5 text-[clamp(30px,4.4vw,56px)] font-semibold leading-[1.04] tracking-tight text-cream">
            Tiap keputusan,
            <br />
            sebuah <span className="text-grad-blue">parameter</span>
          </h2>
          <p className="mt-6 max-w-md text-[16px] leading-relaxed text-mist md:text-[17px]">
            Kami nggak ngejar fitur. Kami atur variabel yang beneran ngegerakin
            bisnismu — produktivitas, efisiensi, penjualan. Geser sendiri, lihat
            logikanya.
          </p>

          {/* maskot mikir */}
          <div aria-hidden className="mt-10 flex justify-center lg:block">
            <Image
              src="/para-thinking.png"
              alt=""
              width={230}
              height={290}
              className="animate-float h-auto w-[195px] object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,.5)]"
            />
          </div>
        </div>
        <ConsolePanel />
      </div>
    </section>
  );
}
