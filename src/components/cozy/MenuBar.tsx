import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import PixelSprite from "./PixelSprite";
import { LofiEngine } from "./lofiEngine";
import "./MenuBar.css";

const LINKS = [
  { id: "about", label: "about" },
  { id: "work", label: "work" },
  { id: "toolbox", label: "toolbox" },
  { id: "contact", label: "contact" },
];

// "top" is watched too, so nothing is highlighted while the hero is on screen
const WATCHED = ["top", ...LINKS.map((link) => link.id)];

// past this many pixels the bar turns into the floating pill
const COMPACT_AFTER = 80;
const MORPH = { type: "spring", stiffness: 420, damping: 38 } as const;

const subscribeToScroll = (onChange: () => void) => {
  window.addEventListener("scroll", onChange, { passive: true });
  return () => window.removeEventListener("scroll", onChange);
};

const clockFormat = new Intl.DateTimeFormat(undefined, { weekday: "short", hour: "numeric", minute: "2-digit" });

function useActiveSection() {
  const [active, setActive] = useState("top");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    WATCHED.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return active;
}

function useClock() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 15_000);
    return () => window.clearInterval(timer);
  }, []);

  return now;
}

function MusicToggle() {
  // the engine (and its AudioContext) is only created on the first click
  const engineRef = useRef<LofiEngine | null>(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => () => engineRef.current?.dispose(), []);

  const toggle = () => {
    engineRef.current ??= new LofiEngine();
    const engine = engineRef.current;
    if (playing) {
      engine.stop();
      setPlaying(false);
      return;
    }
    setPlaying(true);
    // browsers can refuse to start audio; the button simply flips back to "off"
    engine.start().catch(() => setPlaying(false));
  };

  return (
    <button
      type="button"
      className={`cz-music${playing ? " is-playing" : ""}`}
      onClick={toggle}
      aria-pressed={playing}
    >
      <span className="cz-music__bars" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
      </span>
      <span className="cz-music__label">{playing ? "now playing" : "lo-fi"}</span>
      <span className="cz-visually-hidden"> music</span>
    </button>
  );
}

export default function MenuBar() {
  const active = useActiveSection();
  const now = useClock();
  const compact = useSyncExternalStore(subscribeToScroll, () => window.scrollY > COMPACT_AFTER, () => false);
  const reduceMotion = useReducedMotion();
  const transition = reduceMotion ? { duration: 0 } : MORPH;

  const renderLink = (link: (typeof LINKS)[number]) => (
    <motion.li key={link.id} layout="position" transition={transition}>
      <a href={`#${link.id}`} aria-current={active === link.id ? "true" : undefined}>
        {link.label}
      </a>
    </motion.li>
  );

  // the same leaf lives in the brand at the top and in the middle of the pill once scrolled;
  // the shared layoutId makes it fly between the two spots
  const leaf = (
    <motion.span layoutId="cz-menubar-leaf" className="cz-menubar__leaf" transition={transition}>
      <PixelSprite name="leaf" scale={1.5} />
    </motion.span>
  );

  return (
    <header className={`cz-menubar${compact ? " is-compact" : ""}`}>
      <div className="cz-menubar__start">
        {!compact && (
          <a className="cz-menubar__brand" href="#top" aria-label="samyth — back to top">
            {leaf}
            <motion.span
              className="cz-menubar__name"
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, delay: reduceMotion ? 0 : 0.1 }}
            >
              samyth
            </motion.span>
          </a>
        )}
      </div>

      <motion.nav
        layout
        className="cz-menubar__nav"
        aria-label="Sections"
        transition={transition}
        style={{ borderRadius: 999 }}
      >
        <ul>{LINKS.slice(0, 2).map(renderLink)}</ul>
        {compact && (
          <a className="cz-menubar__home" href="#top" aria-label="samyth — back to top">
            {leaf}
          </a>
        )}
        <ul>{LINKS.slice(2).map(renderLink)}</ul>
      </motion.nav>

      <div className="cz-menubar__tray">
        <motion.div layout="position" transition={transition}>
          <MusicToggle />
        </motion.div>
        <AnimatePresence initial={false}>
          {!compact && (
            <motion.time
              className="cz-menubar__clock"
              dateTime={now.toISOString()}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {clockFormat.format(now)}
            </motion.time>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
