import React, { ReactNode, useMemo } from 'react';
import { Animated } from 'react-native';

import { useAnimation, useFadeAnimation } from './hooks';
import { circleComponentStyles } from './styles';
import { pointOnCircle } from './utils';

type ComponentProps = {
  /**
   * The value of the component that is plotted.
   */
  index: number;
  /**
   * The component to be displayed.
   */
  component: ReactNode;
  /**
   * The total number of components in the circle layout.
   */
  totalPoints: number;
  /**
   * Flag to show or hide the component in the circle layout.
   * This flag is used to perform the start and end animation.
   */
  showComponent: boolean;
  /**
   * The configuration for the entry and exit of the components.
   * If this prop is undefined, then there will be no animation.
   */
  animationConfig?:
    | {
        /**
         * The duration for which the animation should last.
         * This value is in milliseconds.
         */
        duration?: number | undefined;
        /**
         * The gap between the start of animation of 2 consecutive components.
         * This value is in milliseconds.
         */
        gap: number;
      }
    | undefined;
  radius: number;
  radians: number;
};

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
  animationConfig,
  radius,
  radians,
}: ComponentProps) => {
  const value = useFadeAnimation(
    showComponent,
    {
      delay: (animationConfig?.gap ?? 1000) * index,
      duration: animationConfig?.duration,
    },
    {
      delay: (animationConfig?.gap ?? 1000) * (totalPoints - index - 1),
      duration: animationConfig?.duration,
    }
  );
  const opacity = useMemo(
    () => (animationConfig && value) || (showComponent ? 1 : 0),
    [animationConfig, showComponent, value]
  );

  const animatedRadius = useAnimation({
    showComponent,
    initialValue: 0,
    finalValue: radius,
    entryAnimationConfig: {
      delay: (animationConfig?.gap ?? 1000) * index,
      duration: animationConfig?.duration,
    },
    exitAnimationConfig: {
      delay: (animationConfig?.gap ?? 1000) * (totalPoints - index - 1),
      duration: animationConfig?.duration,
    },
  });
  const radiusValue = useMemo(
    () => (animationConfig && animatedRadius) || radius,
    [animationConfig, radius, animatedRadius]
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

CircleLayoutComponent.defaultProps = {
  animationConfig: undefined,
};
