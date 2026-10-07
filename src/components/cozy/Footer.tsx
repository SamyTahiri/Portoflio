import { useEffect, useRef, useState, type CSSProperties } from "react";
import PixelSprite from "./PixelSprite";
import RetroWindow from "./RetroWindow";
import { profile } from "../../data/portfolio";
import "./Footer.css";

const YEAR = new Date().getFullYear();

const BADGES = [
  { text: "made with react", tone: "ink" },
  { text: "tea powered", tone: "orange" },
  { text: "no trackers", tone: "butter" },
  { text: `autumn ’${String(YEAR).slice(2)}`, tone: "sage" },
];

const ALERTS = [
  "Too much coziness detected. Please grab a blanket.",
  "Leaf pile overflow. Recommended action: jump in.",
  "Tea levels critically low. Brewing a fresh cup…",
  "Error 404: Monday not found. Enjoy the day!",
];

const VISITS_KEY = "cz-visits";

function readVisits() {
  try {
    return Number(window.localStorage.getItem(VISITS_KEY)) || 0;
  } catch {
    return 0;
  }
}

export default function Footer() {
  const [visits] = useState(() => readVisits() + 1);
  const [alerts, setAlerts] = useState<number[]>([]);
  const nextAlert = useRef(0);

  useEffect(() => {
    try {
      window.localStorage.setItem(VISITS_KEY, String(visits));
    } catch {
      // storage can be blocked (private mode); the counter is just for fun
    }
  }, [visits]);

  useEffect(() => {
    if (alerts.length === 0) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setAlerts((open) => open.slice(0, -1));
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [alerts.length]);

  const raiseAlert = () => {
    const id = nextAlert.current++;
    setAlerts((open) => (open.length >= ALERTS.length ? open : [...open, id]));
  };

  const dismiss = (id: number) => setAlerts((open) => open.filter((alert) => alert !== id));

  return (
    <footer className="cz-footer">
      <div className="cz-footer__inner">
        <ul className="cz-badges" aria-label="Badges">
          {BADGES.map((badge) => (
            <li key={badge.text} className={`cz-badge cz-badge--${badge.tone}`}>
              {badge.text}
            </li>
          ))}
        </ul>

        <div className="cz-footer__row">
          <div>
            <p className="cz-footer__credit">
              © {YEAR} {profile.name} · made with tea, React &amp; far too many leaves
            </p>
            <p className="cz-footer__visits">
              <PixelSprite name="star" scale={1.5} /> visit no. {visits} — thanks for stopping by
            </p>
            <p className="cz-footer__thanks">
              special mentions to{" "}
              <a href="https://jerryxf.net/" target="_blank" rel="noreferrer">
                Jerry
              </a>{" "}
              &amp;{" "}
              <a href="https://www.raphdf201.net/" target="_blank" rel="noreferrer">
                Raphaël
              </a>
            </p>
          </div>

          <div className="cz-footer__actions">
            <a className="cz-footer__link" href="#top">
              back to top <span aria-hidden="true">↑</span>
            </a>
            <button type="button" className="cz-footer__danger" onClick={raiseAlert}>
              do not press
            </button>
          </div>
        </div>
      </div>

      <div className="cz-alerts">
        {alerts.map((id, i) => (
          <div
            key={id}
            className="cz-alert"
            role="alertdialog"
            aria-labelledby={`cz-alert-title-${id}`}
            aria-describedby={`cz-alert-text-${id}`}
            style={{ "--i": i } as CSSProperties}
          >
            <RetroWindow title="system alert" titleId={`cz-alert-title-${id}`} onClose={() => dismiss(id)}>
              <div className="cz-alert__body">
                <PixelSprite name="mug" scale={3} />
                <p id={`cz-alert-text-${id}`}>{ALERTS[id % ALERTS.length]}</p>
              </div>
              <div className="cz-alert__actions">
                <button type="button" className="cz-btn cz-btn--small" onClick={() => dismiss(id)} autoFocus>
                  OK
                </button>
              </div>
            </RetroWindow>
          </div>
        ))}
      </div>
    </footer>
  );
}
