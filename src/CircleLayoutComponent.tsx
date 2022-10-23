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
  const opacity = useMemo(
    () => (opacityAnimationConfig && opacityValue) || (showComponent ? 1 : 0),
    [opacityAnimationConfig, showComponent, opacityValue]
  );

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
  const radiusValue = useMemo(
    () => (linearAnimationConfig && animatedRadius) || radius,
    [linearAnimationConfig, radius, animatedRadius]
  );

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
  const radiansValue = useMemo(
    () => (circularAnimationConfig && animatedRadians) || radians,
    [circularAnimationConfig, radians, animatedRadians]
  );

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
