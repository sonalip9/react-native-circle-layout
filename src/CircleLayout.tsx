import React, { useCallback } from 'react';
import { Animated, View } from 'react-native';

import { CircleLayoutComponent } from './CircleLayoutComponent';
import { circleLayoutStyles } from './styles';
import type { CircleLayoutProps } from './types';

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
  centerComponentContainerStyle = undefined,
  showComponents = true,
  opacityAnimationConfig = undefined,
  linearAnimationConfig = undefined,
  circularAnimationConfig = undefined,
}: CircleLayoutProps) => {
  // The total number of points to divide the circle into
  const totalPoints =
    sweepAngle && sweepAngle !== 2 * Math.PI
      ? components.length - 1
      : components.length;

  /**
   * The list of components to be shown in the circle.
   */
  const componentsList = useCallback(
    () =>
      components.map((component, index) => (
        <CircleLayoutComponent
          circularAnimationConfig={circularAnimationConfig}
          component={component}
          index={index}
          // eslint-disable-next-line react/no-array-index-key
          key={index}
          linearAnimationConfig={linearAnimationConfig}
          opacityAnimationConfig={opacityAnimationConfig}
          radians={startAngle + sweepAngle * (index / totalPoints)}
          radius={radius}
          showComponent={showComponents}
          startAngle={startAngle}
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
          style={[{ marginTop: radius }, centerComponentContainerStyle]}
        >
          {centerComponent}
        </Animated.View>
      </View>
    </View>
  );
};
