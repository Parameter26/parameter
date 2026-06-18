"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { MaskReveal, RiseIn } from "@/components/motion";

/* ============================================================
   PARAMETER — Mini-game "Flappy Param"
   Easter egg ringan buat naikin engagement.
   Canvas-based, kontrol: klik / tap / Spasi.
   Tema: dark base + accent biru brand (#2D6BF5).
   ============================================================ */

// Resolusi internal tetap → fisika konsisten di semua layar.
const W = 360;
const H = 480;

// Tuning gameplay
const GRAVITY = 0.45;
const FLAP = -7.2;
const PIPE_GAP = 140;
const PIPE_W = 58;
const PIPE_SPACING = 200; // jarak horizontal antar pipa
const PIPE_SPEED = 2.2;
const BIRD_X = 96;
const BIRD_R = 13;

// Palet brand
const C = {
  skyTop: "#0E0F13",
  skyBot: "#16181D",
  blue: "#2D6BF5",
  blueBright: "#4B83FF",
  blueElec: "#6FA0FF",
  cream: "#F6F7F9",
  mist: "#9EA1A9",
  line: "rgba(255,255,255,0.09)",
  danger: "#FF5247",
};

type Pipe = { x: number; gapY: number; scored: boolean };
type Phase = "ready" | "playing" | "dead";

export function Game() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  // true kalau area game lagi cukup keliatan di layar.
  // Dipakai biar Spasi/ArrowUp ga "bajak" scroll halaman pas user lagi di section lain.
  const inView = useRef(false);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [phase, setPhase] = useState<Phase>("ready");

  // State game disimpan di ref biar ga trigger re-render tiap frame.
  const game = useRef({
    birdY: H / 2,
    vel: 0,
    pipes: [] as Pipe[],
    frame: 0,
    score: 0,
    phase: "ready" as Phase,
    rafId: 0,
  });

  // Sinkronkan phase ke ref
  useEffect(() => {
    game.current.phase = phase;
  }, [phase]);

  // Load best score dari localStorage (situs asli user, aman dipakai).
  // Di-defer via setTimeout(0) biar ga setState sinkron di dalam effect (lint) &
  // hindari mismatch hidrasi (server render selalu 0).
  useEffect(() => {
    const t = window.setTimeout(() => {
      try {
        const saved = window.localStorage.getItem("param-flappy-best");
        if (saved) setBest(parseInt(saved, 10) || 0);
      } catch {
        /* ignore */
      }
    }, 0);
    return () => window.clearTimeout(t);
  }, []);

  const resetGame = useCallback(() => {
    const g = game.current;
    g.birdY = H / 2;
    g.vel = 0;
    g.frame = 0;
    g.score = 0;
    g.pipes = [
      { x: W + 40, gapY: 200, scored: false },
      { x: W + 40 + PIPE_SPACING, gapY: 260, scored: false },
    ];
    setScore(0);
  }, []);

  const flap = useCallback(() => {
    const g = game.current;
    if (g.phase === "ready") {
      resetGame();
      setPhase("playing");
      g.phase = "playing";
      g.vel = FLAP;
    } else if (g.phase === "playing") {
      g.vel = FLAP;
    } else if (g.phase === "dead") {
      resetGame();
      setPhase("ready");
      g.phase = "ready";
    }
  }, [resetGame]);

  // Pantau apakah section game lagi keliatan di layar.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        inView.current = entry.isIntersecting;
      },
      // Aktif hanya kalau mayoritas area game keliatan → ngepasin niat user buat main.
      { threshold: 0.6 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Input: keyboard (Spasi / ArrowUp) hanya saat section game lagi keliatan,
  // biar ga bajak scroll halaman pas user lagi di bagian lain.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code !== "Space" && e.code !== "ArrowUp") return;
      if (!inView.current) return; // di luar layar → biarin scroll normal
      e.preventDefault(); // game keliatan → Spasi buat ngepak, bukan scroll
      flap();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [flap]);

  // Game loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const g = game.current; // capture utk cleanup yang aman

    // Hi-DPI crisp
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.scale(dpr, dpr);

    const drawBird = (y: number, vel: number) => {
      ctx.save();
      ctx.translate(BIRD_X, y);
      const tilt = Math.max(-0.4, Math.min(0.8, vel / 12));
      ctx.rotate(tilt);
      // glow halus
      ctx.shadowColor = C.blue;
      ctx.shadowBlur = 16;
      // badan — kapsul biru brand
      ctx.fillStyle = C.blue;
      ctx.beginPath();
      ctx.arc(0, 0, BIRD_R, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      // highlight
      ctx.fillStyle = C.blueElec;
      ctx.beginPath();
      ctx.arc(-3, -4, BIRD_R * 0.5, 0, Math.PI * 2);
      ctx.fill();
      // sayap
      ctx.fillStyle = C.cream;
      ctx.beginPath();
      ctx.ellipse(-2, 3, 7, 4, -0.4, 0, Math.PI * 2);
      ctx.fill();
      // mata
      ctx.fillStyle = C.skyTop;
      ctx.beginPath();
      ctx.arc(7, -4, 2.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    const drawPipe = (p: Pipe) => {
      const capH = 14;
      // gradient pipa
      const grad = ctx.createLinearGradient(p.x, 0, p.x + PIPE_W, 0);
      grad.addColorStop(0, C.blue);
      grad.addColorStop(1, C.blueBright);
      ctx.fillStyle = grad;
      // atas
      ctx.fillRect(p.x, 0, PIPE_W, p.gapY - PIPE_GAP / 2);
      // bawah
      ctx.fillRect(p.x, p.gapY + PIPE_GAP / 2, PIPE_W, H - (p.gapY + PIPE_GAP / 2));
      // caps (lebih terang)
      ctx.fillStyle = C.blueElec;
      ctx.fillRect(p.x - 3, p.gapY - PIPE_GAP / 2 - capH, PIPE_W + 6, capH);
      ctx.fillRect(p.x - 3, p.gapY + PIPE_GAP / 2, PIPE_W + 6, capH);
    };

    const render = () => {
      const g = game.current;

      // ==== UPDATE ====
      if (g.phase === "playing") {
        g.frame++;
        g.vel += GRAVITY;
        g.birdY += g.vel;

        // gerak pipa
        for (const p of g.pipes) p.x -= PIPE_SPEED;

        // recycle + spawn
        if (g.pipes.length && g.pipes[0].x + PIPE_W < 0) {
          g.pipes.shift();
        }
        const last = g.pipes[g.pipes.length - 1];
        if (last && last.x < W - PIPE_SPACING) {
          const gapY = 110 + Math.random() * (H - 220);
          g.pipes.push({ x: last.x + PIPE_SPACING, gapY, scored: false });
        }

        // skor
        for (const p of g.pipes) {
          if (!p.scored && p.x + PIPE_W < BIRD_X) {
            p.scored = true;
            g.score++;
            setScore(g.score);
          }
        }

        // tabrakan tanah / langit
        if (g.birdY + BIRD_R > H || g.birdY - BIRD_R < 0) {
          die(g);
        }
        // tabrakan pipa
        for (const p of g.pipes) {
          const inX = BIRD_X + BIRD_R > p.x && BIRD_X - BIRD_R < p.x + PIPE_W;
          const inGap =
            g.birdY - BIRD_R > p.gapY - PIPE_GAP / 2 &&
            g.birdY + BIRD_R < p.gapY + PIPE_GAP / 2;
          if (inX && !inGap) die(g);
        }
      }

      // ==== DRAW ====
      // langit
      const sky = ctx.createLinearGradient(0, 0, 0, H);
      sky.addColorStop(0, C.skyTop);
      sky.addColorStop(1, C.skyBot);
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, W, H);

      // grid teknis halus
      ctx.strokeStyle = C.line;
      ctx.lineWidth = 1;
      for (let x = 0; x <= W; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.stroke();
      }
      for (let y = 0; y <= H; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }

      // pipa
      for (const p of g.pipes) drawPipe(p);

      // tanah garis
      ctx.fillStyle = C.blue;
      ctx.fillRect(0, H - 4, W, 4);

      // burung
      drawBird(g.birdY, g.phase === "ready" ? 0 : g.vel);

      // skor di tengah saat main
      if (g.phase === "playing") {
        ctx.fillStyle = C.cream;
        ctx.font = "700 40px 'General Sans', system-ui, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(String(g.score), W / 2, 64);
      }

      g.rafId = requestAnimationFrame(render);
    };

    const die = (g: typeof game.current) => {
      if (g.phase !== "playing") return;
      g.phase = "dead";
      setPhase("dead");
      setBest((b) => {
        const nb = Math.max(b, g.score);
        try {
          window.localStorage.setItem("param-flappy-best", String(nb));
        } catch {
          /* ignore */
        }
        return nb;
      });
    };

    render();
    return () => cancelAnimationFrame(g.rafId);
  }, []);

  return (
    <section ref={sectionRef} id="game" className="relative overflow-hidden bg-ink py-28">
      {/* glow ambient */}
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-[420px] w-[420px] -translate-x-1/2 glow-blue" />

      <div className="relative mx-auto max-w-7xl px-6">
        {/* header */}
        <div className="flex flex-wrap items-end justify-between gap-6 border-b border-linedark pb-8">
          <h2 className="text-[clamp(30px,5vw,68px)] font-semibold leading-[0.98] tracking-tight text-cream">
            <MaskReveal lines={["Lagi suntuk?", "Main dulu sini."]} />
          </h2>
          <RiseIn delay={0.2} className="max-w-xs">
            <span className="label-mono text-blue-elec">[ ✦ — Iseng-iseng ]</span>
            <p className="mt-3 text-[15px] leading-relaxed text-mist">
              Mini-game ala Flappy Bird, dikit hiburan sambil nyari tahu soal
              Parameter. Klik, tap, atau pencet Spasi buat ngepak.
            </p>
          </RiseIn>
        </div>

        {/* game */}
        <RiseIn delay={0.1}>
          <div className="mt-10 flex flex-col items-center">
            <div
              className="relative w-full max-w-[360px] cursor-pointer select-none overflow-hidden rounded-[20px] border border-linedark"
              onPointerDown={(e) => {
                e.preventDefault();
                flap();
              }}
              role="button"
              tabIndex={0}
              aria-label="Area game Flappy Param — klik atau pencet Spasi untuk main"
              onKeyDown={(e) => {
                if (e.code === "Enter") flap();
              }}
            >
              <canvas
                ref={canvasRef}
                style={{ width: "100%", height: "auto", display: "block", aspectRatio: `${W} / ${H}` }}
              />

              {/* overlay READY */}
              {phase === "ready" && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-ink/55 backdrop-blur-[2px]">
                  <span className="label-mono text-blue-elec">Flappy Param</span>
                  <p className="px-8 text-center text-[15px] font-medium text-cream">
                    Klik / tap / Spasi buat mulai
                  </p>
                  <div className="mt-1 rounded-full bg-blue px-5 py-2 text-sm font-semibold text-white">
                    ▶ Main
                  </div>
                </div>
              )}

              {/* overlay DEAD */}
              {phase === "dead" && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-ink/65 backdrop-blur-[2px]">
                  <span className="label-mono text-[#FF5247]">Game Over</span>
                  <p className="mt-1 text-4xl font-semibold text-cream">{score}</p>
                  <p className="text-[13px] text-mist">Skor terbaik: {Math.max(best, score)}</p>
                  <div className="mt-3 rounded-full bg-blue px-5 py-2 text-sm font-semibold text-white">
                    ↻ Main lagi
                  </div>
                </div>
              )}
            </div>

            {/* skor bar */}
            <div className="mt-5 flex items-center gap-8">
              <div className="text-center">
                <p className="label-mono text-mist">Skor</p>
                <p className="mt-1 text-2xl font-semibold tabular-nums text-cream">{score}</p>
              </div>
              <div className="h-8 w-px bg-linedark" />
              <div className="text-center">
                <p className="label-mono text-mist">Terbaik</p>
                <p className="mt-1 text-2xl font-semibold tabular-nums text-blue-elec">
                  {Math.max(best, score)}
                </p>
              </div>
            </div>
          </div>
        </RiseIn>
      </div>
    </section>
  );
}
