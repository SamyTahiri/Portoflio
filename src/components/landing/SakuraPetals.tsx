import { useMemo } from "react";
import type { CSSProperties } from "react";
import "./SakuraPetals.css";

type Petal = {
  left: number;
  size: number;
  duration: number;
  delay: number;
  drift: number;
  blur: number;
};

const PETALS: Petal[] = [
  { left: 4, size: 14, duration: 11, delay: 0, drift: 60, blur: 0 },
  { left: 12, size: 9, duration: 14, delay: 2, drift: -40, blur: 1.5 },
  { left: 20, size: 16, duration: 9, delay: 1, drift: 90, blur: 0 },
  { left: 28, size: 10, duration: 16, delay: 4, drift: -70, blur: 2 },
  { left: 36, size: 13, duration: 12, delay: 0.5, drift: 50, blur: 0 },
  { left: 44, size: 8, duration: 15, delay: 3, drift: -30, blur: 2.2 },
  { left: 52, size: 15, duration: 10, delay: 2.5, drift: 80, blur: 0 },
  { left: 60, size: 11, duration: 13, delay: 1.5, drift: -60, blur: 1 },
  { left: 68, size: 9, duration: 17, delay: 5, drift: 40, blur: 2 },
  { left: 76, size: 14, duration: 11.5, delay: 0.8, drift: -90, blur: 0 },
  { left: 84, size: 10, duration: 14.5, delay: 3.5, drift: 55, blur: 1.8 },
  { left: 92, size: 16, duration: 9.5, delay: 2.2, drift: -50, blur: 0 },
  { left: 8, size: 8, duration: 18, delay: 6, drift: 35, blur: 2.4 },
  { left: 48, size: 12, duration: 12.5, delay: 4.5, drift: -75, blur: 0.6 },
  { left: 72, size: 9, duration: 16.5, delay: 1.2, drift: 65, blur: 1.6 },
  { left: 30, size: 15, duration: 10.5, delay: 5.5, drift: -45, blur: 0 },
];

export default function SakuraPetals() {
  const petals = useMemo(() => PETALS, []);

  return (
    <>
      {petals.map((p, i) => (
        <span
          key={i}
          className="petal"
          style={
            {
              left: `${p.left}%`,
              width: p.size,
              height: p.size * 0.8,
              filter: p.blur ? `blur(${p.blur}px)` : undefined,
              opacity: p.blur ? 0.5 : 0.9,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
              "--drift": `${p.drift}px`,
            } as CSSProperties
          }
        />
      ))}
    </>
  );
}