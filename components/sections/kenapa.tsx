import { MaskReveal, RiseIn } from "@/components/motion";

const REASONS = [
  {
    n: "01",
    title: "Punya produk sendiri",
    desc: "Platform Belajar Pro & Ritme dipakai user beneran — kami tahu cara bikin yang kepakai, bukan cuma teori.",
  },
  {
    n: "02",
    title: "Lokal & paham UMKM",
    desc: "Bahasa Indonesia, harga masuk akal, paham cara bisnis lokal jalan. Bukan solusi impor yang mahal & kaku.",
  },
  {
    n: "03",
    title: "Fokus hasil, bukan fitur",
    desc: "Kami ukur sukses dari produktivitas & pertumbuhan bisnismu — bukan dari banyaknya fitur yang nggak kepakai.",
  },
  {
    n: "04",
    title: "Dampingi, bukan tinggal",
    desc: "Setelah launch kami nggak hilang. Kami bantu sampai sistemnya beneran jalan di tim kamu.",
  },
];

export function Kenapa() {
  return (
    <section id="kenapa" className="bg-ink py-28">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-6 border-b border-linedark pb-8 md:grid-cols-[1.4fr_1fr]">
          <h2 className="text-[clamp(30px,5vw,68px)] font-semibold leading-[0.98] tracking-tight text-cream">
            <MaskReveal lines={["Builder, bukan", "sekadar vendor."]} />
          </h2>
          <RiseIn delay={0.2} className="flex items-end">
            <span className="label-mono text-blue-elec">[ 03 — Kenapa Parameter ]</span>
          </RiseIn>
        </div>

        <div className="mt-12 grid gap-x-12 gap-y-12 md:grid-cols-2">
          {REASONS.map((r, i) => (
            <RiseIn key={r.n} delay={i * 0.08}>
              <div className="group flex gap-6 border-t border-linedark pt-7">
                <span className="font-mono text-[15px] text-blue-elec">{r.n}</span>
                <div>
                  <h3 className="text-[clamp(20px,2.4vw,28px)] font-semibold tracking-tight text-cream">
                    {r.title}
                  </h3>
                  <p className="mt-3 max-w-md text-[15px] leading-relaxed text-mist">
                    {r.desc}
                  </p>
                </div>
              </div>
            </RiseIn>
          ))}
        </div>
      </div>
    </section>
  );
}
