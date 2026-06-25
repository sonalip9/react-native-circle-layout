import React from 'react';

import type { AnimationDriver } from './animation/types';
import { CircleLayoutContent } from './CircleLayoutContent';
import { CircleLayoutProvider } from './CircleLayoutProvider';
import type { CircleLayoutProps, CircleLayoutRef } from './types';
import { validateProps } from './utils';

/**
 * A component that places a list of components in a circular layout.
 * @param props The properties passed to the component
 * @param props.components The list of components to be placed in the circle layout.
 * @param props.radius The radius of the circle on which the components will be placed.
 * @param props.centerComponent The component to be placed at the center of the circle layout.
 * @param props.sweepAngle The distance in radians to be covered from the starting point. The value needs to be in radians.
 * @param props.startAngle The angle at which the first component will be placed. The value needs to be in radians.
 * @param props.containerStyle The styling of the entire component's container.
 * @param props.centerComponentContainerStyle The styling of the center component's container.
 * @param props.animationProps The props for the animation.
 * @param props.ref The ref that is used to expose the show and hide function of the
 * component to parent components.
 * @see AnimationProps
 * @see CircleLayoutRef
 * @returns A component that places the passed components in a circular view.
 */
export const CircleLayout = <D extends AnimationDriver>({
  ref,
  ...circleLayoutProps
}: CircleLayoutProps<D> & { ref?: React.Ref<CircleLayoutRef> }) => {
  const {
    components,
    radius,
    centerComponent,
    sweepAngle,
    startAngle,
    containerStyle,
    centerComponentContainerStyle,
    animationProps,
    animationDriver,
    bgConfig,
    weights,
    visible,
  } = validateProps<D>(circleLayoutProps);

  return (
    <CircleLayoutProvider
      sweepAngle={sweepAngle}
      radius={radius}
      startAngle={startAngle}
      componentLength={components.length}
      animationProps={animationProps}
      animationDriver={animationDriver}
      weights={weights}
    >
      <CircleLayoutContent
        ref={ref}
        radius={radius}
        components={components}
        centerComponent={centerComponent}
        containerStyle={containerStyle}
        centerComponentContainerStyle={centerComponentContainerStyle}
        sweepAngle={sweepAngle}
        bgConfig={bgConfig}
        visible={visible}
      />
    </CircleLayoutProvider>
  );
};
