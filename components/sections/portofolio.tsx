import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { MaskReveal, RiseIn } from "@/components/motion";
import { waUrl } from "@/lib/contact";

/** Karya yang udah jalan + slot kosong buat ngajak calon klien. */
const WORK = {
  name: "Alana Bakery",
  kategori: "Website Toko Roti · Company Profile + Pre-Order",
  hero: "/portfolio/alana-hero.webp",
  logo: "/portfolio/alana-logo.png",
  domain: "alana.parameter.cloud",
  href: "https://alana.parameter.cloud",
  desc: "Usaha roti rumahan yang tadinya cuma jualan lewat chat & status WhatsApp, kami kasih 'rumah digital' sendiri: website sinematik dengan foto produk yang menggugah, cerita brand, menu, sampai tombol pesan yang langsung nyambung ke WhatsApp.",
  bantu: "Bikin usaha kecil tampil sekelas brand besar — naikin kepercayaan calon pembeli & permudah pemesanan. Dari sekadar 'jualan di story' jadi punya etalase yang kerja 24 jam.",
  tags: ["Tampil profesional", "Foto produk sinematik", "Order via WhatsApp", "Mobile-first"],
};

export function Portofolio() {
  return (
    <section id="portofolio" className="on-cream py-28">
      <div className="mx-auto max-w-7xl px-6">
        {/* header */}
        <div className="flex flex-wrap items-end justify-between gap-6 border-b border-linelight pb-8">
          <h2 className="text-[clamp(30px,5vw,68px)] font-semibold leading-[0.98] tracking-tight text-navy">
            <MaskReveal lines={["Karya yang kami", "bangun buat usaha lokal."]} />
          </h2>
          <RiseIn delay={0.2} className="max-w-xs">
            <span className="label-mono text-blue">[ 03 — Portofolio ]</span>
            <p className="mt-3 text-[15px] leading-relaxed text-mutedlight">
              Bukan mockup. Ini website beneran yang udah online & kepakai —
              hasil kerja kami buat bisnis nyata.
            </p>
          </RiseIn>
        </div>

        {/* grid */}
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* ---- Featured: Alana Bakery (dark card) ---- */}
          <RiseIn className="lg:col-span-2">
            <article className="group flex h-full flex-col overflow-hidden rounded-[22px] border border-linedark bg-ink">
              {/* cover — recreate hero situsnya */}
              <a
                href={WORK.href}
                target="_blank"
                rel="noopener"
                className="relative block h-60 overflow-hidden sm:h-72"
                aria-label={`Buka website ${WORK.name}`}
              >
                <Image
                  src={WORK.hero}
                  alt={`Website ${WORK.name}`}
                  fill
                  sizes="(max-width:768px) 100vw, 66vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/35 to-ink/45" />
                {/* badge */}
                <span className="absolute right-5 top-5 flex items-center gap-1.5 rounded-full border border-cream/20 bg-ink/60 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-cream backdrop-blur">
                  <span className="size-1.5 animate-pulse rounded-full bg-blue-elec" />
                  Live
                </span>
                {/* logo putih, ala hero situsnya */}
                <div className="absolute inset-0 flex items-center justify-center px-8">
                  <Image
                    src={WORK.logo}
                    alt={WORK.name}
                    width={320}
                    height={76}
                    className="w-[170px] object-contain opacity-95 drop-shadow-[0_8px_30px_rgba(0,0,0,.5)] sm:w-[200px]"
                  />
                </div>
                <span className="absolute bottom-4 left-6 font-mono text-[11px] tracking-wide text-cream/65">
                  {WORK.domain}
                </span>
              </a>

              {/* body */}
              <div className="flex flex-1 flex-col p-7">
                <div className="font-mono text-[12px] font-medium text-blue-elec">
                  {WORK.kategori}
                </div>
                <h3 className="mt-2 text-2xl font-semibold text-cream">
                  {WORK.name}
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-mist">
                  {WORK.desc}
                </p>

                {/* bantu dari sisi apa */}
                <div className="mt-5 rounded-2xl border border-linedark bg-surface/40 p-5">
                  <span className="label-mono text-slate">
                    Bantu bisnisnya dari sisi
                  </span>
                  <p className="mt-2 text-[14.5px] leading-relaxed text-mist">
                    {WORK.bantu}
                  </p>
                </div>

                {/* tags */}
                <div className="mt-5 flex flex-wrap gap-2">
                  {WORK.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-cream/15 px-3 py-1 text-[12px] font-medium text-mist"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <a
                  href={WORK.href}
                  target="_blank"
                  rel="noopener"
                  className="mt-7 inline-flex items-center gap-1.5 font-mono text-[13px] font-bold text-cream transition-all hover:gap-3 hover:text-blue-elec"
                >
                  Lihat website live
                  <ArrowUpRight size={16} strokeWidth={2.5} />
                </a>
              </div>
            </article>
          </RiseIn>

          {/* ---- Slot kosong: ajakan jadi proyek berikutnya ---- */}
          <RiseIn delay={0.12}>
            <a
              href={waUrl("Halo Parameter, usaha saya mau dibangunin website")}
              target="_blank"
              rel="noopener"
              className="group flex h-full min-h-[280px] flex-col justify-between rounded-[22px] border border-dashed border-navy/20 bg-white/50 p-7 transition-colors hover:border-blue/50 hover:bg-white"
            >
              <div>
                <span className="label-mono text-blue">[ Slot kosong ]</span>
                <h3 className="mt-4 text-2xl font-semibold leading-tight text-navy">
                  Usaha kamu
                  <br />
                  berikutnya?
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-mutedlight">
                  Punya bisnis yang pengen punya website atau landing page yang
                  jualan kayak gini? Bisa jadi karya kami selanjutnya.
                </p>
              </div>
              <span className="mt-6 inline-flex items-center gap-2 self-start rounded-full bg-ink px-6 py-3 font-semibold text-cream transition-transform group-hover:-translate-y-0.5">
                Ajukan proyek
                <ArrowUpRight
                  size={16}
                  strokeWidth={2.5}
                  className="transition-transform group-hover:rotate-45"
                />
              </span>
            </a>
          </RiseIn>
        </div>
      </div>
    </section>
  );
}
