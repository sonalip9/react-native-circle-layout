import { useMemo } from 'react';
import { pointOnCircle } from '../utils';

export type CirclePosition = {
  x: number;
  y: number;
  angle: number;
};

export type CirclePositionsConfig = {
  count: number;
  radius: number;
  startAngle?: number;
  sweepAngle?: number;
};

/**
 * Computes the position of a point on a circle.
 * @param index - The index of the point.
 * @param sectorAngle - The angle of the sector.
 * @param startAngle - The starting angle.
 * @param radius - The radius of the circle.
 * @returns The position of the point on the circle.
 */
function computePosition(
  index: number,
  sectorAngle: number,
  startAngle: number,
  radius: number
): CirclePosition {
  const angle = (startAngle + sectorAngle * index) % (2 * Math.PI);
  const { x, y } = pointOnCircle({ radius, radians: angle });
  return { x, y, angle };
}

/**
 * Computes the positions of points on a circle.
 * @param param - The configuration object.
 * @param param.count - The number of points.
 * @param param.radius - The radius of the circle.
 * @param param.startAngle - The starting angle.
 * @param param.sweepAngle - The sweep angle.
 * @returns An array of positions of the points on the circle.
 */
export function useCirclePositions({
  count,
  radius,
  startAngle = 0,
  sweepAngle = 2 * Math.PI,
}: CirclePositionsConfig): CirclePosition[] {
  return useMemo(() => {
    if (count <= 0) return [];

    const isCompleteCircle = Math.abs(sweepAngle - 2 * Math.PI) < 0.001;
    const totalParts = isCompleteCircle ? count : count - 1;
    const sectorAngle = totalParts > 0 ? sweepAngle / totalParts : 0;

    return Array.from({ length: count }, (_, index) =>
      computePosition(index, sectorAngle, startAngle, radius)
    );
  }, [count, radius, startAngle, sweepAngle]);
}

/**
 * Computes the position of a single point on a circle.
 * @param param - The configuration object.
 * @param param.index - The index of the point.
 * @param param.count - The number of points.
 * @param param.radius - The radius of the circle.
 * @param param.startAngle - The starting angle.
 * @param param.sweepAngle - The sweep angle.
 * @returns The position of the point on the circle.
 */
export function useCirclePosition({
  index,
  count,
  radius,
  startAngle = 0,
  sweepAngle = 2 * Math.PI,
}: CirclePositionsConfig & { index: number }): CirclePosition {
  return useMemo(() => {
    const isCompleteCircle = Math.abs(sweepAngle - 2 * Math.PI) < 0.001;
    const totalParts = isCompleteCircle ? count : count - 1;
    const sectorAngle = totalParts > 0 ? sweepAngle / totalParts : 0;

    return computePosition(index, sectorAngle, startAngle, radius);
  }, [index, count, radius, startAngle, sweepAngle]);
}
