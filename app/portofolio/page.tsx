import type { Metadata } from "next";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { ProjectCard, ProjectInviteCard } from "@/components/project-card";
import { PROJECTS } from "@/lib/showcase";
import { waUrl } from "@/lib/contact";

export const metadata: Metadata = {
  title: "Portofolio — Parameter",
  description:
    "Website & landing page yang kami bangun buat usaha lokal — beneran online & kepakai. Lihat karya Parameter.",
};

export default function PortofolioPage() {
  const single = PROJECTS.length === 1;
  return (
    <>
      <Nav />
      <main className="flex flex-col gap-2 p-2 sm:gap-2.5 sm:p-2.5">
        <div className="overflow-hidden rounded-[26px] bg-ink">
          <section className="px-6 pb-24 pt-36 sm:pt-40">
            <div className="mx-auto max-w-7xl">
              <span className="label-mono text-blue-elec">[ Portofolio ]</span>
              <h1 className="mt-4 text-[clamp(34px,6vw,76px)] font-semibold leading-[0.98] tracking-tight text-cream">
                Karya yang kami
                <br />
                bangun buat usaha lokal.
              </h1>
              <p className="mt-5 max-w-2xl text-[16px] leading-relaxed text-mist">
                Bukan mockup. Tiap proyek di sini website beneran yang udah online & kepakai — kami
                rancang biar usaha kecil tampil profesional dan gampang dapet pelanggan.
              </p>

              <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {PROJECTS.map((p) => (
                  <div key={p.name} className={single ? "lg:col-span-2" : ""}>
                    <ProjectCard p={p} />
                  </div>
                ))}
                <ProjectInviteCard
                  href={waUrl("Halo Parameter, usaha saya mau dibangunin website")}
                />
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
