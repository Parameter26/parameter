import { Nav } from "@/components/nav";
import { Hero } from "@/components/sections/hero";
import { MarqueeBand } from "@/components/sections/marquee-band";
import { Trust } from "@/components/sections/trust";
import { ConsoleSection } from "@/components/sections/console";
import { Produk } from "@/components/sections/produk";
import { Jasa } from "@/components/sections/jasa";
import { Portofolio } from "@/components/sections/portofolio";
import { UmkmTools } from "@/components/sections/umkm-tools";
import { Game } from "@/components/sections/game";
import { Kenapa } from "@/components/sections/kenapa";
import { Proses } from "@/components/sections/proses";
import { CTA } from "@/components/sections/cta";
import { Footer } from "@/components/footer";

/** Panel rounded ngambang di frame terang (device clean ala sohub). */
function Panel({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-[26px]">{children}</div>
  );
}

export default function Home() {
  return (
    <>
      <Nav />
      <main className="flex flex-col gap-2 p-2 sm:gap-2.5 sm:p-2.5">
        <Panel>
          <Hero />
        </Panel>
        <Panel>
          <MarqueeBand />
        </Panel>
        <Panel>
          <Trust />
        </Panel>
        <Panel>
          <ConsoleSection />
        </Panel>
        <Panel>
          <Produk />
        </Panel>
        <Panel>
          <Jasa />
        </Panel>
        <Panel>
          <Portofolio />
        </Panel>
        <Panel>
          <UmkmTools />
        </Panel>
        <Panel>
          <Game />
        </Panel>
        <Panel>
          <Kenapa />
        </Panel>
        <Panel>
          <Proses />
        </Panel>
        <Panel>
          <CTA />
        </Panel>
        <Panel>
          <Footer />
        </Panel>
      </main>
    </>
  );
}
