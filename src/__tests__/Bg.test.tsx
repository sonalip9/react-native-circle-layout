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
});
