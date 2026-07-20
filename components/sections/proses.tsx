import { MaskReveal, RiseIn } from "@/components/motion";

const STEPS = [
  { n: "01", title: "Konsultasi", desc: "Ceritain masalah & target bisnismu. Gratis, tanpa komitmen." },
  { n: "02", title: "Rancang", desc: "Kami susun solusi & alur produk yang pas dengan kebutuhanmu." },
  { n: "03", title: "Bangun", desc: "Tim kami eksekusi — kamu lihat progresnya tiap langkah." },
  { n: "04", title: "Launch & Dampingi", desc: "Produk live, tim dilatih, dan kami dampingi setelahnya." },
];

export function Proses() {
  return (
    <section id="proses" className="on-cream py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-wrap items-end justify-between gap-6 border-b border-linelight pb-8">
          <h2 className="text-[clamp(30px,5vw,68px)] font-semibold leading-[0.98] tracking-tight text-navy">
            <MaskReveal lines={["Dari ngobrol ke", "produk yang jalan"]} />
          </h2>
          <RiseIn delay={0.2}>
            <span className="label-mono text-blue">[ 04 — Cara Kerja ]</span>
          </RiseIn>
        </div>

        <div className="mt-12 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <RiseIn key={s.n} delay={i * 0.08}>
              <div className="border-t-2 border-navy pt-5">
                <span className="font-mono text-[14px] font-bold text-blue">
                  {s.n}
                </span>
                <h3 className="mt-4 text-xl font-semibold text-navy">
                  {s.title}
                </h3>
                <p className="mt-2 text-[14px] leading-relaxed text-mutedlight">
                  {s.desc}
                </p>
              </div>
            </RiseIn>
          ))}
        </div>
      </div>
    </section>
  );
}
