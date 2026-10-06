import { LogoLoop, type LogoItem } from "../landing/LogoLoop";
import PixelSprite from "./PixelSprite";
import { marqueeWords } from "../../data/portfolio";
import "./TapeMarquee.css";

const frontItems: LogoItem[] = marqueeWords.map((word) => ({
  node: (
    <span className="cz-tape__item">
      <PixelSprite name="leaf" scale={1.5} />
      {word}
    </span>
  ),
}));

const backItems: LogoItem[] = [...marqueeWords].reverse().map((word) => ({
  node: (
    <span className="cz-tape__item">
      <span className="cz-tape__star" aria-hidden="true">
        ✦
      </span>
      {word}
    </span>
  ),
}));

export default function TapeMarquee() {
  return (
    <div className="cz-tapes">
      <div className="cz-tape cz-tape--back" aria-hidden="true">
        <LogoLoop logos={backItems} speed={36} direction="right" logoHeight={18} gap={30} hoverSpeed={12} />
      </div>
      <div className="cz-tape cz-tape--front">
        <LogoLoop
          logos={frontItems}
          speed={56}
          direction="left"
          logoHeight={19}
          gap={34}
          hoverSpeed={16}
          ariaLabel="Things I like working with"
        />
      </div>
    </div>
  );
}
