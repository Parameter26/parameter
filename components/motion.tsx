"use client";

import { motion } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";

const EASE = "cubic-bezier(.16,1,.3,1)";

/**
 * useReveal — IntersectionObserver hand-rolled, BULLETPROOF.
 * Konten dijamin muncul: reveal saat masuk viewport, ATAU saat sudah in-view
 * waktu mount, ATAU paling lambat via failsafe timeout 1.4s. Hormati reduced-motion.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // reduced motion → langsung tampil
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setShown(true);
      return;
    }

    let done = false;
    const reveal = () => {
      if (!done) {
        done = true;
        setShown(true);
      }
    };

    // sudah di viewport saat mount? → reveal frame berikutnya (biar transisi main)
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight * 0.92 && r.bottom > 0) {
      requestAnimationFrame(() => requestAnimationFrame(reveal));
    }

    let io: IntersectionObserver | undefined;
    if (typeof IntersectionObserver !== "undefined") {
      io = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            reveal();
            io?.disconnect();
          }
        },
        { rootMargin: "0px 0px -8% 0px" }
      );
      io.observe(el);
    } else {
      reveal();
    }

    // FAILSAFE — apa pun yang terjadi, jangan pernah stuck invisible
    const t = setTimeout(reveal, 1400);

    return () => {
      io?.disconnect();
      clearTimeout(t);
    };
  }, []);

  return { ref, shown };
}

/** MaskReveal — tiap baris teks naik dari balik garis mask (CSS transition, reliable). */
export function MaskReveal({
  lines,
  className,
  delay = 0,
  stagger = 0.09,
}: {
  lines: ReactNode[];
  className?: string;
  delay?: number;
  stagger?: number;
}) {
  const { ref, shown } = useReveal<HTMLSpanElement>();
  return (
    <span ref={ref} className={className}>
      {lines.map((line, i) => (
        <span key={i} className="mask-line">
          <span
            className="block will-change-transform"
            style={{
              transform: shown ? "translateY(0)" : "translateY(115%)",
              transition: `transform .95s ${EASE} ${delay + i * stagger}s`,
            }}
          >
            {line}
          </span>
        </span>
      ))}
    </span>
  );
}

/** RiseIn — blok naik + fade saat masuk viewport (CSS transition, reliable). */
export function RiseIn({
  children,
  delay = 0,
  y = 26,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const { ref, shown } = useReveal();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "none" : `translateY(${y}px)`,
        transition: `opacity .7s ${EASE} ${delay}s, transform .7s ${EASE} ${delay}s`,
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}

/** Marquee — pita teks bergerak horizontal tanpa henti (continuous, aman). */
export function Marquee({
  children,
  speed = 28,
  className,
}: {
  children: ReactNode;
  speed?: number;
  className?: string;
}) {
  return (
    <div className={`overflow-hidden ${className ?? ""}`}>
      <motion.div
        className="flex w-max gap-0"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: speed, ease: "linear", repeat: Infinity }}
      >
        {children}
        {children}
      </motion.div>
    </div>
  );
}
