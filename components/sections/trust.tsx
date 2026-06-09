import Image from "next/image";
import { PRODUCTS } from "@/lib/contact";

export function Trust() {
  return (
    <section className="on-cream border-y border-linelight">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-10 gap-y-4 px-6 py-7 text-center">
        <span className="label-mono text-mutedlight">
          Kami bukan cuma bikin — kami pakai sendiri:
        </span>
        {PRODUCTS.map((p) => (
          <Image
            key={p.name}
            src={p.logo}
            alt={p.name}
            width={p.logoH * 7}
            height={p.logoH}
            style={{ height: p.logoH - 4, width: "auto" }}
            className="object-contain"
          />
        ))}
        <span className="label-mono text-mutedlight">
          + sistem custom UMKM
        </span>
      </div>
    </section>
  );
}
