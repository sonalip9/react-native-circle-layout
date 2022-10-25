import React, { useMemo } from 'react';
import { Animated } from 'react-native';

import { useAnimation } from './hooks';
import { circleComponentStyles } from './styles';
import type { ComponentProps } from './types';
import { pointOnCircle } from './utils';

/**
 * A component that positions one component in the circle layout.
 * @param props  The properties passed to the component
 * @returns
 */
export const CircleLayoutComponent = ({
  index,
  component,
  totalPoints,
  showComponent,
  opacityAnimationConfig = undefined,
  linearAnimationConfig = undefined,
  circularAnimationConfig = undefined,
  startAngle,
  radius,
  radians,
}: ComponentProps) => {
  /**
   * The animated value that is responsible for the opacity of the component.
   */
  const opacityValue = useAnimation({
    showComponent,
    initialValue: 0,
    finalValue: 1,
    entryAnimationConfig: {
      delay: (opacityAnimationConfig?.gap ?? 1000) * index,
      ...opacityAnimationConfig,
    },
    exitAnimationConfig: {
      delay: (opacityAnimationConfig?.gap ?? 1000) * (totalPoints - index - 1),
      ...opacityAnimationConfig,
    },
  });
  // The value of opacity depending on the props of the component.
  const opacity = useMemo(
    () => (opacityAnimationConfig && opacityValue) || (showComponent ? 1 : 0),
    [opacityAnimationConfig, showComponent, opacityValue]
  );

  /**
   * The animated value that is responsible for the radius of the component.
   * This results in the linear animation of the component from the center to its
   * final position.
   */
  const animatedRadius = useAnimation({
    showComponent,
    initialValue: 0,
    finalValue: radius,
    entryAnimationConfig: {
      delay: (linearAnimationConfig?.gap ?? 1000) * index,
      ...linearAnimationConfig,
    },
    exitAnimationConfig: {
      delay: (linearAnimationConfig?.gap ?? 1000) * (totalPoints - index - 1),
      ...linearAnimationConfig,
    },
  });
  // The value of radius depending on the props of the component.
  const radiusValue = useMemo(
    () => (linearAnimationConfig && animatedRadius) || radius,
    [linearAnimationConfig, radius, animatedRadius]
  );

  /**
   * The animated value that is responsible for the radians of the component.
   * This results in the circular animation of the component from the position of
   * the first component to its final position.
   */
  const animatedRadians = useAnimation({
    showComponent,
    initialValue: startAngle,
    finalValue: radians,
    entryAnimationConfig: {
      delay: (circularAnimationConfig?.gap ?? 1000) * index,
      ...circularAnimationConfig,
    },
    exitAnimationConfig: {
      delay: (circularAnimationConfig?.gap ?? 1000) * (totalPoints - index - 1),
      ...circularAnimationConfig,
    },
  });
  // The value of radians depending on the props of the component.
  const radiansValue = useMemo(
    () => (circularAnimationConfig && animatedRadians) || radians,
    [circularAnimationConfig, radians, animatedRadians]
  );

  // The position of the component.
  // This is animated if either linear or circular animation config is passed.
  const position = pointOnCircle({
    radians: radiansValue,
    radius: radiusValue,
  });

  return (
    <Animated.View
      key={index}
      style={[
        circleComponentStyles.componentContainer,
        {
          opacity,
          transform: [
            {
              translateX: Animated.multiply(position.x, -1),
            },
            {
              translateY: Animated.multiply(position.y, -1),
            },
          ],
        },
      ]}
    >
      {component}
    </Animated.View>
  );
};
