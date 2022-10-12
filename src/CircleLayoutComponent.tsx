import React, { ReactNode, useMemo } from 'react';
import { Animated } from 'react-native';

import { useFadeAnimation } from './hooks';
import { circleComponentStyles } from './styles';

type ComponentProps = {
  /**
   * The value of the component that is plotted.
   */
  index: number;
  /**
   * The position of the component on the horizontal axis.
   */
  x: number;
  /**
   * The position of the component on the vertical axis.
   */
  y: number;
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
};

/**
 * A component that positions one component in the circle layout.
 * @param props  The properties passed to the component
 * @returns
 */
export const CircleLayoutComponent = ({
  index,
  x,
  y,
  component,
  totalPoints,
  showComponent,
  animationConfig,
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

  return (
    <Animated.View
      key={index}
      style={[
        circleComponentStyles.componentContainer,
        {
          bottom: y,
          right: x,
          opacity,
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
