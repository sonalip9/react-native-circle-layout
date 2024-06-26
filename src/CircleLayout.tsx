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
 * @returns A component that places the passed components in a circular view.
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
      animationProps = undefined,
    }: CircleLayoutProps,
    ref
  ) => {
    /**
     * Array of references for each of the circle components.
     */
    const componentRefs = React.useRef<(ComponentRef | null)[]>(
      Array(components.length).fill(null) as null[]
    );

    // The total number of parts to divide the circle into
    const totalParts = React.useMemo(
      () =>
        sweepAngle && sweepAngle !== 2 * Math.PI
          ? components.length - 1
          : components.length,
      [components, sweepAngle]
    );

    /**
     * The value passed to the context of the circle layout.
     */
    const contextValue: CircleLayoutContextType = React.useMemo(
      () => ({
        totalParts,
        radius,
        startAngle,
        animationProps,
      }),
      [animationProps, radius, startAngle, totalParts]
    );

    /**
     * The list of components to be shown in the circle.
     */
    const componentsList = React.useCallback(
      () =>
        components.map((component, index) => {
          const angle = startAngle + sweepAngle * (index / totalParts);
          return (
            <CircleLayoutComponent
              component={component}
              index={index}
              key={`Component-${angle}`}
              radians={angle}
              ref={(el) => {
                componentRefs.current[index] = el;
              }}
            />
          );
        }),
      [components, startAngle, sweepAngle, totalParts]
    );

    /**
     * The instance value that is exposed to parent components when using ref.
     */
    React.useImperativeHandle(ref, () => ({
      hideComponents: () =>
        componentRefs.current?.forEach((componentRef) =>
          componentRef?.hideComponent()
        ),
      showComponents: () =>
        componentRefs.current?.forEach((componentRef) => {
          componentRef?.showComponent();
        }),
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
