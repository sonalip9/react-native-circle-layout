import { Animated } from 'react-native';

import { interpolationWithFunction } from './animation';

/**
 * The props of the polar co-ordinate of a point on the circle.
 */
export type PointOnCircle = {
  /**
   * The radius of the circle.
   */
  radius: number | Animated.Value;
  /**
   * The angle of the point on the circle.
   */
  radians: number | Animated.Value;
};

/**
 * Converts the polar co-ordinates of a point on a circle to its Cartesian co-ordinate.
 * x = r cos θ, y = r sin θ
 * @param props The property of the circle
 * @returns The Cartesian co-ordinates of the point of the circle.
 */
export const pointOnCircle = ({ radius, radians }: PointOnCircle) => {
  if (typeof radius !== 'number') {
    if (typeof radians === 'number') {
      return {
        x: interpolationWithFunction(radius, (r) => Math.cos(radians) * r),
        y: interpolationWithFunction(radius, (r) => Math.sin(radians) * r),
      };
    }

    return {
      x: Animated.multiply(
        radius,
        interpolationWithFunction(radians, (r) => Math.cos(r), {
          endValue: 2 * Math.PI,
        })
      ),
      y: Animated.multiply(
        radius,
        interpolationWithFunction(radians, (r) => Math.sin(r), {
          endValue: 2 * Math.PI,
        })
      ),
    };
  }

  if (typeof radians !== 'number') {
    return {
      x: interpolationWithFunction(radians, (r) => Math.cos(r) * radius, {
        endValue: 2 * Math.PI,
      }),
      y: interpolationWithFunction(radians, (r) => Math.sin(r) * radius, {
        endValue: 2 * Math.PI,
      }),
    };
  }

  return {
    x: Math.cos(radians) * radius,
    y: Math.sin(radians) * radius,
  };
};
