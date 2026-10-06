import PixelSprite from "./PixelSprite";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";
import { projects } from "../../data/portfolio";
import "./Work.css";

export default function Work() {
  return (
    <section id="work" className="cz-section cz-work" aria-labelledby="work-title">
      <SectionHeading index="02" label="projects/" title="things I've made" id="work-title">
        A few projects I'm proud of — open a folder to take a peek.
      </SectionHeading>

      <ul className="cz-folders">
        {projects.map((project, i) => (
          <li key={project.title}>
            <Reveal delay={(i % 2) * 0.1}>
              <article className={`cz-folder cz-folder--${project.color}`}>
                <div className="cz-folder__tab">
                  <span className="cz-folder__number">{String(i + 1).padStart(2, "0")}</span>
                  {project.kind}
                </div>
                <div className="cz-folder__back" aria-hidden="true" />
                <div className="cz-folder__paper" aria-hidden="true">
                  <span className="cz-folder__paper-lines" />
                  <PixelSprite name={project.sprite} scale={4} />
                </div>

                <div className="cz-folder__front">
                  <p className="cz-folder__year">{project.year}</p>
                  <h3 className="cz-folder__title">{project.title}</h3>
                  <p className="cz-folder__description">{project.description}</p>
                  <ul className="cz-chips" aria-label="Built with">
                    {project.tags.map((tag) => (
                      <li key={tag}>{tag}</li>
                    ))}
                  </ul>
                  {project.links.length > 0 && (
                    <div className="cz-folder__links">
                      {project.links.map((link) => (
                        <a key={link.href} href={link.href} className="cz-folder__link">
                          {link.label} <span aria-hidden="true">→</span>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
