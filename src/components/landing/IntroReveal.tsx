import { useEffect, useMemo, useRef } from "react";
import type { CSSProperties } from "react";
import "./IntroReveal.css";

type IntroRevealProps = {
  onFinish: () => void;
  petalCount?: number;
};

type Petal = {
  size: number;
  sx: number;
  sy: number;
  mx: number;
  my: number;
  ex: number;
  ey: number;
  midrot: number;
  endrot: number;
  duration: number;
  delay: number;
  blur: number;
};

function rand(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function buildPetals(count: number, w: number, h: number): Petal[] {
  const petals: Petal[] = [];
  for (let i = 0; i < count; i++) {
    const size = rand(6, 20);
    const sx = rand(-120, w + 60);
    const sy = rand(-160, -20);
    const angle = rand(50, 80) * (Math.PI / 180);
    const dist = rand(h * 1.1, h * 1.6);
    const dir = Math.random() < 0.5 ? -1 : 1;
    const ex = sx + Math.cos(angle) * dist * dir * 0.5;
    const ey = sy + Math.sin(angle) * dist;
    const mx = (ex - sx) * 0.5 + rand(-70, 70);
    const my = (ey - sy) * 0.5 + rand(-40, 40);
    const midrot = rand(-260, 260);
    const endrot = midrot + rand(-260, 260);
    const duration = rand(650, 1500);
    const delay = rand(0, 480);
    const blur = Math.random() < 0.3 ? rand(0.5, 2) : 0;
    petals.push({ size, sx, sy, mx, my, ex, ey, midrot, endrot, duration, delay, blur });
  }
  return petals;
}

export default function IntroReveal({ onFinish, petalCount = 70 }: IntroRevealProps) {
  const finished = useRef(false);

  const petals = useMemo(() => {
    const w = typeof window !== "undefined" ? window.innerWidth : 1280;
    const h = typeof window !== "undefined" ? window.innerHeight : 800;
    return buildPetals(petalCount, w, h);
  }, [petalCount]);

  useEffect(() => {
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) {
      onFinish();
      return;
    }

    const longest = Math.max(...petals.map((p) => p.duration + p.delay));
    const timer = window.setTimeout(() => {
      if (!finished.current) {
        finished.current = true;
        onFinish();
      }
    }, longest + 150);

    return () => window.clearTimeout(timer);
  }, [petals, onFinish]);

  return (
    <div className="intro-overlay" aria-hidden="true">
      {petals.map((p, i) => (
        <span
          key={i}
          className="intro-petal"
          style={
            {
              width: p.size,
              height: p.size * 0.8,
              filter: p.blur ? `blur(${p.blur}px)` : undefined,
              "--sx": `${p.sx}px`,
              "--sy": `${p.sy}px`,
              "--mx": `${p.mx}px`,
              "--my": `${p.my}px`,
              "--ex": `${p.ex}px`,
              "--ey": `${p.ey}px`,
              "--midrot": `${p.midrot}deg`,
              "--endrot": `${p.endrot}deg`,
              animationDuration: `${p.duration}ms`,
              animationDelay: `${p.delay}ms`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}