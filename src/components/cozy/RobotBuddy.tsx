import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion, useSpring } from "framer-motion";
import { robotLines } from "../../data/portfolio";
import "./RobotBuddy.css";

const INK = "#3a2b1a";
const SHELL = "#f3e6cd";
const GLOW = "#ffb35c";

// centre of the screen inside the 230×270 viewBox — the eyes orbit around it
const SCREEN_X = 110 / 230;
const SCREEN_Y = 107 / 270;

export default function RobotBuddy() {
  const svgRef = useRef<SVGSVGElement>(null);
  const reduceMotion = useReducedMotion();
  const eyeX = useSpring(0, { stiffness: 260, damping: 20 });
  const eyeY = useSpring(0, { stiffness: 260, damping: 20 });
  const [blinking, setBlinking] = useState(false);
  const [happy, setHappy] = useState(false);
  const [line, setLine] = useState<number | null>(null);
  const [waves, setWaves] = useState(0);

  // eyes follow the pointer anywhere on the page
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const svg = svgRef.current;
      if (!svg) return;
      const box = svg.getBoundingClientRect();
      const dx = e.clientX - (box.left + box.width * SCREEN_X);
      const dy = e.clientY - (box.top + box.height * SCREEN_Y);
      const distance = Math.hypot(dx, dy) || 1;
      const reach = Math.min(distance / 260, 1);
      eyeX.set((dx / distance) * 10 * reach);
      eyeY.set((dy / distance) * 7 * reach);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [eyeX, eyeY]);

  useEffect(() => {
    let timer = 0;
    const blinkSoon = () => {
      timer = window.setTimeout(() => {
        setBlinking(true);
        timer = window.setTimeout(() => {
          setBlinking(false);
          blinkSoon();
        }, 130);
      }, 2400 + Math.random() * 2800);
    };
    blinkSoon();
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => setLine(0), 1100);
    return () => window.clearTimeout(timer);
  }, []);

  const poke = () => {
    setLine((current) => (current === null ? 0 : (current + 1) % robotLines.length));
    setWaves((n) => n + 1);
  };

  return (
    <div className="cz-robot">
      <div className="cz-robot__bubble-slot" aria-live="polite">
        <AnimatePresence mode="wait">
          {line !== null && (
            <motion.p
              key={line}
              className="cz-robot__bubble"
              initial={{ opacity: 0, y: 8, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.96 }}
              transition={{ duration: 0.22 }}
            >
              {robotLines[line]}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <button
        type="button"
        className="cz-robot__button"
        onClick={poke}
        onPointerEnter={() => setHappy(true)}
        onPointerLeave={() => setHappy(false)}
        onFocus={() => setHappy(true)}
        onBlur={() => setHappy(false)}
        aria-label="Poke the robot"
      >
        <svg ref={svgRef} className="cz-robot__svg" viewBox="0 0 230 270" aria-hidden="true" focusable="false">
          <defs>
            <radialGradient id="cz-robot-screen" cx="50%" cy="42%" r="70%">
              <stop offset="0" stopColor="#5a3a22" />
              <stop offset="1" stopColor="#2a1f15" />
            </radialGradient>
            <pattern id="cz-robot-scanlines" width="4" height="4" patternUnits="userSpaceOnUse">
              <rect width="4" height="1.4" fill="#fff" opacity="0.06" />
            </pattern>
            <filter id="cz-robot-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2.4" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <ellipse cx="110" cy="265" rx="62" ry="4.5" fill={INK} opacity="0.14" />

          <g className="cz-robot__bob" stroke={INK} strokeLinecap="round" strokeLinejoin="round">
            {/* antenna */}
            <path d="M110 46 V24" strokeWidth="4" fill="none" />
            <circle className="cz-robot__antenna" cx="110" cy="16" r="9" fill="#ff9a3c" strokeWidth="3.5" />
            <circle cx="107" cy="13" r="2.6" fill="#fff6e4" stroke="none" />

            {/* resting arm */}
            <path d="M66 206 Q44 216 40 234" strokeWidth="8" fill="none" />
            <path d="M66 206 Q44 216 40 234" stroke={SHELL} strokeWidth="3.5" fill="none" />
            <circle cx="39" cy="238" r="8" fill={SHELL} strokeWidth="3.5" />

            {/* waving arm — remounts on every poke to replay the wave */}
            <motion.g
              key={waves}
              style={{ originX: 0, originY: 1 }}
              animate={reduceMotion ? undefined : { rotate: [0, -24, 12, -18, 6, 0] }}
              transition={{ duration: 1.1, delay: waves === 0 ? 1.1 : 0, ease: "easeInOut" }}
            >
              <path d="M154 206 Q190 206 204 184" strokeWidth="8" fill="none" />
              <path d="M154 206 Q190 206 204 184" stroke={SHELL} strokeWidth="3.5" fill="none" />
              <circle cx="207" cy="178" r="8" fill={SHELL} strokeWidth="3.5" />
            </motion.g>

            {/* treads */}
            <rect x="58" y="238" width="104" height="26" rx="13" fill="#5c4632" strokeWidth="4" />
            {[76, 98, 122, 144].map((cx) => (
              <circle key={cx} cx={cx} cy="251" r="6" fill="#d8bf95" strokeWidth="2.5" />
            ))}

            {/* body */}
            <rect x="96" y="174" width="28" height="16" rx="4" fill="#d8bf95" strokeWidth="3.5" />
            <rect x="62" y="188" width="96" height="54" rx="16" fill="#ef8a3c" strokeWidth="4" />
            <path d="M74 198 h12" stroke="#ffd7a8" strokeWidth="3.5" fill="none" />
            <path
              d="M110 228 c-9 -6 -13 -10 -13 -15 a6 6 0 0 1 13 -2 a6 6 0 0 1 13 2 c0 5 -4 9 -13 15z"
              fill="#fff6e4"
              strokeWidth="3"
            />

            {/* monitor head */}
            <rect x="24" y="44" width="172" height="134" rx="28" fill={SHELL} strokeWidth="4" />
            <rect x="40" y="58" width="140" height="98" rx="18" fill="#dcc7a2" strokeWidth="3.5" />
            <rect x="50" y="66" width="120" height="82" rx="13" fill="url(#cz-robot-screen)" strokeWidth="3" />
            <rect x="50" y="66" width="120" height="82" rx="13" fill="url(#cz-robot-scanlines)" stroke="none" />
            <path d="M60 80 q4 -6 12 -7" stroke="#fff6e4" strokeWidth="3" opacity="0.35" fill="none" />
            <path d="M44 167 h16" strokeWidth="3" fill="none" />
            <circle cx="176" cy="167" r="4" fill="#9fcf5a" strokeWidth="2.5" />

            {/* face */}
            <g stroke="none" filter="url(#cz-robot-glow)">
              <motion.g style={{ x: eyeX, y: eyeY }}>
                {happy ? (
                  <g stroke={GLOW} strokeWidth="4.5" fill="none" strokeLinecap="round">
                    <path d="M80 107 q7 -12 14 0" />
                    <path d="M126 107 q7 -12 14 0" />
                  </g>
                ) : (
                  <motion.g
                    style={{ originY: 0.5 }}
                    animate={{ scaleY: blinking ? 0.12 : 1 }}
                    transition={{ duration: 0.07 }}
                  >
                    <rect x="80" y="92" width="14" height="22" rx="7" fill={GLOW} />
                    <rect x="126" y="92" width="14" height="22" rx="7" fill={GLOW} />
                    <rect x="83" y="96" width="4" height="6" rx="2" fill="#fff1d6" />
                    <rect x="129" y="96" width="4" height="6" rx="2" fill="#fff1d6" />
                  </motion.g>
                )}
              </motion.g>
              <ellipse cx="72" cy="124" rx="7" ry="4" fill="#f0886a" opacity={happy ? 0.95 : 0.7} />
              <ellipse cx="148" cy="124" rx="7" ry="4" fill="#f0886a" opacity={happy ? 0.95 : 0.7} />
              <path
                d={happy ? "M98 121 q12 13 24 0" : "M101 124 q9 8 18 0"}
                stroke={GLOW}
                strokeWidth="3.5"
                fill="none"
                strokeLinecap="round"
              />
            </g>
          </g>
        </svg>
      </button>
    </div>
  );
}
