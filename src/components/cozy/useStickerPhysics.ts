import { useEffect, useRef, useState, type RefObject } from "react";
import { motionValue } from "framer-motion";

const FRICTION = 0; // per second; higher = shorter glide (1.4 ≈ framer's default throw)
const BOUNCE = 0.65; // share of speed kept after hitting a wall or another sticker
const MAX_SPEED = 2600; // px/s, so a wild flick doesn't launch a sticker across the page
const REST_SPEED = 6; // px/s, below this a sticker counts as stopped

type Body = {
  vx: number;
  vy: number;
  dragging: boolean;
  // layout centre in page coordinates, before the drag offset (x, y) is applied
  baseX: number;
  baseY: number;
  halfW: number;
  halfH: number;
  radius: number;
};

/**
 * Lightweight 2D physics for draggable stickers: a thrown sticker glides, slows down,
 * bounces off the sides of the screen (and the top/bottom of the bounds element)
 * and knocks into the other stickers — including the one being dragged.
 */
export function useStickerPhysics(count: number, boundsRef: RefObject<HTMLElement | null>) {
  const [offsets] = useState(() => Array.from({ length: count }, () => ({ x: motionValue(0), y: motionValue(0) })));
  const elements = useRef<(HTMLElement | null)[]>([]);
  const bodies = useRef<Body[]>(
    Array.from({ length: count }, () => ({
      vx: 0,
      vy: 0,
      dragging: false,
      baseX: 0,
      baseY: 0,
      halfW: 0,
      halfH: 0,
      radius: 0,
    })),
  );
  const frame = useRef(0);
  const bounds = useRef({ left: 0, right: 0, top: 0, bottom: 0 });

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  const measure = () => {
    const box = boundsRef.current?.getBoundingClientRect();
    if (box) {
      bounds.current = {
        left: 0,
        right: document.documentElement.clientWidth,
        top: box.top + window.scrollY,
        bottom: box.bottom + window.scrollY,
      };
    }

    bodies.current.forEach((body, i) => {
      const el = elements.current[i];
      if (!el) return;
      const rect = el.getBoundingClientRect();
      // the art is the visible part; the wrapper can be a little larger
      body.halfW = el.offsetWidth / 2;
      body.halfH = el.offsetHeight / 2;
      body.radius = Math.min(body.halfW, body.halfH) * 0.92;
      body.baseX = rect.left + rect.width / 2 + window.scrollX - offsets[i].x.get();
      body.baseY = rect.top + rect.height / 2 + window.scrollY - offsets[i].y.get();
    });
  };

  const step = (dt: number) => {
    const list = bodies.current;
    const { left, right, top, bottom } = bounds.current;
    const visible = list.map((body, i) => body.halfW > 0 && elements.current[i]?.offsetParent !== null);

    // move the free stickers and slow them down
    const damping = Math.exp(-FRICTION * dt);
    list.forEach((body, i) => {
      if (!visible[i]) return;
      const { x, y } = offsets[i];
      if (body.dragging) {
        // a held sticker moves with the pointer; remember its speed so it can push others
        body.vx = x.getVelocity();
        body.vy = y.getVelocity();
        return;
      }
      body.vx *= damping;
      body.vy *= damping;
      x.set(x.get() + body.vx * dt);
      y.set(y.get() + body.vy * dt);
    });

    // sticker vs sticker
    for (let i = 0; i < list.length; i++) {
      for (let j = i + 1; j < list.length; j++) {
        const a = list[i];
        const b = list[j];
        if (!visible[i] || !visible[j] || (a.dragging && b.dragging)) continue;

        const dx = b.baseX + offsets[j].x.get() - (a.baseX + offsets[i].x.get());
        const dy = b.baseY + offsets[j].y.get() - (a.baseY + offsets[i].y.get());
        const dist = Math.hypot(dx, dy) || 0.01;
        const overlap = a.radius + b.radius - dist;
        if (overlap <= 0) continue;

        const nx = dx / dist;
        const ny = dy / dist;
        // a held sticker doesn't budge, so the other one takes the whole push
        const shareA = a.dragging ? 0 : b.dragging ? 1 : 0.5;
        const shareB = 1 - shareA;
        offsets[i].x.set(offsets[i].x.get() - nx * overlap * shareA);
        offsets[i].y.set(offsets[i].y.get() - ny * overlap * shareA);
        offsets[j].x.set(offsets[j].x.get() + nx * overlap * shareB);
        offsets[j].y.set(offsets[j].y.get() + ny * overlap * shareB);

        const approach = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
        if (approach < 0) {
          const impulse = -(1 + BOUNCE) * approach;
          a.vx -= nx * impulse * shareA;
          a.vy -= ny * impulse * shareA;
          b.vx += nx * impulse * shareB;
          b.vy += ny * impulse * shareB;
        }
      }
    }

    // walls
    let moving = false;
    list.forEach((body, i) => {
      if (!visible[i]) return;
      if (body.dragging) {
        moving = true;
        return;
      }
      const { x, y } = offsets[i];
      const cx = body.baseX + x.get();
      const cy = body.baseY + y.get();

      if (cx - body.halfW < left) {
        x.set(x.get() + left - (cx - body.halfW));
        body.vx = Math.abs(body.vx) * BOUNCE;
      } else if (cx + body.halfW > right) {
        x.set(x.get() - (cx + body.halfW - right));
        body.vx = -Math.abs(body.vx) * BOUNCE;
      }
      if (cy - body.halfH < top) {
        y.set(y.get() + top - (cy - body.halfH));
        body.vy = Math.abs(body.vy) * BOUNCE;
      } else if (cy + body.halfH > bottom) {
        y.set(y.get() - (cy + body.halfH - bottom));
        body.vy = -Math.abs(body.vy) * BOUNCE;
      }

      if (Math.hypot(body.vx, body.vy) < REST_SPEED) {
        body.vx = 0;
        body.vy = 0;
      } else {
        moving = true;
      }
    });

    return moving;
  };

  const run = () => {
    cancelAnimationFrame(frame.current);
    measure();
    let last = performance.now();
    const tick = (now: number) => {
      // clamp the step so a backgrounded tab doesn't teleport stickers
      const dt = Math.min((now - last) / 1000, 1 / 30);
      last = now;
      frame.current = step(dt) ? requestAnimationFrame(tick) : 0;
    };
    frame.current = requestAnimationFrame(tick);
  };

  const bind = (i: number) => ({
    ref: (el: HTMLElement | null) => {
      elements.current[i] = el;
    },
    style: { x: offsets[i].x, y: offsets[i].y },
    onDragStart: () => {
      const body = bodies.current[i];
      body.dragging = true;
      body.vx = 0;
      body.vy = 0;
      run();
    },
    onDragEnd: () => {
      const body = bodies.current[i];
      const speed = Math.hypot(offsets[i].x.getVelocity(), offsets[i].y.getVelocity());
      const scale = speed > MAX_SPEED ? MAX_SPEED / speed : 1;
      body.dragging = false;
      body.vx = offsets[i].x.getVelocity() * scale;
      body.vy = offsets[i].y.getVelocity() * scale;
      run();
    },
  });

  return bind;
}
