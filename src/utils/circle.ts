import { Animated } from 'react-native';

import { interpolationWithFunction } from './animation';

export type PointOnCircle = {
  radius: number | Animated.Value;
  radians: number | Animated.Value;
};

/**
 * Converts the polar coordinates of a point on the circle
 * to cartesian coordinates.
 * @param index The point to be plotted.
 * @returns The cartesian coordinates for the top left point
 * of the component's placement.
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
