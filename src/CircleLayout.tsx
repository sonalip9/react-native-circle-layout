import React, { useCallback, useMemo } from 'react';
import { Animated, StyleProp, View, ViewStyle } from 'react-native';

import { CircleLayoutComponent } from './CircleLayoutComponent';
import { useFadeAnimation } from './hooks';
import { circleLayoutStyles } from './styles';

export type CircleLayoutProps = {
  /**
   * The list of components that needs to be placed in the circle.
   */
  components: React.ReactNode[];
  /**
   * The component to be placed at the center.
   */
  centerComponent?: React.ReactNode | undefined;
  /**
   * The radius of the circle on which the components will
   * be placed.
   */
  radius: number;
  /**
   * The distance in radians to be covered from the starting point. The
   * value needs to be in radians.
   */
  sweepAngle?: number;
  /**
   * The angle at which the first component will be placed. The
   * value needs to be in radians.
   */
  startAngle?: number;
  /**
   * The styling of the entire component's container.
   */
  containerStyle?: StyleProp<ViewStyle> | undefined;
  /**
   * The styling of the center component's container.
   */
  centerComponentContainerStyle?: StyleProp<ViewStyle> | undefined;
  /**
   * Flag to show or hide the components in the circle layout.
   * This flag is used to perform the start and end animation.
   */
  showComponents: boolean;
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
 * A component that places a list of components in a circular layout.
 * @param props The properties passed to the component
 * @returns
 */
export const CircleLayout = ({
  components,
  radius,
  centerComponent = undefined,
  sweepAngle = 2 * Math.PI,
  startAngle = 0,
  containerStyle = undefined,
  centerComponentContainerStyle,
  showComponents,
  animationConfig = undefined,
}: CircleLayoutProps) => {
  const totalPoints =
    sweepAngle && sweepAngle !== 2 * Math.PI
      ? components.length - 1
      : components.length;

  const value = useFadeAnimation(
    showComponents,
    {
      duration: animationConfig?.duration,
    },
    {
      delay: (animationConfig?.gap ?? 1000) * totalPoints,
      duration: animationConfig?.duration,
    }
  );

  const opacity = useMemo(
    () => (animationConfig && value) || (showComponents ? 1 : 0),
    [animationConfig, showComponents, value]
  );

  const componentsList = useCallback(
    () =>
      components.map((component, index) => (
        <CircleLayoutComponent
          animationConfig={animationConfig}
          component={component}
          index={index}
          // eslint-disable-next-line react/no-array-index-key
          key={index}
          radians={startAngle + sweepAngle * (index / totalPoints)}
          radius={radius}
          showComponent={showComponents}
          totalPoints={components.length}
        />
      )),
    [components]
  );

  return (
    <View
      style={[
        circleLayoutStyles.layoutContainer,
        {
          minHeight: sweepAngle >= Math.PI ? 2 * radius : radius,
        },
        containerStyle,
      ]}
    >
      <View>
        {componentsList()}

        <Animated.View
          style={[
            { marginTop: radius, opacity: animationConfig && opacity },
            centerComponentContainerStyle,
          ]}
        >
          {centerComponent}
        </Animated.View>
      </View>
    </View>
  );
};
