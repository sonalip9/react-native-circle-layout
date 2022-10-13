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
  radius,
  radians,
}: ComponentProps) => {
  const entryAnimationDelay = (opacityAnimationConfig?.gap ?? 1000) * index;
  const exitAnimationDelay =
    (opacityAnimationConfig?.gap ?? 1000) * (totalPoints - index - 1);

  const opacityValue = useAnimation({
    showComponent,
    initialValue: 0,
    finalValue: 1,
    entryAnimationConfig: {
      delay: entryAnimationDelay,
      ...opacityAnimationConfig,
    },
    exitAnimationConfig: {
      delay: exitAnimationDelay,
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
      delay: entryAnimationDelay,
      ...linearAnimationConfig,
    },
    exitAnimationConfig: {
      delay: exitAnimationDelay,
      ...linearAnimationConfig,
    },
  });
  const radiusValue = useMemo(
    () => (linearAnimationConfig && animatedRadius) || radius,
    [linearAnimationConfig, radius, animatedRadius]
  );

  const position = pointOnCircle({ radians, radius: radiusValue });

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
