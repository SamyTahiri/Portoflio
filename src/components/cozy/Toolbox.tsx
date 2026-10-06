import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import Reveal from "./Reveal";
import RetroWindow from "./RetroWindow";
import SectionHeading from "./SectionHeading";
import { skillGroups } from "../../data/portfolio";
import "./Toolbox.css";

const ALL_KEYS = skillGroups.flatMap((group) => group.keys);

export default function Toolbox() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { amount: 0.3 });
  const [pressed, setPressed] = useState<string[]>([]);

  // typing a letter while the toolbox is on screen "presses" the matching keycaps
  useEffect(() => {
    if (!inView) return;
    let release = 0;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || e.repeat || e.key.length !== 1) return;
      if (e.target instanceof HTMLElement && e.target.closest("input, textarea, [contenteditable]")) return;
      const letter = e.key.toLowerCase();
      const hits = ALL_KEYS.filter((key) => key.toLowerCase().startsWith(letter));
      if (hits.length === 0) return;
      setPressed(hits);
      window.clearTimeout(release);
      release = window.setTimeout(() => setPressed([]), 260);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.clearTimeout(release);
    };
  }, [inView]);

  return (
    <section id="toolbox" className="cz-section cz-toolbox" ref={sectionRef} aria-labelledby="toolbox-title">
      <SectionHeading index="03" label="toolbox.exe" title="what I work with" id="toolbox-title">
        The tools I reach for most — from pixels on a screen to motors on a robot.
      </SectionHeading>

      <Reveal>
        <RetroWindow title="keyboard.cfg" className="cz-toolbox__window">
          <div className="cz-keyboard">
            {skillGroups.map((group) => (
              <div className="cz-keyboard__row" key={group.label}>
                <p className="cz-keyboard__label">{group.label}</p>
                <ul className="cz-keyboard__keys">
                  {group.keys.map((key) => {
                    const classes = ["cz-key"];
                    if (group.featured?.includes(key)) classes.push("cz-key--accent");
                    if (pressed.includes(key)) classes.push("is-pressed");
                    return (
                      <li key={key} className={classes.join(" ")}>
                        {key}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
          <p className="cz-toolbox__hint">
            <kbd>psst</kbd> try typing a letter on your keyboard
          </p>
        </RetroWindow>
      </Reveal>
    </section>
  );
}
