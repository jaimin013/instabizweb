import assert from "node:assert/strict";
import { test } from "node:test";
import {
  easeRig,
  laneWalkY,
  LANE_PEEK_FROM_BOTTOM,
  LANE_WALK_FROM_BOTTOM,
  shouldPrint,
  STILL,
  travelPace,
  treadmillPace,
  type Pace,
} from "./motion.ts";
import type { RigParams } from "./rig.ts";

const rig = (): RigParams => ({ facing: 1, phase: 0, amp: 0, sit: 0, bow: 0, peek: 0, tilt: 0, t: 0 });
const walking = (speed: number, step: number): Pace => ({
  walkSpeed: speed,
  stepPx: step,
  heading: 0,
  moved: step,
  facing: null,
});

test("travelPace reads speed, distance, heading and facing from a frame of movement", () => {
  const right = travelPace(3, 4, 16.7);
  assert.equal(right.stepPx, 5);
  assert.ok(Math.abs(right.walkSpeed - 5) < 1e-9, "at 60 fps, speed equals px per frame");
  assert.equal(right.facing, 1);
  assert.equal(travelPace(-6, 0, 16.7).facing, -1);
  assert.equal(travelPace(0.2, 9, 16.7).facing, null, "mostly vertical movement keeps his direction");
  assert.ok(Math.abs(travelPace(0, 5, 16.7).heading - Math.PI / 2) < 1e-9);
});

test("travelPace gives the same speed whatever the frame length", () => {
  const fast = travelPace(10, 0, 8.35); // a 120 Hz frame covering the same 10 px would be twice as quick…
  const slow = travelPace(10, 0, 16.7);
  assert.ok(Math.abs(fast.walkSpeed - slow.walkSpeed * 2) < 1e-9);
});

test("treadmillPace ignores tiny shifts and turns him with the direction of the slide", () => {
  assert.equal(treadmillPace(100.01, 100, 16.7).facing, null);
  assert.equal(treadmillPace(120, 100, 16.7).facing, 1);
  assert.equal(treadmillPace(80, 100, 16.7).facing, -1);
  assert.equal(treadmillPace(80, 100, 16.7).stepPx, 20);
});

test("easeRig walks him up to speed, advances the gait by distance, and settles when still", () => {
  const r = rig();
  for (let i = 0; i < 60; i += 1) easeRig(r, { pace: walking(14, 6), facing: 1, scale: 1, now: i * 16 }, 16);
  assert.ok(r.amp > 0.95, `amp ${r.amp}`);
  assert.ok(r.phase > 0);
  const phase = r.phase;
  easeRig(r, { pace: STILL, facing: 1, scale: 1, now: 2000 }, 16);
  assert.equal(r.phase, phase, "no distance, no stride");
  for (let i = 0; i < 80; i += 1) easeRig(r, { pace: STILL, facing: 1, scale: 1, now: 2000 + i * 16 }, 16);
  assert.ok(r.amp < 0.03);
});

test("the gait advances in proportion to ground covered and inversely to his on-screen size", () => {
  const a = rig();
  const b = rig();
  a.amp = b.amp = 1;
  easeRig(a, { pace: walking(10, 10), facing: 1, scale: 1, now: 0 }, 16);
  easeRig(b, { pace: walking(10, 10), facing: 1, scale: 2, now: 0 }, 16);
  assert.ok(Math.abs(a.phase - b.phase * 2) < 1e-9);
});

test("easeRig moves each pose channel towards its own goal only", () => {
  const r = rig();
  for (let i = 0; i < 200; i += 1)
    easeRig(r, { pose: "peek", pace: STILL, facing: -1, scale: 1, now: i * 16 }, 16);
  assert.ok(r.peek > 0.99 && r.sit < 0.01 && r.bow < 0.01);
  assert.ok(r.facing < -0.99, "he has turned to face left");
  for (let i = 0; i < 300; i += 1)
    easeRig(r, { pose: "sit", act: "tilt", pace: STILL, facing: 1, scale: 1, now: i * 16 }, 16);
  assert.ok(r.sit > 0.99 && r.peek < 0.01);
  assert.ok(Math.abs(r.tilt - 11) < 0.1, "he cocks his head while wondering");
});

test("a paw print is left only while walking across the page and not too often", () => {
  assert.equal(shouldPrint(true, 0.9, 50), true);
  assert.equal(shouldPrint(true, 0.9, 20), false, "too soon after the last one");
  assert.equal(shouldPrint(true, 0.2, 50), false, "barely moving");
  assert.equal(shouldPrint(false, 0.9, 50), false, "not travelling");
});

test("on a phone he rests on the bar's edge at both ends of a walk and walks higher between", () => {
  for (const vh of [667, 844]) {
    const peek = vh - LANE_PEEK_FROM_BOTTOM;
    const walk = vh - LANE_WALK_FROM_BOTTOM;
    assert.equal(laneWalkY(0, vh), peek);
    assert.equal(laneWalkY(1, vh), peek);
    assert.equal(laneWalkY(0.5, vh), walk);
    assert.ok(walk < peek, "walking height is above the resting height");
    for (let p = 0; p <= 1; p += 0.02) {
      const y = laneWalkY(p, vh);
      assert.ok(y >= walk - 1e-9 && y <= peek + 1e-9);
    }
  }
});
