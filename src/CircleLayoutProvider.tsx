import React, { useMemo } from 'react';

import type { AnimationDriver } from './animation/types';
import { rnAnimatedDriver } from './animation/rnAnimatedDriver';
import { CircleLayoutContext } from './CircleLayoutContext';
import type { CircleLayoutContextType, CircleLayoutProps } from './types';

type CircleLayoutProviderProps = Required<
  Omit<
    CircleLayoutProps<AnimationDriver>,
    | 'centerComponent'
    | 'containerStyle'
    | 'centerComponentContainerStyle'
    | 'components'
    | 'animationProps'
    | 'bgConfig'
    | 'animationDriver'
    | 'weights'
  > & {
    componentLength: number;
  }
> &
  Pick<
    CircleLayoutProps<AnimationDriver>,
    'animationProps' | 'animationDriver' | 'weights'
  >;
/**
 * A component that places a list of components in a circular layout.
 * @param props The properties passed to the component
 * @param props.radius The radius of the circle on which the components will be placed.
 * @param props.sweepAngle The distance in radians to be covered from the starting point. The value needs to be in radians.
 * @param props.startAngle The angle at which the first component will be placed. The value needs to be in radians.
 * @param props.componentLength The number of components to be placed in the circle layout.
 * @param props.children The child components to be rendered inside the circle layout.
 * @param props.animationProps The props for the animation.
 * @param props.animationDriver The animation driver used to power animations. Defaults to {@link rnAnimatedDriver}.
 * @param props.weights Optional weights for data-proportional angular placement.
 * @see AnimationProps
 * @returns A component that places the passed components in a circular view.
 */
export const CircleLayoutProvider = ({
  sweepAngle,
  radius,
  startAngle,
  componentLength,
  children,
  animationProps,
  animationDriver = rnAnimatedDriver,
  weights,
}: React.PropsWithChildren<CircleLayoutProviderProps>) => {
  const isCompleteCircle = useMemo(
    () => Math.abs(sweepAngle - 2 * Math.PI) < 0.001,
    [sweepAngle]
  );

  // The total number of parts to divide the circle into
  const totalParts = React.useMemo(
    () => (isCompleteCircle ? componentLength : componentLength - 1),
    [componentLength, isCompleteCircle]
  );

  const { sectorAngles, componentAngles } = React.useMemo(() => {
    if (weights && weights.length === componentLength) {
      const totalWeight = weights.reduce((sum, w) => sum + w, 0);
      const effectiveSweep = isCompleteCircle
        ? sweepAngle
        : (sweepAngle * totalWeight) /
          (totalWeight - weights[weights.length - 1]!);
      const sectors = weights.map((w) => (w / totalWeight) * effectiveSweep);
      let cumulative = startAngle;
      const angles = sectors.map((s, i) => {
        const angle = cumulative % (2 * Math.PI);
        if (i < sectors.length - 1 || isCompleteCircle) {
          cumulative += s;
        }
        return angle;
      });
      return { sectorAngles: sectors, componentAngles: angles };
    }
    const uniformSector = sweepAngle / totalParts;
    const sectors = Array<number>(componentLength).fill(uniformSector);
    const angles = Array.from(
      { length: componentLength },
      (_, i) => (startAngle + uniformSector * i) % (2 * Math.PI)
    );
    return { sectorAngles: sectors, componentAngles: angles };
  }, [
    weights,
    componentLength,
    sweepAngle,
    startAngle,
    totalParts,
    isCompleteCircle,
  ]);

  /**
   * The value passed to the context of the circle layout.
   */
  const contextValue: CircleLayoutContextType<AnimationDriver> = React.useMemo(
    () => ({
      totalParts,
      radius,
      startAngle,
      animationProps,
      animationDriver,
      sectorAngles,
      componentAngles,
    }),
    [
      animationDriver,
      animationProps,
      radius,
      startAngle,
      totalParts,
      sectorAngles,
      componentAngles,
    ]
  );

  return (
    <CircleLayoutContext value={contextValue}>{children}</CircleLayoutContext>
  );
};
