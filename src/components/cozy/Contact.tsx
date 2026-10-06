import { useEffect, useRef, useState } from "react";
import PixelSprite from "./PixelSprite";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { profile, socials } from "../../data/portfolio";
import "./Contact.css";

const YEAR = new Date().getFullYear();

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const resetTimer = useRef(0);

  useEffect(() => () => window.clearTimeout(resetTimer.current), []);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
    } catch {
      return; // clipboard blocked — the mailto link still works
    }
    setCopied(true);
    window.clearTimeout(resetTimer.current);
    resetTimer.current = window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <section id="contact" className="cz-section cz-contact" aria-labelledby="contact-title">
      <SectionHeading index="04" label="say-hi.eml" title="let's make something cozy" id="contact-title" />

      <Reveal>
        <div className="cz-postcard">
          <div className="cz-postcard__card">
            <div className="cz-postcard__message">
              <p className="cz-postcard__greeting">Hi there,</p>
              <p className="cz-postcard__text">
                Have a project, an idea, or just want to say hi? My inbox is always open — I'd love to hear from you.
              </p>

              <div className="cz-postcard__email">
                <a className="cz-btn cz-btn--primary" href={`mailto:${profile.email}`}>
                  {profile.email}
                </a>
                <button type="button" className="cz-btn cz-btn--small" onClick={copyEmail}>
                  {copied ? "copied ✓" : "copy"}
                </button>
                <span className="cz-visually-hidden" aria-live="polite">
                  {copied ? "Email address copied" : ""}
                </span>
              </div>

              <ul className="cz-postcard__socials">
                {socials.map((social) => (
                  <li key={social.label}>
                    <a href={social.href} target="_blank" rel="noreferrer">
                      {social.label} <span aria-hidden="true">↗</span>
                    </a>
                  </li>
                ))}
              </ul>

              <p className="cz-postcard__sign">— Samy</p>
            </div>

            <div className="cz-postcard__side" aria-hidden="true">
              <div className="cz-stamp">
                <div className="cz-stamp__edge">
                  <div className="cz-stamp__inner">
                    <PixelSprite name="leaf" scale={3} />
                    <span>autumn ’{String(YEAR).slice(2)}</span>
                  </div>
                </div>
              </div>

              <svg className="cz-postmark" viewBox="0 0 120 120">
                <defs>
                  <path id="cz-postmark-ring" d="M60 60 m-43 0 a43 43 0 1 1 86 0 a43 43 0 1 1 -86 0" />
                </defs>
                <circle cx="60" cy="60" r="56" />
                <circle cx="60" cy="60" r="31" />
                <g className="cz-postmark__ring">
                  <text>
                    <textPath href="#cz-postmark-ring" textLength="268" lengthAdjust="spacing">
                      SAMY TAHIRI ✦ CORNER OF THE WEB ✦
                    </textPath>
                  </text>
                </g>
                <text className="cz-postmark__year" x="60" y="66">
                  {YEAR}
                </text>
              </svg>

              <div className="cz-postcard__address">
                <p>
                  <span>to</span> you, lovely visitor
                </p>
                <p>
                  <span>from</span> a cozy corner of the web
                </p>
                <p>
                  <span>via</span> the internet ✦
                </p>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
