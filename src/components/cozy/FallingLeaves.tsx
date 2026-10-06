import type { CSSProperties } from "react";
import "./FallingLeaves.css";

const SHAPES = [
  // maple
  {
    body: "M20 1 L23 9 L28 6 L27 13 L36 11 L31 18 L38 21 L30 24 L32 29 L24 27 L21 33 L20 39 L19 33 L16 27 L8 29 L10 24 L2 21 L9 18 L4 11 L13 13 L12 6 L17 9 Z",
    veins: "M20 8 V38 M20 22 L10 14 M20 22 L30 14 M20 26 L9 23 M20 26 L31 23",
  },
  // oak
  {
    body: "M20 2 Q26 6 24 10 Q30 11 27 16 Q33 18 28 23 Q32 27 25 30 Q24 35 20 37 Q16 35 15 30 Q8 27 12 23 Q7 18 13 16 Q10 11 16 10 Q14 6 20 2 Z",
    veins: "M20 6 V39",
  },
  // birch
  {
    body: "M20 2 C31 10 33 25 20 37 C7 25 9 10 20 2 Z",
    veins: "M20 6 V39",
  },
];

const COLORS = [
  { fill: "#ef8a3c", vein: "#c8622a" },
  { fill: "#d9622b", vein: "#8a3c19" },
  { fill: "#e9b04a", vein: "#b07a22" },
  { fill: "#b5532a", vein: "#7a3416" },
];

// hand-placed so the page looks the same on every visit
const LEAVES = [
  { left: 3, size: 30, fall: 19, delay: 2, sway: 46, shape: 0, color: 0 },
  { left: 12, size: 22, fall: 24, delay: 11, sway: 30, shape: 2, color: 2 },
  { left: 22, size: 26, fall: 21, delay: 6, sway: 54, shape: 1, color: 1 },
  { left: 34, size: 20, fall: 27, delay: 16, sway: 36, shape: 0, color: 3 },
  { left: 47, size: 28, fall: 22, delay: 9, sway: 48, shape: 2, color: 0 },
  { left: 58, size: 24, fall: 26, delay: 1, sway: 40, shape: 0, color: 2 },
  { left: 69, size: 30, fall: 20, delay: 14, sway: 58, shape: 1, color: 0 },
  { left: 79, size: 21, fall: 25, delay: 5, sway: 34, shape: 2, color: 1 },
  { left: 88, size: 27, fall: 23, delay: 18, sway: 44, shape: 0, color: 1 },
  { left: 96, size: 23, fall: 28, delay: 8, sway: 38, shape: 1, color: 2 },
];

export default function FallingLeaves() {
  return (
    <div className="cz-leaves" aria-hidden="true">
      {LEAVES.map((leaf, i) => {
        const shape = SHAPES[leaf.shape];
        const color = COLORS[leaf.color];
        return (
          <span
            key={i}
            className="cz-leaves__fall"
            style={{ left: `${leaf.left}%`, animationDuration: `${leaf.fall}s`, animationDelay: `-${leaf.delay}s` }}
          >
            <span
              className="cz-leaves__sway"
              style={{ "--sway": `${leaf.sway}px`, animationDuration: `${leaf.fall / 5}s` } as CSSProperties}
            >
              <svg viewBox="0 0 40 40" width={leaf.size} height={leaf.size}>
                <path d={shape.body} fill={color.fill} />
                <path d={shape.veins} stroke={color.vein} strokeWidth="1.2" strokeLinecap="round" fill="none" />
              </svg>
            </span>
          </span>
        );
      })}
    </div>
  );
}
