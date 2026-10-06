import { useEffect, useRef, useState } from "react";
import PixelSprite from "./PixelSprite";
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
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!audio.paused) {
      audio.pause();
      return;
    }
    audio.volume = 0.45;
    // browsers can refuse playback; the button simply stays "off"
    audio.play().catch(() => setPlaying(false));
  };

  return (
    <>
      <audio
        ref={audioRef}
        src="/audios/ambient.mp3"
        loop
        preload="none"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      />
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
        <span className="cz-visually-hidden"> ambient music</span>
      </button>
    </>
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
