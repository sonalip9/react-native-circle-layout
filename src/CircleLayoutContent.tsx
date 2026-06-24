import { useImperativeHandle, useMemo, useRef, useState } from 'react';
import { type StyleProp, type ViewStyle, Animated, View } from 'react-native';
import CircleLayoutArray from './CircleLayoutArray';
import type {
  BgConfig,
  CircleLayoutRef,
  Layout,
  ResolvedBgConfig,
} from './types';
import React from 'react';
import { Bg } from './Bg';

/**
 * Resolves a per-sector style value from a scalar, array, or function.
 * @param value The value to resolve — a single value, per-index array, or index function
 * @param index The sector index to resolve for
 * @returns The resolved scalar value for the given index
 */
function resolveValue<T>(
  value: T | T[] | ((index: number) => T) | undefined,
  index: number
): T | undefined {
  if (typeof value === 'function') {
    return (value as (index: number) => T)(index);
  }
  if (Array.isArray(value)) {
    return value[index];
  }
  return value;
}

/**
 * Resolves a BgConfig with possible per-sector overrides into scalar values for one sector.
 * @param bgConfig The raw BgConfig which may contain arrays or functions
 * @param index The sector index to resolve for
 * @returns A ResolvedBgConfig with scalar values only
 */
function resolveBgConfig(bgConfig: BgConfig, index: number): ResolvedBgConfig {
  return {
    color: resolveValue(bgConfig.color, index),
    strokeColor: resolveValue(bgConfig.strokeColor, index),
    strokeWidth: resolveValue(bgConfig.strokeWidth, index),
    innerRadius: bgConfig.innerRadius,
    outerRadius: bgConfig.outerRadius,
  };
}

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
 * @param props.bgConfig The configuration for the background of the circle layout.
 * @param props.sweepAngle The distance in radians to be covered from the starting point. The
 * value needs to be in radians.
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
  bgConfig,
  ref,
}: {
  radius: number;
  components: React.ReactNode[];
  centerComponent?: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle> | undefined;
  centerComponentContainerStyle?: StyleProp<ViewStyle> | undefined;
  sweepAngle: number;
  bgConfig?: BgConfig;
} & React.RefAttributes<CircleLayoutRef>) {
  const componentLayoutArrayRef = useRef<CircleLayoutRef>(null);
  const [componentVisible, setComponentVisible] = useState(false);

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

  /**
   * The instance value that is exposed to parent components when using ref.
   */
  useImperativeHandle(
    ref,
    () => ({
      hideComponents: () => {
        componentLayoutArrayRef.current?.hideComponents();
        setComponentVisible(false);
      },
      showComponents: () => {
        componentLayoutArrayRef.current?.showComponents();
        setComponentVisible(true);
      },
    }),
    [setComponentVisible]
  );

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
        {bgConfig &&
          components.map((_, index) => (
            <Bg
              key={index}
              index={index}
              minComponentLayout={minComponentLayout}
              centerComponentLayout={centerComponentLayout}
              radius={radius}
              isVisible={componentVisible}
              {...resolveBgConfig(bgConfig, index)}
            />
          ))}
        {/* The list of components to be shown in the circle. */}
        <CircleLayoutArray
          ref={componentLayoutArrayRef}
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
