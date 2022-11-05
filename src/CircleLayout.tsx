import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
} from 'react';
import { Animated, View } from 'react-native';

import { CircleLayoutComponent } from './CircleLayoutComponent';
import { circleLayoutStyles } from './styles';
import type { CircleLayoutProps, CircleLayoutRef, ComponentRef } from './types';

/**
 * A component that places a list of components in a circular layout.
 * @param props The properties passed to the component
 * @returns
 */
export const CircleLayout = forwardRef<CircleLayoutRef, CircleLayoutProps>(
  (
    {
      components,
      radius,
      centerComponent = undefined,
      sweepAngle = 2 * Math.PI,
      startAngle = 0,
      containerStyle = undefined,
      centerComponentContainerStyle = undefined,
      opacityAnimationConfig = undefined,
      linearAnimationConfig = undefined,
      circularAnimationConfig = undefined,
    }: CircleLayoutProps,
    ref
  ) => {
    const componentRefs = useRef<Array<ComponentRef | null>>(
      Array(components.length).fill(null) as null[]
    );

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
            ref={(el) => {
              componentRefs.current[index] = el;
            }}
            startAngle={startAngle}
            totalPoints={components.length}
          />
        )),
      [components]
    );

    useImperativeHandle(ref, () => ({
      hideComponents: () =>
        componentRefs.current?.forEach((componentRef) =>
          componentRef?.hideComponent()
        ),
      showComponents: () =>
        componentRefs.current?.forEach((componentRef) => {
          componentRef?.showComponent();
        }),
      componentsVisible: componentRefs.current.every(
        (component) => component?.componentVisible
      ),
    }));

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
  }
);
