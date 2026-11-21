/**
 * A tiny pub/sub so Teddy (pup-layer) can leave paw prints on the canvas owned
 * by <PawTrail>, without the two knowing about each other.
 *
 * `docY` is a position in the *document*, not the viewport: Teddy's prints stay
 * where he stepped and scroll away with the page, while mouse prints use
 * viewport coordinates and simply fade.
 */

export type Footprint = {
  x: number;
  /** Viewport y for mouse prints, document y for Teddy's. */
  y: number;
  angle: number;
  /** True when `y` is a document coordinate. */
  doc: boolean;
};

type Listener = (print: Footprint) => void;

const listeners = new Set<Listener>();

export function emitFootprint(print: Footprint) {
  listeners.forEach((listener) => listener(print));
}

export function onFootprint(listener: Listener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
