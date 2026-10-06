import { Fragment, useRef, type CSSProperties } from "react";
import { motion } from "framer-motion";
import PixelSprite from "./PixelSprite";
import RobotBuddy from "./RobotBuddy";
import { SPRITES, type SpriteName } from "./pixelArt";
import { useMediaQuery } from "./useMediaQuery";
import { profile } from "../../data/portfolio";
import "./Hero.css";

type Sticker = {
  sprite: SpriteName;
  scale: number;
  rotate: number;
  position: { top?: string; right?: string; bottom?: string; left?: string };
  compact?: boolean; // still shown on small screens
};

// positions are relative to the notebook; negative values let a sticker hang over its edge
const STICKERS: Sticker[] = [
  { sprite: "mug", scale: 5, rotate: -10, position: { top: "-3%", left: "-2.5%" }, compact: true },
  { sprite: "leaf", scale: 4, rotate: 12, position: { top: "-5%", left: "38%" } },
  { sprite: "star", scale: 4, rotate: 14, position: { top: "8%", right: "-2.5%" }, compact: true },
  { sprite: "floppy", scale: 4, rotate: -8, position: { top: "47%", right: "-3%" } },
  { sprite: "acorn", scale: 4, rotate: 10, position: { top: "40%", left: "-3%" } },
  { sprite: "gear", scale: 4, rotate: 0, position: { bottom: "-4%", left: "52%" } },
  { sprite: "heart", scale: 4, rotate: 10, position: { bottom: "-3%", right: "9%" }, compact: true },
  { sprite: "mushroom", scale: 5, rotate: -8, position: { bottom: "-5%", left: "6%" }, compact: true },
];

// each letter gets a running index so the entrance can be staggered across both words
const NAME_WORDS = profile.name.split(" ").map((word, i, words) => ({
  word,
  offset: words.slice(0, i).join("").length,
}));

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const canDrag = useMediaQuery("(hover: hover) and (pointer: fine)");

  return (
    <section id="top" className="cz-hero" ref={heroRef}>
      <div className="cz-hero__stage">
        <div className="cz-notebook">
          <div className="cz-notebook__rings" aria-hidden="true">
            {Array.from({ length: 16 }, (_, i) => (
              <span key={i} />
            ))}
          </div>

          <div className="cz-notebook__paper">
            <div className="cz-hero__copy">
              <p className="cz-hero__tag">&lt;hello world /&gt;</p>

              <h1 className="cz-hero__name" aria-label={profile.name}>
                <span aria-hidden="true">
                  {NAME_WORDS.map(({ word, offset }, w) => (
                    <Fragment key={word}>
                      {w > 0 && " "}
                      <span className="cz-hero__word">
                        {[...word].map((char, i) => (
                          <span className="cz-hero__letter-in" key={i} style={{ "--i": offset + i } as CSSProperties}>
                            <span className="cz-hero__letter">{char}</span>
                          </span>
                        ))}
                      </span>
                    </Fragment>
                  ))}
                </span>
                <svg className="cz-hero__squiggle" viewBox="0 0 320 24" preserveAspectRatio="none" aria-hidden="true">
                  <path pathLength={1} d="M4 15 C40 4 70 24 108 13 S178 4 214 14 S284 24 316 9" />
                </svg>
              </h1>

              <p className="cz-hero__role">
                <mark>{profile.role}</mark>
              </p>
              <p className="cz-hero__intro">{profile.intro}</p>

              <div className="cz-hero__actions">
                <span className="cz-hero__cta">
                  <a className="cz-btn cz-btn--primary" href="#work">
                    see my work <span aria-hidden="true">↓</span>
                  </a>
                  <PixelSprite name="cursor" scale={2} className="cz-hero__pointer" />
                </span>
                <a className="cz-btn" href="#contact">
                  say hello
                </a>
              </div>
            </div>

            <div className="cz-hero__buddy">
              <RobotBuddy />
            </div>

            <span className="cz-code cz-code--title" aria-hidden="true">
              &lt;title&gt;
            </span>
            <span className="cz-code cz-code--html" aria-hidden="true">
              &lt;html&gt;
            </span>
            <span className="cz-code cz-code--p" aria-hidden="true">
              &lt;/p&gt;
            </span>
            <span className="cz-coffee" aria-hidden="true" />
          </div>
        </div>

        {STICKERS.map((sticker) => (
          <motion.div
            key={sticker.sprite}
            className={`cz-sticker${sticker.compact ? " cz-sticker--compact" : ""}`}
            style={{ ...sticker.position, rotate: sticker.rotate }}
            drag={canDrag}
            dragConstraints={heroRef}
            dragElastic={0.15}
            whileHover={canDrag ? { scale: 1.08, rotate: sticker.rotate + 6 } : undefined}
            whileDrag={{ scale: 1.15, rotate: 0, zIndex: 20 }}
            aria-hidden="true"
          >
            <span
              className="cz-sticker__art"
              style={{ "--sticker-w": `${SPRITES[sticker.sprite].width * sticker.scale}px` } as CSSProperties}
            >
              <PixelSprite name={sticker.sprite} scale={sticker.scale} />
            </span>
          </motion.div>
        ))}

        <p className="cz-hero__hint" aria-hidden="true">
          <svg viewBox="0 0 64 34" fill="none">
            <path d="M60 26 C44 32 22 30 8 12" />
            <path d="M8 12 L9 24 M8 12 L19 15" />
          </svg>
          psst… the stickers come off!
        </p>
      </div>
    </section>
  );
}
