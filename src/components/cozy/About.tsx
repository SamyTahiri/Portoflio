import PixelSprite from "./PixelSprite";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { about, nowTags, profile } from "../../data/portfolio";
import "./About.css";

export default function About() {
  return (
    <section id="about" className="cz-section cz-about" aria-labelledby="about-title">
      <SectionHeading index="01" label="about.txt" title="a little about me" id="about-title" />

      <div className="cz-about__grid">
        <Reveal className="cz-about__photo">
          <figure className="cz-polaroid">
            <span className="cz-washi cz-washi--left" aria-hidden="true" />
            <span className="cz-washi cz-washi--right" aria-hidden="true" />
            <img src={profile.photo} alt={profile.photoAlt} width={346} height={346} loading="lazy" />
            <figcaption>{profile.photoCaption}</figcaption>
          </figure>
          <span className="cz-about__heart" aria-hidden="true">
            <PixelSprite name="heart" scale={4} />
          </span>
        </Reveal>

        <Reveal className="cz-about__text" delay={0.12}>
          <div className="cz-note">
            {about.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <ul className="cz-tags" aria-label="Right now">
            {nowTags.map((tag) => (
              <li key={tag.label} className={`cz-tag cz-tag--${tag.color}`}>
                <span className="cz-tag__label">{tag.label}</span>
                <span className="cz-tag__value">{tag.value}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
