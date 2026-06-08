import { Animated } from 'react-native';

import { interpolationWithFunction } from './animation';

type Point = {
  x: number;
  y: number;
};

type PointAnimated = {
  x: Animated.AnimatedInterpolation<number>;
  y: Animated.AnimatedInterpolation<number>;
};

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
function pointOnCircleX({ radius, radians }: PointOnCircle): number {
  return radius * Math.cos(radians);
}

/**
 * Computes the y co-ordinate of a point on a circle. y = r sin θ
 * @param props The property of the circle
 * @param props.radius The radius of the circle.
 * @param props.radians The angle of the point on the circle.
 * @returns The y co-ordinate of the point on the circle.
 */
function pointOnCircleY({ radius, radians }: PointOnCircle): number {
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
export function pointOnCircle({ radius, radians }: PointOnCircle): Point {
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
}: PointOnCircleAnimated): PointAnimated {
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

/**
 * The properties for creating an SVG path of a circle.
 */
type CirclePathProps = {
  radius: number;
  startAngle: number;
  endAngle: number;
  isClockwise?: boolean;
  center?: Point;
};

/**
 * Creates an SVG path for a sector of a circle based on the provided properties.
 * The path is created using the format:
 * M cx cy L startPoint.x startPoint.y A radius radius 0 largeArcFlag sweepFlag endPoint.x endPoint.y Z
 * @param props The properties of the sector.
 * @param props.radius The radius of the sector.
 * @param props.startAngle The angle at which the sector starts. The value needs to be in radians.
 * @param props.endAngle The angle at which the sector ends. The value needs to be in radians.
 * @param props.isClockwise Whether the sector is drawn in a clockwise direction or not. The default value is true.
 * @param props.center The center point of the circle on which the sector is drawn. The default value is { x: 0, y: 0 }.
 * @param props.center.x The x-coordinate of the center point.
 * @param props.center.y The y-coordinate of the center point.
 * @returns The SVG path for the sector.
 */
export function getSectorPath({
  radius,
  startAngle,
  endAngle,
  isClockwise = true,
  center: { x: cx, y: cy } = { x: 0, y: 0 },
}: CirclePathProps): string {
  const { startPoint, arc } = getArc({
    radius,
    startAngle,
    endAngle,
    isClockwise,
    center: { x: cx, y: cy },
  });

  return [
    'M',
    cx,
    cy,
    'L',
    -startPoint.x + cx,
    -startPoint.y + cy,
    'A',
    ...arc,
  ].join(' ');
}

/**
 * Creates an SVG path for an arc of a circle based on the provided properties.
 * The path is created using the format:
 * M startPoint.x startPoint.y A radius radius 0 largeArcFlag sweepFlag endPoint.x endPoint.y
 * @param params The properties for creating the SVG path of an arc.
 * @param params.radius The radius of the arc.
 * @param params.startAngle The angle at which the arc starts, in radians.
 * @param params.endAngle The angle at which the arc ends, in radians.
 * @param params.isClockwise Whether the arc is drawn in a clockwise direction
 * or not. The default value is true.
 * @param params.center The center point of the circle on which the arc is drawn.
 * The default value is { x: 0, y: 0 }.
 * @param params.center.x The x-coordinate of the center point.
 * @param params.center.y The y-coordinate of the center point.
 * @returns The SVG path for the arc.
 */
export function getArcPath({
  radius,
  startAngle,
  endAngle,
  isClockwise = true,
  center: { x: cx, y: cy } = { x: 0, y: 0 },
}: CirclePathProps): string {
  const { startPoint, arc } = getArc({
    radius,
    startAngle,
    endAngle,
    isClockwise,
    center: { x: cx, y: cy },
  });

  return ['M', -startPoint.x + cx, -startPoint.y + cy, 'A', ...arc].join(' ');
}

/**
 * Creates the parameters for an SVG arc based on the provided properties.
 * The parameters are created in the format:
 * [
 *     radius for x-axis,
 *     radius for y-axis,
 *     rotation,
 *     largeArcFlag,
 *     sweepFlag,
 *     x coordinate of the end point,
 *     y coordinate of the end point
 * ]
 * @param params The properties for creating an SVG arc.
 * @param params.radius The radius of the arc.
 * @param params.startAngle The angle at which the arc starts, in radians.
 * @param params.endAngle The angle at which the arc ends, in radians.
 * @param params.isClockwise Whether the arc is drawn in a clockwise direction
 * or not. The default value is true.
 * @param params.center The center point of the circle on which the arc is drawn.
 * The default value is { x: 0, y: 0 }.
 * @param params.center.x The x-coordinate of the center point.
 * @param params.center.y The y-coordinate of the center point.
 * @returns An object containing the start point and the arc parameters for the SVG path.
 */
function getArc({
  radius,
  startAngle,
  endAngle,
  isClockwise = true,
  center: { x: cx, y: cy } = { x: 0, y: 0 },
}: CirclePathProps): { startPoint: Point; arc: number[] } {
  const startPoint = pointOnCircle({ radius, radians: startAngle });
  const endPoint = pointOnCircle({ radius, radians: endAngle });

  return {
    startPoint,
    arc: [
      radius,
      radius,
      0,
      endAngle - startAngle >= Math.PI ? 1 : 0,
      isClockwise ? 1 : 0,
      -endPoint.x + cx,
      -endPoint.y + cy,
    ],
  };
}
