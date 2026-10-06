import { useEffect, useRef, useState } from "react";
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

  return (
    <header className="cz-menubar">
      <a className="cz-menubar__brand" href="#top" aria-label="samy.os — back to top">
        <PixelSprite name="leaf" scale={1.5} />
        <span>samy.os</span>
      </a>

      <nav className="cz-menubar__nav" aria-label="Sections">
        <ul>
          {LINKS.map((link) => (
            <li key={link.id}>
              <a href={`#${link.id}`} aria-current={active === link.id ? "true" : undefined}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="cz-menubar__tray">
        <MusicToggle />
        <time className="cz-menubar__clock" dateTime={now.toISOString()}>
          {clockFormat.format(now)}
        </time>
      </div>
    </header>
  );
}
