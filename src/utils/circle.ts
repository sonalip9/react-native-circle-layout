import type { AnimatedNode, AnimationDriver } from '../animation/types';
import type { Layout } from '../types';

type Point = {
  x: number;
  y: number;
};

type PointAnimated<D extends AnimationDriver> = {
  x: AnimatedNode<D>;
  y: AnimatedNode<D>;
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
export function pointOnCircleX({ radius, radians }: PointOnCircle): number {
  return radius * Math.cos(radians);
}

/**
 * Computes the y co-ordinate of a point on a circle. y = r sin θ
 * @param props The property of the circle
 * @param props.radius The radius of the circle.
 * @param props.radians The angle of the point on the circle.
 * @returns The y co-ordinate of the point on the circle.
 */
export function pointOnCircleY({ radius, radians }: PointOnCircle): number {
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
export type PointOnCircleAnimated<D extends AnimationDriver> = {
  /**
   * The driver used to power the animated interpolations.
   */
  driver: D;
  /**
   * The radius of the circle.
   */
  radius: number | AnimatedNode<D>;
  /**
   * The angle of the point on the circle.
   */
  radians: number | AnimatedNode<D>;
};

/**
 * Converts the polar co-ordinates of a point on a circle to its Cartesian co-ordinate,
 * supporting animated nodes (produced by the given driver) for radius and/or radians.
 * x = r cos θ, y = r sin θ
 * @param props The property of the circle
 * @param props.driver The driver used to power the animated interpolations.
 * @param props.radius The radius of the circle. Can be a number or an animated node.
 * @param props.radians The angle of the point on the circle. Can be a number or an animated node.
 * @returns The Cartesian co-ordinates of the point of the circle, interpolated when animated.
 * @throws {Error}  If neither `radius` nor `radians` is an animated node. Use `pointOnCircle` for static values.
 */
export function pointOnCircleAnimated<D extends AnimationDriver>({
  driver,
  radians,
  radius,
}: PointOnCircleAnimated<D>): PointAnimated<D> {
  if (typeof radians === 'number') {
    if (typeof radius === 'number') {
      throw new Error(
        'At least one of radius and radians needs to be an animated node.' +
          ' Use pointOnCircle for static values.'
      );
    } else {
      return {
        x: driver.interpolate(radius, (r) =>
          pointOnCircleX({ radius: r, radians })
        ) as AnimatedNode<D>,
        y: driver.interpolate(radius, (r) =>
          pointOnCircleY({ radius: r, radians })
        ) as AnimatedNode<D>,
      };
    }
  } else {
    return {
      x: driver.multiply(
        driver.interpolate(
          radians,
          (rad) => pointOnCircleX({ radius: 1, radians: rad }),
          { endValue: 2 * Math.PI }
        ),
        radius
      ) as AnimatedNode<D>,
      y: driver.multiply(
        driver.interpolate(
          radians,
          (rad) => pointOnCircleY({ radius: 1, radians: rad }),
          { endValue: 2 * Math.PI }
        ),
        radius
      ) as AnimatedNode<D>,
    };
  }
}

/**
 * The result of dividing a circle (or arc) into equally-spaced sectors.
 */
export type SectorAngles = {
  /**
   * Whether the sweep angle is a full circle (as opposed to a partial arc).
   */
  isCompleteCircle: boolean;
  /**
   * The number of angular divisions used for spacing. `count` for full
   * circles, `count - 1` for partial arcs — see ADR-0002.
   */
  totalParts: number;
  /**
   * The angle, in radians, between two consecutive components.
   */
  sectorAngle: number;
};

/**
 * Computes the totalParts invariant (ADR-0002) and the resulting per-step
 * sector angle for `count` components evenly spaced across `sweepAngle`.
 * `sweepAngle` is expected to already be normalized (e.g. via `validateProps`
 * or a caller-side equivalent) — this function does not normalize it.
 * @param count The number of components to space around the circle.
 * @param sweepAngle The normalized sweep angle, in radians, the components span.
 * @returns The totalParts invariant and the resulting sector angle.
 */
export function computeSectorAngles(
  count: number,
  sweepAngle: number
): SectorAngles {
  const isCompleteCircle = Math.abs(sweepAngle - 2 * Math.PI) < 0.001;
  const totalParts = isCompleteCircle ? count : count - 1;
  const sectorAngle = totalParts > 0 ? sweepAngle / totalParts : 0;
  return { isCompleteCircle, totalParts, sectorAngle };
}

/**
 * The inputs needed to resolve one background sector's angular span and its
 * containing SVG canvas size/center, for a component placed at `index` in a
 * circle layout.
 */
export type BgGeometryInput = {
  /**
   * The index of the component this sector's background belongs to.
   */
  index: number;
  /**
   * The absolute angle (in radians) at which each component is placed.
   * @see CircleLayoutContextType.componentAngles
   */
  componentAngles: number[];
  /**
   * The angular span (in radians) from each component's placement angle to
   * the next.
   * @see CircleLayoutContextType.sectorAngles
   */
  sectorAngles: number[];
  /**
   * The totalParts invariant (ADR-0002): equal to `sectorAngles.length` for a
   * complete circle, one less for a partial arc.
   * @default sectorAngles.length (i.e. a complete circle)
   * @see CircleLayoutContextType.totalParts
   */
  totalParts?: number;
  /**
   * The radius of the circle on which the components are placed.
   */
  radius: number;
  /**
   * The outer radius of the background sector, if overridden.
   * @default radius
   */
  outerRadius?: number;
  /**
   * The largest layout of any component in the circle, used to ensure the
   * background's SVG canvas is large enough to not clip the components.
   */
  minComponentLayout: Layout;
  /**
   * The layout of the center component, subtracted from the canvas size
   * since the center component overlaps the middle of the background.
   */
  centerComponentLayout: Layout;
};

/**
 * A background sector's resolved angular span and its containing SVG
 * canvas geometry.
 */
export type BgGeometry = {
  /**
   * The angle at which this sector starts, in radians.
   */
  startAngleInRadians: number;
  /**
   * The angle at which this sector ends, in radians.
   */
  endAngleInRadians: number;
  /**
   * The width/height of the (square) SVG canvas the sector is drawn on.
   */
  size: number;
  /**
   * The center point of the SVG canvas, in canvas-local coordinates.
   */
  center: Point;
};

/**
 * Resolves the angular span of one component's background sector, and the
 * size/center of the SVG canvas it needs to be drawn on without clipping
 * the components. Pulled out of `Bg` so this geometry can be tested
 * directly, without standing up a full `CircleLayoutContext` provider.
 *
 * The wedge is centered on its own marker (`componentAngles[index]`): its
 * boundary with each neighbor sits at the angular midpoint between the two
 * markers, so wedges stay gapless/overlap-free even when neighboring
 * sectors have different weights (including the wrap from the last index
 * back to index 0), and reduce to exact centering when neighboring sectors
 * are equal size.
 *
 * The first/last markers of a partial arc (sweepAngle < 2π) have no real
 * neighbor on their outer side — wrapping around would borrow the opposite
 * sector's width and either extend past the sweep or leave its true edge
 * uncovered, so those boundaries fall back to the un-centered marker angle
 * instead.
 * @param props The inputs needed to resolve the sector's geometry.
 * @param props.index The index of the component this sector's background belongs to.
 * @param props.componentAngles The absolute angle (in radians) at which each component is placed.
 * @param props.sectorAngles The angular span (in radians) from each component's placement angle to the next.
 * @param props.totalParts The totalParts invariant (ADR-0002).
 * @param props.radius The radius of the circle on which the components are placed.
 * @param props.outerRadius The outer radius of the background sector, if overridden. Defaults to radius.
 * @param props.minComponentLayout The largest layout of any component in the circle.
 * @param props.centerComponentLayout The layout of the center component.
 * @returns The resolved angular span and canvas size/center.
 */
export function resolveBgGeometry({
  index,
  componentAngles,
  sectorAngles,
  totalParts = sectorAngles.length,
  radius,
  outerRadius,
  minComponentLayout,
  centerComponentLayout,
}: BgGeometryInput): BgGeometry {
  const count = sectorAngles.length;
  const isCompleteCircle = totalParts === count;
  const angle = componentAngles[index]!;
  const nextGap = sectorAngles[index]!;
  const hasPrevNeighbor = isCompleteCircle || index > 0;
  const hasNextNeighbor = isCompleteCircle || index < count - 1;
  const prevGap = hasPrevNeighbor
    ? sectorAngles[(index - 1 + count) % count]!
    : 0;
  const startAngleInRadians = hasPrevNeighbor ? angle - prevGap / 2 : angle;
  const endAngleInRadians = hasNextNeighbor
    ? angle + nextGap / 2
    : angle + nextGap;

  const diameter = (outerRadius ?? radius) * 2;
  const width =
    diameter + minComponentLayout.width - centerComponentLayout.width / 2;
  const height =
    diameter + minComponentLayout.height - centerComponentLayout.height / 2;
  const size = Math.max(width, height);

  return {
    startAngleInRadians,
    endAngleInRadians,
    size,
    center: { x: size / 2, y: size / 2 },
  };
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
    'Z',
  ].join(' ');
}

/**
 * Creates an SVG path for an annular sector (donut slice) bounded by an outer
 * and inner radius. When innerRadius is 0 or negative the result is identical
 * to getSectorPath.
 * @param props The properties of the annular sector.
 * @param props.radius The outer radius of the annular sector.
 * @param props.innerRadius The inner radius of the annular sector.
 * @param props.startAngle The angle at which the annular sector starts. The value needs to be in radians.
 * @param props.endAngle The angle at which the annular sector ends. The value needs to be in radians.
 * @param props.isClockwise Whether the annular sector is drawn in a clockwise direction or not. The default value is true.
 * @param props.center The center point of the circle on which the annular sector is drawn. The default value is { x: 0, y: 0 }.
 * @param props.center.x The x-coordinate of the center point.
 * @param props.center.y The y-coordinate of the center point.
 * @returns The SVG path for the annular sector.
 */
export function getDonutSectorPath({
  radius,
  innerRadius,
  startAngle,
  endAngle,
  isClockwise = true,
  center: { x: cx, y: cy } = { x: 0, y: 0 },
}: CirclePathProps & { innerRadius: number }): string {
  if (innerRadius <= 0) {
    return getSectorPath({
      radius,
      startAngle,
      endAngle,
      isClockwise,
      center: { x: cx, y: cy },
    });
  }

  const { startPoint: outerStart, arc: outerArc } = getArc({
    radius,
    startAngle,
    endAngle,
    isClockwise,
    center: { x: cx, y: cy },
  });

  // Reverse: inner arc goes endAngle→startAngle in opposite winding
  const { startPoint: innerEnd, arc: innerArc } = getArc({
    radius: innerRadius,
    startAngle: endAngle,
    endAngle: startAngle,
    isClockwise: !isClockwise,
    center: { x: cx, y: cy },
  });

  return [
    'M',
    -outerStart.x + cx,
    -outerStart.y + cy,
    'A',
    ...outerArc,
    'L',
    -innerEnd.x + cx,
    -innerEnd.y + cy,
    'A',
    ...innerArc,
    'Z',
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
