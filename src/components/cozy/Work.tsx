import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import PixelSprite from "./PixelSprite";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { projectTypes } from "../../data/portfolio";
import "./Work.css";

const pullOut = { type: "spring", stiffness: 260, damping: 30 } as const;

export default function Work() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const reduceMotion = useReducedMotion();
  const openers = useRef<(HTMLButtonElement | null)[]>([]);
  const closeButton = useRef<HTMLButtonElement>(null);

  const open = openIndex === null ? null : projectTypes[openIndex];
  // the same id on the folder's paper and the open card lets framer slide one into the other
  const paperId = (i: number) => (reduceMotion ? undefined : `cz-paper-${i}`);

  useEffect(() => {
    if (openIndex === null) return;

    const opener = openers.current[openIndex];
    const root = document.documentElement;
    const scrollbar = window.innerWidth - root.clientWidth;
    root.style.overflow = "hidden";
    root.style.paddingRight = `${scrollbar}px`;
    closeButton.current?.focus({ preventScroll: true });

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenIndex(null);
    };
    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("keydown", onKey);
      root.style.overflow = "";
      root.style.paddingRight = "";
      opener?.focus({ preventScroll: true });
    };
  }, [openIndex]);

  return (
    <section id="work" className="cz-section cz-work" aria-labelledby="work-title">
      <SectionHeading index="02" label="projects/" title="things I've made" id="work-title">
        My work, sorted by type — click a folder to pull out what's inside.
      </SectionHeading>

      <ul className="cz-folders">
        {projectTypes.map((type, i) => (
          <li key={type.title}>
            <Reveal delay={(i % 2) * 0.1}>
              <article className={`cz-folder cz-folder--${type.color}`}>
                <div className="cz-folder__tab">
                  <span className="cz-folder__number">{String(i + 1).padStart(2, "0")}</span>
                  {type.kind}
                </div>
                <div className="cz-folder__back" aria-hidden="true" />
                <div className="cz-folder__paper" aria-hidden="true">
                  {openIndex !== i && (
                    <motion.div
                      layoutId={paperId(i)}
                      className="cz-folder__sheet"
                      style={{ borderRadius: 8 }}
                      transition={pullOut}
                    >
                      <span className="cz-folder__paper-lines" />
                      <PixelSprite name={type.sprite} scale={4} />
                    </motion.div>
                  )}
                </div>

                <div className="cz-folder__front">
                  <h3 className="cz-folder__title">
                    <button
                      type="button"
                      className="cz-folder__open"
                      aria-haspopup="dialog"
                      ref={(el) => {
                        openers.current[i] = el;
                      }}
                      onClick={() => setOpenIndex(i)}
                    >
                      {type.title}
                    </button>
                  </h3>
                  <p className="cz-folder__count">
                    {type.projects.length} {type.projects.length === 1 ? "project" : "projects"}
                    <span aria-hidden="true"> · open ↗</span>
                  </p>
                </div>
              </article>
            </Reveal>
          </li>
        ))}
      </ul>

      {/* portalled to the page root so the card sits above the menu bar (main has its own stacking context) */}
      {createPortal(
        <AnimatePresence>
          {open && openIndex !== null && (
            <div className="cz-sheet-layer" key="sheet">
              <motion.div
                className="cz-sheet-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setOpenIndex(null)}
              />

              <motion.div
                layoutId={paperId(openIndex)}
                className={`cz-sheet cz-sheet--${open.color}`}
                style={{ borderRadius: 14 }}
                role="dialog"
                aria-modal="true"
                aria-labelledby="cz-sheet-title"
                transition={pullOut}
                initial={reduceMotion ? { opacity: 0 } : undefined}
                animate={reduceMotion ? { opacity: 1 } : undefined}
                exit={reduceMotion ? { opacity: 0 } : undefined}
              >
                <motion.div
                  className="cz-sheet__content"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { delay: reduceMotion ? 0 : 0.18 } }}
                  exit={{ opacity: 0, transition: { duration: 0.1 } }}
                >
                  <div className="cz-sheet__head">
                    <p className="cz-sheet__label">
                      <span className="cz-folder__number">{String(openIndex + 1).padStart(2, "0")}</span>
                      {open.kind}/
                    </p>
                    <button
                      type="button"
                      ref={closeButton}
                      className="cz-sheet__close"
                      aria-label="Close and put the card back"
                      onClick={() => setOpenIndex(null)}
                    >
                      ✕
                    </button>
                  </div>

                  <div className="cz-sheet__intro">
                    <div>
                      <h3 id="cz-sheet-title" className="cz-sheet__title">
                        {open.title}
                      </h3>
                      <p className="cz-sheet__description">{open.description}</p>
                    </div>
                    <PixelSprite name={open.sprite} scale={5} />
                  </div>

                  <ul className="cz-chips" aria-label="Built with">
                    {open.tags.map((tag) => (
                      <li key={tag}>{tag}</li>
                    ))}
                  </ul>

                  <ul className="cz-sheet__items">
                    {open.projects.map((project) => {
                      const external = project.link?.href.startsWith("http");
                      return (
                        <li key={project.title} className="cz-sheet__item">
                          <div className="cz-sheet__item-head">
                            <h4 className="cz-sheet__item-title">{project.title}</h4>
                            <span className="cz-sheet__item-year">{project.year}</span>
                          </div>
                          <p className="cz-sheet__item-description">{project.description}</p>
                          {project.link && (
                            <a
                              href={project.link.href}
                              className="cz-folder__link"
                              target={external ? "_blank" : undefined}
                              rel={external ? "noreferrer" : undefined}
                              onClick={external ? undefined : () => setOpenIndex(null)}
                            >
                              {project.link.label} <span aria-hidden="true">{external ? "↗" : "→"}</span>
                            </a>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </motion.div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.querySelector(".cz-page") ?? document.body,
      )}
    </section>
  );
}
