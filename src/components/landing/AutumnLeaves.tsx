import { useMemo } from "react";
import type { CSSProperties } from "react";
import "./AutumnLeaves.css";

type Leaf = {
  left: number;
  size: number;
  duration: number;
  delay: number;
  drift: number;
  blur: number;
  variant: number;
};

const LEAVES: Leaf[] = [
  { left: 4, size: 16, duration: 13, delay: 0, drift: 70, blur: 0, variant: 1 },
  { left: 12, size: 11, duration: 16, delay: 2, drift: -50, blur: 1.5, variant: 2 },
  { left: 20, size: 18, duration: 11, delay: 1, drift: 100, blur: 0, variant: 3 },
  { left: 28, size: 12, duration: 18, delay: 4, drift: -80, blur: 2, variant: 1 },
  { left: 36, size: 15, duration: 14, delay: 0.5, drift: 60, blur: 0, variant: 2 },
  { left: 44, size: 10, duration: 17, delay: 3, drift: -40, blur: 2.2, variant: 3 },
  { left: 52, size: 17, duration: 12, delay: 2.5, drift: 90, blur: 0, variant: 1 },
  { left: 60, size: 13, duration: 15, delay: 1.5, drift: -70, blur: 1, variant: 2 },
  { left: 68, size: 11, duration: 19, delay: 5, drift: 50, blur: 2, variant: 3 },
  { left: 76, size: 16, duration: 13.5, delay: 0.8, drift: -100, blur: 0, variant: 1 },
  { left: 84, size: 12, duration: 16.5, delay: 3.5, drift: 65, blur: 1.8, variant: 2 },
  { left: 92, size: 18, duration: 11.5, delay: 2.2, drift: -60, blur: 0, variant: 3 },
  { left: 8, size: 10, duration: 20, delay: 6, drift: 45, blur: 2.4, variant: 1 },
  { left: 48, size: 14, duration: 14.5, delay: 4.5, drift: -85, blur: 0.6, variant: 2 },
  { left: 72, size: 11, duration: 18.5, delay: 1.2, drift: 75, blur: 1.6, variant: 3 },
  { left: 30, size: 17, duration: 12.5, delay: 5.5, drift: -55, blur: 0, variant: 1 },
];

export default function AutumnLeaves() {
  const leaves = useMemo(() => LEAVES, []);

  return (
    <>
      {leaves.map((l, i) => (
        <span
          key={i}
          className={`leaf leaf-${l.variant}`}
          style={
            {
              left: `${l.left}%`,
              width: l.size,
              height: l.size,
              filter: l.blur ? `blur(${l.blur}px)` : undefined,
              opacity: l.blur ? 0.55 : 0.9,
              animationDuration: `${l.duration}s`,
              animationDelay: `${l.delay}s`,
              "--drift": `${l.drift}px`,
            } as CSSProperties
          }
        />
      ))}
    </>
  );
}