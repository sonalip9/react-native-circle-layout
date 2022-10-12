import React, { ReactNode, useMemo } from 'react';
import { Animated } from 'react-native';

import { useFadeAnimation } from './hooks';
import { useLinearAnimation } from './hooks/useLinearAnimation';
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
  startAngle: number;
  sweepAngle: number;
  radius: number;
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
  startAngle,
  sweepAngle,
  radius,
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

  const endPosition = pointOnCircle({
    radians: startAngle + sweepAngle * (index / totalPoints),
    radius,
  });

  const startPosition = pointOnCircle({
    radians: startAngle + sweepAngle * (index / totalPoints),
    radius: 0,
  });

  const position = useLinearAnimation(
    showComponent,
    startPosition,
    endPosition,
    {
      delay: (animationConfig?.gap ?? 1000) * index,
      duration: animationConfig?.duration,
    },
    {
      delay: (animationConfig?.gap ?? 1000) * (totalPoints - index - 1),
      duration: animationConfig?.duration,
    }
  );

  return (
    <Animated.View
      key={index}
      style={[
        circleComponentStyles.componentContainer,
        {
          bottom: startPosition.y,
          right: startPosition.x,
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
