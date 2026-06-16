import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { ToolCard } from "@/components/tool-card";
import { TOOLS } from "@/lib/showcase";
import { waUrl } from "@/lib/contact";
import { ArrowUpRight } from "lucide-react";

export const metadata: Metadata = {
  title: "UMKM Tools — Parameter",
  description:
    "Kumpulan alat siap pakai buat UMKM: kalkulator HPP, margin, invoice, dan lainnya. Ada yang gratis, ada yang sekali bayar pakai selamanya.",
};

export default function UmkmToolsPage() {
  return (
    <>
      <Nav />
      <main className="flex flex-col gap-2 p-2 sm:gap-2.5 sm:p-2.5">
        <div className="overflow-hidden rounded-[26px] on-cream">
          <section className="px-6 pb-24 pt-36 sm:pt-40">
            <div className="mx-auto max-w-7xl">
              <span className="label-mono text-blue">[ UMKM Tools ]</span>
              <h1 className="mt-4 text-[clamp(34px,6vw,76px)] font-semibold leading-[0.98] tracking-tight text-navy">
                Alat siap pakai
                <br />
                buat bantu usahamu.
              </h1>
              <p className="mt-5 max-w-2xl text-[16px] leading-relaxed text-mutedlight">
                Tools praktis yang dibuat khusus biar UMKM lebih gampang ngatur usaha — dari hitung
                harga jual sampai bikin tagihan. Ada yang <strong className="text-navy">gratis</strong>,
                ada yang <strong className="text-navy">sekali bayar pakai selamanya</strong>.
              </p>

              <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {TOOLS.map((t) => (
                  <ToolCard key={t.name} t={t} />
                ))}
              </div>

              {/* CTA usul tool */}
              <div className="mt-14 flex flex-wrap items-center justify-between gap-5 rounded-[22px] border border-linelight bg-card p-8">
                <div>
                  <h2 className="text-xl font-semibold text-navy">Butuh tool yang belum ada?</h2>
                  <p className="mt-1 text-[15px] text-mutedlight">
                    Cerita kebutuhan usahamu — bisa jadi tool berikutnya yang kami bikin.
                  </p>
                </div>
                <a
                  href={waUrl("Halo Parameter, saya mau usul / butuh tool UMKM")}
                  target="_blank"
                  rel="noopener"
                  className="group inline-flex items-center gap-2 rounded-full bg-ink px-7 py-4 font-semibold text-cream transition-transform hover:-translate-y-0.5"
                >
                  Usul tool
                  <ArrowUpRight size={18} strokeWidth={2.5} className="transition-transform group-hover:rotate-45" />
                </a>
              </div>
            </div>
          </section>
        </div>
        <div className="overflow-hidden rounded-[26px]">
          <Footer />
        </div>
      </main>
    </>
  );
}
