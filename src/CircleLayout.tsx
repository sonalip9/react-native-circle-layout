import React, { useMemo } from 'react';
import { Animated, View } from 'react-native';

import { CircleLayoutContext } from './CircleLayoutContext';
import { circleLayoutStyles } from './styles';
import type {
  CircleLayoutContextType,
  CircleLayoutProps,
  CircleLayoutRef,
  Layout,
} from './types';
import CircleLayoutArray from './CircleLayoutArray';

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
  const [minComponentLayout, setMinComponentLayout] = React.useState<Layout>({
    height: 0,
    width: 0,
  });
  const { minHeight, minWidth } = useMemo(() => {
    return {
      minHeight:
        (sweepAngle >= Math.PI ? 2 * radius : radius) +
        minComponentLayout.height,
      minWidth:
        (sweepAngle >= Math.PI ? 2 * radius : radius) +
        minComponentLayout.width,
    };
  }, [minComponentLayout, radius, sweepAngle]);

  const [centerComponentLayout, setCenterComponentLayout] =
    React.useState<Layout>({ width: 0, height: 0 });

  // The total number of parts to divide the circle into
  const totalParts = React.useMemo(
    () =>
      Math.abs(sweepAngle - 2 * Math.PI) < 0.001
        ? components.length
        : components.length - 1,
    [components, sweepAngle]
  );

  /**
   * The value passed to the context of the circle layout.
   */
  const contextValue: CircleLayoutContextType = React.useMemo(
    () => ({ totalParts, radius, startAngle, animationProps }),
    [animationProps, radius, startAngle, totalParts]
  );

  return (
    <CircleLayoutContext value={contextValue}>
      <View
        style={[
          circleLayoutStyles.layoutContainer,
          { minHeight, minWidth },
          containerStyle,
        ]}
      >
        <View>
          {/* The list of components to be shown in the circle. */}
          <CircleLayoutArray
            ref={ref}
            components={components}
            sweepAngle={sweepAngle}
            setMinComponentLayout={setMinComponentLayout}
            centerComponentLayout={centerComponentLayout}
          />
          <Animated.View
            style={[centerComponentContainerStyle]}
            onLayout={(event) => {
              const layout = event.nativeEvent.layout;
              setCenterComponentLayout(layout);
            }}
          >
            {centerComponent}
          </Animated.View>
        </View>
      </View>
    </CircleLayoutContext>
  );
};
