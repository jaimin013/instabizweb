import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { actorAt, easeOutQuad, normalise, smoothstep, type Stop, type Transform } from "./timeline.ts";

/** A stop that rides the page: stays put in the document, so its viewport y falls as you scroll. */
function riding(id: string, arrive: number, depart: number, x: number, docY: number, s = 1): Stop {
  return { id, arrive, depart, holdAt: (scroll): Transform => ({ x, y: docY - scroll, s }) };
}

/** A pinned stop: fixed in the viewport for its whole range. */
function pinned(id: string, arrive: number, depart: number, x: number, y: number, s = 1): Stop {
  return { id, arrive, depart, holdAt: (): Transform => ({ x, y, s }) };
}

const hero = riding("hero", -Infinity, 400, 600, 640, 1.4);
const hall = pinned("hall", 1000, 4800, 244, 770, 0.84);
const stops = [hero, hall];

describe("actorAt", () => {
  it("holds the first stop until it departs", () => {
    for (const scroll of [0, 200, 400]) {
      const state = actorAt(stops, scroll);
      assert.equal(state?.kind, "hold");
      assert.equal(state?.stop.id, "hero");
    }
  });

  it("rides the page while holding a normal stop", () => {
    const at0 = actorAt(stops, 0)!.at;
    const at300 = actorAt(stops, 300)!.at;
    assert.equal(at0.y - at300.y, 300);
  });

  it("starts travelling exactly where he left and arrives exactly on the next stop", () => {
    const start = actorAt(stops, 401);
    assert.equal(start?.kind, "travel");
    const left = hero.holdAt(400);
    assert.ok(Math.abs(start!.at.x - left.x) < 1 && Math.abs(start!.at.y - left.y) < 2);

    const end = actorAt(stops, 999)!.at;
    const rest = hall.holdAt(1000);
    assert.ok(
      Math.abs(end.x - rest.x) < 1 && Math.abs(end.y - rest.y) < 1 && Math.abs(end.s - rest.s) < 0.01,
    );
  });

  it("holds the pinned stop for its whole range, then leaves", () => {
    for (const scroll of [1000, 2500, 4800]) {
      const state = actorAt(stops, scroll);
      assert.equal(state?.kind, "hold");
      if (state?.kind === "hold") assert.equal(state.stop.id, "hall");
    }
    const after = actorAt([hero, hall, riding("end", 5200, 9e9, 800, 5400)], 5000);
    assert.equal(after?.kind, "travel");
  });

  it("is a pure function of scroll, so scrolling back retraces the same path", () => {
    const forward = actorAt(stops, 700)!.at;
    actorAt(stops, 1200);
    const back = actorAt(stops, 700)!.at;
    assert.deepEqual(forward, back);
  });

  it("returns null with no stops", () => {
    assert.equal(actorAt([], 100), null);
  });
});

describe("normalise", () => {
  it("orders stops by arrival", () => {
    const ordered = normalise([riding("b", 900, 1000, 0, 0), riding("a", 100, 200, 0, 0)]);
    assert.deepEqual(
      ordered.map((s) => s.id),
      ["a", "b"],
    );
  });

  it("never lets a stop arrive before the previous one has left", () => {
    const [, second] = normalise([riding("a", 0, 500, 0, 0), riding("b", 300, 400, 0, 0)]);
    assert.ok(second.arrive > 500);
    assert.ok(second.depart > second.arrive);
  });
});

describe("easing, fitted to the reference site", () => {
  // x positions measured on the reference between hero and hall, as a fraction of the way there,
  // against how far through the trip the scroll was (p).
  const measured: Array<[p: number, xFraction: number]> = [
    [0.16, 0.1],
    [0.32, 0.225],
    [0.48, 0.45],
    [0.64, 0.72],
    [0.81, 0.93],
  ];

  it("smoothstep tracks the measured horizontal motion", () => {
    for (const [p, expected] of measured) {
      assert.ok(Math.abs(smoothstep(p) - expected) < 0.05, `p=${p}: ${smoothstep(p)} vs ${expected}`);
    }
  });

  it("both curves run from 0 to 1 and only ever increase", () => {
    for (const ease of [smoothstep, easeOutQuad]) {
      assert.equal(ease(0), 0);
      assert.equal(ease(1), 1);
      let last = -1;
      for (let i = 0; i <= 20; i++) {
        const v = ease(i / 20);
        assert.ok(v >= last);
        last = v;
      }
    }
  });
});
