import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { gsap } from "gsap";
import "./ShapeOverlay.css";

export interface ShapeOverlayHandle {
  play: (onComplete: () => void) => void;
}

const NUM_POINTS = 10;
const DELAY_POINTS_MAX = 0.3;
const DELAY_PER_PATH = 0.25;

const ShapeOverlay = forwardRef<ShapeOverlayHandle>((_, ref) => {
  const path1Ref = useRef<SVGPathElement>(null);
  const path2Ref = useRef<SVGPathElement>(null);
  const allPointsRef = useRef<number[][]>([]);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const isOpenedRef = useRef(false);

  useEffect(() => {
    const paths = [path2Ref.current, path1Ref.current];
    const numPaths = paths.length;
    const allPoints: number[][] = [];

    for (let i = 0; i < numPaths; i++) {
      const points: number[] = [];
      for (let j = 0; j < NUM_POINTS; j++) points.push(100);
      allPoints.push(points);
    }
    allPointsRef.current = allPoints;

    function render() {
      for (let i = 0; i < numPaths; i++) {
        const path = paths[i];
        if (!path) continue;
        const points = allPoints[i];

        let d = isOpenedRef.current
          ? `M 0 0 V ${points[0]} C`
          : `M 0 ${points[0]} C`;

        for (let j = 0; j < NUM_POINTS - 1; j++) {
          const p = ((j + 1) / (NUM_POINTS - 1)) * 100;
          const cp = p - ((1 / (NUM_POINTS - 1)) * 100) / 2;
          d += ` ${cp} ${points[j]} ${cp} ${points[j + 1]} ${p} ${points[j + 1]}`;
        }

        d += isOpenedRef.current ? ` V 100 H 0` : ` V 0 H 0`;
        path.setAttribute("d", d);
      }
    }

    isOpenedRef.current = true;
    render();

    tlRef.current = gsap.timeline({
      onUpdate: render,
      defaults: { ease: "power2.inOut", duration: 0.9 },
    });

    runTransition(false, () => {});

    function runTransition(cover: boolean, onComplete: () => void) {
      const tl = tlRef.current;
      if (!tl) return;

      isOpenedRef.current = cover;
      tl.progress(0).clear();

      const pointsDelay: number[] = [];
      for (let i = 0; i < NUM_POINTS; i++) {
        pointsDelay[i] = Math.random() * DELAY_POINTS_MAX;
      }

      for (let i = 0; i < numPaths; i++) {
        const points = allPoints[i];
        for (let j = 0; j < NUM_POINTS; j++) points[j] = 100;

        const pathDelay = DELAY_PER_PATH * (cover ? i : numPaths - i - 1);
        for (let j = 0; j < NUM_POINTS; j++) {
          tl.to(points, { [j]: 0 }, pointsDelay[j] + pathDelay);
        }
      }

      tl.eventCallback("onComplete", onComplete);
    }

    (allPointsRef as unknown as { runTransition?: typeof runTransition }).runTransition = runTransition;
  }, []);

  useImperativeHandle(ref, () => ({
    play(onComplete: () => void) {
      const runTransition = (allPointsRef as unknown as {
        runTransition?: (cover: boolean, cb: () => void) => void;
      }).runTransition;
      if (!runTransition) return;
      runTransition(true, onComplete);
    },
  }));

  return (
    <svg className="shape-overlays" viewBox="0 0 100 100" preserveAspectRatio="none">
      <defs>
        <linearGradient id="gradient1" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ff8709" />
          <stop offset="100%" stopColor="#f7bdf8" />
        </linearGradient>
        <linearGradient id="gradient2" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffd9b0" />
          <stop offset="100%" stopColor="#ff8709" />
        </linearGradient>
      </defs>
      <path ref={path2Ref} className="shape-overlays__path" fill="url(#gradient2)" />
      <path ref={path1Ref} className="shape-overlays__path" fill="url(#gradient1)" />
    </svg>
  );
});

export default ShapeOverlay;