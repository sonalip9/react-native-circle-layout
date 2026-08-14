import { Path } from 'react-native-svg';
import { render } from '@testing-library/react-native';

import { rnAnimatedDriver } from '../animation/rnAnimatedDriver';
import { Bg } from '../Bg';
import { CircleLayoutContext } from '../CircleLayoutContext';
import type { CircleLayoutContextType } from '../types';

const baseContext: CircleLayoutContextType = {
  totalParts: 4,
  radius: 100,
  startAngle: 0,
  sectorAngles: Array(4).fill(Math.PI / 2),
  componentAngles: [0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2],
  animationDriver: rnAnimatedDriver,
};

const renderBg = (ctx: CircleLayoutContextType, index: number) => {
  const { UNSAFE_getByType } = render(
    <CircleLayoutContext value={ctx}>
      <Bg
        index={index}
        radius={100}
        outerRadius={100}
        minComponentLayout={{ width: 0, height: 0 }}
        centerComponentLayout={{ width: 0, height: 0 }}
        color="red"
      />
    </CircleLayoutContext>
  );
  return (UNSAFE_getByType(Path).props.d as string)
    .match(/-?[\d.]+/g)!
    .map(Number);
};

// Path tokens: M cx cy L sx sy A rx ry rot largeArc sweep ex ey Z
const localAngleDeg = (nums: number[], point: 'start' | 'end'): number => {
  const [cx, cy, sx, sy, , , , , , ex, ey] = nums;
  const [px, py] = point === 'start' ? [sx!, sy!] : [ex!, ey!];
  return ((Math.atan2(py - cy!, px - cx!) * 180) / Math.PI + 360) % 360;
};

describe('Bg', () => {
  it('draws the sector arc at outerRadius, not at the padded canvas size', () => {
    // minComponentLayout/centerComponentLayout differ, as they do once real
    // marker/center components have been measured, so the SVG canvas (size)
    // ends up padded larger than the configured outerRadius.
    const { UNSAFE_getByType } = render(
      <CircleLayoutContext value={baseContext}>
        <Bg
          index={0}
          radius={100}
          outerRadius={100}
          minComponentLayout={{ width: 37, height: 48 }}
          centerComponentLayout={{ width: 25, height: 25 }}
          color="red"
        />
      </CircleLayoutContext>
    );

    const path = UNSAFE_getByType(Path).props.d as string;
    const tokens = path.split(' ');
    const arcRadius = Number(tokens[7]);

    expect(arcRadius).toBeCloseTo(100);
  });

  it('falls back to radius when outerRadius is not provided', () => {
    const { UNSAFE_getByType } = render(
      <CircleLayoutContext value={baseContext}>
        <Bg
          index={0}
          radius={80}
          minComponentLayout={{ width: 37, height: 48 }}
          centerComponentLayout={{ width: 25, height: 25 }}
          color="red"
        />
      </CircleLayoutContext>
    );

    const path = UNSAFE_getByType(Path).props.d as string;
    const arcRadius = Number(path.split(' ')[7]);

    expect(arcRadius).toBeCloseTo(80);
  });

  describe('wedge boundaries', () => {
    it('keeps wedges gapless around the wrap for unequal weights on a complete circle', () => {
      const ctx: CircleLayoutContextType = {
        ...baseContext,
        totalParts: 3,
        sectorAngles: [Math.PI, Math.PI / 2, Math.PI / 2],
        componentAngles: [0, Math.PI, (3 * Math.PI) / 2],
      };

      const first = renderBg(ctx, 0);
      const last = renderBg(ctx, 2);

      // The last wedge's end point must land exactly on the first wedge's
      // start point for the ring to be gapless/overlap-free at the wrap.
      const [, , firstStartX, firstStartY] = first;
      const [, , , , , , , , , lastEndX, lastEndY] = last;
      expect(lastEndX).toBeCloseTo(firstStartX!);
      expect(lastEndY).toBeCloseTo(firstStartY!);
    });

    it('does not wrap the first/last wedge of a partial arc across the sweep boundary', () => {
      // 3 markers over a half-sweep: totalParts (2) !== sectorAngles.length
      // (3) marks this as a partial arc, same as CircleLayoutProvider
      // produces for sweepAngle < 2π.
      const ctx: CircleLayoutContextType = {
        ...baseContext,
        totalParts: 2,
        sectorAngles: Array(3).fill(Math.PI / 2),
        componentAngles: [0, Math.PI / 2, Math.PI],
      };

      const first = renderBg(ctx, 0);
      const last = renderBg(ctx, 2);

      // First wedge's start must sit at its own (un-centered) marker angle
      // (0 rad -> 180 deg once rendered), not wrapped backward using the
      // trailing sector's width.
      expect(localAngleDeg(first, 'start')).toBeCloseTo(180, 1);
      // Last wedge's end must reach the full sweep width forward
      // (angle[2] + sectorAngles[2] = 3π/2 rad -> 90 deg once rendered),
      // not stop halfway as it would if centered on a nonexistent neighbor.
      expect(localAngleDeg(last, 'end')).toBeCloseTo(90, 1);
    });
  });
});
