import { Animated } from 'react-native';

import { interpolationWithFunction } from './animation';

/**
 * The props of the polar co-ordinate of a point on the circle.
 */
export type PointOnCircle = {
  /**
   * The radius of the circle.
   */
  radius: number;
  /**
   * The angle of the point on the circle.
   */
  radians: number;
};

/**
 * Computes the x co-ordinate of a point on a circle. x = r cos θ
 * @param props The property of the circle
 * @param props.radius The radius of the circle.
 * @param props.radians The angle of the point on the circle.
 * @returns The x co-ordinate of the point on the circle.
 */
function pointOnCircleX({ radius, radians }: PointOnCircle) {
  return radius * Math.cos(radians);
}

/**
 * Computes the y co-ordinate of a point on a circle. y = r sin θ
 * @param props The property of the circle
 * @param props.radius The radius of the circle.
 * @param props.radians The angle of the point on the circle.
 * @returns The y co-ordinate of the point on the circle.
 */
function pointOnCircleY({ radius, radians }: PointOnCircle) {
  return radius * Math.sin(radians);
}

/**
 * Converts the polar co-ordinates of a point on a circle to its Cartesian co-ordinate.
 * x = r cos θ, y = r sin θ
 * @param props The property of the circle
 * @param props.radius The radius of the circle.
 * @param props.radians The angle of the point on the circle.
 * @returns The Cartesian co-ordinates of the point of the circle.
 */
export function pointOnCircle({ radius, radians }: PointOnCircle) {
  return {
    x: pointOnCircleX({ radius, radians }),
    y: pointOnCircleY({ radius, radians }),
  };
}

/**
 * The props of the polar co-ordinate of a point on the circle.
 */
export type PointOnCircleAnimated = {
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
 * Converts the polar co-ordinates of a point on a circle to its Cartesian co-ordinate,
 * supporting `Animated.Value` for radius and/or radians.
 * x = r cos θ, y = r sin θ
 * @param props The property of the circle
 * @param props.radius The radius of the circle. Can be a number or an `Animated.Value`.
 * @param props.radians The angle of the point on the circle. Can be a number or an `Animated.Value`.
 * @returns The Cartesian co-ordinates of the point of the circle, interpolated when animated.
 * @throws {Error}  If neither `radius` nor `radians` is an `Animated.Value`. Use `pointOnCircle` for static values.
 */
export function pointOnCircleAnimated({
  radians,
  radius,
}: PointOnCircleAnimated) {
  if (typeof radians === 'number') {
    if (typeof radius === 'number') {
      throw new Error(
        'At least one of radius and radians needs to be an Animated.Value.' +
          ' Use pointOnCircle for static values.'
      );
    } else {
      return {
        x: interpolationWithFunction(radius, (r) =>
          pointOnCircleX({ radius: r, radians })
        ),
        y: interpolationWithFunction(radius, (r) =>
          pointOnCircleY({ radius: r, radians })
        ),
      };
    }
  } else {
    return {
      x: Animated.multiply(
        interpolationWithFunction(
          radians,
          (rad) => pointOnCircleX({ radius: 1, radians: rad }),
          { endValue: 2 * Math.PI }
        ),
        radius
      ),
      y: Animated.multiply(
        interpolationWithFunction(
          radians,
          (rad) => pointOnCircleY({ radius: 1, radians: rad }),
          { endValue: 2 * Math.PI }
        ),
        radius
      ),
    };
  }
}
