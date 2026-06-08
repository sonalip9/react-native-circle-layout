import { Animated } from 'react-native';

import {
  getArcPath,
  getSectorPath,
  pointOnCircle,
  pointOnCircleAnimated,
} from '../../utils/circle';

const expectListenerValue = (
  animatedValue: Animated.Value | Animated.AnimatedInterpolation<number>,
  expectedValue: number
) => {
  animatedValue.addListener(({ value }) => {
    expect(value).toBeCloseTo(expectedValue);
  });
};

/**
 * Splits an SVG path string into tokens, parsing numeric tokens to numbers.
 * @param path The SVG path string to parse.
 * @returns An array of path tokens, where numeric tokens are converted to numbers.
 * This allows for easier assertions on the structure and values of the path in tests.
 */
const parsePathTokens = (path: string): (string | number)[] =>
  path.split(' ').map((token) => {
    const num = Number(token);
    return Number.isNaN(num) ? token : num;
  });

describe('pointOnCircle', () => {
  it('returns (radius, 0) when radians is 0', () => {
    const result = pointOnCircle({ radius: 5, radians: 0 });

    expect(result.x).toBeCloseTo(5);
    expect(result.y).toBeCloseTo(0);
  });

  it('returns (0, radius) when radians is π/2', () => {
    const result = pointOnCircle({ radius: 1, radians: Math.PI / 2 });

    expect(result.x).toBeCloseTo(0);
    expect(result.y).toBeCloseTo(1);
  });

  it('returns (-radius, 0) when radians is π', () => {
    const result = pointOnCircle({ radius: 3, radians: Math.PI });

    expect(result.x).toBeCloseTo(-3);
    expect(result.y).toBeCloseTo(0);
  });

  describe('edge cases', () => {
    it('returns (radius, 0) when radians is exactly 2π (full rotation)', () => {
      const result = pointOnCircle({ radius: 5, radians: 2 * Math.PI });
      expect(result.x).toBeCloseTo(5);
      expect(result.y).toBeCloseTo(0);
    });

    it('returns same result as π when radians is 3π (trig wraps > 2π naturally)', () => {
      const full = pointOnCircle({ radius: 3, radians: 3 * Math.PI });
      const wrapped = pointOnCircle({ radius: 3, radians: Math.PI });
      expect(full.x).toBeCloseTo(wrapped.x as number);
      expect(full.y).toBeCloseTo(wrapped.y as number);
    });

    it('returns (0, −radius) when radians is negative (−π/2)', () => {
      const result = pointOnCircle({ radius: 1, radians: -Math.PI / 2 });
      expect(result.x).toBeCloseTo(0);
      expect(result.y).toBeCloseTo(-1);
    });

    it('returns (0, 0) for any angle when radius is 0', () => {
      const result = pointOnCircle({ radius: 0, radians: Math.PI / 3 });
      expect(result.x).toBeCloseTo(0);
      expect(result.y).toBeCloseTo(0);
    });

    it('handles fractional radius', () => {
      const result = pointOnCircle({ radius: 0.5, radians: 0 });
      expect(result.x).toBeCloseTo(0.5);
      expect(result.y).toBeCloseTo(0);
    });

    it('handles negative radius — flips coordinate sign', () => {
      const result = pointOnCircle({ radius: -3, radians: 0 });
      expect(result.x).toBeCloseTo(-3);
      expect(result.y).toBeCloseTo(0);
    });
  });
});

describe('pointOnCircleAnimated', () => {
  it('interpolates x and y when radius is Animated.Value', () => {
    const result = pointOnCircleAnimated({
      radius: new Animated.Value(2),
      radians: Math.PI / 4,
    });

    expectListenerValue(
      result.x as Animated.AnimatedInterpolation<number>,
      1.414
    );
    expectListenerValue(
      result.y as Animated.AnimatedInterpolation<number>,
      1.414
    );
  });

  it('interpolates x and y when radians is Animated.Value', () => {
    const result = pointOnCircleAnimated({
      radius: 4,
      radians: new Animated.Value(Math.PI / 3),
    });

    expectListenerValue(result.x as Animated.AnimatedInterpolation<number>, 2);
    expectListenerValue(
      result.y as Animated.AnimatedInterpolation<number>,
      3.464
    );
  });

  it('interpolates x and y when both radius and radians are Animated.Value', () => {
    const result = pointOnCircleAnimated({
      radius: new Animated.Value(2),
      radians: new Animated.Value(Math.PI / 6),
    });

    expectListenerValue(result.x as Animated.AnimatedInterpolation<number>, 1);
    expectListenerValue(
      result.y as Animated.AnimatedInterpolation<number>,
      1.732
    );
  });

  describe('edge cases', () => {
    it('does not throw when Animated.Value radians exceeds 2π (extrapolates)', () => {
      expect(() =>
        pointOnCircleAnimated({
          radius: 1,
          radians: new Animated.Value(3 * Math.PI),
        })
      ).not.toThrow();
    });

    it('does not throw when Animated.Value radians is negative (extrapolates)', () => {
      expect(() =>
        pointOnCircleAnimated({
          radius: 1,
          radians: new Animated.Value(-Math.PI / 2),
        })
      ).not.toThrow();
    });

    it('does not throw when Animated.Value radius is 0', () => {
      expect(() =>
        pointOnCircleAnimated({
          radius: new Animated.Value(0),
          radians: Math.PI / 4,
        })
      ).not.toThrow();
    });
  });
});

describe('getSectorPath', () => {
  it('builds a clockwise quarter-circle sector path from 0 to π/2', () => {
    const tokens = parsePathTokens(
      getSectorPath({ radius: 1, startAngle: 0, endAngle: Math.PI / 2 })
    );

    expect(tokens[0]).toBe('M');
    expect(tokens[1]).toBeCloseTo(0); // cx
    expect(tokens[2]).toBeCloseTo(0); // cy
    expect(tokens[3]).toBe('L');
    expect(tokens[4]).toBeCloseTo(-1); // startPoint.x
    expect(tokens[5]).toBeCloseTo(0); // startPoint.y
    expect(tokens[6]).toBe('A');
    expect(tokens[7]).toBe(1); // rx
    expect(tokens[8]).toBe(1); // ry
    expect(tokens[9]).toBe(0); // x-axis-rotation
    expect(tokens[10]).toBe(0); // large-arc-flag (sweep < π)
    expect(tokens[11]).toBe(1); // sweep-flag (clockwise)
    expect(tokens[12]).toBeCloseTo(0); // -endPoint.x + cx
    expect(tokens[13]).toBeCloseTo(-1); // -endPoint.y + cy
  });

  it('sets sweep-flag to 0 when isClockwise is false', () => {
    const tokens = parsePathTokens(
      getSectorPath({
        radius: 1,
        startAngle: 0,
        endAngle: Math.PI / 2,
        isClockwise: false,
      })
    );

    expect(tokens[11]).toBe(0);
  });

  it('sets large-arc-flag to 1 when the angular sweep is >= π', () => {
    const tokens = parsePathTokens(
      getSectorPath({ radius: 1, startAngle: 0, endAngle: Math.PI })
    );

    expect(tokens[10]).toBe(1);
  });

  it('sets large-arc-flag to 0 when the angular sweep is < π', () => {
    const tokens = parsePathTokens(
      getSectorPath({ radius: 1, startAngle: 0, endAngle: Math.PI / 4 })
    );

    expect(tokens[10]).toBe(0);
  });

  it('offsets the path by the given center', () => {
    const tokens = parsePathTokens(
      getSectorPath({
        radius: 2,
        startAngle: 0,
        endAngle: Math.PI / 2,
        center: { x: 5, y: -3 },
      })
    );

    expect(tokens[1]).toBeCloseTo(5); // cx
    expect(tokens[2]).toBeCloseTo(-3); // cy
    expect(tokens[4]).toBeCloseTo(-2 + 5); // startPoint.x (offset by center)
    expect(tokens[5]).toBeCloseTo(0 + -3); // startPoint.y (offset by center)
    expect(tokens[12]).toBeCloseTo(-0 + 5); // -endPoint.x + cx
    expect(tokens[13]).toBeCloseTo(-2 + -3); // -endPoint.y + cy
  });
});

describe('getArcPath', () => {
  it('builds a clockwise quarter-circle arc path from 0 to π/2', () => {
    const tokens = parsePathTokens(
      getArcPath({ radius: 1, startAngle: 0, endAngle: Math.PI / 2 })
    );

    expect(tokens[0]).toBe('M');
    expect(tokens[1]).toBeCloseTo(-1); // -startPoint.x + cx
    expect(tokens[2]).toBeCloseTo(0); // -startPoint.y + cy
    expect(tokens[3]).toBe('A');
    expect(tokens[4]).toBe(1); // rx
    expect(tokens[5]).toBe(1); // ry
    expect(tokens[6]).toBe(0); // x-axis-rotation
    expect(tokens[7]).toBe(0); // large-arc-flag (sweep < π)
    expect(tokens[8]).toBe(1); // sweep-flag (clockwise)
    expect(tokens[9]).toBeCloseTo(0); // -endPoint.x + cx
    expect(tokens[10]).toBeCloseTo(-1); // -endPoint.y + cy
  });

  it('sets sweep-flag to 0 when isClockwise is false', () => {
    const tokens = parsePathTokens(
      getArcPath({
        radius: 1,
        startAngle: 0,
        endAngle: Math.PI / 2,
        isClockwise: false,
      })
    );

    expect(tokens[8]).toBe(0);
  });

  it('sets large-arc-flag to 1 when the angular sweep is >= π', () => {
    const tokens = parsePathTokens(
      getArcPath({ radius: 1, startAngle: 0, endAngle: Math.PI })
    );

    expect(tokens[7]).toBe(1);
  });

  it('sets large-arc-flag to 0 when the angular sweep is < π', () => {
    const tokens = parsePathTokens(
      getArcPath({ radius: 1, startAngle: 0, endAngle: Math.PI / 4 })
    );

    expect(tokens[7]).toBe(0);
  });

  it('offsets the path by the given center', () => {
    const tokens = parsePathTokens(
      getArcPath({
        radius: 2,
        startAngle: 0,
        endAngle: Math.PI / 2,
        center: { x: 5, y: -3 },
      })
    );

    expect(tokens[1]).toBeCloseTo(-2 + 5); // -startPoint.x + cx
    expect(tokens[2]).toBeCloseTo(-0 + -3); // -startPoint.y + cy
    expect(tokens[9]).toBeCloseTo(-0 + 5); // -endPoint.x + cx
    expect(tokens[10]).toBeCloseTo(-2 + -3); // -endPoint.y + cy
  });
});
