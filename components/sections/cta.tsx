import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { MaskReveal, RiseIn } from "@/components/motion";
import { InstagramIcon, WhatsappIcon } from "@/components/icons";
import { INSTAGRAM, IG_HANDLE, mailUrl, waUrl } from "@/lib/contact";

export function CTA() {
  return (
    <section className="relative overflow-hidden bg-ink py-32">
      <div className="grid-tech pointer-events-none absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,#000,transparent)]" />
      <div className="glow-blue pointer-events-none absolute left-1/2 top-1/3 size-[600px] -translate-x-1/2" />

      {/* cube aksen ngambang */}
      <Image
        src="/parameter-cube.png"
        alt=""
        aria-hidden
        width={170}
        height={170}
        className="animate-float pointer-events-none absolute left-[7%] top-[20%] hidden w-[120px] lg:block"
      />
      <Image
        src="/parameter-cube.png"
        alt=""
        aria-hidden
        width={120}
        height={120}
        style={{ animationDelay: "-3s" }}
        className="animate-float pointer-events-none absolute bottom-[18%] right-[9%] hidden w-[88px] opacity-90 lg:block"
      />

      <div className="relative mx-auto max-w-7xl px-6 text-center">
        <RiseIn>
          <span className="label-mono text-blue-elec">[ Ngobrol Yuk ]</span>
        </RiseIn>

        <h2 className="mt-6 text-[clamp(44px,9vw,140px)] font-semibold leading-[0.92] tracking-[-0.03em] text-cream">
          <MaskReveal
            lines={[
              <span key="c1">Jangan</span>,
              <span key="c2" className="text-grad-blue">
                malu-malu.
              </span>,
            ]}
          />
        </h2>

        <RiseIn delay={0.3}>
          <p className="mx-auto mt-8 max-w-xl text-[17px] leading-relaxed text-mist md:text-[19px]">
            Ceritain bisnismu, kami bantu cariin solusi digital yang paling pas —
            produk kami atau sistem custom. Konsultasi pertama gratis.
          </p>
        </RiseIn>

        <RiseIn delay={0.4}>
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <a
              href={waUrl()}
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-2.5 rounded-full bg-cream px-8 py-4 font-semibold text-ink transition-all hover:bg-white hover:-translate-y-0.5"
            >
              <WhatsappIcon />
              Konsultasi via WhatsApp
            </a>
            <a
              href={mailUrl()}
              className="inline-flex items-center gap-2 rounded-full border border-linedark px-8 py-4 font-medium text-cream transition-colors hover:border-cream"
            >
              Email Kami
              <ArrowUpRight size={18} strokeWidth={2.5} />
            </a>
          </div>
        </RiseIn>

        <RiseIn delay={0.5}>
          <a
            href={INSTAGRAM}
            target="_blank"
            rel="noopener"
            className="mt-8 inline-flex items-center gap-2 font-mono text-[13px] text-slate transition-colors hover:text-blue-elec"
          >
            <InstagramIcon size={16} />
            Follow {IG_HANDLE}
          </a>
        </RiseIn>
      </div>
    </section>
  );
}
