import React, { useMemo } from 'react';
import { Animated, View } from 'react-native';

import CircleLayoutArray from './CircleLayoutArray';
import type { CircleLayoutProps, CircleLayoutRef, Layout } from './types';
import { validateProps } from './utils/validation';
import { CircleLayoutProvider } from './CircleLayoutProvider';

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
  ref,
  ...circleLayoutProps
}: CircleLayoutProps & { ref: React.Ref<CircleLayoutRef> }) => {
  const {
    components,
    radius,
    centerComponent,
    sweepAngle,
    startAngle,
    containerStyle,
    centerComponentContainerStyle,
    animationProps,
  } = validateProps(circleLayoutProps);

  const isGreaterThanHalfCircle = useMemo(
    () => sweepAngle >= Math.PI,
    [sweepAngle]
  );

  const [minComponentLayout, setMinComponentLayout] = React.useState<Layout>({
    height: 0,
    width: 0,
  });
  const { minHeight, minWidth } = useMemo(() => {
    const defaultMinDimension = isGreaterThanHalfCircle ? 2 * radius : radius;
    return {
      minHeight: defaultMinDimension + minComponentLayout.height,
      minWidth: defaultMinDimension + minComponentLayout.width,
    };
  }, [minComponentLayout, radius, isGreaterThanHalfCircle]);

  const [centerComponentLayout, setCenterComponentLayout] =
    React.useState<Layout>({ width: 0, height: 0 });

  return (
    <CircleLayoutProvider
      componentLength={components.length}
      radius={radius}
      startAngle={startAngle}
      sweepAngle={sweepAngle}
      animationProps={animationProps}
    >
      <View
        style={[
          {
            minHeight,
            minWidth,
            justifyContent: sweepAngle >= Math.PI ? 'center' : 'flex-end',
            alignItems: 'center',
          },
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
    </CircleLayoutProvider>
  );
};
