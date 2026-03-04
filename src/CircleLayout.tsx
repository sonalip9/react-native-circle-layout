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
 * @param props.components The list of components to be placed in the circle layout.
 * @param props.radius The radius of the circle on which the components will be placed.
 * @param props.centerComponent The component to be placed at the center of the circle layout.
 * @param props.sweepAngle The distance in radians to be covered from the starting point. The value needs to be in radians.
 * @param props.startAngle The angle at which the first component will be placed. The value needs to be in radians.
 * @param props.containerStyle The styling of the entire component's container.
 * @param props.centerComponentContainerStyle The styling of the center component's container.
 * @param props.animationProps The props for the animation.
 * @param props.ref The ref that is used to expose the show and hide function of the
 * component to parent components.
 * @see AnimationProps
 * @see CircleLayoutRef
 * @returns A component that places the passed components in a circular view.
 */
export const CircleLayout = ({
  components,
  radius,
  centerComponent = undefined,
  sweepAngle = 2 * Math.PI,
  startAngle = 0,
  containerStyle = undefined,
  centerComponentContainerStyle = undefined,
  animationProps = undefined,
  ref,
}: CircleLayoutProps & { ref: React.Ref<CircleLayoutRef> }) => {
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
    <CircleLayoutContext value={contextValue}>
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
    </CircleLayoutContext>
  );
};
