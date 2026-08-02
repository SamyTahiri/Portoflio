import { useMemo } from "react";
import type { CSSProperties } from "react";
import "./DustMotes.css";

type Mote = {
  left: number;
  top: number;
  size: number;
  duration: number;
  delay: number;
  drift: number;
};

const MOTES: Mote[] = [
  { left: 10, top: 20, size: 3, duration: 14, delay: 0, drift: 30 },
  { left: 18, top: 60, size: 2, duration: 18, delay: 2, drift: -20 },
  { left: 25, top: 35, size: 4, duration: 12, delay: 1, drift: 40 },
  { left: 33, top: 75, size: 2, duration: 20, delay: 4, drift: -30 },
  { left: 40, top: 15, size: 3, duration: 16, delay: 0.5, drift: 25 },
  { left: 48, top: 50, size: 2, duration: 19, delay: 3, drift: -15 },
  { left: 55, top: 30, size: 4, duration: 13, delay: 2.5, drift: 35 },
  { left: 62, top: 65, size: 2, duration: 17, delay: 1.5, drift: -25 },
  { left: 70, top: 22, size: 3, duration: 21, delay: 5, drift: 20 },
  { left: 77, top: 55, size: 2, duration: 15, delay: 0.8, drift: -40 },
  { left: 84, top: 40, size: 3, duration: 18.5, delay: 3.5, drift: 30 },
  { left: 90, top: 70, size: 4, duration: 12.5, delay: 2.2, drift: -20 },
  { left: 6, top: 45, size: 2, duration: 22, delay: 6, drift: 15 },
  { left: 58, top: 12, size: 3, duration: 16.5, delay: 4.5, drift: -35 },
  { left: 80, top: 85, size: 2, duration: 20.5, delay: 1.2, drift: 25 },
  { left: 15, top: 80, size: 3, duration: 14.5, delay: 5.5, drift: -15 },
];

export default function DustMotes() {
  const motes = useMemo(() => MOTES, []);

  return (
    <>
      {motes.map((m, i) => (
        <span
          key={i}
          className="dust-mote"
          style={
            {
              left: `${m.left}%`,
              top: `${m.top}%`,
              width: m.size,
              height: m.size,
              animationDuration: `${m.duration}s`,
              animationDelay: `${m.delay}s`,
              "--drift": `${m.drift}px`,
            } as CSSProperties
          }
        />
      ))}
    </>
  );
}