/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable no-underscore-dangle */
import { Animated } from 'react-native';

import { pointOnCircle } from '../utils/circle';

// TODO update the test with Animated.Value response using testing library

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

    expect((result.x as any).__getValue()).toBeCloseTo(1.414);
    expect((result.y as any).__getValue()).toBeCloseTo(1.414);
  });

  it('should return the correct coordinates on the circle when radians is animated', () => {
    const result = pointOnCircle({
      radius: 4,
      radians: new Animated.Value(Math.PI / 3),
    });

    expect((result.x as any).__getValue()).toBeCloseTo(2);
    expect((result.y as any).__getValue()).toBeCloseTo(3.457);
  });

  it('should return the correct coordinates on the circle when both radius and radians are animated', () => {
    const result = pointOnCircle({
      radius: new Animated.Value(2),
      radians: new Animated.Value(Math.PI / 6),
    });

    expect((result.x as any).__getValue()).toBeCloseTo(1.73);
    expect((result.y as any).__getValue()).toBeCloseTo(0.999);
  });
});
