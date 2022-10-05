import React from 'react';
import { StyleProp, View, ViewStyle } from 'react-native';

export type CircleLayoutProps = {
  /**
   * The list of components that needs to be placed in the circle.
   */
  components: React.ReactNode[];
  /**
   * The component to be placed at the center.
   */
  centerComponent?: React.ReactNode;
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
  containerStyle?: StyleProp<ViewStyle>;
  /**
   * The styling of the center component's container.
   */
  centerComponentContainerStyle?: StyleProp<ViewStyle>;
};

/**
 * A component that places a list of components in a circular layout.
 * @param props The properties passed to the component
 * @returns
 */
export const CircleLayout = ({
  components,
  radius,
  centerComponent,
  sweepAngle,
  startAngle,
  containerStyle,
  centerComponentContainerStyle,
}: CircleLayoutProps) => {
  const totalPoints =
    sweepAngle && sweepAngle !== 2 * Math.PI
      ? components.length - 1
      : components.length;

  /**
   * Converts the polar coordinates of a point on the circle
   * to cartesian coordinates.
   * @param index The point to be plotted.
   * @returns The cartesian coordinates for the top left point
   * of the component's placement.
   */
  const point = (index: number) => {
    const radians = startAngle! + sweepAngle! * (index / totalPoints);
    return {
      x: Math.cos(radians) * radius,
      y: Math.sin(radians) * radius,
    };
  };
  return (
    <View
      style={[
        {
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 10,
          minHeight: sweepAngle! >= Math.PI ? 2 * radius : radius,
        },
        containerStyle,
      ]}
    >
      <View>
        {components.map((component, index) => {
          const { x, y } = point(index);
          return (
            <View
              key={index}
              style={{ position: 'absolute', bottom: y, right: x }}
            >
              {component}
            </View>
          );
        })}
        <View style={[{ marginTop: radius }, centerComponentContainerStyle]}>
          {centerComponent}
        </View>
      </View>
    </View>
  );
};

CircleLayout.defaultProps = {
  startAngle: 0,
  sweepAngle: 2 * Math.PI,
};
