import assert from "node:assert/strict";
import { test } from "node:test";
import { legCycle, rigTransforms, STRIDE_UNITS, type RigParams } from "./rig.ts";

const rest: RigParams = { facing: 1, phase: 0, amp: 1, sit: 0, bow: 0, peek: 0, tilt: 0, t: 0 };
const N = 720;
const samples = Array.from({ length: N }, (_, i) => legCycle(i / N));

test("the leg angle has no jumps over a full cycle, including the wrap-around", () => {
  for (let i = 0; i < N; i += 1) {
    const jump = Math.abs(samples[(i + 1) % N].angle - samples[i].angle);
    assert.ok(jump < 2.5, `jump of ${jump.toFixed(2)}° at ${i}/${N}`);
  }
});

test("a paw is only lifted while it swings forward, never while it pushes back", () => {
  for (let i = 0; i < N; i += 1) {
    const here = samples[i];
    const next = samples[(i + 1) % N];
    if (here.lift > 0.05) assert.ok(next.angle <= here.angle + 0.2, `lifted while moving back at ${i}`);
  }
});

test("on the ground the paw slides back at an even pace", () => {
  const ground = samples.filter((s) => s.lift === 0);
  const steps = ground.slice(1).map((s, i) => s.angle - ground[i].angle);
  const mean = steps.reduce((a, b) => a + b, 0) / steps.length;
  for (const step of steps) assert.ok(Math.abs(step - mean) < 0.05);
  assert.ok(mean > 0, "angle should increase (paw moving back) while on the ground");
});

test("diagonal legs move together and are half a cycle from the others", () => {
  const t = (phase: number) => rigTransforms({ ...rest, phase });
  const at = (s: string) => Number(/rotate\((-?[\d.]+)\)/.exec(s)![1]);
  for (const phase of [0.4, 1.7, 3.1, 5.2]) {
    const r = t(phase);
    assert.equal(at(r.fn), at(r.bf));
    assert.equal(at(r.ff), at(r.bn));
  }
});

test("standing still keeps every leg straight", () => {
  const r = rigTransforms({ ...rest, amp: 0, phase: 2 });
  for (const leg of ["fn", "ff", "bn", "bf"]) assert.match(r[leg], /rotate\(0\.00\)/);
});

test("stride length is in proportion to how far a paw sweeps on the ground", () => {
  // Ground a planted paw covers per cycle if the body kept pace with it exactly (leg ~53 units long).
  const ground = samples.filter((s) => s.lift === 0);
  const sweep =
    53 * (Math.sin((ground.at(-1)!.angle * Math.PI) / 180) - Math.sin((ground[0].angle * Math.PI) / 180));
  const exact = sweep / (ground.length / N);
  assert.ok(
    STRIDE_UNITS >= exact * 0.9 && STRIDE_UNITS <= exact * 3,
    `stride ${STRIDE_UNITS} vs exact ${exact.toFixed(0)}`,
  );
});
