import { SPRITES, type SpriteName } from "./pixelArt";

type PixelSpriteProps = {
  name: SpriteName;
  // size of one art pixel in CSS pixels
  scale?: number;
  className?: string;
};

export default function PixelSprite({ name, scale = 4, className }: PixelSpriteProps) {
  const sprite = SPRITES[name];

  return (
    <svg
      className={className}
      width={sprite.width * scale}
      height={sprite.height * scale}
      viewBox={`0 0 ${sprite.width} ${sprite.height}`}
      shapeRendering="crispEdges"
      aria-hidden="true"
      focusable="false"
    >
      {sprite.runs.map((run, i) => (
        <rect key={i} x={run.x} y={run.y} width={run.w} height={1} fill={run.fill} />
      ))}
    </svg>
  );
}
