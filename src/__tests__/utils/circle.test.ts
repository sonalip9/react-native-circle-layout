import { Animated } from 'react-native';

import { pointOnCircle, pointOnCircleAnimated } from '../../utils/circle';

const expectListenerValue = (
  animatedValue: Animated.Value | Animated.AnimatedInterpolation<number>,
  expectedValue: number
) => {
  animatedValue.addListener(({ value }) => {
    expect(value).toBeCloseTo(expectedValue);
  });
};

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
