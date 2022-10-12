export interface PointOnCircle {
  radius: number;
  radians: number;
}

/**
 * Converts the polar coordinates of a point on the circle
 * to cartesian coordinates.
 * @param index The point to be plotted.
 * @returns The cartesian coordinates for the top left point
 * of the component's placement.
 */
export const pointOnCircle = ({ radius, radians }: PointOnCircle) => ({
  x: Math.cos(radians) * radius,
  y: Math.sin(radians) * radius,
});
