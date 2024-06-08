import { Animated } from 'react-native';

import { pointOnCircle } from '../utils/circle';

const expectListenerValue = (
  animatedValue: Animated.Value | Animated.AnimatedInterpolation<number>,
  expectedValue: number
) => {
  animatedValue.addListener(({ value }) => {
    expect(value).toBeCloseTo(expectedValue);
  });
};

describe('pointOnCircle', () => {
  it('should return the correct coordinates on the circle when only radius is provided', () => {
    const result = pointOnCircle({ radius: 5, radians: 0 });

    expect(result.x).toBeCloseTo(5);
    expect(result.y).toBeCloseTo(0);
  });

  it('should return the correct coordinates on the circle when only radians is provided', () => {
    const result = pointOnCircle({ radius: 1, radians: Math.PI / 2 });

    expect(result.x).toBeCloseTo(0);
    expect(result.y).toBeCloseTo(1);
  });

  it('should return the correct coordinates on the circle when both radius and radians are provided', () => {
    const result = pointOnCircle({ radius: 3, radians: Math.PI });

    expect(result.x).toBeCloseTo(-3);
    expect(result.y).toBeCloseTo(0);
  });

  it('should return the correct coordinates on the circle when radius is animated', () => {
    const result = pointOnCircle({
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

  it('should return the correct coordinates on the circle when radians is animated', () => {
    const result = pointOnCircle({
      radius: 4,
      radians: new Animated.Value(Math.PI / 3),
    });

    expectListenerValue(result.x as Animated.AnimatedInterpolation<number>, 2);
    expectListenerValue(
      result.y as Animated.AnimatedInterpolation<number>,
      3.464
    );
  });

  it('should return the correct coordinates on the circle when both radius and radians are animated', () => {
    const result = pointOnCircle({
      radius: new Animated.Value(2),
      radians: new Animated.Value(Math.PI / 6),
    });

    expectListenerValue(result.x as Animated.AnimatedInterpolation<number>, 1);
    expectListenerValue(
      result.y as Animated.AnimatedInterpolation<number>,
      1.732
    );
  });
});
