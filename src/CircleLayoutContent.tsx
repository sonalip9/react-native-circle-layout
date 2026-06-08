import { useMemo } from 'react';
import { type StyleProp, type ViewStyle, Animated, View } from 'react-native';
import CircleLayoutArray from './CircleLayoutArray';
import type { CircleLayoutRef, Layout } from './types';
import React from 'react';

/**
 * The content of the CircleLayout component. This is separated from the main
 * CircleLayout component to avoid unnecessary re-renders of the entire component
 * when the layout of the components is calculated.
 * @param props The properties passed to the component
 * @param props.radius The radius of the circle on which the components will be placed.
 * @param props.components The list of components to be placed in the circle layout.
 * @param props.centerComponent The component to be placed at the center of the circle layout.
 * @param props.containerStyle The styling of the entire component's container.
 * @param props.centerComponentContainerStyle The styling of the center component's container.
 * @param props.sweepAngle The distance in radians to be covered from the starting point. The value needs to be in radians.
 * @param props.ref The ref that is used to expose the show and hide function of the
 * component to parent components.
 * @returns The content of the CircleLayout component which contains the
 * background and the components to be placed in the circle layout.
 * @see CircleLayout
 */
export function CircleLayoutContent({
  radius,
  components,
  centerComponent,
  containerStyle,
  centerComponentContainerStyle,
  sweepAngle,
  ref,
}: {
  radius: number;
  components: React.ReactNode[];
  centerComponent?: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle> | undefined | undefined;
  centerComponentContainerStyle?: StyleProp<ViewStyle> | undefined | undefined;
  sweepAngle: number;
} & React.RefAttributes<CircleLayoutRef>) {
  const [minComponentLayout, setMinComponentLayout] = React.useState<Layout>({
    height: 0,
    width: 0,
  });
  const { minHeight, minWidth } = useMemo(() => {
    const defaultMinDimension = sweepAngle >= Math.PI ? 2 * radius : radius;
    return {
      minHeight: defaultMinDimension + minComponentLayout.height,
      minWidth: defaultMinDimension + minComponentLayout.width,
    };
  }, [minComponentLayout, radius, sweepAngle]);

  const [centerComponentLayout, setCenterComponentLayout] =
    React.useState<Layout>({ width: 0, height: 0 });

  return (
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
  );
}
