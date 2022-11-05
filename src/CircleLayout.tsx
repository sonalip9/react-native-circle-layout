import React from 'react';
import { Animated, View } from 'react-native';

import { CircleLayoutComponent } from './CircleLayoutComponent';
import { CircleLayoutContext } from './CircleLayoutContext';
import { circleLayoutStyles } from './styles';
import type {
  CircleLayoutContextType,
  CircleLayoutProps,
  CircleLayoutRef,
  ComponentRef,
} from './types';

/**
 * A component that places a list of components in a circular layout.
 * @param props The properties passed to the component
 * @returns
 */
export const CircleLayout = React.forwardRef<
  CircleLayoutRef,
  CircleLayoutProps
>(
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
    const componentRefs = React.useRef<Array<ComponentRef | null>>(
      Array(components.length).fill(null) as null[]
    );

    // The total number of points to divide the circle into
    const totalPoints =
      sweepAngle && sweepAngle !== 2 * Math.PI
        ? components.length - 1
        : components.length;

    const contextValue: CircleLayoutContextType = React.useMemo(
      () => ({
        totalPoints,
        opacityAnimationConfig,
        circularAnimationConfig,
        linearAnimationConfig,
        radius,
        startAngle,
      }),
      [
        circularAnimationConfig,
        linearAnimationConfig,
        opacityAnimationConfig,
        radius,
        startAngle,
        totalPoints,
      ]
    );

    /**
     * The list of components to be shown in the circle.
     */
    const componentsList = React.useCallback(
      () =>
        components.map((component, index) => (
          <CircleLayoutComponent
            component={component}
            index={index}
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            radians={startAngle + sweepAngle * (index / totalPoints)}
            ref={(el) => {
              componentRefs.current[index] = el;
            }}
          />
        )),
      [components, startAngle, sweepAngle, totalPoints]
    );

    React.useImperativeHandle(ref, () => ({
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
      <CircleLayoutContext.Provider value={contextValue}>
        <View
          style={[
            circleLayoutStyles.layoutContainer,
            { minHeight: sweepAngle >= Math.PI ? 2 * radius : radius },
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
      </CircleLayoutContext.Provider>
    );
  }
);
