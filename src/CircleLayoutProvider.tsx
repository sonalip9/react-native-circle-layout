import React, { useMemo } from 'react';

import { rnAnimatedDriver } from './animation/rnAnimatedDriver';
import { CircleLayoutContext } from './CircleLayoutContext';
import type { CircleLayoutContextType, CircleLayoutProps } from './types';

type CircleLayoutProviderProps = Required<
  Omit<
    CircleLayoutProps,
    | 'centerComponent'
    | 'containerStyle'
    | 'centerComponentContainerStyle'
    | 'components'
    | 'animationProps'
    | 'bgConfig'
    | 'animationDriver'
  > & {
    componentLength: number;
  }
> &
  Pick<CircleLayoutProps, 'animationProps' | 'animationDriver'>;
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

  /**
   * The value passed to the context of the circle layout.
   */
  const contextValue: CircleLayoutContextType = React.useMemo(
    () => ({
      totalParts,
      radius,
      startAngle,
      animationProps,
      animationDriver,
      sectorAngle: sweepAngle / totalParts,
    }),
    [
      animationDriver,
      animationProps,
      radius,
      startAngle,
      sweepAngle,
      totalParts,
    ]
  );

  return (
    <CircleLayoutContext value={contextValue}>{children}</CircleLayoutContext>
  );
};
